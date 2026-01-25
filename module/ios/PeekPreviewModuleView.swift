import ExpoModulesCore
import UIKit

/// Native trigger view that owns the UIContextMenuInteraction.
///
/// Contract:
/// - The first non-content child becomes the "direct" child that receives the interaction.
/// - A PeekPreviewContentView child is captured but not mounted in the normal hierarchy.
final class PeekPreviewTriggerView: ExpoView, UIContextMenuInteractionDelegate {
  private var interaction: UIContextMenuInteraction?
  private var previewContent: PeekPreviewContentView?
  private var directChild: UIView?

  var previewKey: String?

  let onWillShow = EventDispatcher()
  let onCommit = EventDispatcher()
  let onDismiss = EventDispatcher()

  required init(appContext: AppContext? = nil) {
    super.init(appContext: appContext)
    interaction = UIContextMenuInteraction(delegate: self)
  }

  override func mountChildComponentView(_ childComponentView: UIView, index: Int) {
    // Capture preview content separately so it can be hosted in a preview controller.
    if let previewView = childComponentView as? PeekPreviewContentView {
      previewContent = previewView
      return
    }

    // We only support a single direct child to keep the interaction target well-defined.
    if directChild != nil {
      return
    }

    directChild = childComponentView
    // Attach the context menu interaction directly to the rendered child.
    if let interaction {
      childComponentView.addInteraction(interaction)
    }
    super.mountChildComponentView(childComponentView, index: index)
  }

  override func unmountChildComponentView(_ child: UIView, index: Int) {
    if child is PeekPreviewContentView {
      if previewContent === child {
        previewContent = nil
      }
      return
    }

    guard let directChild else {
      return
    }

    if directChild !== child {
      return
    }

    // Detach the interaction to avoid leaking it across view reuse.
    if let interaction {
      directChild.removeInteraction(interaction)
    }

    self.directChild = nil
    super.unmountChildComponentView(child, index: index)
  }

  func contextMenuInteraction(
    _ interaction: UIContextMenuInteraction,
    configurationForMenuAtLocation location: CGPoint
  ) -> UIContextMenuConfiguration? {
    // Without preview content there is nothing to present, so we disable the menu.
    guard previewContent != nil else {
      return nil
    }
    // Emit a will-show event as soon as the system asks for a configuration.
    onWillShow(makeEventPayload())
    return UIContextMenuConfiguration(
      identifier: nil,
      previewProvider: { [weak self] in
        self?.createPreviewViewController()
      },
      actionProvider: { _ in
        return nil
      }
    )
  }

  func contextMenuInteraction(
    _ interaction: UIContextMenuInteraction,
    configuration: UIContextMenuConfiguration,
    highlightPreviewForItemWithIdentifier identifier: NSCopying
  ) -> UITargetedPreview? {
    guard let superview, let directChild else {
      return nil
    }

    // Anchor the highlight animation to the direct child for a more natural effect.
    let target = UIPreviewTarget(
      container: superview,
      center: convert(directChild.center, to: superview)
    )

    let parameters = UIPreviewParameters()
    parameters.backgroundColor = .clear

    return UITargetedPreview(view: directChild, parameters: parameters, target: target)
  }

  func contextMenuInteraction(
    _ interaction: UIContextMenuInteraction,
    willEndFor configuration: UIContextMenuConfiguration,
    animator: UIContextMenuInteractionAnimating?
  ) {
    // The dismiss callback should run after the interaction animation completes.
    animator?.addCompletion { [weak self] in
      self?.onDismiss(self?.makeEventPayload() ?? [:])
    }
  }

  func contextMenuInteraction(
    _ interaction: UIContextMenuInteraction,
    willPerformPreviewActionForMenuWith configuration: UIContextMenuConfiguration,
    animator: UIContextMenuInteractionCommitAnimating
  ) {
    // A commit corresponds to the "pop" action.
    onCommit(makeEventPayload())
  }

  private func createPreviewViewController() -> UIViewController? {
    guard let previewContent else {
      return nil
    }

    let viewController = PeekPreviewViewController(contentView: previewContent)
    let size = previewContent.resolvePreferredContentSize()
    // Apply an explicit preferredContentSize when available.
    if size.width > 0, size.height > 0 {
      viewController.preferredContentSize = size
    }
    return viewController
  }

  private func makeEventPayload() -> [String: Any] {
    guard let previewKey else {
      return [:]
    }
    return ["previewKey": previewKey]
  }
}

/// Hidden content view that is rendered by React, but presented inside the preview controller.
final class PeekPreviewContentView: ExpoView {
  var preferredContentSizeOverride: CGSize?

  func resolvePreferredContentSize() -> CGSize {
    // Preferred size precedence:
    // 1) explicit override from JS
    // 2) Auto Layout measurement
    // 3) current bounds as a final fallback
    if let preferredContentSizeOverride {
      return preferredContentSizeOverride
    }

    let measuredSize = systemLayoutSizeFitting(UIView.layoutFittingCompressedSize)
    if measuredSize.width > 0, measuredSize.height > 0 {
      return measuredSize
    }

    return bounds.size
  }
}

/// Simple container controller that hosts the preview content view directly.
final class PeekPreviewViewController: UIViewController {
  private let contentView: PeekPreviewContentView

  init(contentView: PeekPreviewContentView) {
    self.contentView = contentView
    super.init(nibName: nil, bundle: nil)
  }

  override func loadView() {
    view = contentView
  }

  override func viewDidAppear(_ animated: Bool) {
    super.viewDidAppear(animated)
    // Ensure the content view fills the preview container after presentation.
    contentView.frame = view.bounds
    contentView.setNeedsLayout()
    contentView.layoutIfNeeded()
  }

  @available(*, unavailable)
  required init?(coder: NSCoder) {
    fatalError("init(coder:) has not been implemented")
  }
}

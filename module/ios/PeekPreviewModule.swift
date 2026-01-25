import ExpoModulesCore

/// Native module that powers iOS peek and pop behavior via UIContextMenuInteraction.
/// It exposes two native views:
/// - PeekPreviewTriggerView: attaches the interaction to its direct child.
/// - PeekPreviewContentView: supplies the preview view controller's content.
public class PeekPreviewModule: Module {
  public static let moduleName = "PeekPreviewModule"

  public func definition() -> ModuleDefinition {
    Name(PeekPreviewModule.moduleName)

    // The trigger view owns the interaction and emits lifecycle events.
    View(PeekPreviewTriggerView.self) {
      // The preview key is echoed back in events so JS can correlate callbacks.
      Prop("previewKey") { (view: PeekPreviewTriggerView, previewKey: String?) in
        view.previewKey = previewKey
      }

      Prop("disableForceFlatten") { (_: PeekPreviewTriggerView, _: Bool) in
        // Used by Expo's shadow node to disable view flattening when display: contents is set.
      }

      Events("onWillShow", "onCommit", "onDismiss")
    }

    // The content view is mounted as a hidden child and used only for previews.
    View(PeekPreviewContentView.self) {
      Prop("preferredContentSize") { (view: PeekPreviewContentView, size: PreferredContentSize?) in
        guard let size else {
          view.preferredContentSizeOverride = nil
          return
        }

        // Negative sizes are treated as invalid and ignored.
        guard size.width >= 0, size.height >= 0 else {
          return
        }

        view.preferredContentSizeOverride = CGSize(
          width: CGFloat(size.width),
          height: CGFloat(size.height)
        )
      }
    }
  }
}

/// Serializable size override passed from JS for the preview controller.
struct PreferredContentSize: Record {
  @Field var width: Double
  @Field var height: Double
}

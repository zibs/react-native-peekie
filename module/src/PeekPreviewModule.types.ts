import type { ReactNode } from 'react';
import type { ViewProps } from 'react-native';

/**
 * Optional size override for the native preview controller.
 * Provide a height and set width to 0 to let the system choose the width.
 */
export type PreferredContentSize = {
  width: number;
  height: number;
};

/** Native event payload emitted from the trigger view. */
export type PeekPreviewEventPayload = {
  previewKey?: string;
};

/** Native event wrapper used by Expo view events. */
export type PeekPreviewEvent = {
  nativeEvent: PeekPreviewEventPayload;
};

/** Internal props for the native trigger view. */
export interface NativePeekPreviewTriggerProps extends ViewProps {
  previewKey?: string;
  disableForceFlatten?: boolean;
  onWillShow?: (event: PeekPreviewEvent) => void;
  onCommit?: (event: PeekPreviewEvent) => void;
  onDismiss?: (event: PeekPreviewEvent) => void;
  children: ReactNode;
}

/** Internal props for the native preview content view. */
export interface NativePeekPreviewContentProps extends ViewProps {
  preferredContentSize?: PreferredContentSize;
  children?: ReactNode;
}

/** Legacy registry renderer type. Prefer the compositional API. */
export type PeekPreviewRenderer = () => ReactNode;

/** Legacy trigger props kept for backward compatibility. */
export interface PeekPreviewTriggerProps extends ViewProps {
  previewKey: string;
  onCommit: () => void;
  onWillShow?: () => void;
  onDismiss?: () => void;
  preferredContentSize?: PreferredContentSize;
  children: ReactNode;
}

/**
 * Compositional peek and pop container.
 *
 * Render `PeekPreview.Trigger` as the press target and `PeekPreview.Preview`
 * as the preview content. `previewKey` is optional but recommended so
 * callbacks can be correlated and the legacy registry fallback can work.
 */
export interface PeekPreviewProps extends ViewProps {
  previewKey?: string;
  onCommit: () => void;
  onWillShow?: () => void;
  onDismiss?: () => void;
  preferredContentSize?: PreferredContentSize;
  children: ReactNode;
}

/** Props for `PeekPreview.Trigger`. Accepts standard view props like `style`. */
export interface PeekPreviewTriggerSlotProps extends ViewProps {
  children: ReactNode;
}

/** Props for `PeekPreview.Preview`. */
export interface PeekPreviewPreviewSlotProps {
  /** Overrides the root `preferredContentSize` for this preview. */
  preferredContentSize?: PreferredContentSize;
  children?: ReactNode;
}

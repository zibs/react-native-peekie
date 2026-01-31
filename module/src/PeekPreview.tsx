import * as React from 'react';
import { View } from 'react-native';

import type {
  PeekPreviewEvent,
  PeekPreviewPreviewSlotProps,
  PeekPreviewProps,
  PeekPreviewTriggerSlotProps,
} from './PeekPreviewModule.types';
import {
  NativePeekPreviewContent,
  NativePeekPreviewTrigger,
  areNativePeekPreviewsAvailable,
} from './PeekPreviewModuleView';

/** Slot component that marks the trigger subtree. */
function TriggerSlot(props: PeekPreviewTriggerSlotProps) {
  return <>{props.children}</>;
}

/** Slot component that marks the preview subtree. */
function PreviewSlot(props: PeekPreviewPreviewSlotProps) {
  return <>{props.children}</>;
}

type SlotElement<P> = React.ReactElement<P> | null;

type PickSlotsResult = {
  triggerChildren: React.ReactNode[];
  triggerSlot: React.ReactElement<PeekPreviewTriggerSlotProps> | null;
  previewSlot: React.ReactElement<PeekPreviewPreviewSlotProps> | null;
};

/** Splits children into trigger and preview slots without extra wrappers. */
function pickSlots(children: React.ReactNode): PickSlotsResult {
  const triggerChildren: React.ReactNode[] = [];
  let triggerSlot: SlotElement<PeekPreviewTriggerSlotProps> = null;
  let previewSlot: SlotElement<PeekPreviewPreviewSlotProps> = null;

  React.Children.forEach(children, (child) => {
    if (!React.isValidElement(child)) {
      triggerChildren.push(child);
      return;
    }

    if (child.type === TriggerSlot) {
      triggerSlot = child as React.ReactElement<PeekPreviewTriggerSlotProps>;
      return;
    }

    if (child.type === PreviewSlot) {
      previewSlot = child as React.ReactElement<PeekPreviewPreviewSlotProps>;
      return;
    }

    triggerChildren.push(child);
  });

  return { triggerChildren, triggerSlot, previewSlot };
}

/**
 * Compositional PeekPreview container.
 *
 * This mirrors Expo Router's pattern:
 * - `PeekPreview.Trigger` defines the press target.
 * - `PeekPreview.Preview` defines the preview content.
 */
function PeekPreviewRoot(props: PeekPreviewProps) {
  const {
    previewKey,
    onCommit,
    onWillShow,
    onDismiss,
    preferredContentSize,
    children,
    style,
    ...rootViewProps
  } = props;

  const { triggerChildren, triggerSlot, previewSlot } = pickSlots(children);

  const slotStyle = triggerSlot?.props.style;
  const mergedStyle = slotStyle && style ? [slotStyle, style] : style ?? slotStyle;

  const viewProps = {
    ...(triggerSlot?.props ?? {}),
    ...rootViewProps,
    style: mergedStyle,
  };

  const previewContent = previewSlot?.props.children;
  const resolvedPreferredContentSize = previewSlot?.props.preferredContentSize ?? preferredContentSize;

  const handleWillShow = React.useCallback(
    (_event: PeekPreviewEvent) => {
      onWillShow?.();
    },
    [onWillShow]
  );

  const handleCommit = React.useCallback(
    (_event: PeekPreviewEvent) => {
      onCommit();
    },
    [onCommit]
  );

  const handleDismiss = React.useCallback(
    (_event: PeekPreviewEvent) => {
      onDismiss?.();
    },
    [onDismiss]
  );

  const resolvedTriggerChildren = triggerSlot ? triggerSlot.props.children : triggerChildren;

  if (!areNativePeekPreviewsAvailable) {
    return <View {...viewProps}>{resolvedTriggerChildren}</View>;
  }

  return (
    <NativePeekPreviewTrigger
      {...viewProps}
      previewKey={previewKey}
      onWillShow={handleWillShow}
      onCommit={handleCommit}
      onDismiss={handleDismiss}
    >
      {resolvedTriggerChildren}
      {previewContent ? (
        <NativePeekPreviewContent preferredContentSize={resolvedPreferredContentSize}>
          {previewContent}
        </NativePeekPreviewContent>
      ) : null}
    </NativePeekPreviewTrigger>
  );
}

type PeekPreviewComponent = React.FC<PeekPreviewProps> & {
  Trigger: React.FC<PeekPreviewTriggerSlotProps>;
  Preview: React.FC<PeekPreviewPreviewSlotProps>;
};

/** Public compositional API with `Trigger` and `Preview` slots. */
export const PeekPreview = PeekPreviewRoot as PeekPreviewComponent;
PeekPreview.Trigger = TriggerSlot;
PeekPreview.Preview = PreviewSlot;

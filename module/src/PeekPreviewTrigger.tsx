import * as React from 'react';
import { View } from 'react-native';

import type { PeekPreviewEvent, PeekPreviewTriggerProps } from './PeekPreviewModule.types';
import {
  NativePeekPreviewContent,
  NativePeekPreviewTrigger,
  areNativePeekPreviewsAvailable,
} from './PeekPreviewModuleView';
import { getPeekPreviewRenderer, subscribePeekPreviewRegistry } from './registry';

function useRegisteredPreview(previewKey: string) {
  return React.useSyncExternalStore(
    (listener) => subscribePeekPreviewRegistry(previewKey, listener),
    () => getPeekPreviewRenderer(previewKey),
    () => getPeekPreviewRenderer(previewKey)
  );
}

export function PeekPreviewTrigger(props: PeekPreviewTriggerProps) {
  const {
    previewKey,
    onCommit,
    onWillShow,
    onDismiss,
    preferredContentSize,
    children,
    ...viewProps
  } = props;

  const renderPreview = useRegisteredPreview(previewKey);

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

  if (!areNativePeekPreviewsAvailable) {
    return <View {...viewProps}>{children}</View>;
  }

  return (
    <NativePeekPreviewTrigger
      {...viewProps}
      previewKey={previewKey}
      onWillShow={handleWillShow}
      onCommit={handleCommit}
      onDismiss={handleDismiss}
    >
      {children}
      {renderPreview ? (
        <NativePeekPreviewContent preferredContentSize={preferredContentSize}>
          {renderPreview()}
        </NativePeekPreviewContent>
      ) : null}
    </NativePeekPreviewTrigger>
  );
}

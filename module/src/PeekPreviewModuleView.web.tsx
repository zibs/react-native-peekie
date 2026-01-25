import * as React from 'react';
import { View } from 'react-native';

import type {
  NativePeekPreviewContentProps,
  NativePeekPreviewTriggerProps,
} from './PeekPreviewModule.types';

export const areNativePeekPreviewsAvailable = false;

export function NativePeekPreviewTrigger(props: NativePeekPreviewTriggerProps) {
  return <View style={props.style}>{props.children}</View>;
}

export function NativePeekPreviewContent(_props: NativePeekPreviewContentProps) {
  return null;
}

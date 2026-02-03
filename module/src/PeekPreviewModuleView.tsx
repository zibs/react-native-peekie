import { requireNativeView } from "expo";
import * as React from "react";
import { Platform, StyleSheet, View } from "react-native";

import type {
  NativePeekPreviewContentProps,
  NativePeekPreviewTriggerProps,
} from "./PeekPreviewModule.types";

// Expo modules views require bridgeless mode to use requireNativeView reliably.
const isBridgeless =
  (globalThis as { RN$Bridgeless?: boolean }).RN$Bridgeless === true;

/** True when the native peek and pop views can be mounted. */
export const areNativePeekPreviewsAvailable =
  Platform.OS === "ios" && isBridgeless;

const NativePeekPreviewTriggerView: React.ComponentType<NativePeekPreviewTriggerProps> | null =
  areNativePeekPreviewsAvailable
    ? requireNativeView("PeekPreviewModule", "PeekPreviewTriggerView")
    : null;

const NativePeekPreviewContentView: React.ComponentType<NativePeekPreviewContentProps> | null =
  areNativePeekPreviewsAvailable
    ? requireNativeView("PeekPreviewModule", "PeekPreviewContentView")
    : null;

/** Native trigger view wrapper with a graceful JS fallback. */
export function NativePeekPreviewTrigger(props: NativePeekPreviewTriggerProps) {
  if (!NativePeekPreviewTriggerView) {
    return <View style={props.style}>{props.children}</View>;
  }
  return <NativePeekPreviewTriggerView {...props} />;
}

/**
 * Native preview content wrapper.
 * The content is rendered off-screen and consumed by the native preview controller.
 */
export function NativePeekPreviewContent(props: NativePeekPreviewContentProps) {
  const sizeStyle = React.useMemo(() => {
    const width = props.preferredContentSize?.width ?? 0;
    const height = props.preferredContentSize?.height ?? 0;

    const resolved: { width?: number; height?: number } = {};
    if (width > 0) {
      resolved.width = width;
    }
    if (height > 0) {
      resolved.height = height;
    }

    return resolved;
  }, [props.preferredContentSize?.height, props.preferredContentSize?.width]);

  if (!NativePeekPreviewContentView) {
    return null;
  }

  const hiddenStyle = StyleSheet.flatten([
    props.style,
    sizeStyle,
    styles.hiddenPreviewContent,
  ]);

  return <NativePeekPreviewContentView {...props} style={hiddenStyle} />;
}

const styles = StyleSheet.create({
  hiddenPreviewContent: {
    position: "absolute",
    top: 0,
    left: 0,
    opacity: 0,
  },
});

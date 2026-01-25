import type { PeekPreviewRenderer } from './PeekPreviewModule.types';

// Legacy registry retained for compatibility. The new compositional API does not require it.
const registry = new Map<string, PeekPreviewRenderer>();
const listenersByKey = new Map<string, Set<() => void>>();

function notifyListeners(previewKey: string) {
  const listeners = listenersByKey.get(previewKey);
  if (!listeners) {
    return;
  }
  listeners.forEach((listener) => listener());
}

/** Subscribes to changes for a specific preview key. */
export function subscribePeekPreviewRegistry(previewKey: string, listener: () => void) {
  let listeners = listenersByKey.get(previewKey);
  if (!listeners) {
    listeners = new Set();
    listenersByKey.set(previewKey, listeners);
  }
  listeners.add(listener);

  return () => {
    const current = listenersByKey.get(previewKey);
    if (!current) {
      return;
    }
    current.delete(listener);
    if (current.size === 0) {
      listenersByKey.delete(previewKey);
    }
  };
}

/**
 * Registers preview content for a key.
 * Prefer rendering `PeekPreview.Preview` directly when possible.
 */
export function registerPeekPreview(previewKey: string, renderPreview: PeekPreviewRenderer) {
  const previous = registry.get(previewKey);
  registry.set(previewKey, renderPreview);
  if (previous !== renderPreview) {
    notifyListeners(previewKey);
  }

  return () => {
    const current = registry.get(previewKey);
    if (current === renderPreview) {
      registry.delete(previewKey);
      notifyListeners(previewKey);
    }
  };
}

/** Returns the registered preview renderer for a key, if present. */
export function getPeekPreviewRenderer(previewKey: string): PeekPreviewRenderer | undefined {
  return registry.get(previewKey);
}

<p align="center">
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="peekie-dark.png" />
    <img src="peakie.png" alt="react-native-peekie" width="900" />
  </picture>
</p>

<h1 align="center">react-native-peekie</h1>

<p align="center">
  <a href="https://www.npmjs.com/package/react-native-peekie"><img src="https://img.shields.io/npm/v/react-native-peekie.svg" alt="npm version" /></a>
</p>

iOS Peek & Pop (via `UIContextMenuInteraction`) for React Native and Expo Modules.

> iOS-only. Requires a development build (custom native code).

<img src="example.gif" alt="Peek preview demo" width="360" />

License: MIT

## Features

- Compositional API: `PeekPreview.Trigger` + `PeekPreview.Preview`
- Works with React Navigation or any router
- No global registry required (good for large lists)

## Attribution

This module is heavily inspired by Expo Router’s iOS context‑menu preview behavior.
The goal here is to offer the same UX in a router‑agnostic, reusable Expo module.

## Requirements

- iOS 15.1+
- Expo development build or bare React Native app (not supported in Expo Go)
- Targets the latest Expo SDK and React Native (older versions not supported)

## Installation

```bash
npm install react-native-peekie
```

This module depends on `react-native-screens`:

```bash
npx expo install react-native-screens
```

## Usage (no navigation)

```tsx
import * as React from 'react';
import { Text, View } from 'react-native';
import { PeekPreview } from 'react-native-peekie';

export function Item() {
  return (
    <PeekPreview
      previewKey="demo-preview"
      onCommit={() => console.log('committed')}
      onDismiss={() => console.log('dismissed')}
    >
      <PeekPreview.Trigger>
        <Text>Press and hold me</Text>
      </PeekPreview.Trigger>
      <PeekPreview.Preview preferredContentSize={{ width: 0, height: 220 }}>
        <View>
          <Text>Preview content</Text>
        </View>
      </PeekPreview.Preview>
    </PeekPreview>
  );
}
```

## Usage (React Navigation)

```tsx
import * as React from 'react';
import { Text, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { PeekPreview } from 'react-native-peekie';

export function Row({ id, title }: { id: string; title: string }) {
  const navigation = useNavigation();

  return (
    <PeekPreview
      previewKey={id}
      onCommit={() => navigation.navigate('Details', { id })}
    >
      <PeekPreview.Trigger>
        <Text>{title}</Text>
      </PeekPreview.Trigger>
      <PeekPreview.Preview preferredContentSize={{ width: 0, height: 220 }}>
        <View>
          <Text>{title}</Text>
        </View>
      </PeekPreview.Preview>
    </PeekPreview>
  );
}
```

## API

### `PeekPreview`

Props:
- `previewKey?: string` — optional key echoed in native events.
- `onCommit(): void` — called when the user commits (“pop”).
- `onWillShow?(): void` — called just before the preview appears.
- `onDismiss?(): void` — called after the preview is dismissed.
- `preferredContentSize?: { width: number; height: number }` — optional default preview size.

### `PeekPreview.Trigger`

Slot component for the press target. Accepts standard `ViewProps` (e.g., `style`).

### `PeekPreview.Preview`

Slot component for preview content. Accepts an optional `preferredContentSize`.

## Development

Run the example app:

```bash
cd example
npm install
npx expo start
```

Then create a development build (required for native code):

```bash
npx expo run:ios
```

## Publishing

```bash
npm whoami
npm pack
npm publish --access public
```

Notes:
- If this is the first publish, npm may prompt you to enable 2FA.
- `--access public` is required for scoped packages; harmless for unscoped.

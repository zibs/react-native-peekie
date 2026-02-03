# AGENTS.md

## Repo Layout
- Root contains media assets and the `module/` package.
- The React Native Expo module lives in `module/`.

## Common Commands (module/)
- Install deps: `npm install`
- Build: `npm run build`
- Lint: `npm run lint`
- Test: `npm run test`
- Clean: `npm run clean`
- Prepare: `npm run prepare`
- Prepublish: `npm run prepublishOnly`

## Example App (module/example/)
- Install: `npm install`
- Start dev server: `npx expo start`
- Create iOS dev build: `npx expo run:ios`
- Open Xcode project: `npm run open:ios`
- Open Android Studio project: `npm run open:android`

## Publishing
- `npm whoami`
- `npm pack`
- `npm publish --access public`

## TODO
- Confirm whether root-level workflows exist outside `module/`.

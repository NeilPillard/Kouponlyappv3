# Kouponly Mobile

Expo SDK 55 implementation of the Kouponly web experience for iOS and Android.

## Run

```bash
npm install
npm run ios
# or
npm run android
```

The app uses native Liquid Glass for navigation surfaces when the iOS 26 API is available. Older iOS versions and Android use a translucent blur fallback. Prototype activity is persisted locally with AsyncStorage.

## Verify

```bash
npm run typecheck
npm test
npx expo install --check
```

Maestro journeys are stored under `.maestro/` and require a simulator/device with the app installed.

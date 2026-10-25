# Petavie

Evcil hayvan profili, sağlık kayıtları, hatırlatmalar ve yerel rehber — veriler
cihazda kalır, hesap gerekmez.

## Stack

- **Mobile:** React Native + Expo SDK 58 + TypeScript + Expo Router
- **Styling:** NativeWind v4 + Tailwind
- **State:** TanStack Query (veri), React local state (UI)
- **Forms:** React Hook Form + Zod
- **Depolama:** AsyncStorage (`src/services/demo/store.ts`)

## Kurulum

```bash
npm install --legacy-peer-deps
cp .env.example .env
npm run start
```

`APP_ENV`: `development` | `staging` | `production` — `app.config.ts` uygulama adı
ve bundle id seçer.

```bash
npm run typecheck
npm run lint
npm run doctor   # npx expo-doctor
```

Expo Go yalnızca geliştirme içindir. **iOS + Android mağaza** için EAS kullan.

### Mağaza build (iOS + Android)

1. [Expo hesabı](https://expo.dev) + `npm i -g eas-cli` → `eas login`
2. Apple Developer + Google Play Console hesapları
3. Gizlilik politikası URL’si (konum, fotoğraf, bildirim izinleri)
4. İlk build (TestFlight / internal test):

```bash
npm install --legacy-peer-deps
eas build --profile preview --platform all
```

5. Mağaza sürümü (`APP_ENV=production`, bundle id `com.petavie.app`):

```bash
npm run build:production
# veya: eas build --profile production --platform ios
#       eas build --profile production --platform android
```

6. Yükleme:

```bash
eas submit --profile production --platform ios
eas submit --profile production --platform android
```

`eas.json` içinde production profili `APP_ENV=production` ve build numarası
`autoIncrement` kullanır. Android submit varsayılanı **internal** track; Play
Console’da testten production’a al.

Detay: [EAS Build](https://docs.expo.dev/build/introduction/) ·
[iOS submit](https://docs.expo.dev/submit/ios/) ·
[Android submit](https://docs.expo.dev/submit/android/)

## Klasör yapısı

```text
src/
├── app/              # Expo Router
├── features/         # pets, health, reminders, guide, nearby, …
├── components/       # ui, forms, navigation
├── services/         # demo store, analytics, query client
├── config/           # env
├── constants/
├── utils/
└── types/
```

Her feature: `service.ts`, `backends/local.ts`, hooks, components.

## Mimari

- Ekranlar yalnızca feature `service` katmanını kullanır.
- Sunucu verisi TanStack Query cache’inde tutulur; ayrı global store yok.
- Rehber görselleri Wikimedia URL’lerinden yüklenir (`features/guide/images.ts`).

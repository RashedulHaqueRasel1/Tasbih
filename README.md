# Tasbih: Digital Tasbih Counter

Muslim der jonno ekta offline, ads-chara, sundor tasbih counter app. React Native (Expo SDK 58) + TypeScript.

Ei file e puro app er plan, feature, ar phase onujayi kaj bhag kora ache. Prottek phase choto rakha hoyeche jate ek ek kore build kora jay ar prottek phase er shesh e app run kore dekha jay.

---

## Quick start

```bash
npm install
npx expo start
```

Terminal e QR code ashbe. Phone e **Expo Go** app diye scan korlei app khulbe. `a` chaple Android emulator, `w` chaple browser.

Useful command:

```bash
npx expo install <package>   # package install, ALWAYS eta use koro (SDK-compatible version ney)
npm run validate             # typecheck + lint + format check
npx expo-doctor              # setup check
```

---

## App er idea

| Onno app e problem            | Amader solution                |
| ----------------------------- | ------------------------------ |
| Choto button, tap kora kothin | Pura screen tap area           |
| Ads, popup                    | Zero ads                       |
| Count hariye jay              | Prottek tap e auto-save        |
| Vul reset                     | Confirm dialog + Undo          |
| Chokhe lage                   | Light + Dark theme             |
| Bujha jay na koyta bakhi      | Mala animation + round counter |
| Internet lage                 | 100% offline                   |

**Design**: duto mala style (Oval mala ar Vertical strand), duto theme (Light beige, Dark warm black + amber), 7 ta bead skin.

---

## Tech stack

| Kaj                 | Tool                                                  |
| ------------------- | ----------------------------------------------------- |
| Framework           | Expo SDK 58, React Native 0.88, TypeScript            |
| Navigation          | expo-router                                           |
| State               | Zustand (+ persist)                                   |
| Storage             | AsyncStorage (Phase 2 e MMKV)                         |
| Mala drawing        | react-native-svg + Reanimated                         |
| Animation / gesture | react-native-reanimated, react-native-gesture-handler |
| Haptic / Sound      | expo-haptics, expo-audio                              |
| Screen on           | expo-keep-awake                                       |
| Notification        | expo-notifications                                    |
| Language            | i18next + react-i18next                               |
| Chart               | react-native-svg (custom bar chart)                   |
| Backup              | expo-file-system, expo-sharing                        |

---

## Architecture

Feature-based architecture. Prottek feature nijer sob kichu (screen, component, store, data, logic) nijer folder e rakhe. Jinish jeta ek-er beshi feature use kore, seta `shared/` e jay.

```
Tasbih/
├─ src/
│  ├─ app/                  Route file gulo (expo-router). Shudhu feature screen re-export kore, kono logic nai
│  │
│  ├─ features/             Prottek feature ekta folder, nijer moddhe self-contained
│  │  ├─ welcome/           (ekhon ache)
│  │  ├─ counter/           Phase 1: counter screen, counterStore, tap logic
│  │  ├─ mala/              Phase 2, 4: OvalMala, VerticalMala, skins
│  │  ├─ dhikr/             Phase 3: dhikr library, custom dhikr, target picker
│  │  ├─ chain/             Phase 5: tasbih chain
│  │  ├─ history/           Phase 6: daily goal, streak, chart
│  │  ├─ settings/          Phase 7: settings screen, settingsStore
│  │  ├─ onboarding/        Phase 7
│  │  └─ reminder/          Phase 8
│  │
│  ├─ shared/               Feature-agnostic code (kono feature import kore na)
│  │  ├─ ui/                AppText, Surface, Screen, Button ...
│  │  ├─ theme/             colors, spacing, typography, useTheme
│  │  ├─ hooks/             useColorScheme, useHaptics ...
│  │  ├─ storage/           MMKV wrapper (Phase 1)
│  │  ├─ i18n/              bn.json, en.json (Phase 7)
│  │  └─ utils/             date helper ...
│  │
│  └─ global.css            web font variable
├─ assets/                  fonts, sounds, images
├─ README.md
└─ app.json
```

### Ekta feature er structure

```
features/<name>/
├─ screens/       Screen component (route theke eta e render hoy)
├─ components/    Shudhu ei feature er UI component
├─ store/         Zustand store
├─ hooks/         Ei feature er hook
├─ data/          Static data / constant
├─ utils/         Pure function (test kora shohoj)
├─ types.ts       Ei feature er type
└─ index.ts       Public API: feature er baire ja export korbo shudhu ta
```

Shob folder prothom theke thakbe na, dorkar hole banabo.

### Rules (ESLint diye enforce kora)

1. **Feature er public API `index.ts`**: onno jaygay theke `@/features/counter` import kora jabe, `@/features/counter/store/counter-store` kora jabe na.
2. **`shared/` kokhono `features/` import korbe na.** Dependency shobshomoy `app → features → shared` dike jabe.
3. **Ek feature onno feature er internal file import korbe na.** Dorkar hole public API diye, ba jinish ta `shared/` e niye jao.
4. **`app/` e logic nai.** Route file shudhu `export { XScreen as default } from "@/features/x"`.
5. **File naam kebab-case** (`phase-progress-card.tsx`), component naam PascalCase.
6. **Style `StyleSheet.create` diye, color shobshomoy `useTheme()` theke.** Hardcoded hex color component e likha jabe na.

### Code quality tools

| Command             | Kaj                                        |
| ------------------- | ------------------------------------------ |
| `npm run typecheck` | TypeScript strict check                    |
| `npm run lint`      | ESLint (Expo config + architecture rule)   |
| `npm run format`    | Prettier diye format                       |
| `npm run validate`  | typecheck + lint + format check, ek shathe |

Kono phase shesh korar age `npm run validate` pass korte hobe.

---

## Phase overview

| Phase | Naam                           | Result                                  | Somoy (ontomano) |
| ----- | ------------------------------ | --------------------------------------- | ---------------- |
| 0     | Project setup                  | App run hoy, welcome screen ashe        | Done             |
| 1     | Core counter                   | Simple counter kaj kore, count save hoy | Done             |
| 2     | Theme + Oval bead mala         | Light/Dark, bead mala ghure             | Done             |
| 3     | Dhikr library + target/round   | Dhikr choose, target, round             | Done             |
| 4     | Vertical strand + skins        | Notun mala style, 6 skin                | Done             |
| 5     | Chain mode                     | 33/33/34 auto chain                     | Done             |
| 6     | Daily goal, streak, history    | Progress, chart                         | Done             |
| 7     | Settings, language, onboarding | Full settings, Bangla/English           | 2 din            |
| 8     | Reminder notification          | Daily reminder                          | 1 din            |
| 9     | Backup, polish, testing        | Stable, smooth app                      | 2 din            |
| 10    | Release                        | Play Store build                        | 1-2 din          |
| 11    | Version 2 (optional)           | Widget, volume button                   | pore             |

Prottek phase er shesh e **"Done when"** checklist ache. Sob tick hole porer phase e jabe.

---

## Phase 0: Project setup (DONE)

**Goal**: Project create, welcome screen dekha.

- [x] Latest Expo (SDK 58) project create
- [x] Template demo file remove
- [x] Tasbih color theme (Light beige / Dark warm black + amber)
- [x] Welcome screen with progress card
- [x] Feature-based architecture (`features/`, `shared/`), ESLint boundary rules, Prettier, strict TypeScript
- [x] Splash background dark green
- [x] README with phase plan

**Done when**: `npx expo start` korle "Welcome to Tasbih" screen ashe.

---

## Phase 1: Core counter (DONE)

**Goal**: Kaj kora simple counter, app close korle o count thake.

**Install kora hoyeche**: `zustand`, `expo-haptics`, `@react-native-async-storage/async-storage`, `jest-expo` (test)

> MMKV er bodole **AsyncStorage** use kora hoyeche, karon MMKV Expo Go te cholbe na. Shob storage `src/shared/storage/persist-storage.ts` e ek jaygay ache, Kokhono development build use korle oi ek file bodlalei MMKV hoye jabe.

**Tasks**

- [x] `features/counter/utils/counter-logic.ts`: pure function (`tap`, `undo`, `reset`, `roundProgress`), 9 ta unit test
- [x] `features/counter/store/counter-store.ts`: Zustand store, auto-save (persist)
- [x] Counter screen: boro number, "of 33", round, progress bar
- [x] Pura screen tap area, tap e +1 (number e choto pulse animation)
- [x] Haptic: normal tap e light, round complete e success, reset e warning
- [x] Undo (round er shima paar kore o) ar Reset (confirm dialog shoho)
- [x] Welcome screen e "Start counting" button, `/counter` route
- [x] Shared: `Button`, `haptics`, `useStoreHydrated`, `persistStorage`

**Logic**

```
tap: count + 1
count == target: rounds + 1, count = 0, success haptic
undo at count 0, round > 1: previous round er (target - 1) e fire jay
```

**Done when**: tap korle number barhe, vibration hoy, app bondho kore khulle count thik thake, reset e confirm chay. `npm run validate` pass kore.

---

## Phase 2: Theme + Oval bead mala (DONE)

**Goal**: Sundor Oval mala, Light/Dark theme.

> **Skia bad dewa hoyeche, `react-native-svg` + Reanimated use kora hoyeche.** 33 ta bead er jonno SVG jothesto smooth, ar eta Expo Go ar web e shorashori cholay, development build lagena. Mala component ta `features/mala` e alada, tai pore dorkar hole Skia te bodlano shohoj.

**Install kora hoyeche**: `react-native-svg`, `expo-font`, `@expo-google-fonts/amiri`, `@expo-google-fonts/hind-siliguri`

**Tasks**

- [x] `shared/theme/theme-preference-store.ts`: theme Auto / Light / Dark, save hoy
- [x] `useColorScheme` ekhon user er preference mane (native + web)
- [x] Root layout font ar theme load hole splash hide kore (kono flash nai)
- [x] `features/settings`: Settings screen (theme + counter display) ar `settings-store`
- [x] `features/mala/utils/bead-layout.ts`: bead position er pure math (worklet), unit test shoho
- [x] `features/mala/components/oval-mala.tsx`: 33 bead, imam (shonali) bead, tassel, highlight
- [x] Tap e bead spring animation (Reanimated shared value), reset/dhikr change e snap
- [x] Mala'r majhe count number
- [x] Bead mala / Simple counter toggle (Settings e)
- [x] Shared: `Chip`, `SegmentedControl`, `ScreenHeader`

**Done when**: tap korle bead gulo ghure, tassel shoho, Light/Dark duto theme e sundor dekhay.

---

## Phase 3: Dhikr library + target/round (DONE)

**Goal**: Alada alada dhikr choose kora, target set kora.

**Tasks**

- [x] `features/dhikr/data/preset-dhikr.ts`: SubhanAllah, Alhamdulillah, Allahu Akbar, La ilaha illallah, Astaghfirullah, Durood, Hasbunallah (Arabic, English, Bangla, target)
- [x] Amiri (Arabic) ar Hind Siliguri (Bangla) font
- [x] Counter screen er upore dhikr chips (favorite age)
- [x] Dhikr library screen: list, search, favorite (star), selected highlight
- [x] Target picker: 33, 99, 100, 313, 1000, custom, infinite
- [x] Prottek dhikr er alada count / round / target save (`progress` per dhikr)
- [x] Custom dhikr banano (nam, Arabic optional, meaning optional, target) + validation + delete
- [x] Persist v1 to v2 migration (ager save kora count nosto hoyna)
- [x] Route file e wiring (`app/dhikr.tsx`) jate `dhikr` ar `counter` feature ek ar ekke import na kore

**Done when**: dhikr bodle Arabic text ar target bodle jay, prottek dhikr er count alada thake.

> Arabic text ar ortho release er age ekjon alem diye check korano uchit.

---

## Phase 4: Vertical strand + skins (DONE)

**Goal**: Notun mala style ar 6 ta bead skin.

**Tasks**

- [x] `features/mala/components/vertical-mala.tsx`: lomba S-curve e dana, bead gulo upor dike sorte thake, tassel shoho imam bead
- [x] `features/mala/utils/strand-layout.ts`: bead recycling er pure math (worklet), unit test shoho
- [x] **Vertical strand upor theke niche chole** (swipe down = +1), ar ekta fixed **gol ring** dekhay ekhon kon bead e acho. Ring er niche gona bead gulo dim, upore bakhi bead gulo solid. Oval mala te o front e ring ache
- [x] **Counter screen UI polish**: header e icon button (Chains, Settings), dhikr chips edge-to-edge scroll, vertical strand shoru kora jate bam dike text column choura hoy, nicher **ControlBar** (Undo / Target / Reset, icon + label). Icon: `@expo/vector-icons` (Ionicons)
- [x] **Oval mala er direction ulte dewa hoyeche**: ekhon bead gulo dan theke bam dike ghure (right to left)
- [x] Swipe: swipe down (strand) ba swipe left (oval) = +1, tap o kaj kore, swipe up/right count kore na (`counter/components/tap-surface.tsx`)
- [x] Settings: Mala style (Oval / Vertical strand)
- [x] `features/mala/data/skins.ts`: Wooden, Crystal blue, Amber, Black onyx, Turquoise, Pearl (prottek ta Light + Dark)
- [x] Skin picker (settings e rong er goal)
- [x] Duto mala style ei same counter logic ar same `useMalaOffset` animation hook share kore

> Gesture Handler er bodole React Native er `PanResponder` use kora hoyeche, tai root e extra setup lagena ar Expo Go te cholay.

**Done when**: style ar skin bodle shathe shathe mala bodlay, swipe kaj kore.

---

## Phase 5: Chain mode (DONE)

**Goal**: Tasbih-e-Fatima style: SubhanAllah 33, Alhamdulillah 33, Allahu Akbar 34.

**Tasks**

- [x] `features/chain`: `Chain { id, name, steps[] }`, preset Tasbih-e-Fatima (33 + 33 + 34)
- [x] `chain-logic.ts`: pure function (`tapRun`, `undoRun`, `runTotalTaps`), unit test shoho
- [x] Target hole auto next step, step complete e success haptic, chain complete e double haptic
- [x] Top e step indicator (dots) + chain er naam
- [x] "Chain complete" screen (Start again / Done)
- [x] Custom chain banano (naam + step: dhikr ar target), validation, delete
- [x] Chain progress save (app close korle o cholbe), delete kora chain cholchhe thakle auto exit
- [x] Counter screen e **Chains** button, chain mode e dhikr chips er jaygay chain indicator ar "Exit chain"
- [x] `useCounterSession`: chain ar normal dhikr ek hook e, screen duto ke ek vabe render kore
- [x] Mala chain er shob step jure ekbar e ghure (step bodlale thame na)

**Done when**: 3 ta dhikr auto ek ek kore cholbe ar shesh e complete screen ashbe.

---

## Phase 6: Daily goal, streak, history (DONE)

**Goal**: Progress track kora.

**Tasks**

- [x] `features/history/store/log-store.ts`: `DailyLog { "2026-11-23": { total, byDhikr } }` + `dailyGoal`
- [x] Prottek tap e aajker log update, undo e minus (800ms debounced save, app background e gele sathe sathe save: `shared/storage/debounced-storage.ts`)
- [x] Daily goal set (History screen e preset chip) + progress bar (History screen e)
- [x] Streak calculation (`utils/streak.ts`): current + best, aj ekhono hoy nai tai streak bhange na
- [x] History screen: week/month bar chart (react-native-svg), goal er dashed line, goal hit korle gold bar
- [x] Dhikr onujayi breakdown, lifetime total
- [x] Raat 12 tar por notun din, local timezone (`useToday` midnight e refresh kore)

**Done when**: aj koyta korlam, koy din streak, shoptaher chart shob thik dekhay.

---

## Phase 7: Settings, language, onboarding

**Goal**: Full settings ar prothom bar e welcome flow.

**Tasks**

- [ ] Settings screen: haptic, sound, keep screen on, left-hand mode
- [ ] `expo-keep-awake` (shudhu counter screen e)
- [ ] Click sound (`expo-audio`, preload)
- [x] i18n: Bangla + English + Arabic (RTL), `shared/i18n/` (landing, language select, Settings theke bodlano jay, count digit o bhasha onujayi)
- [ ] Onboarding 2-3 screen: language, mala style, daily goal
- [ ] `hasOnboarded` flag, Skip button

**Done when**: language bodle shob text bodlay, notun user prothom e onboarding dekhe.

---

## Phase 8: Reminder notification

**Goal**: Daily reminder.

**Install**: `expo-notifications`

**Tasks**

- [ ] Local scheduled notification (server lage na)
- [ ] Reminder time picker (shokal / shondha)
- [ ] "Aj ekhono goal hoy nai" streak bachano reminder
- [ ] Permission shudhu reminder on korar shomoy chaibe
- [ ] Android 13+ permission handle

**Done when**: thik somoy e notification ashe, off korle ashe na.

---

## Phase 9: Backup, polish, testing

**Goal**: Stable ar smooth app.

**Tasks**

- [ ] Data export/import (JSON file, `expo-sharing`)
- [ ] Reset all data (confirm shoho)
- [ ] Animation smooth check (60fps), low-end phone e test
- [ ] Small screen / big screen / tablet layout
- [ ] Accessibility: font size, contrast, screen reader label
- [ ] Bug fix, `npx expo lint`, `npx tsc --noEmit`, `npx expo-doctor`
- [ ] Real phone e 1-2 din use kore dekha

**Done when**: crash nai, animation smooth, data kokhono hariye jay na.

---

## Phase 10: Release

**Goal**: Play Store e publish.

**Tasks**

- [ ] App icon + adaptive icon, splash screen
- [ ] `app.json`: name, package name, version
- [ ] Privacy policy (data phone er baire jay na, eta likha)
- [ ] EAS Build: `npx eas build -p android`
- [ ] Play Store listing: screenshot, description (Bangla + English)
- [ ] Internal test, tarpor production

**Done when**: Play Store e app live.

---

## Phase 11: Version 2 (optional, pore)

- [ ] Home screen widget (Android)
- [ ] Volume button diye count (native module lagbe)
- [ ] Share milestone card
- [ ] Arabic language + RTL
- [ ] Locked skin (streak diye unlock)

---

## Feature details (short)

**Counter**: pura screen tap, bead animation, haptic, optional sound, Undo, Reset (confirm).
**Dhikr**: preset + custom, Arabic, uccharon, ortho, target, favorite.
**Target/Round**: 33 / 99 / 100 / 313 / 1000 / custom / infinite, target hole vibration.
**Chain**: SubhanAllah 33 → Alhamdulillah 33 → Allahu Akbar 34, auto next.
**Skin/Theme**: Oval/Vertical mala, 6 bead skin, Light/Dark/Auto.
**Goal/Streak/History**: daily goal, streak, week/month chart, dhikr breakdown.
**Reminder**: local notification, shokal/shondha.
**Settings**: haptic, sound, keep awake, left-hand, language, theme, backup.
**Offline**: kono account, server, internet lage na. Data shudhu user er phone e thake.

## Data model

```ts
Dhikr    { id, arabic, transliteration, meaning, defaultTarget, isCustom }
Chain    { id, name, steps: [{ dhikrId, target }] }
DailyLog { [date]: { total, byDhikr: { [dhikrId]: number } } }
Settings { theme, malaStyle, skin, haptic, sound, keepAwake, leftHand,
           language, dailyGoal, reminderTime, hasOnboarded }
```

## Design colors

|            | Light     | Dark      |
| ---------- | --------- | --------- |
| Background | `#efe6d6` | `#17120e` |
| Text       | `#3a2f22` | `#f1e6d0` |
| Accent     | `#8a3b1f` | `#e0a35a` |
| Card       | `#e0d4bd` | `#2a221b` |

Rong gulo ek jaygay: `src/shared/theme/colors.ts`. Default bead skin "Red amber" (`features/mala/data/skins.ts`).

#Contains logs encountered by running the following commands in order as shown below:  

npm run format
npm run typecheck
npm run lint
run run build
npm run dev / npm run start


Results/ Logs : 

Windows PowerShell
Copyright (C) Microsoft Corporation. All rights reserved.

Install the latest PowerShell for new features and improvements! https://aka.ms/PSWindows

PS C:\Users\ameen\Desktop\FlashRead-v1> npm run format

> flashread@0.1.0 format
> prettier --write "src/**/*.{ts,tsx,css,json}"

src/app/auth/page.tsx 1281ms (unchanged)
src/app/error.tsx 21ms
src/app/import/error.tsx 15ms
src/app/import/loading.tsx 11ms (unchanged)
src/app/import/page.tsx 27ms
src/app/layout.tsx 8ms
src/app/library/error.tsx 6ms
src/app/library/loading.tsx 11ms
src/app/library/page.tsx 29ms
src/app/loading.tsx 7ms
src/app/page.tsx 21ms
src/app/reader/error.tsx 10ms
src/app/reader/loading.tsx 5ms (unchanged)
src/app/reader/page.tsx 63ms
src/app/settings/error.tsx 8ms
src/app/settings/loading.tsx 10ms (unchanged)
src/app/settings/page.tsx 30ms
src/components/errors/ErrorBoundary.tsx 16ms
src/components/layout/BottomNavBar.tsx 15ms
src/components/layout/NavigationDrawer.tsx 16ms
src/components/layout/TopAppBar.tsx 11ms
src/components/shared/BookCard.tsx 13ms
src/components/shared/BookCover.tsx 13ms
src/components/shared/EmptyState.tsx 13ms
src/components/shared/ProgressBar.tsx 13ms
src/components/shared/SearchBar.tsx 13ms
src/components/ui/Button.tsx 16ms
src/components/ui/Card.tsx 7ms (unchanged)
src/components/ui/Input.tsx 8ms
src/components/ui/Modal.tsx 11ms (unchanged)
src/components/ui/Slider.tsx 10ms
src/components/ui/Switch.tsx 10ms
src/components/ui/Toast.tsx 11ms
src/config/app.ts 4ms (unchanged)
src/config/featureFlags.ts 5ms (unchanged)
src/config/reader.ts 3ms (unchanged)
src/config/storage.ts 5ms (unchanged)
src/constants/index.ts 6ms (unchanged)
src/design-system/animations.ts 7ms (unchanged)
src/design-system/icons.ts 10ms (unchanged)
src/design-system/index.ts 4ms (unchanged)
src/design-system/themes.ts 8ms (unchanged)
src/design-system/tokens.ts 6ms (unchanged)
src/design-system/typography.ts 9ms (unchanged)
src/features/auth/hooks/useAuth.ts 11ms (unchanged)
src/features/home/components/ContinueReadingHero.tsx 20ms
src/features/home/components/LibraryGrid.tsx 13ms
src/features/home/components/QuickImportCard.tsx 10ms
src/features/home/components/RecentBooksCarousel.tsx 13ms
src/features/import/components/ImportHelpSection.tsx 5ms
src/features/import/components/PasteTextCard.tsx 8ms
src/features/import/components/SupportedFormatsCard.tsx 9ms
src/features/import/components/UploadDropzone.tsx 13ms
src/features/import/hooks/useImport.ts 11ms
src/features/library/components/EmptyLibraryState.tsx 5ms
src/features/library/components/LibraryFilters.tsx 6ms
src/features/library/components/LibraryList.tsx 16ms
src/features/library/components/LibrarySearch.tsx 6ms
src/features/library/components/LoadingLibraryState.tsx 5ms
src/features/library/hooks/useLibrary.ts 3ms (unchanged)
src/features/reader/components/KeyboardShortcutsHelp.tsx 10ms
src/features/reader/components/ReaderCanvas.tsx 4ms
src/features/reader/components/ReaderControls.tsx 7ms
src/features/reader/components/ReaderProgress.tsx 8ms
src/features/reader/components/ReaderStats.tsx 9ms
src/features/reader/components/ReaderToolbar.tsx 12ms
src/features/reader/components/ReaderWordDisplay.tsx 10ms
src/features/reader/components/SpeedControl.tsx 14ms
src/features/reader/components/ThemePicker.tsx 17ms
src/features/reader/engine/index.ts 3ms (unchanged)
src/features/reader/engine/orp.ts 15ms (unchanged)
src/features/reader/engine/playback.ts 51ms
src/features/reader/engine/queue.ts 8ms (unchanged)
src/features/reader/engine/timing.ts 7ms (unchanged)
src/features/reader/engine/types.ts 7ms (unchanged)
src/features/reader/hooks/useKeyboardShortcuts.ts 13ms
src/features/reader/hooks/useReader.ts 2ms (unchanged)
src/features/reader/hooks/useRsvpEngine.ts 11ms
src/features/reader/tests/playback.test.ts 2ms (unchanged)
src/features/settings/components/AccessibilitySection.tsx 5ms
src/features/settings/components/FontSection.tsx 11ms
src/features/settings/components/ProfileSection.tsx 12ms
src/features/settings/components/ReaderSection.tsx 13ms
src/features/settings/components/ThemeSection.tsx 11ms
src/features/settings/hooks/useSettings.ts 6ms (unchanged)
src/hooks/useTheme.ts 5ms (unchanged)
src/lib/formatters.ts 9ms (unchanged)
src/lib/utils.ts 2ms (unchanged)
src/lib/validators.ts 3ms (unchanged)
src/mocks/books.ts 8ms
src/mocks/readerText.ts 4ms (unchanged)
src/mocks/readingProgress.ts 12ms
src/mocks/settings.ts 4ms
src/mocks/user.ts 3ms
src/providers/LibraryProvider.tsx 17ms
src/providers/ReaderProvider.tsx 8ms
src/providers/SettingsProvider.tsx 10ms
src/providers/ThemeProvider.tsx 11ms
src/services/auth.ts 11ms (unchanged)
src/services/parser/clipboard.ts 6ms (unchanged)
src/services/parser/epub.ts 5ms (unchanged)
src/services/parser/index.ts 14ms
src/services/parser/pdf.ts 8ms (unchanged)
src/services/parser/txt.ts 6ms (unchanged)
src/services/progress.ts 7ms (unchanged)
src/services/storage.ts 9ms (unchanged)
src/styles/globals.css 690ms
src/types/index.ts 12ms (unchanged)
PS C:\Users\ameen\Desktop\FlashRead-v1> npm run typecheck

> flashread@0.1.0 typecheck
> tsc --noEmit

src/features/reader/tests/playback.test.ts:1:1 - error TS2582: Cannot find name 'describe'. Do you need to install type definitions for a test runner? Try `npm i --save-dev @types/jest` or `npm i --save-dev @types/mocha`.

1 describe("RSVP Playback Engine", () => {
  ~~~~~~~~

src/features/reader/tests/playback.test.ts:2:3 - error TS2582: Cannot find name 'it'. Do you need to install type definitions for a test runner? Try `npm i --save-dev @types/jest` or `npm i --save-dev @types/mocha`.

2   it("should initialize in a paused state", () => {
    ~~

src/features/reader/tests/playback.test.ts:4:5 - error TS2304: Cannot find name 'expect'.

4     expect(true).toBe(true);
      ~~~~~~


Found 3 errors in the same file, starting at: src/features/reader/tests/playback.test.ts:1

PS C:\Users\ameen\Desktop\FlashRead-v1> npm run lint

> flashread@0.1.0 lint
> next lint

=============

WARNING: You are currently running a version of TypeScript which is not officially supported by @typescript-eslint/typescript-estree.

You may find that it works just fine, or you may not.

SUPPORTED TYPESCRIPT VERSIONS: >=4.7.4 <5.5.0

YOUR TYPESCRIPT VERSION: 5.9.3

Please only submit bug reports when using the officially supported version.

=============

./src/components/shared/BookCover.tsx
25:9  Warning: Using `<img>` could result in slower LCP and higher bandwidth. Consider using `<Image />` from `next/image` to automatically optimize images. This may incur additional usage or cost from your provider. See: https://nextjs.org/docs/messages/no-img-element  @next/next/no-img-element

./src/features/settings/components/ProfileSection.tsx
18:13  Warning: Using `<img>` could result in slower LCP and higher bandwidth. Consider using `<Image />` from `next/image` to automatically optimize images. This may incur additional usage or cost from your provider. See: https://nextjs.org/docs/messages/no-img-element  @next/next/no-img-element

info  - Need to disable some ESLint rules? Learn more here: https://nextjs.org/docs/basic-features/eslint#disabling-rules
PS C:\Users\ameen\Desktop\FlashRead-v1>
PS C:\Users\ameen\Desktop\FlashRead-v1>
PS C:\Users\ameen\Desktop\FlashRead-v1>
PS C:\Users\ameen\Desktop\FlashRead-v1>   npm run build

> flashread@0.1.0 build
> next build

  ▲ Next.js 14.2.3

   Creating an optimized production build ...
 ✓ Compiled successfully

./src/components/shared/BookCover.tsx
25:9  Warning: Using `<img>` could result in slower LCP and higher bandwidth. Consider using `<Image />` from `next/image` to automatically optimize images. This may incur additional usage or cost from your provider. See: https://nextjs.org/docs/messages/no-img-element  @next/next/no-img-element

./src/features/settings/components/ProfileSection.tsx
18:13  Warning: Using `<img>` could result in slower LCP and higher bandwidth. Consider using `<Image />` from `next/image` to automatically optimize images. This may incur additional usage or cost from your provider. See: https://nextjs.org/docs/messages/no-img-element  @next/next/no-img-element

info  - Need to disable some ESLint rules? Learn more here: https://nextjs.org/docs/basic-features/eslint#disabling-rules
 ✓ Linting and checking validity of types
 ✓ Collecting page data
 ✓ Generating static pages (9/9)
 ✓ Collecting build traces
 ✓ Finalizing page optimization

Route (app)                              Size     First Load JS
┌ ○ /                                    6.38 kB         100 kB
├ ○ /_not-found                          871 B          87.9 kB
├ ○ /auth                                1.19 kB        88.2 kB
├ ○ /import                              2.71 kB        96.5 kB
├ ○ /library                             6.36 kB         100 kB
├ ○ /reader                              10.6 kB         104 kB
└ ○ /settings                            3.39 kB        97.2 kB
+ First Load JS shared by all            87 kB
  ├ chunks/23-d2b161d347555473.js        31.5 kB
  ├ chunks/fd9d1056-7d984d043e51fca8.js  53.6 kB
  └ other shared chunks (total)          1.89 kB


○  (Static)  prerendered as static content

PS C:\Users\ameen\Desktop\FlashRead-v1> npm run start

> flashread@0.1.0 start
> next start

  ▲ Next.js 14.2.3
  - Local:        http://localhost:3000

 ✓ Starting...
 ✓ Ready in 1039ms

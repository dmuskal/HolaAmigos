# ¡Hola Amigos! 🦜

A tiny, offline, ad-free app to help a 5-year-old learn her first Spanish
words — colors, animals, numbers, family, and greetings — through
flashcards and a listen-and-tap picture game.

## Quick start (web app — no Mac needed)

This is the version to use. It's a plain static web app: no build step, no
account, no App Store.

**Try it right now, on your computer or phone:** open `web/index.html`
directly in a browser (double-click it, or drag it into a browser tab).

**To install it on an iPhone/iPad** (yours, or send the link to your niece):
1. Host the `web/` folder somewhere reachable by URL — the easiest option
   is GitHub Pages (see below).
2. Open that URL in **Safari** on the iPhone/iPad.
3. Tap the Share icon → **Add to Home Screen**.
4. It now launches full-screen from its own home-screen icon, like a real
   app, and keeps working offline after that first load.

### Hosting it with GitHub Pages

1. In this repo's GitHub settings → Pages, set the source to the `web/`
   folder on the `master` branch (or ask whoever's driving the repo to run
   `gh api -X POST repos/<owner>/HolaAmigos/pages -f "source[branch]=master" -f "source[path]=/web"`).
   Note: GitHub Pages on a **private** repo requires a paid GitHub plan; on
   the free plan the repo (or at least the Pages site) needs to be public.
2. GitHub gives you a URL like `https://<owner>.github.io/HolaAmigos/`.
   Share that link — that's what you open in Safari and "Add to Home
   Screen" from.

No backend, no sign-in, no ads, no data collection — everything runs and
speaks on-device (via the browser's built-in speech synthesis), so it's
safe to hand straight to a kid. The only network use is fetching the app's
own files the first time; after that, a service worker caches everything.

## Quick start (native Swift/iOS — needs a Mac)

There's also a from-scratch SwiftUI rebuild of the same app in
`Sources/HolaAmigos/`, kept in case a Mac and Apple Developer account
become available later. It is **not** the actively maintained version —
see [`CLAUDE.md`](./CLAUDE.md) for why.

1. Install [Xcode](https://apps.apple.com/app/xcode/id497799835) (Mac only, free).
2. Install [XcodeGen](https://github.com/yonaskolb/XcodeGen): `brew install xcodegen`
3. From this folder: `xcodegen generate`
4. Open it: `open HolaAmigos.xcodeproj`
5. Pick a Team under *Signing & Capabilities* for a real device, then Run (⌘R).

Distributing this build to someone else's iPad (e.g. via TestFlight) also
requires a paid Apple Developer account ($99/year).

## What's in it

- **Flashcards** — swipe through a category, tap a card to hear it spoken in Spanish.
- **Listen & Tap game** — hear a word, tap the matching picture out of three; earn a star for each correct answer.
- **Progress** — a star counter per category, saved locally on the device.

See [`CLAUDE.md`](./CLAUDE.md) for architecture details and how to extend
either build (e.g. adding new categories or words).

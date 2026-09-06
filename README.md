# ¡Hola Amigos! 🦜

A tiny, offline, ad-free app to help a 5-year-old learn her first Spanish
words — colors, animals, numbers, family, and greetings — through
flashcards and a listen-and-tap picture game.

## Quick start (web app — no Mac needed)

This is the version to use. It's a plain static web app: no build step, no
account, no App Store.

**Live link:** **https://dmuskal.github.io/HolaAmigos/**
Open that in **Safari** on an iPhone/iPad, then tap the Share icon →
**Add to Home Screen**. It launches full-screen from its own home-screen
icon from then on, like a real app, and keeps working offline after that
first load. This is the link to send your niece.

You can also just open `docs/index.html` directly in any browser to try it
without the live link.

Served via GitHub Pages from the `docs/` folder (that's the folder GitHub
Pages requires — it's the same app, name aside). The repo is public so
Pages can serve it on GitHub's free plan; there's nothing sensitive in a
static kids' vocabulary app. If you ever want it private again, Pages on a
private repo needs a paid GitHub plan.

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

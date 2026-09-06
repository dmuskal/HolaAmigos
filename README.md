# ¡Hola Amigos! 🦜

A tiny, offline, ad-free iOS app to help a 5-year-old learn her first Spanish
words on the iPad — colors, animals, numbers, family, and greetings — through
flashcards and a listen-and-tap picture game.

## Quick start (on a Mac with Xcode)

1. Install [Xcode](https://apps.apple.com/app/xcode/id497799835) from the App Store (free).
2. Install [XcodeGen](https://github.com/yonaskolb/XcodeGen) (generates the `.xcodeproj` from `project.yml`):
   ```sh
   brew install xcodegen
   ```
3. From this folder, generate the Xcode project:
   ```sh
   xcodegen generate
   ```
4. Open it:
   ```sh
   open HolaAmigos.xcodeproj
   ```
5. Plug in the iPad (or pick an iPad simulator), pick your Team under
   *Signing & Capabilities* if running on a real device, and hit **Run** (⌘R).

No backend, no sign-in, no ads, no network access, no data collection —
everything runs and speaks on-device, so it's safe to hand straight to a kid.

## What's in it

- **Flashcards** — swipe through a category, tap a card to hear it spoken in Spanish.
- **Listen & Tap game** — hear a word, tap the matching picture out of three; earn a star for each correct answer.
- **Progress** — a star counter per category, saved locally on the device.

See [`CLAUDE.md`](./CLAUDE.md) for the architecture and how to extend it
(e.g. adding new categories or words).

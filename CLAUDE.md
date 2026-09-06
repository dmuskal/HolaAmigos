# CLAUDE.md

Guidance for Claude Code (or any future contributor) working in this repo.

## What this project is

**¡Hola Amigos!** teaches a young child (target age: ~5) her first Spanish
vocabulary — colors, animals, numbers, family members, and greetings — via
flashcards and a listen-and-tap picture quiz.

The target user cannot read fluently yet. Every design and code decision
should be filtered through that constraint:

- **Emoji/pictures before text.** Navigation, quiz answers, and category
  selection all lean on pictures, not labels a 5-year-old can't read yet.
- **Audio-first for Spanish.** Words are always available as speech, not
  just text, since the goal is spoken vocabulary.
- **No reading required to get positive feedback.** Correct-answer feedback
  uses color, animation, sound, and simple exclamations ("¡Muy bien!").
- **Big touch targets, forgiving interactions.** Buttons are large, there's
  no time pressure, and wrong answers just say "try again" — no penalty,
  no game-over state.
- **Zero risk surface for a kids' app.** No network calls (beyond loading
  the app itself), no ads, no third-party SDKs, no accounts, no data
  leaving the device. Keep it that way — it's what makes this safe to hand
  a 5-year-old unsupervised.

## Two implementations, one app

This repo currently holds **two builds of the same app**, because of how
the project's constraints evolved:

| | `docs/` | `Sources/HolaAmigos/` |
|---|---|---|
| Status | **Primary / actively used** | Dormant reference build |
| Stack | Plain HTML/CSS/JS PWA | SwiftUI, iOS 16+ |
| Why | Author has no Mac and the child is remote — a web app installs via a link and a browser "Add to Home Screen," no Xcode/App Store/Apple Developer account needed | Was the original plan; kept in case a Mac + Apple Developer account become available later for a true native app |
| Run it | https://dmuskal.github.io/HolaAmigos/ (or open `docs/index.html` directly) | Needs a Mac + Xcode + XcodeGen |

The folder is named `docs/` rather than something like `web/` only because
that's one of the two paths GitHub Pages' legacy branch-deploy will serve
from (the other being repo root, which was worse — it would've mixed the
app's files in with the Swift project/README/etc). It's not documentation;
it's the whole app.

**Default to `docs/` for any new work** unless the user explicitly asks for
the native Swift version. Keep the two in sync on vocabulary/content if you
touch one and it's a quick change, but don't feel obligated to port every
web feature back to Swift — that build is not the active target.

## `docs/` — structure

```
docs/
  index.html    - shell, iOS home-screen meta tags, PWA manifest link
  styles.css    - all styling
  data.js       - CATEGORIES + WORDS (the vocabulary; edit here to add words)
  app.js        - hash router (#/, #/cards/<id>, #/quiz/<id>), speech via
                  Web Speech API, progress via localStorage, quiz logic
  manifest.webmanifest
  sw.js         - offline app-shell cache (bump CACHE_NAME on asset changes)
  icons/        - apple-touch-icon + manifest icons (generated procedurally,
                  see icons/generate-icons.js — no image tooling was
                  available in the authoring environment; regenerate with
                  `node icons/generate-icons.js` if you want a different icon)
```

No build step, no dependencies, no bundler — it's plain static files by
design. Pushing to `master` updates the live GitHub Pages site automatically
(usually within a minute or two).

### Adding vocabulary (web)

Edit `WORDS` (and `CATEGORIES` for a new category) in `docs/data.js` —
nothing else needs to change; the home grid, flashcards, and quiz all read
from it. Keep each category small (5-8 words): mastery of a few words beats
a large overwhelming deck for this age group.

### Key implementation notes (web)

- **Speech**: `speak()` in `app.js` uses `SpeechSynthesisUtterance` with an
  `es-*` voice if the browser exposes one; iOS Safari populates voices
  asynchronously, hence the `voiceschanged` listener rather than reading
  `getVoices()` once.
- **Routing**: hash-based (`#/cards/animals`, not History API pushState) so
  it behaves identically opened from a server, from a home-screen icon in
  standalone display mode, or from a local file.
- **Progress**: `localStorage`, one integer per category. No accounts, no
  sync — progress is per-device, which is fine for a single kid's iPad.
- **Offline**: `sw.js` caches the whole app shell on first load so it keeps
  working without a network afterward. Bump `CACHE_NAME` when you change
  any cached asset or clients will keep serving the stale version.

## `Sources/HolaAmigos/` (Swift/SwiftUI) — structure

Kept as-is from the original native build; see git history for the commit
that introduced it if you need the reasoning behind a specific choice here.

```
Sources/HolaAmigos/
  App/         - App entry point (HolaAmigosApp.swift)
  Models/      - SpanishWord, WordCategory (plain value types, no logic)
  Data/        - WordBank: the static vocabulary list
  Services/    - SpeechManager (AVSpeechSynthesizer wrapper),
                 ProgressStore (UserDefaults-backed star counts)
  Views/       - HomeView, FlashcardView, QuizView
  Views/Components/ - CategoryButton, MascotView
```

Project file is **not** committed — it's generated from `project.yml` via
[XcodeGen](https://github.com/yonaskolb/XcodeGen) (`xcodegen generate`) on
a Mac with Xcode installed. See `README.md` for the full quick-start.

## Design/tone constraints (please preserve these, in either build)

- Keep vocabulary and phrases genuinely useful/common — favor words a parent
  would actually say to a 5-year-old day-to-day.
- Keep the color palette bright and high-contrast; avoid busy/dark UI.
- Any new interaction should be testable by "would a 5-year-old figure this
  out without an adult explaining it?" If not, simplify it rather than
  adding an instructional text label.
- Don't add network requests, analytics, ads, or in-app purchases. If a
  future feature seems to need one of these, flag it for discussion first —
  it likely conflicts with this app's core safety/privacy premise.

## Building & running

See [README.md](./README.md) for both quick-starts (web app, and the
dormant Swift/Xcode path). There is no CI and no automated tests — the app
is small enough that manual testing in a browser/Simulator/on-device is the
current workflow. If non-trivial logic grows in `app.js` or `Services/`,
consider adding real tests rather than growing untested state machines.

## Status / roadmap ideas

Current state: flashcards + one quiz mode across 5 categories, star
progress tracking, shipped as an installable web app. Not yet built (ideas,
not commitments):
- More categories (food, days of the week, body parts).
- A simple "review missed words" mode.
- Custom mascot artwork instead of emoji.
- Optional short recorded native-speaker audio as an alternative to
  synthesized speech.
- Revisit the native Swift build if a Mac + Apple Developer account become
  available.

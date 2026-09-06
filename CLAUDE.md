# CLAUDE.md

Guidance for Claude Code (or any future contributor) working in this repo.

## What this project is

**¡Hola Amigos!** is a SwiftUI iOS app that teaches a young child (target
age: ~5) her first Spanish vocabulary — colors, animals, numbers, family
members, and greetings — via flashcards and a listen-and-tap picture quiz.

The target user cannot read fluently yet. Every design and code decision
should be filtered through that constraint:

- **Emoji/pictures before text.** Navigation, quiz answers, and category
  selection all lean on pictures, not labels a 5-year-old can't read yet.
- **Audio-first for Spanish.** Words are always available as speech
  (`SpeechManager`), not just text, since the goal is spoken vocabulary.
- **No reading required to get positive feedback.** Correct-answer feedback
  uses color, animation, sound, and simple exclamations ("¡Muy bien!").
- **Big touch targets, forgiving interactions.** Buttons are large (120pt+),
  there's no time pressure, and wrong answers just say "try again" — no
  penalty, no game-over state.
- **Zero risk surface for a kids' app.** No network calls, no ads, no
  third-party SDKs, no accounts, no data leaving the device. Keep it that
  way — it's what makes this safe to hand a 5-year-old unsupervised.

## Tech stack & structure

- SwiftUI, iOS 16+, no external dependencies.
- Project file is **not** committed — it's generated from `project.yml` via
  [XcodeGen](https://github.com/yonaskolb/XcodeGen) (`xcodegen generate`).
  If you add/remove/move source files, no project.yml change is needed
  (it globs `Sources/HolaAmigos`); you only touch `project.yml` for
  target-level settings (bundle id, deployment target, orientations, etc).

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

Data flow is intentionally simple and one-directional: `WordBank` (static
data) → Views read it directly → `ProgressStore`/`SpeechManager` are the only
pieces of shared mutable state, injected as `@EnvironmentObject` from the
app root. There's no view model layer because the app doesn't need one yet;
don't add one speculatively.

## Adding vocabulary

To add words to an existing category, add entries to `WordBank.words` in
`Sources/HolaAmigos/Data/WordBank.swift` — nothing else needs to change.

To add a whole new category:
1. Add a case to `WordCategory` (title, emoji, accent color).
2. Add words for it in `WordBank`.
It'll automatically appear on the home screen grid and work in both the
flashcards and quiz.

Keep each category small (5-8 words). The goal is mastery of a few words,
not a large deck — that's a deliberate scope limit for the target age, not
an oversight.

## Design/tone constraints (please preserve these)

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

See [README.md](./README.md) for the human quick-start (XcodeGen + Xcode).
There is no CI configured yet and no automated tests — the app is small
enough that manual testing in Simulator/on-device is the current workflow.
If you add non-trivial logic to `Services/` or `Data/`, consider adding a
Swift Testing/XCTest target rather than growing untested state machines.

## Status / roadmap ideas

Current state: flashcards + one quiz mode across 5 categories, star
progress tracking. Not yet built (ideas, not commitments):
- More categories (food, days of the week, body parts).
- A simple "review missed words" mode.
- Custom mascot artwork instead of emoji.
- Optional short recorded native-speaker audio as an alternative to
  synthesized speech.

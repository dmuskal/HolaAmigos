import SwiftUI

/// A listening-comprehension quiz: hear the Spanish word, tap the matching
/// picture. Deliberately picture-only for the answer choices — a
/// pre-reading 5-year-old can play this entirely by ear and by emoji.
struct QuizView: View {
    let category: WordCategory
    private let roundCount = 5

    @EnvironmentObject private var speech: SpeechManager
    @EnvironmentObject private var progress: ProgressStore

    @State private var rounds: [Round] = []
    @State private var roundIndex = 0
    @State private var feedback: Feedback?
    @State private var isFinished = false

    private struct Round {
        let answer: SpanishWord
        let choices: [SpanishWord]
    }

    private enum Feedback { case correct, wrong }

    var body: some View {
        Group {
            if isFinished {
                CompletionView(category: category)
            } else if let round = rounds[safe: roundIndex] {
                content(for: round)
            } else {
                ProgressView()
            }
        }
        .navigationTitle("\(category.emoji) \(category.title) Game")
        .navigationBarTitleDisplayMode(.inline)
        .onAppear(perform: setUpRounds)
    }

    @ViewBuilder
    private func content(for round: Round) -> some View {
        VStack(spacing: 32) {
            Text("Round \(roundIndex + 1) of \(roundCount)")
                .font(.headline)
                .foregroundStyle(.secondary)

            Button {
                speech.speak(round.answer.speechText)
            } label: {
                Label(round.answer.spanish, systemImage: "speaker.wave.3.fill")
                    .font(.system(size: 28, weight: .bold, design: .rounded))
            }
            .buttonStyle(.plain)
            .padding()
            .background(category.accentColor.opacity(0.2), in: Capsule())

            HStack(spacing: 20) {
                ForEach(round.choices) { choice in
                    Button {
                        select(choice, correct: round.answer)
                    } label: {
                        Text(choice.emoji)
                            .font(.system(size: 72))
                            .frame(width: 120, height: 120)
                            .background(.white.opacity(0.7), in: RoundedRectangle(cornerRadius: 24))
                            .overlay(RoundedRectangle(cornerRadius: 24).stroke(category.accentColor, lineWidth: 3))
                    }
                    .buttonStyle(.plain)
                    .disabled(feedback != nil)
                }
            }

            if let feedback {
                Text(feedback == .correct ? "¡Muy bien! 🎉" : "Try again! 💪")
                    .font(.title2.bold())
                    .foregroundStyle(feedback == .correct ? .green : .orange)
                    .transition(.scale.combined(with: .opacity))
            }
        }
        .padding()
        .onAppear { speech.speak(round.answer.speechText) }
    }

    private func setUpRounds() {
        guard rounds.isEmpty else { return }
        let words = WordBank.words(in: category).shuffled()
        let answers = Array(words.prefix(roundCount))
        rounds = answers.map { answer in
            var distractors = words.filter { $0.id != answer.id }.shuffled().prefix(2)
            if distractors.count < 2 {
                // Category too small for 2 distractors — pad from the whole
                // bank so the quiz never crashes on a tiny word list.
                distractors = Array((WordBank.words.filter { $0.id != answer.id }.shuffled()).prefix(2))
            }
            let choices = (Array(distractors) + [answer]).shuffled()
            return Round(answer: answer, choices: choices)
        }
    }

    private func select(_ choice: SpanishWord, correct answer: SpanishWord) {
        let isCorrect = choice.id == answer.id
        withAnimation(.spring()) { feedback = isCorrect ? .correct : .wrong }

        if isCorrect {
            progress.addStar(for: category)
        }

        DispatchQueue.main.asyncAfter(deadline: .now() + (isCorrect ? 1.1 : 0.9)) {
            withAnimation { feedback = nil }
            if isCorrect {
                advance()
            }
        }
    }

    private func advance() {
        if roundIndex + 1 < rounds.count {
            roundIndex += 1
        } else {
            withAnimation { isFinished = true }
        }
    }
}

private struct CompletionView: View {
    let category: WordCategory

    var body: some View {
        VStack(spacing: 20) {
            Text("🏆")
                .font(.system(size: 96))
            Text("You did it!")
                .font(.largeTitle.bold())
            Text("Great job learning \(category.title.lowercased()) in Spanish!")
                .font(.title3)
                .multilineTextAlignment(.center)
                .foregroundStyle(.secondary)
        }
        .padding()
    }
}

private extension Array {
    subscript(safe index: Int) -> Element? {
        indices.contains(index) ? self[index] : nil
    }
}

#Preview {
    NavigationStack {
        QuizView(category: .colors)
            .environmentObject(SpeechManager.shared)
            .environmentObject(ProgressStore.shared)
    }
}

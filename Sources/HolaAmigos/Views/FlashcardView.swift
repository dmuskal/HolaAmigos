import SwiftUI

/// Swipeable flashcards for a category: big emoji, English + Spanish word,
/// tap to hear it spoken. This is the "learn" step before the quiz.
struct FlashcardView: View {
    let category: WordCategory
    @EnvironmentObject private var speech: SpeechManager
    @State private var index = 0
    @State private var showQuiz = false

    private var words: [SpanishWord] { WordBank.words(in: category) }

    var body: some View {
        VStack(spacing: 24) {
            TabView(selection: $index) {
                ForEach(Array(words.enumerated()), id: \.offset) { offset, word in
                    FlashcardTile(word: word)
                        .tag(offset)
                        .onTapGesture { speech.speak(word.speechText) }
                }
            }
            .tabViewStyle(.page(indexDisplayMode: .always))
            .indexViewStyle(.page(backgroundDisplayMode: .always))

            Button {
                showQuiz = true
            } label: {
                Label("Play a Game!", systemImage: "star.fill")
                    .font(.title3.bold())
                    .padding()
                    .frame(maxWidth: .infinity)
                    .background(category.accentColor, in: Capsule())
                    .foregroundStyle(.white)
            }
            .padding(.horizontal, 32)
            .padding(.bottom, 24)
        }
        .navigationTitle("\(category.emoji) \(category.title)")
        .navigationBarTitleDisplayMode(.inline)
        .onAppear {
            // Speak the first word automatically so a pre-reader gets
            // immediate audio feedback without needing to know to tap.
            if let first = words.first { speech.speak(first.speechText) }
        }
        .onChange(of: index) { _, newValue in
            guard words.indices.contains(newValue) else { return }
            speech.speak(words[newValue].speechText)
        }
        .navigationDestination(isPresented: $showQuiz) {
            QuizView(category: category)
        }
    }
}

private struct FlashcardTile: View {
    let word: SpanishWord

    var body: some View {
        VStack(spacing: 16) {
            Text(word.emoji)
                .font(.system(size: 120))
            Text(word.spanish)
                .font(.system(size: 44, weight: .heavy, design: .rounded))
                .foregroundStyle(word.category.accentColor)
            Text(word.english)
                .font(.title2)
                .foregroundStyle(.secondary)
            Image(systemName: "speaker.wave.2.fill")
                .font(.title3)
                .foregroundStyle(.secondary)
        }
        .padding(32)
        .frame(maxWidth: .infinity)
        .background(.white.opacity(0.7), in: RoundedRectangle(cornerRadius: 28))
        .padding(.horizontal, 24)
    }
}

#Preview {
    NavigationStack {
        FlashcardView(category: .animals)
            .environmentObject(SpeechManager.shared)
    }
}

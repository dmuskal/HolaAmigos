import SwiftUI

/// Landing screen: a grid of big, colorful category buttons plus a mascot.
/// No text-heavy navigation, no settings menu on the main screen — a
/// 5-year-old should be able to get lost in this app without adult help.
struct HomeView: View {
    @EnvironmentObject private var progress: ProgressStore
    @State private var selectedCategory: WordCategory?

    private let columns = [GridItem(.adaptive(minimum: 160), spacing: 20)]

    var body: some View {
        NavigationStack {
            ZStack {
                LinearGradient(
                    colors: [Color.yellow.opacity(0.35), Color.pink.opacity(0.25)],
                    startPoint: .topLeading, endPoint: .bottomTrailing
                )
                .ignoresSafeArea()

                VStack(spacing: 24) {
                    MascotView(greeting: "¡Hola!")

                    StarTotalBadge(count: progress.totalStars)

                    ScrollView {
                        LazyVGrid(columns: columns, spacing: 20) {
                            ForEach(WordCategory.allCases) { category in
                                CategoryButton(category: category, stars: progress.stars[category] ?? 0) {
                                    selectedCategory = category
                                }
                            }
                        }
                        .padding(.horizontal)
                    }
                }
                .padding(.top, 32)
            }
            .navigationDestination(item: $selectedCategory) { category in
                FlashcardView(category: category)
            }
        }
    }
}

private struct StarTotalBadge: View {
    let count: Int

    var body: some View {
        HStack(spacing: 6) {
            Image(systemName: "star.fill")
                .foregroundStyle(.yellow)
            Text("\(count)")
                .font(.title2.bold())
        }
        .padding(.horizontal, 16)
        .padding(.vertical, 8)
        .background(.white.opacity(0.8), in: Capsule())
        .shadow(radius: 2)
    }
}

#Preview {
    HomeView()
        .environmentObject(ProgressStore.shared)
        .environmentObject(SpeechManager.shared)
}

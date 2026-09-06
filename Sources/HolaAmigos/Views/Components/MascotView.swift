import SwiftUI

/// A gently bobbing emoji "mascot" that greets the child. Cheap to build
/// (no custom art needed) but goes a long way toward making the app feel
/// alive and friendly rather than like a flashcard drill.
struct MascotView: View {
    let greeting: String
    @State private var bounce = false

    var body: some View {
        VStack(spacing: 4) {
            Text("🦜")
                .font(.system(size: 72))
                .offset(y: bounce ? -10 : 0)
                .animation(.easeInOut(duration: 1.1).repeatForever(autoreverses: true), value: bounce)
                .onAppear { bounce = true }
            Text(greeting)
                .font(.title.bold())
        }
    }
}

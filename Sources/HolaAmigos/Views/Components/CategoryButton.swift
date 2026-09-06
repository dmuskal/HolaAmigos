import SwiftUI

/// A big, tappable, emoji-led category tile. Sized generously (min 160pt)
/// for small thumbs and low motor precision.
struct CategoryButton: View {
    let category: WordCategory
    let stars: Int
    let action: () -> Void

    @State private var isPressed = false

    var body: some View {
        Button(action: action) {
            VStack(spacing: 8) {
                Text(category.emoji)
                    .font(.system(size: 56))
                Text(category.title)
                    .font(.title3.bold())
                    .foregroundStyle(.primary)
                if stars > 0 {
                    HStack(spacing: 2) {
                        Image(systemName: "star.fill").font(.caption)
                        Text("\(stars)").font(.caption.bold())
                    }
                    .foregroundStyle(.yellow)
                }
            }
            .frame(minWidth: 160, minHeight: 140)
            .background(category.accentColor.opacity(0.25), in: RoundedRectangle(cornerRadius: 24))
            .overlay(RoundedRectangle(cornerRadius: 24).stroke(category.accentColor, lineWidth: 3))
        }
        .buttonStyle(.plain)
        .scaleEffect(isPressed ? 0.92 : 1)
        .animation(.spring(response: 0.25, dampingFraction: 0.5), value: isPressed)
        .simultaneousGesture(
            DragGesture(minimumDistance: 0)
                .onChanged { _ in isPressed = true }
                .onEnded { _ in isPressed = false }
        )
        .accessibilityLabel("\(category.title), \(stars) stars")
    }
}

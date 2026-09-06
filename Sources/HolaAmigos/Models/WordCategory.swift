import SwiftUI

/// A themed group of vocabulary (colors, animals, numbers, etc.).
/// Kept tiny on purpose — a 5-year-old navigates by color and emoji, not text.
enum WordCategory: String, CaseIterable, Identifiable {
    case colors
    case animals
    case numbers
    case family
    case greetings

    var id: String { rawValue }

    var title: String {
        switch self {
        case .colors: return "Colors"
        case .animals: return "Animals"
        case .numbers: return "Numbers"
        case .family: return "Family"
        case .greetings: return "Hello!"
        }
    }

    var emoji: String {
        switch self {
        case .colors: return "🎨"
        case .animals: return "🐶"
        case .numbers: return "🔢"
        case .family: return "👨‍👩‍👧‍👦"
        case .greetings: return "👋"
        }
    }

    var accentColor: Color {
        switch self {
        case .colors: return .pink
        case .animals: return .green
        case .numbers: return .blue
        case .family: return .orange
        case .greetings: return .purple
        }
    }
}

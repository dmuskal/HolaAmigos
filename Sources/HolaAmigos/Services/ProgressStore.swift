import Foundation
import Combine

/// Tracks stars earned per category. Backed by UserDefaults because progress
/// for a single local kid profile doesn't need anything heavier — no
/// accounts, no network, no data leaves the device.
final class ProgressStore: ObservableObject {
    static let shared = ProgressStore()

    @Published private(set) var stars: [WordCategory: Int] = [:]

    private let defaults = UserDefaults.standard
    private func key(for category: WordCategory) -> String { "stars.\(category.rawValue)" }

    private init() {
        for category in WordCategory.allCases {
            stars[category] = defaults.integer(forKey: key(for: category))
        }
    }

    func addStar(for category: WordCategory) {
        let updated = (stars[category] ?? 0) + 1
        stars[category] = updated
        defaults.set(updated, forKey: key(for: category))
    }

    var totalStars: Int {
        stars.values.reduce(0, +)
    }
}

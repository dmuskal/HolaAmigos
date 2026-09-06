import Foundation

/// One vocabulary item. Every card is picture-first: a 5-year-old should be
/// able to use the whole app from the emoji alone, before they can read.
struct SpanishWord: Identifiable, Hashable {
    let id = UUID()
    let category: WordCategory
    let emoji: String
    let english: String
    let spanish: String

    /// Text handed to AVSpeechSynthesizer. Kept separate from `spanish`
    /// in case a word ever needs different phrasing for speech vs. display.
    var speechText: String { spanish }
}

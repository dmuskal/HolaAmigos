import Foundation

/// Static starter vocabulary. Small and curated on purpose — better to have
/// 30 words a 5-year-old masters than 300 that overwhelm them. Add more
/// `SpanishWord` entries here as the app grows; nothing else needs to change.
enum WordBank {
    static let words: [SpanishWord] = [
        // Colors
        .init(category: .colors, emoji: "🔴", english: "Red", spanish: "Rojo"),
        .init(category: .colors, emoji: "🔵", english: "Blue", spanish: "Azul"),
        .init(category: .colors, emoji: "🟡", english: "Yellow", spanish: "Amarillo"),
        .init(category: .colors, emoji: "🟢", english: "Green", spanish: "Verde"),
        .init(category: .colors, emoji: "🟠", english: "Orange", spanish: "Naranja"),
        .init(category: .colors, emoji: "🟣", english: "Purple", spanish: "Morado"),

        // Animals
        .init(category: .animals, emoji: "🐶", english: "Dog", spanish: "Perro"),
        .init(category: .animals, emoji: "🐱", english: "Cat", spanish: "Gato"),
        .init(category: .animals, emoji: "🐦", english: "Bird", spanish: "Pájaro"),
        .init(category: .animals, emoji: "🐟", english: "Fish", spanish: "Pez"),
        .init(category: .animals, emoji: "🐰", english: "Rabbit", spanish: "Conejo"),
        .init(category: .animals, emoji: "🐸", english: "Frog", spanish: "Rana"),

        // Numbers
        .init(category: .numbers, emoji: "1️⃣", english: "One", spanish: "Uno"),
        .init(category: .numbers, emoji: "2️⃣", english: "Two", spanish: "Dos"),
        .init(category: .numbers, emoji: "3️⃣", english: "Three", spanish: "Tres"),
        .init(category: .numbers, emoji: "4️⃣", english: "Four", spanish: "Cuatro"),
        .init(category: .numbers, emoji: "5️⃣", english: "Five", spanish: "Cinco"),

        // Family
        .init(category: .family, emoji: "👩", english: "Mom", spanish: "Mamá"),
        .init(category: .family, emoji: "👨", english: "Dad", spanish: "Papá"),
        .init(category: .family, emoji: "👧", english: "Sister", spanish: "Hermana"),
        .init(category: .family, emoji: "👦", english: "Brother", spanish: "Hermano"),
        .init(category: .family, emoji: "👶", english: "Baby", spanish: "Bebé"),

        // Greetings
        .init(category: .greetings, emoji: "👋", english: "Hello", spanish: "Hola"),
        .init(category: .greetings, emoji: "😴", english: "Goodnight", spanish: "Buenas noches"),
        .init(category: .greetings, emoji: "🙏", english: "Please", spanish: "Por favor"),
        .init(category: .greetings, emoji: "😊", english: "Thank you", spanish: "Gracias"),
        .init(category: .greetings, emoji: "👋", english: "Goodbye", spanish: "Adiós"),
    ]

    static func words(in category: WordCategory) -> [SpanishWord] {
        words.filter { $0.category == category }
    }
}

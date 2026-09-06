// Vocabulary data — the JS equivalent of Sources/HolaAmigos/Data/WordBank.swift
// and Models/WordCategory.swift. Keep this the single source of truth for
// words; app.js should never hardcode a word or category elsewhere.

const CATEGORIES = [
  { id: "colors", title: "Colors", emoji: "🎨", color: "#ff5da2" },
  { id: "animals", title: "Animals", emoji: "🐶", color: "#3fbf63" },
  { id: "numbers", title: "Numbers", emoji: "🔢", color: "#3f9bff" },
  { id: "family", title: "Family", emoji: "👨‍👩‍👧‍👦", color: "#ff9b3f" },
  { id: "greetings", title: "Hello!", emoji: "👋", color: "#a561ff" },
];

const WORDS = [
  // Colors
  { category: "colors", emoji: "🔴", english: "Red", spanish: "Rojo" },
  { category: "colors", emoji: "🔵", english: "Blue", spanish: "Azul" },
  { category: "colors", emoji: "🟡", english: "Yellow", spanish: "Amarillo" },
  { category: "colors", emoji: "🟢", english: "Green", spanish: "Verde" },
  { category: "colors", emoji: "🟠", english: "Orange", spanish: "Naranja" },
  { category: "colors", emoji: "🟣", english: "Purple", spanish: "Morado" },

  // Animals
  { category: "animals", emoji: "🐶", english: "Dog", spanish: "Perro" },
  { category: "animals", emoji: "🐱", english: "Cat", spanish: "Gato" },
  { category: "animals", emoji: "🐦", english: "Bird", spanish: "Pájaro" },
  { category: "animals", emoji: "🐟", english: "Fish", spanish: "Pez" },
  { category: "animals", emoji: "🐰", english: "Rabbit", spanish: "Conejo" },
  { category: "animals", emoji: "🐸", english: "Frog", spanish: "Rana" },

  // Numbers
  { category: "numbers", emoji: "1️⃣", english: "One", spanish: "Uno" },
  { category: "numbers", emoji: "2️⃣", english: "Two", spanish: "Dos" },
  { category: "numbers", emoji: "3️⃣", english: "Three", spanish: "Tres" },
  { category: "numbers", emoji: "4️⃣", english: "Four", spanish: "Cuatro" },
  { category: "numbers", emoji: "5️⃣", english: "Five", spanish: "Cinco" },

  // Family
  { category: "family", emoji: "👩", english: "Mom", spanish: "Mamá" },
  { category: "family", emoji: "👨", english: "Dad", spanish: "Papá" },
  { category: "family", emoji: "👧", english: "Sister", spanish: "Hermana" },
  { category: "family", emoji: "👦", english: "Brother", spanish: "Hermano" },
  { category: "family", emoji: "👶", english: "Baby", spanish: "Bebé" },

  // Greetings
  { category: "greetings", emoji: "👋", english: "Hello", spanish: "Hola" },
  { category: "greetings", emoji: "😴", english: "Goodnight", spanish: "Buenas noches" },
  { category: "greetings", emoji: "🙏", english: "Please", spanish: "Por favor" },
  { category: "greetings", emoji: "😊", english: "Thank you", spanish: "Gracias" },
  { category: "greetings", emoji: "👋", english: "Goodbye", spanish: "Adiós" },
];

function wordsInCategory(categoryId) {
  return WORDS.filter((w) => w.category === categoryId);
}

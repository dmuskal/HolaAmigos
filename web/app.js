// ¡Hola Amigos! — app logic.
//
// Hash-based router with three screens: home ("#/"), flashcards
// ("#/cards/<category>"), and the quiz ("#/quiz/<category>"). Hash routing
// (rather than the History API) is used deliberately: it works identically
// whether the page is opened over http(s), from a home-screen icon in
// standalone mode, or straight from a local file, with no server config.

const root = document.getElementById("app");

// ---------- Progress (localStorage) ----------

const STORAGE_PREFIX = "holaamigos.stars.";

function getStars(categoryId) {
  return parseInt(localStorage.getItem(STORAGE_PREFIX + categoryId) || "0", 10);
}

function addStar(categoryId) {
  const next = getStars(categoryId) + 1;
  localStorage.setItem(STORAGE_PREFIX + categoryId, String(next));
  return next;
}

function totalStars() {
  return CATEGORIES.reduce((sum, c) => sum + getStars(c.id), 0);
}

// ---------- Speech ----------

let cachedVoices = [];
if ("speechSynthesis" in window) {
  const loadVoices = () => { cachedVoices = window.speechSynthesis.getVoices(); };
  loadVoices();
  window.speechSynthesis.onvoiceschanged = loadVoices;
}

function speak(text) {
  if (!("speechSynthesis" in window)) return;
  window.speechSynthesis.cancel();
  const utter = new SpeechSynthesisUtterance(text);
  const esVoice =
    cachedVoices.find((v) => /^es-(mx|us)/i.test(v.lang)) ||
    cachedVoices.find((v) => /^es/i.test(v.lang));
  if (esVoice) utter.voice = esVoice;
  utter.lang = esVoice ? esVoice.lang : "es-MX";
  utter.rate = 0.85;
  utter.pitch = 1.1;
  window.speechSynthesis.speak(utter);
}

// ---------- Small helpers ----------

function el(html) {
  const template = document.createElement("template");
  template.innerHTML = html.trim();
  return template.content.firstElementChild;
}

function shuffled(array) {
  const copy = [...array];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

function categoryById(id) {
  return CATEGORIES.find((c) => c.id === id);
}

function celebrate() {
  const emojis = ["⭐", "🎉", "✨"];
  const count = 10;
  for (let i = 0; i < count; i++) {
    const piece = el(`<span class="confetti-piece">${emojis[i % emojis.length]}</span>`);
    piece.style.left = `${Math.random() * 90 + 5}vw`;
    piece.style.animationDelay = `${Math.random() * 0.2}s`;
    document.body.appendChild(piece);
    piece.addEventListener("animationend", () => piece.remove());
  }
  if (navigator.vibrate) {
    try { navigator.vibrate(30); } catch (_) { /* not supported everywhere */ }
  }
}

// ---------- Screens ----------

function renderHome() {
  root.innerHTML = "";
  const view = el(`
    <div class="home">
      <div class="mascot">
        <span class="emoji">🦜</span>
        <div class="greeting">¡Hola!</div>
      </div>
      <div class="star-badge">⭐ <span id="total-stars"></span></div>
      <div class="category-grid" id="category-grid"></div>
    </div>
  `);
  view.querySelector("#total-stars").textContent = totalStars();

  const grid = view.querySelector("#category-grid");
  for (const category of CATEGORIES) {
    const stars = getStars(category.id);
    const btn = el(`
      <button class="category-btn" style="--accent:${category.color}" aria-label="${category.title}, ${stars} stars">
        <span class="emoji">${category.emoji}</span>
        <span class="title">${category.title}</span>
        ${stars > 0 ? `<span class="stars">⭐ ${stars}</span>` : ""}
      </button>
    `);
    btn.addEventListener("click", () => {
      location.hash = `#/cards/${category.id}`;
    });
    grid.appendChild(btn);
  }

  root.appendChild(view);
}

function renderTopBar(container, category, title) {
  const bar = el(`
    <div class="top-bar">
      <button class="back-btn" aria-label="Back">⬅️</button>
      <h1>${category.emoji} ${title}</h1>
    </div>
  `);
  bar.querySelector(".back-btn").addEventListener("click", () => {
    location.hash = "#/";
  });
  container.appendChild(bar);
}

function renderFlashcards(categoryId) {
  const category = categoryById(categoryId);
  const words = wordsInCategory(categoryId);
  root.innerHTML = "";
  if (!category || words.length === 0) { location.hash = "#/"; return; }

  const screen = el(`<div class="screen" style="--accent:${category.color}"></div>`);
  renderTopBar(screen, category, category.title);

  const viewport = el(`<div class="card-viewport"></div>`);
  const dots = el(`<div class="card-dots"></div>`);
  const playBtn = el(`<div class="play-game-btn">⭐ Play a Game!</div>`);

  let index = 0;

  function renderCard() {
    const word = words[index];
    viewport.innerHTML = "";
    const card = el(`
      <div class="flashcard">
        <div class="emoji">${word.emoji}</div>
        <div class="spanish">${word.spanish}</div>
        <div class="english">${word.english}</div>
        <div class="speaker">🔊</div>
      </div>
    `);
    card.addEventListener("click", () => speak(word.spanish));
    viewport.appendChild(card);

    dots.innerHTML = "";
    words.forEach((_, i) => {
      dots.appendChild(el(`<span class="dot${i === index ? " active" : ""}"></span>`));
    });

    speak(word.spanish);
  }

  // Swipe support (touch) plus keep it navigable via simple left/right taps
  // on the edges of the viewport, since a 5-year-old may not know to swipe.
  let touchStartX = null;
  viewport.addEventListener("touchstart", (e) => { touchStartX = e.touches[0].clientX; }, { passive: true });
  viewport.addEventListener("touchend", (e) => {
    if (touchStartX === null) return;
    const dx = e.changedTouches[0].clientX - touchStartX;
    touchStartX = null;
    if (Math.abs(dx) < 40) return;
    if (dx < 0 && index < words.length - 1) { index++; renderCard(); }
    if (dx > 0 && index > 0) { index--; renderCard(); }
  }, { passive: true });

  playBtn.addEventListener("click", () => {
    location.hash = `#/quiz/${categoryId}`;
  });

  screen.appendChild(viewport);
  screen.appendChild(dots);
  screen.appendChild(playBtn);
  root.appendChild(screen);

  renderCard();
}

function renderQuiz(categoryId) {
  const category = categoryById(categoryId);
  const allWords = wordsInCategory(categoryId);
  root.innerHTML = "";
  if (!category || allWords.length === 0) { location.hash = "#/"; return; }

  const ROUND_COUNT = Math.min(5, allWords.length);
  const answers = shuffled(allWords).slice(0, ROUND_COUNT);
  const rounds = answers.map((answer) => {
    const distractors = shuffled(allWords.filter((w) => w !== answer)).slice(0, 2);
    return { answer, choices: shuffled([...distractors, answer]) };
  });

  const screen = el(`<div class="screen" style="--accent:${category.color}"></div>`);
  renderTopBar(screen, category, `${category.title} Game`);
  const body = el(`<div></div>`);
  screen.appendChild(body);
  root.appendChild(screen);

  let roundIndex = 0;
  let locked = false;

  function renderRound() {
    locked = false;
    const round = rounds[roundIndex];
    body.innerHTML = "";

    body.appendChild(el(`<div class="quiz-round-label">Round ${roundIndex + 1} of ${rounds.length}</div>`));

    const speakBtn = el(`<button class="speak-btn">🔊 ${round.answer.spanish}</button>`);
    speakBtn.addEventListener("click", () => speak(round.answer.spanish));
    body.appendChild(speakBtn);

    const choiceRow = el(`<div class="choice-row"></div>`);
    for (const choice of round.choices) {
      const btn = el(`<button class="choice-btn">${choice.emoji}</button>`);
      btn.addEventListener("click", () => selectChoice(choice, round.answer, choiceRow));
      choiceRow.appendChild(btn);
    }
    body.appendChild(choiceRow);

    speak(round.answer.spanish);
  }

  function selectChoice(choice, answer, choiceRow) {
    if (locked) return;
    locked = true;
    for (const btn of choiceRow.children) btn.disabled = true;

    const isCorrect = choice === answer;
    const feedback = el(`
      <div class="feedback ${isCorrect ? "correct" : "wrong"}">
        ${isCorrect ? "¡Muy bien! 🎉" : "Try again! 💪"}
      </div>
    `);
    body.appendChild(feedback);

    if (isCorrect) {
      addStar(categoryId);
      celebrate();
      setTimeout(() => {
        if (roundIndex + 1 < rounds.length) {
          roundIndex++;
          renderRound();
        } else {
          renderCompletion();
        }
      }, 1100);
    } else {
      setTimeout(() => {
        feedback.remove();
        for (const btn of choiceRow.children) btn.disabled = false;
        locked = false;
      }, 900);
    }
  }

  function renderCompletion() {
    root.innerHTML = "";
    const view = el(`
      <div class="completion">
        <div class="trophy">🏆</div>
        <h2>You did it!</h2>
        <p>Great job learning ${category.title.toLowerCase()} in Spanish!</p>
        <div class="actions">
          <button id="again-btn">Play Again</button>
          <button id="home-btn">Home</button>
        </div>
      </div>
    `);
    view.querySelector("#again-btn").addEventListener("click", () => renderQuiz(categoryId));
    view.querySelector("#home-btn").addEventListener("click", () => { location.hash = "#/"; });
    root.appendChild(view);
  }

  renderRound();
}

// ---------- Router ----------

function route() {
  const hash = location.hash || "#/";
  const cardsMatch = hash.match(/^#\/cards\/(.+)$/);
  const quizMatch = hash.match(/^#\/quiz\/(.+)$/);

  if (cardsMatch) {
    renderFlashcards(decodeURIComponent(cardsMatch[1]));
  } else if (quizMatch) {
    renderQuiz(decodeURIComponent(quizMatch[1]));
  } else {
    renderHome();
  }
}

window.addEventListener("hashchange", route);
window.addEventListener("DOMContentLoaded", route);

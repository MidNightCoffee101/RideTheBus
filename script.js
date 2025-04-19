const suits = ['Hearts', 'Diamonds', 'Clubs', 'Spades'];
const colors = { Hearts: 'Red', Diamonds: 'Red', Clubs: 'Black', Spades: 'Black' };

const gameFlow = [
  { question: "Red or Black?", options: ["Red", "Black"] },
  { question: "Higher or Lower?", options: ["Higher", "Lower"] },
  { question: "Inside or Outside?", options: ["Inside", "Outside"] },
  { question: "Pick a Suit", options: ["Spades", "Hearts", "Diamonds", "Clubs"] }
];

let currentStep = 0;
let drawnCards = [];

function drawCard() {
  const value = Math.floor(Math.random() * 13) + 1;
  const suit = suits[Math.floor(Math.random() * 4)];
  return { value, suit };
}

function showCard(card) {
  const face = `${card.value} of ${card.suit}`;
  const display = document.getElementById("card-display");
  const img = document.createElement("img");
  img.src = getCardImage(card);
  img.className = "card-img";
  display.innerHTML = '';
  display.appendChild(img);
}

function getCardImage(card) {
  const valueMap = { 1: 'ace', 11: 'jack', 12: 'queen', 13: 'king' };
  const value = valueMap[card.value] || card.value;
  const suit = card.suit.toLowerCase();
  return `cards/${value}_of_${suit}.svg`;
}

function askQuestion() {
  const step = gameFlow[currentStep];
  document.getElementById("question").textContent = step.question;
  const optionsDiv = document.getElementById("options");
  optionsDiv.innerHTML = '';

  step.options.forEach(opt => {
    const btn = document.createElement("button");
    btn.textContent = opt;
    btn.onclick = () => handleChoice(opt);
    optionsDiv.appendChild(btn);
  });

  const resultDiv = document.getElementById("result");
  resultDiv.textContent = '';
  resultDiv.className = 'result-hide';
  document.getElementById("next").style.display = "none";
}

function handleChoice(choice) {
  const newCard = drawCard();
  drawnCards.push(newCard);
  showCard(newCard);

  const cardDisplay = document.getElementById("card-display");
  cardDisplay.classList.add("reveal");

  let correct = false;

  if (currentStep === 0) {
    correct = choice === colors[newCard.suit];
  } else if (currentStep === 1) {
    const prev = drawnCards[0].value;
    correct = (choice === "Higher" && newCard.value > prev) ||
              (choice === "Lower" && newCard.value < prev);
  } else if (currentStep === 2) {
    const [c1, c2] = [drawnCards[0].value, drawnCards[1].value];
    const min = Math.min(c1, c2);
    const max = Math.max(c1, c2);
    correct = (choice === "Inside" && newCard.value > min && newCard.value < max) ||
              (choice === "Outside" && (newCard.value < min || newCard.value > max));
  } else if (currentStep === 3) {
    correct = newCard.suit === choice;
  }

  // Show result
  const resultDiv = document.getElementById("result");
  resultDiv.textContent = correct ? "✅ Correct!" : "❌ Wrong!";
  resultDiv.className = `result-show ${correct ? 'correct' : 'wrong'}`;

  document.querySelectorAll("#options button").forEach(btn => btn.disabled = true);

  logRound({
    question: gameFlow[currentStep].question,
    choice,
    card: newCard,
    result: correct
  });

  setTimeout(() => {
    cardDisplay.classList.remove("reveal");

    if (correct) {
      currentStep++;
      if (currentStep < gameFlow.length) {
        setTimeout(askQuestion, 600);
      } else {
        document.getElementById("question").textContent = "🎉 You made it through!";
        document.getElementById("options").innerHTML = '';
        document.getElementById("next").style.display = "none";

        setTimeout(() => {
          currentStep = 0;
          drawnCards = [];
          askQuestion();
        }, 2500);
      }
    } else {
      setTimeout(() => {
        currentStep = 0;
        drawnCards = [];
        askQuestion();
      }, 1800);
    }
  }, 1000);
}

document.getElementById("next").addEventListener("click", () => {
  currentStep++;
  if (currentStep < gameFlow.length) {
    askQuestion();
  } else {
    document.getElementById("question").textContent = "🛑 Game Over!";
    document.getElementById("options").innerHTML = '';
    document.getElementById("next").style.display = "none";

    setTimeout(() => {
      currentStep = 0;
      drawnCards = [];
      askQuestion();
    }, 2000);
  }
});

document.getElementById("clear-log").addEventListener("click", () => {
  document.getElementById("game-log").innerHTML = '';
});

function logRound(logData) {
  const logItem = document.createElement("li");
  logItem.textContent = `${logData.question}: You chose ${logData.choice}, card was ${logData.card.value} of ${logData.card.suit} - ${logData.result ? "✅ Win" : "❌ Lose"}`;
  document.getElementById("game-log").appendChild(logItem);
}

// Dark mode toggle
document.getElementById("toggle-theme").addEventListener("click", () => {
  document.body.classList.toggle("dark-mode");
  const isDark = document.body.classList.contains("dark-mode");
  document.getElementById("toggle-theme").textContent = isDark ? "🌞" : "🌙";
});

// Start game
askQuestion();
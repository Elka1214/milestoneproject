const grid = document.querySelector(".grid-container");
let cards = [];
let firstCard, SecondCard;
let hasFlippedCard = false;
let lockBoard = false;
let score = 0;

document.querySelector(".core").textContent = score;

fetch("./data/cards.json")
  .then((res) => res.json()) //convert response to json
  .then((data) => {
    cards = [...data, ...data]; //add data to cards array
    shuffleCards(); //shuffle cards
    generateCards(); //generate cards
  });

function shuffleCards(cards) {
  let currentIndex = cards.length,
    temporaryValue,
    randomIndex;
  while (currentIndex !== 0) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;
    temporaryValue = cards[currentIndex];
    cards[currentIndex] = cards[randomIndex];
    cards[randomIndex] = temporaryValue;
  }
}

function generateCards(cards) {
  for (let card of cards) {
    const cardElement = document.createElement("div");
    cardElement.classList.add("card");
    cardElement.setAttribute("data-name", card.name);
    cardElement.innerHTML = `
           <div class="front">
               <img class="front.image" src="${card.image}" />
           </div>
           <div class="back"></div>
           `;
    grid.appendChild(cardElement);
    cardElement.addEventListener("click", flipCard);
  }
}

function flipCard() {
  if (lockBoard) return;
  if (this === firstCard) return;
  this.classList.add("flip");
  if (!hasFlippedCard) {
    hasFlippedCard = true;
    firstCard = this;
    return;
  }
  secondCard = this;
  score++;
  document.querySelector(".score").textContent = score;
  lockBoard = true;
  checkForMatch();
}

function checkForMatch() {
  let isMatch = firstCard.dataset.name === secondCard.dataset.name;
  isMatch ? disableCards() : unFlipCards();
}

function disableCards() {
  firstCard.removeEventListener("click", flipCard);
  secondCard.removeEventListener("click", flipCard);
  resetBoard();
}

function unFlipCards() {
  lockBoard = false;
  setTimeout(() => {
    firstCard.classList.remove("flip");
    secondCard.classList.remove("flip");
    resetBoard();
  }, 1500);
}

function resetBoard() {
  [hasFlippedCard, lockBoard] = [false, false];
  [firstCard, secondCard] = [null, null];
}

function restart() {
  [hasFlippedCard, lockBoard] = [false, false];
  [firstCard, secondCard] = [null, null];
  score = 0;
  document.querySelector(".score").textContent = score;
  grid.innerHTML = "";
  generateCards(cards);
}

"use strict";

const cards = document.querySelectorAll(".card");
const mode = document.getElementById("mode");
const timerText = document.getElementById("time");

let numOfCards = 8;
let firstCard = true;
let matched = false;
let numMatched = 0;
let cardOneType = null;
let cardTwoType = null;
let cardOne = null;
let cardTwo = null;
let currentIndex = null;
let removeListener = null;

let startTime;
let timeElapsed = 0;
let timerInterval;

let score = 0;
let highScore = 0;
let topScore = 5000;

const mediaQuery = window.matchMedia('(min-width: 600px)');

const changeCardsContainerSize = () => {
  const cardContainer = document.getElementById("cards")
  if (mediaQuery.matches && (mode.value === "medium" || mode.value === "hard")) {
    cardContainer.style.maxWidth = "43rem"
    console.log("condition met")
  } else if (mediaQuery.matches) {
    cardContainer.style.maxWidth = "34.5rem"
  }
};

const changeCardSize = (size) => {
  // Only change card size if on mobile device
  // and change container size on larger screens
  const maxWidth = window.matchMedia("(max-width: 425px)");

  if (maxWidth.matches) {
    // can I use switch case?
    if (size === "large") {
      cards.forEach((card) => {
        card.style.width = "6rem";
        card.style.height = "8rem";
      });
    }

    if (size === "medium") {
      cards.forEach((card) => {
        card.style.width = "4rem";
        card.style.height = "6rem";
      });
    }

    if (size === "small") {
      cards.forEach((card) => {
        card.style.width = "3rem";
        card.style.height = "5rem";
      });
    }
  }
};

const setMode = () => {
  const mediumCards = document.querySelectorAll(".medium");
  const hardCards = document.querySelectorAll(".hard");

  //turnery function??
  if (mode.value === "easy") {
    changeCardSize("large");
    changeCardsContainerSize();
    numOfCards = 8;
    //turn into reusable function
    mediumCards.forEach((card) => {
      card.classList.add("hidden");
    });
    hardCards.forEach((card) => {
      card.classList.add("hidden");
    });
  }

  if (mode.value === "medium") {
    changeCardSize("medium");
    changeCardsContainerSize();
    numOfCards = 12;
    mediumCards.forEach((card) => {
      card.classList.remove("hidden");
    });
    hardCards.forEach((card) => {
      card.classList.add("hidden");
    });
  }

  if (mode.value === "hard") {
    changeCardSize("small");
    changeCardsContainerSize();
    numOfCards = 16;
    mediumCards.forEach((card) => {
      card.classList.remove("hidden");
    });
    hardCards.forEach((card) => {
      card.classList.remove("hidden");
    });
  }
  shuffle();
};

const cardOrder = () => {
  const order = new Set();
  while (order.size < numOfCards) {
    order.add(Math.floor(Math.random() * numOfCards + 1));
  }
  return Array.from(order);
};

const shuffle = () => {
  const orderList = cardOrder();
  let count = 0;
  cards.forEach((card) => {
    card.style.order = orderList[count];
    count++;
  });
};

const checkMatch = (cardName, cardType) => {
  cardTwoType = cardType;
  cardTwo = document.getElementById(cardName);
  if (cardOneType === cardTwoType) {
    // Keep cards displayed

    cardOne.classList.remove("background");
    cardTwo.classList.remove("background");
    matched = true;
    removeListener = true;
    numMatched++;
    return true;
  } else {
    matched = false;
    return false;
  }
};

const displayCard = () => {
  const cardName = cards[currentIndex].id;
  const cardType = cards[currentIndex].className.split(" ", 1).toString();
  const card = document.getElementById(cardName);

  if (firstCard) {
    // if cards not null hide revealed cards
    if (cardOne && cardTwo && !matched) {
      cardOne.classList.add("background");
      cardTwo.classList.add("background");
    }

    cardOneType = cardType;
    cardOne = card;
    card.classList.remove("background");
    firstCard = false;
  } else {
    firstCard = true;
    if (checkMatch(cardName, cardType)) {
      return;
    } else {
      card.classList.remove("background");
    }
  }
};

const gameReset = () => {
  if (numMatched === numOfCards / 2) {
    stopTimer();
    displayScore();
    numMatched = 0;
    cardOneType = null;
    cardTwoType = null;
    cardOne = null;
    cardTwo = null;
    removeListener = false;
    cards.forEach((card) => {
      card.classList.add("background");
      card.removeEventListener("click", cardSelectHandler);
      card.addEventListener("click", cardSelectHandler);
    });
    shuffle();
  }
};

const cardSelectHandler = () => {
  if (!cardOne) {
    startTimer();
    displayTime();
  }
  displayCard();
  gameReset();
};

const removeListenerHandler = () => {
  if (removeListener) {
    cardOne.removeEventListener("click", cardSelectHandler);
    cardTwo.removeEventListener("click", cardSelectHandler);
  }
  removeListener = false;
};

const cardIndexHandler = (index) => (currentIndex = index);

const startTimer = () => {
  startTime = Date.now();
  timerInterval = setInterval(() => {
    timeElapsed = Date.now() - startTime;
    displayTime(timeElapsed);
  }, 10);
};

const stopTimer = () => clearInterval(timerInterval);

const timeFormat = (time) => {
  const hrs = time / 3600000;
  const hh = Math.floor(hrs);

  const min = (hrs - hh) * 60;
  const mm = Math.floor(min);

  const sec = (min - mm) * 60;
  const ss = Math.floor(sec);

  const msec = (sec - ss) * 100;
  const ms = Math.floor(msec);

  const formattedMM = mm.toString().padStart(2, "0");
  const formattedSS = ss.toString().padStart(2, "0");
  const formattedMS = ms.toString().padStart(2, "0");

  return `${formattedMM}:${formattedSS}:${formattedMS}`;
};

const displayTime = (time) => {
  timerText.innerText = timeFormat(time);
};

const getScore = () => {
  let devisor;
  if (mode.value === "easy") {
    devisor = 12;
  } else if (mode.value === "medium") {
    devisor = 15;
  } else {
    devisor = 18;
  }

  const num = Math.round(timeElapsed / devisor);
  score = topScore - num;
};

const getHighScore = () => {
  if (score > highScore) {
    highScore = score;
  }
};

const displayScore = () => {
  getScore();
  getHighScore();
  const scoreEl = document.getElementById("score-num");
  const highScoreEl = document.getElementById("highscore-num");
  scoreEl.innerText = score;
  highScoreEl.innerText = highScore;
};

mode.addEventListener("click", setMode);

let loopIndex = 0;

cards.forEach((card) => {
  card.addEventListener("click", cardIndexHandler.bind(self, loopIndex));
  loopIndex++;
  card.addEventListener("click", removeListenerHandler);
  card.addEventListener("click", cardSelectHandler);
});

shuffle();


  // increase max-width of cards container if in medium
  // or hard mode. 
  mediaQuery.addEventListener("change", event => {
    const cardContainer = document.getElementById("cards")
    if (event.matches && (mode.value === "medium" || mode.value === "hard")) {
      cardContainer.style.maxWidth = "43rem"
      console.log("condition met")
    }
  })



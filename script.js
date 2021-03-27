const cards = document.querySelectorAll(".card");
const mode = document.getElementById("mode");
const timerText = document.getElementById("time");

let numOfCards = 8;
let firstCard = true;
let matched = false;
let numMatched = 0;
let cardOneType;
let cardTwoType;
let cardOne;
let cardTwo;
let currentIndex;
let removeListener;

let startTime;
let timeElapsed = 0;
let timerInterval;

let score = 0;
let highScore = 0;
const topScore = 5000;

const mediaQuery = window.matchMedia("(min-width: 600px)");

/** Change container size based on screen size and mode.*/
const changeCardsContainerSize = () => {
  const cardContainer = document.getElementById("cards");
  if (
    mediaQuery.matches &&
    (mode.value === "medium" || mode.value === "hard")
  ) {
    cardContainer.style.maxWidth = "43rem";
  } else if (mediaQuery.matches) {
    cardContainer.style.maxWidth = "34.5rem";
  }
};
// increase max-width of cards container if in medium or hard mode.
mediaQuery.addEventListener("change", (event) => {
  const cardContainer = document.getElementById("cards");
  if (event.matches && (mode.value === "medium" || mode.value === "hard")) {
    cardContainer.style.maxWidth = "43rem";
  }
});

/**
 * Change card size if on mobile device (small screen).
 * @param {string} size Size of the card: 'small', 'medium' or 'large'.
 */
const changeCardSize = (size) => {
  const maxWidth = window.matchMedia("(max-width: 425px)");

  if (maxWidth.matches) {
    switch (size) {
      case "large":
        cards.forEach((card) => {
          card.style.width = "6rem";
          card.style.height = "8rem";
        });
        break;

      case "medium":
        cards.forEach((card) => {
          card.style.width = "4rem";
          card.style.height = "6rem";
        });
        break;

      case "small":
        cards.forEach((card) => {
          card.style.width = "3rem";
          card.style.height = "5rem";
        });
    }
  }
};

/**
 * Display or hide additional cards based on difficulty level.
 * @param {boolean} medium True displays medium cards, false hides them.
 * @param {boolean} hard True displays hard cards, false hides them.
 */
const changeCardVisibility = (medium, hard) => {
  const mediumCards = document.querySelectorAll(".medium");
  const hardCards = document.querySelectorAll(".hard");

  medium
    ? mediumCards.forEach((card) => {
        card.classList.remove("hidden");
      })
    : mediumCards.forEach((card) => {
        card.classList.add("hidden");
      });

  hard
    ? hardCards.forEach((card) => {
        card.classList.remove("hidden");
      })
    : hardCards.forEach((card) => {
        card.classList.add("hidden");
      });
};

/** Change display based on difficulty mode.*/
const setMode = () => {
  const localMode = mode.value;

  switch (localMode) {
    case "easy":
      changeCardSize("large");
      changeCardsContainerSize();
      changeCardVisibility(false, false);
      numOfCards = 8;
      break;

    case "medium":
      changeCardSize("medium");
      changeCardsContainerSize();
      changeCardVisibility(true, false);
      numOfCards = 12;
      break;

    case "hard":
      changeCardSize("small");
      changeCardsContainerSize();
      changeCardVisibility(true, true);
      numOfCards = 16;
  }
  shuffle();
};

/**
 *  Return array of unique numbers from 0 to number
 *  stored in numOfCards variable.
 */
const cardOrder = () => {
  const order = new Set();
  while (order.size < numOfCards) {
    order.add(Math.floor(Math.random() * numOfCards + 1));
  }
  return Array.from(order);
};

/** Change the order that the cards are displayed */
const shuffle = () => {
  const orderList = cardOrder();
  let count = 0;
  cards.forEach((card) => {
    card.style.order = orderList[count];
    count++;
  });
};

/**
 * Check if the first and second card selected match.
 * @param {string} cardName id of second card element selected.
 * @param {string} cardType type of second card selected.
 * @returns {boolean} true if cards match, else false.
 */
const checkMatch = (cardName, cardType) => {
  cardTwoType = cardType;
  cardTwo = document.getElementById(cardName);
  if (cardOneType === cardTwoType) {
    // Keep cards displayed.
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

/**
 * Assign values to global variables based on card clicked and toggle
 * background class based on if it's the first or second card clicked
 */
const displayCard = () => {
  const cardName = cards[currentIndex].id;
  const cardType = cards[currentIndex].className.split(" ", 1).toString();
  const card = document.getElementById(cardName);
  if (firstCard) {
    if (cardOne && cardTwo && !matched) {
      // If not first turn and not matched hide revealed cards.
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

/** If all cards are matched display time & score and reset variables. */
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

/** Handle click event for cards. Start timer if start of game & display card*/
const cardSelectHandler = () => {
  if (!cardOne) {
    startTimer();
  }
  displayCard();
  gameReset();
};

/**
 * remove CardSelectHandler event listener on global cardOne and cardTwo
 * when removeListener is true.
 */
const removeListenerHandler = () => {
  if (removeListener) {
    cardOne.removeEventListener("click", cardSelectHandler);
    cardTwo.removeEventListener("click", cardSelectHandler);
  }
  removeListener = false;
};

/**
 * Set global currentIndex variable to index parameter.
 * @param {number} index index number of current card.
 */
const cardIndexHandler = (index) => (currentIndex = index);

/** Record time elapsed since calling this function */
const startTimer = () => {
  startTime = Date.now();
  timerInterval = setInterval(() => {
    timeElapsed = Date.now() - startTime;
    displayTime(timeElapsed);
  }, 10);
};

/** clear interval on timerInterval variable to stop timer */
const stopTimer = () => clearInterval(timerInterval);

/**
 * Convert time in milliseconds to string in 00:00:00 format
 * @param {number} time time elapsed in milliseconds
 * @returns {string} number converted to string in minutes,
 *                   seconds and hundredths of second format
 */
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

/**
 * update DOM timerText element with formatted time.
 * @param {number} time time elapsed in milliseconds
 */
const displayTime = (time) => {
  timerText.innerText = timeFormat(time);
};

/** Update global score variable. */
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

/** Update global highScore variable */
const getHighScore = () => {
  if (score > highScore) {
    highScore = score;
  }
};

/** update scoreEL and highscoreEL elements in DOM with scores variables. */
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

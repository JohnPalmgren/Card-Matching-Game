// "use strict";

const cards = document.querySelectorAll(".card");
// const cards = document.getElementsByClassName("card");

const mode = document.getElementById("mode");

let numOfCards = 8;
let firstCard = true;
let matched = false;
let numMatched = 0;
let cardOneType = null;
let cardTwoType = null;
let cardOne = null;
let cardTwo = null;

const matchedList = []

// !matchedList.includes(cardType)

const changeCardSize = size => {

  // Only change card size if on mobile device
  const maxWidth = window.matchMedia("(max-width: 425px)")

  if (maxWidth.matches) {
    // can I use switch case?
    if (size === "large") {
      cards.forEach(card => {
        card.style.width = "6rem";
        card.style.height = "8rem";
      })
    };
  
    if (size === "medium") {
      cards.forEach(card => {
        card.style.width = "4rem";
        card.style.height = "6rem";
      });
    };
  
    if (size === "small") {
      cards.forEach(card => {
        card.style.width = "3rem";
        card.style.height = "5rem";
      });
    };
  };
};

const setMode = () => {

  const mediumCards = document.querySelectorAll(".medium")
  const hardCards = document.querySelectorAll(".hard")
  
  //turnery function??
  if (mode.value === "easy") {
    changeCardSize("large");
    numOfCards = 8;
    //turn into reusable function
    mediumCards.forEach(card => {
      card.classList.add("hidden");
    });
    hardCards.forEach(card => {
      card.classList.add("hidden");
    });
  };

  if (mode.value === "medium") {
    changeCardSize("medium");
    numOfCards = 12;
    mediumCards.forEach((card) => {
      card.classList.remove("hidden");
    });
    hardCards.forEach(card => {
      card.classList.add("hidden");
    });


  };

  if (mode.value === "hard") {
    changeCardSize("small");
    numOfCards = 16
    mediumCards.forEach((card) => {
      card.classList.remove("hidden");
    });
    hardCards.forEach(card => {
      card.classList.remove("hidden");
    });
  };
  shuffle();
};

mode.addEventListener("click", setMode);


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
  cards.forEach(card => {
    card.style.order = orderList[count];
    count++;
  });
};

const checkMatch = (cardName, cardType) => {
  cardTwoType = cardType;
  cardTwo = document.getElementById(cardName);
  if (cardOneType === cardTwoType) {
    // Keep cards displayed

    matchedList.push(cardType);

    cardOne.classList.remove("background");
    cardTwo.classList.remove("background");
    matched = true;
    numMatched++;
    return true;
  } else {
    matched = false;
    return false;
  };
};

const displayCard = (cardName, cardType) => {
  const card = document.getElementById(cardName);
  if (firstCard) {
    // if cards not null hide revealed cards
    if (cardOne && cardTwo && !matched) {
      cardOne.classList.add("background");
      cardTwo.classList.add("background");
    }

    cardOneType = cardType;
    cardOne = document.getElementById(cardName);
    card.classList.remove("background");
    firstCard = false;
  } else {
    firstCard = true;
    if (checkMatch(cardName, cardType)) {
      return;
    } else {
      card.classList.remove("background");
      //set mach to false??
    }
  }
};

const gameReset = () => {
  if (numMatched === numOfCards / 2) {
    stopTimer();
    displayScore();
    cards.forEach(card => card.classList.add("background"));
    numMatched = 0;
    cardOneType = null;
    cardTwoType = null;
    cardOne = null;
    cardTwo = null;
    shuffle();
  }
};

const cardSelectHandler = (cardName, cardType) => {
  // console.log(matched, cardOne, cardTwo)
  // if (matched) {
  //   cardOne.removeEventListener("click", cardSelectHandler);
  //   cardTwo.removeEventListener("click", cardSelectHandler);
  // }
  if (!cardOne) {
    startTimer();
    displayTime()
  }
  displayCard(cardName, cardType);
  gameReset();
};

// return both values in one function
const getCardIndex = cardNum => {
  let index;
  let count = 0;
  if (cardNum === 1) {
    cards.forEach(card => {
      if (card === cardOne) {
        index = count;
      };
    count++
    })
  } else if (cardNum === 2) {
    cards.forEach(card => {
      if (card === cardTwo) {
        index = count;
      };
    count++
    });
  };
  return index;
};

//why doesn't this work
//remove as redundant
const removeListenerHandler = () => {
  if (matched) {
      cards[getCardIndex(1)].removeEventListener("click", cardSelectHandler);
      cards[getCardIndex(2)].removeEventListener("click", cardSelectHandler);  
      console.log("function runs")
    };
};



cards.forEach(card => {
  const cardType = card.className.split(" ", 1).toString();
  const cardName = card.id;
  card.addEventListener("click", cardSelectHandler.bind(self, cardName, cardType),
  );
  card.addEventListener("click", removeListenerHandler);
});



shuffle();


const timerText = document.getElementById("time");

let startTime;
let timeElapsed = 0;
let timerInterval;

const startTimer = () => {
    startTime = Date.now();
    timerInterval = setInterval(() => {
        timeElapsed = Date.now() - startTime;
        displayTime(timeElapsed);
    }, 10)
}

const stopTimer = () => clearInterval(timerInterval);

const timeFormat = time => {
    const hrs = time / 3600000;
    const hh = Math.floor(hrs);

    const min = (hrs - hh) * 60;
    const mm = Math.floor(min);

    const sec = (min -mm) * 60;
    const ss = Math.floor(sec);

    const msec = (sec - ss) * 100;
    const ms = Math.floor(msec)

    const formattedMM = mm.toString().padStart(2, "0");
    const formattedSS = ss.toString().padStart(2, "0");
    const formattedMS = ms.toString().padStart(2, "0");

    return `${formattedMM}:${formattedSS}:${formattedMS}`
}

const displayTime = (time) => {
        timerText.innerText = timeFormat(time);
}


let score = 0;
let highScore = 0;
let topScore = 5000;

const getScore = () => {
  let devisor;
  if (mode.value === "easy") {
    devisor = 12;
  } else if (mode.value === "medium") {
    devisor = 15;
  } else {
    devisor = 18;
  };

  const num = Math.round(timeElapsed / devisor);
  score = topScore - num;
};

const getHighScore = () => {
  if (score > highScore) {
    highScore = score;
  };
};

const displayScore = () => {
  getScore()
  getHighScore()
  const scoreEl = document.getElementById("score-num");
  const highScoreEl = document.getElementById("highscore-num");
  scoreEl.innerText = score;
  highScoreEl.innerText = highScore;
};


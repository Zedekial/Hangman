let model = {
  randomWord: false,
  guesses: 0,
  incorrectGuesses: 0,
  guessesRemaining: 10,
  rightGuess: false,
  gameOver: false,
  youWin: false,
  word: '',
  allLetters: ['a','b','c','d','e','f','g','h','i','j','k','l','m','n','o','p','q','r','s','t','u','v','w','x','y','z'],
}

let controller = {
  initPage: function() {
    view.buildLetters();
    view.buildWord();
    this.letterListener();
  },

  addInitialListeners: function() {
    this.startWithChosenWord();
    this.restartGameListener();
    this.gameModeListener();
  },

  gameModeListener: function() {
    let randomButton = document.getElementById('randomButton');
    let chooseWordButton = document.getElementById('inputOwnButton');

    randomButton.addEventListener('click', () => {
      this.randomiseWord();
      this.initPage();
      view.startGame();
    })

    chooseWordButton.addEventListener('click', (e) => {
      view.showWordBox();
    })
  },

  chooseWord: function(chosenWord) {
    this.updateChosenWord(chosenWord);
    this.initPage();
    view.startGame();
  },

  updateChosenWord: function(chosenWord) {
    model.word = chosenWord;
  },

  randomiseWord: function() {
    var words = ['Woof', 'Hello', 'Help', 'Run', 'Get Out', 'French', 'Hungry', 'Shut Up', 'Go Home', 'Meow', 'Cat', 'Dog'
    , 'Cow', 'Camel', 'Whale', 'Baby', 'New Zealand', 'Amsterdam', 'The Netherlands', 'Teacher', 'Cowboy', 'Beach ball', 'Peanut', 'Iron',
    'Monkey', ' Angry', 'Function'];

    var number = Math.floor(Math.random() * words.length);

    let word = words[number];

    model.word = word;
  },

  checkWin: function() {
    let letterCounter = 0;
    let allLetters = document.getElementsByClassName('word');

    for(i = 0; i < model.word.length; i++) {
      if(allLetters[i].innerText === '_' || allLetters[i].innerText === ' ') {
        if(letterCounter != 0) {
          letterCounter--;
          console.log(`checkWin is reducing the counter by 1, it is now ${letterCounter}`);
        }
      }else if(model.word.includes(allLetters[i].innerText)) {
        letterCounter++;
        console.log(`checkWin is increasing the counter by 1, it is now ${letterCounter}`);
        if(letterCounter === model.word.length) {
          model.youWin = true;
          console.log(`The counter matches the length of the word, counter is ${letterCounter} and word length is ${word.Length}`)
          view.youWin();
        }
      }
    }
  },

  letterListener: function() {
    let div = document.getElementById('letters');
    div.addEventListener('click', (e) => {
      this.checkLetter(e);
    })
  },

  startWithChosenWord: function() {
    let startButton = document.getElementById('startGame');
    let inputBox = document.getElementById('wordBox');

    startButton.addEventListener('click', () => {
      if(inputBox.value.length === 0) {
        view.alertPleaseInputWord();
      }else {
        this.chooseWord(inputBox.value);
      }
    })
  },

  restartGameListener: function() {
    let restartButton = document.getElementById('playAgain');
    let restartButtonWin = document.getElementById('playAgainWinScreen')
    restartButton.addEventListener('click', () => {
      this.restartGame();
    });
    restartButtonWin.addEventListener('click', () => {
      this.restartGame();
    });
  },

  restartGame: function() {
    console.log('Restart game is clicked')
    let gameOverScreen = document.getElementById('gameOver');
    let winScreen = document.getElementById('winScreen');
    let gameScreen = document.getElementById('gameContainer');
    let lettersGuessedDisplay = document.getElementById('lettersGuessed');

    model.rightGuess = false;
    model.guesses = 0;
    model.incorrectGuesses = 0;
    model.guessesRemaining = 10;

    lettersGuessedDisplay.innerHTML = '';
    view.updateGuesses();
    this.randomiseWord();
    view.buildLetters();
    view.buildWord();
    view.updateHangManImg();

    if(model.gameOver === true) {
      console.log('Game over is true')
      gameScreen.classList.toggle('gameOverHidden');
      gameOverScreen.classList.toggle('gameOverHidden');
      model.gameOver = false;
    }else if(model.youWin === true) {
      console.log('You win is true')
      gameScreen.classList.toggle('winHidden');
      winScreen.classList.toggle('winScreenHidden');
      model.youWin = false;
    }

  },

  checkLetter: function(e) {
    if(e.target.id && e.target.id.length === 1) {
      if(model.word.toUpperCase().includes(e.target.id.toUpperCase())) {
        model.rightGuess = true;
        model.guesses++
        view.addLetter(e.target.id);
        view.updateLetterButton(e.target.id, model.rightGuess);
        this.checkWin();
      }else {
        model.rightGuess = false;
        view.addIncorrectGuess(e.target.id);
        view.updateLetterButton(e.target.id, model.rightGuess);

        model.guesses++

        if(model.rightGuess === false) {
          model.incorrectGuesses++
          model.guessesRemaining--
          view.updateHangManImg();
          if(model.incorrectGuesses === 10) {
            console.log('You lose')
            model.gameOver = true;
            view.gameOverScreen();
          }
        }
      }
      view.updateGuesses();
    }
  },
}

let view = {
  alertPleaseInputWord: function() {
    let wordBox = document.getElementById('wordBox');

    wordBox.classList.add('js-textBoxWarning');
    wordBox.placeholder = 'Please enter a valid word!';
  },

  buildLetters: function() {
    let div = document.getElementById('letters');
    div.innerHTML = '';
    model.allLetters.forEach(letter => {
      let button = document.createElement('button');
      button.innerHTML = letter;
      button.id = letter;
      button.classList = 'letter';
      div.append(button);
    });
  },

  buildWord: function() {
    let wordDiv = document.getElementById('word')
    wordDiv.innerHTML = ''
    let wordArray = [...model.word];

    wordArray.forEach(letter => {
      let letterModule = document.createElement('button');
      if(letter === ' ') {
        letterModule.innerHTML = ' ';
      }else {
        letterModule.innerHTML = '_';
      }
      letterModule.classList = letter;
      letterModule.classList += ' word';
      letterModule.disabled = true;

      wordDiv.append(letterModule);
    });
  },

  addLetter: function(e) {
    let correctLetter = document.getElementsByClassName(e);
    console.log(correctLetter);
    for(i = 0; i < correctLetter.length; i++) {
      if(model.word.toUpperCase().indexOf(e.toUpperCase()) === 0) {
        correctLetter[i].innerHTML = e.toUpperCase();
      }else {
        correctLetter[i].innerHTML = e;
      }
    }
  },

  updateLetterButton: function(e, rightGuess) {
    let buttonClicked = document.getElementById(e);

    buttonClicked.disabled = true;
    if(model.rightGuess === true) {
      buttonClicked.classList.toggle('rightGuess');
    }else if(model.rightGuess === false) {
      buttonClicked.classList.toggle('wrongGuess');
    }
  },

  addIncorrectGuess: function(e) {
    let lettersGuessedDisplay = document.getElementById('lettersGuessed');
    lettersGuessedDisplay.innerHTML += `<span>${e} </span>`;
  },

  updateGuesses: function(rightGuess) {
    let guessesDisplay = document.getElementById('guessesSoFar');
    let guessesRemainingDisplay = document.getElementById('remainingGuesses');
    let incorrectGuessesDisplay = document.getElementById('incorrectGuesses');

    guessesDisplay.innerHTML = model.guesses;
    guessesRemainingDisplay.innerHTML = model.guessesRemaining;
    incorrectGuessesDisplay.innerHTML = model.incorrectGuesses;
  },

  gameOverScreen: function() {
    if(model.gameOver === true) {
      let gameOverScreen = document.getElementById('gameOver');
      let gameScreen = document.getElementById('gameContainer');

      gameScreen.classList.toggle('gameOverHidden');
      gameOverScreen.classList.toggle('gameOverHidden');

    }else if(model.gameOver === false) {
      return;
    }
  },

  updateHangManImg: function() {
    let hangmanImg = document.getElementById('hangmanImg');
    switch(model.incorrectGuesses) {
      case 1:
        hangmanImg.src = 'img/hangman1.png'
        break;
      case 2:
        hangmanImg.src = 'img/hangman2.png'
        break;
      case 3:
        hangmanImg.src = 'img/hangman3.png'
        break;
      case 4:
        hangmanImg.src = 'img/hangman4.png'
        break;
      case 5:
        hangmanImg.src = 'img/hangman5.png'
        break;
      case 6:
        hangmanImg.src = 'img/hangman6.png'
        break;
      case 7:
        hangmanImg.src = 'img/hangman7.png'
        break;
      case 8:
        hangmanImg.src = 'img/hangman8.png'
        break;
      case 9:
        hangmanImg.src = 'img/hangman9.png'
        break;

      default:
        hangmanImg.src = 'img/hangmanStart.png'
    }
  },

  startGame: function() {
    let gameScreen = document.getElementById('gameContainer');
    let startScreen = document.getElementById('startScreen');

    startScreen.classList.toggle('hideStartScreen');
    gameScreen.classList.toggle('startScreenShown');
  },

  youWin: function() {
    let gameScreen = document.getElementById('gameContainer');
    let winScreen = document.getElementById('winScreen');
    let winScreenMessage = document.getElementById('correctWord');

    winScreenMessage.innerHTML = model.word;
    gameScreen.classList.toggle('winHidden');
    winScreen.classList.toggle('winScreenHidden');
  },

  showWordBox: function() {
    let wordBox = document.getElementById('wordBox');
    let startGameButton = document.getElementById('startGame');

    wordBox.classList.toggle('hideWordBox');
    startGameButton.classList.toggle('hideStartButton');
  }
};

setTimeout(() => controller.addInitialListeners(), 200);

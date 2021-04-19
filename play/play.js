const quest = document.getElementById("quest");
const choices = Array.from(document.getElementsByClassName("choice-text")); //converting the html collection into an array
// const questionCounterText = document.getElementById("questionCounter");
const progressText = document.getElementById("progressText");
const scoreText = document.getElementById("score");
const progressBarFull = document.getElementById("progressBarFull");

const loader = document.getElementById("loader");
const game = document.getElementById("game");

let currentQuestion = {};
let pendAnswer = false;
let score = 0;
let questionCounter = 0;
let availableQuestions = [];

let questions = [
  // {
  //   question: "Mandoza was an iconic kwaito artist in which country?",
  //   choice1: "Zambia",
  //   choice2: "Belarus",
  //   choice3: "South Africa",
  //   choice4: "India",
  //   answer: 3
  // },
  // {
  //   question: "A group of flamingos is called what?",
  //   choice1: "A flamboyance",
  //   choice2: "A squad",
  //   choice3: "Peaches",
  //   choice4: "Pink panthers",
  //   answer: 1
  // },
  // {
  //   question: "The ____ of a shrimp is located in its head.",
  //   choice1: "Intestine",
  //   choice2: "Anus",
  //   choice3: "Telson",
  //   choice4: "Heart",
  //   answer: 4
  // },
  // {
  //   question: "When spliced together, there are 26 minutes of quiet staring in this film series.",
  //   choice1: "Silent Hill",
  //   choice2: "Harry Potter",
  //   choice3: "Twilight",
  //   choice4: "Star Trek",
  //   answer: 3
  // },
  // {
  //   question: "Barry Manilow’s hit, “I Write the Songs”, was written by ___.",
  //   choice1: "Bruce Johnston",
  //   choice2: "Barry Manilow",
  //   choice3: "Billy Joel",
  //   choice4: "Foo Fighters",
  //   answer: 1
  // }
];
// fetch("quest.json") //requesting questions from local json file
fetch("https://opentdb.com/api.php?amount=10&category=9&difficulty=easy&type=multiple")
  .then(respo => {
    return respo.json();
  })
  .then(loadedQuestions => {
    questions = loadedQuestions.results.map(loadedQuestion => { //*singular, not loadedQuestions
      const formattedQuestion = {
        question: loadedQuestion.question
      }
      const answerChoices = [...loadedQuestion.incorrect_answers];
      formattedQuestion.answer = Math.floor(Math.random() * 3) + 1; //randomize answer placement
      answerChoices.splice(formattedQuestion.answer - 1, 0, loadedQuestion.correct_answer);

      answerChoices.forEach((choice, index) => {
        formattedQuestion["choice" + (index+1)] = choice;
      });
      return formattedQuestion;
    })
    // questions = loadedQuestions; //local json use only
    
    startGame();
  })
  .catch(err => {
    console.error(err);
  })

// CONSTANTS
const correct_bonus = 10;
const max_questions = 5;

startGame = () => {
  questionCounter = 0;
  score = 0;
  availableQuestions = [...questions]; // .../spread operator is used for spreading a list into an array
  getNewQuestions();
  game.classList.remove("hidden");
  loader.classList.add("hidden");
}

getNewQuestions = () => {
  if (availableQuestions.length == 0 || questionCounter >= max_questions) { //controlls n of questions the user will answer
    localStorage.setItem("mostRecentScore", score);
    return window.location.assign("fin.html"); //end page
  }
  questionCounter++;

  // questionCounterText.innerText = questionCounter + "/" + max_questions;
  progressText.innerText = `Question ${questionCounter}/${max_questions}` //same as above line

  progressBarFull.style.width = `${(questionCounter / max_questions) * 100}%`;

  const questionIndex = Math.floor(Math.random() * availableQuestions.length);
  currentQuestion = availableQuestions[questionIndex];
  quest.innerText = currentQuestion.question;

  choices.forEach(choice => {
    const number = choice.dataset["number"];
    choice.innerText = currentQuestion["choice" + number];
  });

  availableQuestions.splice(questionIndex, 1); //takes the questions array and gets rid of the question we just used

  pendAnswer = true;
};

choices.forEach(choice => {
  choice.addEventListener("click", e => {
    if (!pendAnswer) return;
    pendAnswer = false;

    const selectedChoice = e.target;
    const selectedAnswer = selectedChoice.dataset["number"];

    classToApply = "incorrect";
    if (selectedAnswer == currentQuestion.answer) {
      classToApply = "correct";
    }
    // const classToApply = selectedAnswer == currentQuestion.answer ? 'correct' : 'incorrect'; //this is the same as the above if statement

    if (classToApply == "correct") {
      incrementScore(correct_bonus);
    }

    selectedChoice.parentElement.classList.add(classToApply);

    setTimeout(() => {
      selectedChoice.parentElement.classList.remove(classToApply);
      getNewQuestions();
    }, 850);

  });
});

incrementScore = num => {
  score += num;
  scoreText.innerText = score;
}

// startGame();
const userName = document.getElementById("userName");
const saveScoreBtn = document.getElementById("saveScoreBtn");
const finalScore = document.getElementById("finalScore");
const mostRecentScore = localStorage.getItem("mostRecentScore");
finalScore.innerText = mostRecentScore;

const highScores = JSON.parse(localStorage.getItem("highScores")) || []; //convert the string list into a JSON array
const maxHighScores = 5;

userName.addEventListener("keyup", () => {
  saveScoreBtn.disabled = !userName.value; //disables savebutton if there is no input value
});

saveHighScore = e => {
  e.preventDefault(); //prevents form from auto posting to a different php page

  const score = {score: Math.floor(Math.random()*100), name: userName.value};
  highScores.push(score);

  highScores.sort((a, b) => b.score - a.score);
  highScores.splice(5);

  localStorage.setItem("highScores", JSON.stringify(highScores));
  window.location.assign("/")
};
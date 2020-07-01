var progressBox = document.getElementById("progress-box");
var questionBox = document.getElementById("question-box");
var imageBox = document.getElementById("image-box");
var alertBox = document.getElementById("alert-box");
var answerBox = document.getElementById("answer-box");
var nextBtn = document.getElementById("next-btn");
var finishBtn = document.getElementById("finish-btn");
var questionNumber = 0;
var numberOfQuestions;

function showAnswer(status) {
  return function() {
    if (status == "correct") {
      alertBox.classList.remove("alert-danger");
      alertBox.classList.add("alert-success");
      alertBox.innerText = "Correct!";
    } else {
      alertBox.classList.remove("alert-success");
      alertBox.classList.add("alert-danger");
      alertBox.innerText = "Incorrect.";
    }
    alertBox.classList.remove("d-none");
    if (questionNumber == numberOfQuestions) {
      // Finished
      finishBtn.removeAttribute("disabled");
    } else {
      nextBtn.removeAttribute("disabled");
    }
  };
}

function hideAnswer() {
  if (questionNumber == 1) {
    // Don't clear event listeners
  } else {
    for (i=0; i < answerBox.children.length; i++) {
      var box = answerBox.children[i];
      box.children[0].removeEventListener("change", showAnswer());
    }
    alertBox.classList.add("d-none");
    nextBtn.setAttribute("disabled", "true");
  }
}

function getQuestions(state) {
  var request = new XMLHttpRequest();
  request.onreadystatechange = function (){
    if (this.readyState == 4 && this.status == 200) {
      // Ready to go
      var output = this.responseText;
      var questions = JSON.parse(output);
      numberOfQuestions = questions.length;
      function newQuestion(questions) {
        questionNumber += 1;
        progressBox.style = "width: " + (questionNumber / questions.length)*100 + "%;";
        // Reset
        hideAnswer();
        // Add question
        questionBox.innerText = questions[questionNumber-1].question;
        imageBox.src = "imgs/" + state + "/" + questions[questionNumber-1].image;
        console.log(answerBox.children);
        for (i= 0; i < answerBox.children.length; i++) {
          var box = answerBox.children[i];
          if (typeof questions[0].answers[i] === "object") {
              // Correct
              box.children[0].addEventListener("change", showAnswer("correct"));
              box.children[1].innerText = questions[questionNumber-1].answers[i].correct;
          } else {
              box.children[0].addEventListener("change", showAnswer("incorrect"));
              box.children[1].innerText = questions[questionNumber-1].answers[i];
          }
        }
      }
      newQuestion(questions);
      nextBtn.onclick = function() {
        newQuestion(questions);
      }
    }
  }
  request.open("GET", "json/" + state + ".json", true);
  request.send();
}

getQuestions("tn");




// newQuestion(questions);

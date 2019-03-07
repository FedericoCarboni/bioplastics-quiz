/*
for (var i = questions.length - 1; i > 0; i--) {
  var j = Math.floor(Math.random() * (i + 1));
  var tmp = questions[i];
  questions[i] = questions[j];
  questions[j] = tmp;
}*/
function Question(prompt, options, answer, description) {
  this.prompt = prompt;
  this.options = options;
  this.answer = answer;
  this.description = description;
}

Question.prototype.isCorrect = function (answer) {
  return this.answer === answer;
};


var questions = [
  new Question("Sono una domanda?", ["Si", "No", "Forse", "Non lo so"], "a", "Ciao"),
  new Question("Sono una domanda?1", ["Si", "No", "Forse", "Non lo so"], "b", "Cacca")
]

var score = 0;
var questionIndex = 0;

function populate() {
  if (questionIndex == questions.length) {
    document.getElementById('question').classList.add('hidden');
    document.getElementById('score').classList.remove('hidden');
    document.getElementById('score').classList.add('description');
    document.getElementById('score').innerHTML = "<h1>Score: " + score + "</h1>";
  } else {
    document.getElementById('question-header').innerHTML = questions[questionIndex].prompt;
    document.getElementById('question-index').innerHTML = "Question " + (questionIndex + 1);
    document.getElementById('question-options').classList.remove('hidden');
    document.getElementById('description').classList.add('hidden');
    document.getElementById('a').innerHTML = questions[questionIndex].options[0];
    document.getElementById('b').innerHTML = questions[questionIndex].options[1];
    document.getElementById('c').innerHTML = questions[questionIndex].options[2];
    document.getElementById('d').innerHTML = questions[questionIndex].options[3];
    document.getElementById('next-question').classList.add('hidden');
    if (questionIndex === (questions.length - 1)) {
      document.getElementById('next-question').innerHTML = "Finish";
    } else {
      document.getElementById('next-question').innerHTML = "Next Question";
    }
  }
}

function check(value) {
  if (questions[questionIndex].answer == value) {
    score++;
    var element = document.getElementById('description');
    element.innerHTML = '<br><h3 id="description-header">Correct. Well done!</h3><hr>' + questions[questionIndex].description + '<br>';
    element.classList.remove('hidden');
    element.classList.add('bg-success');
    document.getElementById('question-options').classList.add('hidden');
    document.getElementById('next-question').classList.remove('hidden');
    document.getElementById('next-question').classList.add('btn-success');
  } else {
    score--;
    var element = document.getElementById('description');
    element.innerHTML = '<br><h3 id="description-header">Wrong. You\'ll do better next time!</h3><hr>' + questions[questionIndex].description + '<br>';
    element.classList.remove('hidden');
    element.classList.add('bg-danger');
    document.getElementById('question-options').classList.add('hidden');
    document.getElementById('next-question').classList.remove('hidden');
    document.getElementById('next-question').classList.add('btn-danger');
  }
  if (questionIndex === (questions.length - 1)) {
    document.getElementById('next-question').innerHTML = "Finish";
  } else {
    document.getElementById('next-question').innerHTML = "Next Question"
  }
}

function next() {
  questionIndex++;
  populate();
}

populate();

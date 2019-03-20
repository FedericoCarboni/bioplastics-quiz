function Question(prompt, options, answer, description) {
  this.prompt = prompt;
  this.options = options;
  this.answer = answer;
  this.description = description;
}

Question.prototype.isCorrect = function (answer) {
  return this.answer == answer;
};

var questions = [
  new Question("Sono una domanda?", ["Si", "No", "Forse", "Non lo so"], "a", "Ciao"),
  new Question("Sono una domanda?1", ["Si", "No", "Sicuramente", "Non lo so"], "b", "Cacca"),
  new Question("Sono una domanda?2", ["Si", "No", "cq", "Non lo so"], "c", "Cacca")
]


// Randomizes the order of the questions
for (var i = questions.length - 1; i > 0; i--) {
  var j = Math.floor(Math.random() * (i + 1));
  var tmp = questions[i];
  questions[i] = questions[j];
  questions[j] = tmp;
}


var score = 0;
var index = 0;

function populate() {
  if (index == questions.length) {
    document.getElementById('question').classList.add('hidden');
    document.getElementById('score').classList.remove('hidden');
    document.getElementById('score').innerHTML = "<h1>Score: " + score + "</h1><hr>";
  } else {
    document.getElementById('description').classList.add('hidden');
    document.getElementById('question-options').classList.remove('hidden');

    document.getElementById('question-header').innerHTML = questions[index].prompt;
    document.getElementById('question-index').innerHTML = "Question " + (index + 1);

    document.getElementById('a').innerHTML = questions[index].options[0];
    document.getElementById('b').innerHTML = questions[index].options[1];
    document.getElementById('c').innerHTML = questions[index].options[2];
    document.getElementById('d').innerHTML = questions[index].options[3];

    document.getElementById('next-question').classList.add('hidden');

    if (index == (questions.length - 1)) {
      document.getElementById('next-question').innerHTML = "Finish";
    } else {
      document.getElementById('next-question').innerHTML = "Next Question";
    }
  }
}


function check(answer) {
  var description = document.getElementById('description');

  if (questions[index].isCorrect(answer)) {
    score++;
    document.getElementById('next-question').classList.remove('hidden');
    document.getElementById('next-question').classList.remove('btn-danger');

    document.getElementById('question-options').classList.add('hidden');
    document.getElementById('next-question').classList.add('btn-success');

    description.innerHTML = "<h3 id=\"description-header\">Correct. Well done!<h3><hr>" + questions[index].description;
    description.classList.remove('hidden');
    description.classList.remove('bg-danger');

    description.classList.add('bg-success');
  } else {
    // score--;
    document.getElementById('next-question').classList.remove('hidden');
    document.getElementById('next-question').classList.remove('btn-success');

    document.getElementById('question-options').classList.add('hidden');
    document.getElementById('next-question').classList.add('btn-danger');

    description.innerHTML = "<h3 id=\"description-header\">Wrong. You'll do better next time!</h3><hr>" + questions[index].description;
    description.classList.remove('bg-success');
    description.classList.remove('hidden');

    description.classList.add('bg-danger');
  }
}

function next() {
  index++;
  populate();
}

populate();

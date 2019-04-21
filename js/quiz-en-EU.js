/*
 * Copyright (c) 2019  Federico Carboni
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program. If not, see <https://www.gnu.org/licenses/>.
 */

function Question(prompt, options, answer, description) {
  this.prompt = prompt;
  this.options = options;
  this.answer = answer;
  this.description = description;
}

Question.prototype.isCorrect = function (answer) {
  return this.answer == answer;
};

function random(min, max, except) {
  var num = Math.floor(Math.random() * (max - min + 1)) + min;
  return (num == except[0] || num == except[1]) ? random(min, max, except) : num;
}

var questions = [
  new Question("How much plastic has been produced in 2017 (millions of tons)?", ["Under 100", "Between 200 e 300", "Between 400 e 500", "More than 500	"], "c", ""),
  new Question("What is a polymer?", ["A set of giant molecules made up of smaller chains called repetitive units", "A set of micro molecules that makes a bigger one", "A set of repetitive units", "A molecule that attaches to another"], "a", ""),
  new Question("What are bioplastics?", ["There's no official definitions", "Una plastica che deriva anche solo in parte da risorse rinnovabili o è biodegradable A plastic made at least partly of renewable resources or that is biodegradable", "A biodegradable plastic", "A plastic made of renewable resources"], "a", ""),
  new Question("Can plastic be made out of the peel of a banana?", ["Yes", "No", "There have been no experiments regarding this", "Scientists are still trying"], "b", ""),
  new Question("What is the continent that produces the most bioplastic?", ["Europe", "Asia", "North America", "Oceania"], "b", ""),
  new Question("How many polymers are produced by bioplastics industries in Italy?", ["117.000 tonnes", "52.000 tonnes", "73.000 tonnes", "19.000 tonnes"], "c", ""),
  new Question("How much is the complete revenue of bioplastics industries in Italy?", ["Between 200 e 400 millions of euros", "Between 450 e 600 millions of euros", "Less than 200 millions of euros", "More than 600 millions of euros"], "b", ""),
  new Question("What is Ohoo?", ["An organization against non-recyclable plastics", "A company that produces bioplastics from fruits and vegetables", "A company that recycles bioplastics", "A project that makes edible water bottles"], "d", ""),
  new Question("If a polymer is made out of natural materials, is it always biodegradable?", ["No, it's never biodegradable", "Yes, it's always biodegradable", "Scientists haven't conducted any research about it", "It depends from the chemical structure"], "d", ""),
  new Question("How many types of bioplastics exist?", ["10 types and they're distinguished by grades of reuse", "3 types: A, B, C", "5 types: 1, 2, 3, 4, 5", "There's only one type of bioplastic, vegetal"], "b", ""),
]

for (var i = questions.length - 1; i > 0; i--) {
  var j = Math.floor(Math.random() * (i + 1));
  var tmp = questions[i];
  questions[i] = questions[j];
  questions[j] = tmp;
}


var score = 0;
var index = 0;
var hints = 0;

function populate() {
  if (index == questions.length) {
    document.getElementById('question').classList.add('hidden');
    document.getElementById('score').classList.remove('hidden');
    score = score - hints / 2;
    document.getElementById('score').innerHTML = "<h1>Score: " + score + "</h1><hr>";
  } else {
    document.getElementById('description').classList.add('hidden');
    document.getElementById('question-options').classList.remove('hidden');

    if (hints < questions.length * 0.3) {
      hintBtn = document.getElementById('hint');
      hintBtn.classList.remove('hidden');
      hintBtn.classList.remove('btn-secondary');
      hintBtn.classList.add('btn-primary');
      hintBtn.disabled = false;
      hintBtn.title = "Click for help, hints left " + Math.round(questions.length * 0.3);
    } else {
      hintBtn = document.getElementById('hint');
      hintBtn.classList.remove('hidden');
      hintBtn.classList.remove('btn-primary');
      hintBtn.classList.add('btn-secondary');
      hintBtn.disabled = true;
      hintBtn.title = "You finished your hints.";
    }

    document.getElementById('question-header').innerHTML = questions[index].prompt;
    document.getElementById('question-index').innerHTML = "Question " + (index + 1);
    a = document.getElementById('a');
    b = document.getElementById('b');
    c = document.getElementById('c');
    d = document.getElementById('d');
    a.innerHTML = questions[index].options[0];
    b.innerHTML = questions[index].options[1];
    c.innerHTML = questions[index].options[2];
    d.innerHTML = questions[index].options[3];
    a.classList.remove('btn-danger');
    b.classList.remove('btn-danger');
    c.classList.remove('btn-danger');
    d.classList.remove('btn-danger');
    a.classList.add('btn-primary');
    b.classList.add('btn-primary');
    c.classList.add('btn-primary');
    d.classList.add('btn-primary');

    var options = document.getElementById('question-options');

    for (var i = options.children.length; i >= 0; i--) {
      options.appendChild(options.children[Math.random() * i | 0]);
    }

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
    document.getElementById('hint').classList.add('hidden');
    document.getElementById('next-question').classList.add('btn-success');
    descHeader = document.getElementById('description-header');
    descHeader.innerHTML = "Correct. Well done!";
    descBody = document.getElementById('description-body');
    descBody.innerHTML = questions[index].description;
    description.classList.remove('hidden');
    description.classList.remove('bg-danger');

    description.classList.add('bg-success');
  } else {
    // score = score - 0.5;
    document.getElementById('next-question').classList.remove('hidden');
    document.getElementById('next-question').classList.remove('btn-success');

    document.getElementById('question-options').classList.add('hidden');
    document.getElementById('hint').classList.add('hidden');
    document.getElementById('next-question').classList.add('btn-danger');

    descHeader = document.getElementById('description-header');
    descHeader.innerHTML = "Wrong. You'll do better next time!";
    descBody = document.getElementById('description-body');
    descBody.innerHTML = questions[index].description;
    description.classList.remove('bg-success');
    description.classList.remove('hidden');

    description.classList.add('bg-danger');
  }
}

function hint() {
  if (hints < questions.length / 2) {
    hintBtn = document.getElementById('hint');
    hintBtn.classList.remove('btn-primary');
    hintBtn.classList.add('btn-secondary');
    hintBtn.disabled = true;
    hints++;
    hintBtn.title = "Hint already used, hints left " + Math.round(questions.length * 0.3);
    question = questions[index];
    questionOptions = document.getElementById('question-options');
    _options = ['a', 'b', 'c', 'd'];
    index1 = random(0, 3, [_options.indexOf(question.answer), -1]);
    index2 = random(0, 3, [_options.indexOf(question.answer), index1]);

    opz1 = document.getElementById(_options[index1]);
    opz2 = document.getElementById(_options[index2]);
    opz1.classList.remove('btn-primary');
    opz2.classList.remove('btn-primary');
    opz1.classList.add('btn-danger');
    opz2.classList.add('btn-danger');
  }
}

function next() {
  index++;
  populate();
}

populate();

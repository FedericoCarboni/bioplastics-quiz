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

var questions = [
  new Question("Quanti milioni di tonnellate di plastica sono state prodotte nel 2017?", ["Meno di 100", "Tra 200 e 300", "Tra 400 e 500", "Più di 500	"], "c", ""),
  new Question("Cos’è un polimero?", ["Un insieme di molecole giganti costituite da tanti mattoncini detti unità ripetitive", "Un insieme di micro molecole che forma una grande macro molecola", "Un insieme di unità ripetitive", "Una micro molecola che si unisce ad un’altra"], "a", ""),
  new Question("Cosa sono le bioplastiche?", ["Non c’è una definizione che vada bene per tutti gli studiosi", "Una plastica che deriva anche solo in parte da risorse rinnovabili o è biodegradabile", "Una plastica biodegradabile", "Una plastica che proviene da fonti rinnovabili"], "a", ""),
  new Question("Si può creare una plastica attraverso una buccia di banana?", ["Si", "No", "Non ci sono ancora esperimenti a riguardo", "Gli studi sono ancora in corso"], "b", ""),
  new Question("Qual`è il continente che produce più bioplastiche?", ["Europa", "Asia", "Nord America", "Oceania"], "b", ""),
  new Question("Quanti sono i polimeri lavorati dalle industrie delle bioplastiche in Italia?", ["117.000 tonnellate", "52.000 tonnellate", "73.000 tonnellate ", "19.000 tonnellate"], "c", ""),
  new Question("Quanto è il fatturato complessivo delle aziende di bioplastiche in Italia?", ["Tra 200 e 400 milioni di euro", "Tra 450 e 600 milioni di euro", "Meno di 200 milioni di euro", "Più di 600 milioni di euro"], "b", ""),
  new Question("Cos’è Ohoo?", ["Un’organizzazione contro le plastiche non riciclabili", "Un’azienda che produce bioplastiche da frutta e verdura", "Un’azienda che ricicla le bioplastiche in posate", "Un progetto che crea una bottiglia d’acqua commestibile"], "d", ""),
  new Question("È sempre biodegradabile un polimero ottenuto da fonti naturali?", ["No, non è mai biodegradabile", "È sempre biodegradabile", "Gli scienziati non hanno fatto ancora studi a riguardo", "Dipende dalla struttura chimica"], "d", ""),
  new Question("Quanti tipi di bioplastiche esistono?", ["10 tipi e si distinguono per gradi di riutilizzo", "3 tipi: A, B, C", "5 tipi: 1, 2, 3, 4, 5", "C’è solo un tipo di bioplastiche, quelle vegetali"], "b", ""),
  // new Question("domanda", ["opz", "opz", "opz", "opz"], "giusta", ""),
]

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
    document.getElementById('question-index').innerHTML = "Domanda " + (index + 1);

    document.getElementById('a').innerHTML = questions[index].options[0];
    document.getElementById('b').innerHTML = questions[index].options[1];
    document.getElementById('c').innerHTML = questions[index].options[2];
    document.getElementById('d').innerHTML = questions[index].options[3];

    document.getElementById('next-question').classList.add('hidden');

    if (index == (questions.length - 1)) {
      document.getElementById('next-question').innerHTML = "Finisci";
    } else {
      document.getElementById('next-question').innerHTML = "Prossima Domanda";
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

    description.innerHTML = "<h3 id=\"description-header\">Esatto. Ben fatto!<h3><hr>" + questions[index].description;
    description.classList.remove('hidden');
    description.classList.remove('bg-danger');

    description.classList.add('bg-success');
  } else {
    // score--;
    document.getElementById('next-question').classList.remove('hidden');
    document.getElementById('next-question').classList.remove('btn-success');

    document.getElementById('question-options').classList.add('hidden');
    document.getElementById('next-question').classList.add('btn-danger');

    description.innerHTML = "<h3 id=\"description-header\">Sbagliato. Farai meglio la prossima volta!</h3><hr>" + questions[index].description;
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

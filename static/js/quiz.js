/** Class wrapper for browser compatibility */
var Quiz = /** @class */ (function () {
  function Quiz(json) {
    var data = JSON.parse(json);
    this.questions = data.questions;
    this.lang = data.lang;
    /* Initializing variables */
    this.index = 0;
    this.score = 0;
    this.hints = 0;
  }
  
  Quiz.prototype.populate = function () {
    if (this.index == 0) {
      for (var i = this.questions.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var tmp = this.questions[i];
        this.questions[i] = this.questions[j];
        this.questions[j] = tmp;
      }
      document.getElementById('next-question').innerText = this.lang.nextquestion;
    }
    /* Hinding the description and the 'Next' button of the question */
    document.getElementById('description').classList.add('hidden');
    document.getElementById('next-question').classList.add('hidden');
    
    /* Unhiding the question's options */
    document.getElementById('question-options').classList.remove('hidden');

    /* Updating hints */
    var hint = document.getElementById('hint');
    hint.classList.remove('hidden');
  
    if (this.hints < this.questions.length * 0.3) {
      hint.classList.remove('btn-secondary');
      hint.classList.add('btn-primary');
      hint.disabled = false;
      hint.title = this.lang.hintnotused.replace('%s', Math.round(this.questions.length * 0.3) - this.hints)
    } else {
      hint.classList.remove('btn-primary');
      hint.classList.add('btn-secondary');
      hint.disabled = true;
      hint.title = this.lang.hintsfinished;
    }
  
    var question = this.questions[this.index];
  
    /* Updating the question header and body */
    document.getElementById('question-header').innerText = question.prompt;
    document.getElementById('question-index').innerText = this.lang.questionindex.replace('%s', this.index + 1);
    var letters = ['a', 'b', 'c', 'd'];
    for (var i = 0; i < letters.length; i++) {
      var option = document.getElementById(letters[i]);
      option.innerText = question.options[i];
      option.classList.remove('btn-danger');
      option.classList.add('btn-primary');
      option.disabled = false;
    }
  
    /* Scrambling question options */
    var options = document.getElementById('question-options');
    
    for (var i = options.children.length; i >= 0; i--) {
      options.appendChild(options.children[Math.random() * i | 0]);
    }
  };
  
  Quiz.prototype.check = function (answer) {
    var description = document.getElementById('description');
    var descHeader = document.getElementById('description-header');
    var descBody = document.getElementById('description-body');
    var nextButton = document.getElementById('next-question');
    var submit = document.getElementById('submit');
    var submitScore = document.getElementById('submit-score');
    var submitButton = document.getElementById('submit-btn');
    var question = this.questions[this.index];

    /* Hiding 'Hint' button and question options */
    document.getElementById('hint').classList.add('hidden');
    document.getElementById('question-options').classList.add('hidden');
    
    /* Clearing classes from description and next-question */
    description.classList.remove('hidden');
    description.classList.remove('bg-success');
    description.classList.remove('bg-danger');
    nextButton.classList.remove('btn-success');
    nextButton.classList.remove('btn-danger');

    /* Setting the quiz' description body */
    descBody.innerText = question.description;

    /* Checking if the answer is correct */
    if (question.answer == answer) {
      this.score++;
      /* Checking if the quiz is finished */
      if (this.index == (this.questions.length - 1)) {
        submit.classList.remove('hidden');
        submitScore.value = this.score;
        submitButton.classList.add('btn-success');
      } else {
        nextButton.classList.remove('hidden');
        nextButton.classList.add('btn-success');
      }

      /* Setting the quiz' description header */
      descHeader.innerText = this.lang.descriptioncorrect;

      description.classList.add('bg-success');
    } else {
      /* Checking if the quiz is finished */
      if (this.index == (this.questions.length - 1)) {
        submit.classList.remove('hidden');
        submitScore.value = this.score;
        submitButton.classList.add('btn-danger');
      } else {
        nextButton.classList.remove('hidden');
        nextButton.classList.add('btn-danger');
      }

      /* Setting the quiz' description header */
      descHeader.innerText = this.lang.descriptionwrong;

      description.classList.add('bg-danger');
    }
  };

  function random(min, max, except) {
    var num = Math.floor(Math.random() * (max - min + 1)) + min;
    for (var i = 0; i < except.length; i++) {
      if (num == except[i]) {
        return random(min, max, except);
      }
    }
    return num;
  }

  Quiz.prototype.hint = function () {
    this.hints++;
    this.score -= 0.5;
    var question = this.questions[this.index];
    var hintButton = document.getElementById('hint');
    
    /* Choosing two random options */
    var letters = ['a', 'b', 'c', 'd'];
    var max = letters.length - 1;
    var index1 = random(0, max, [letters.indexOf(question.answer)]);
    var index2 = random(0, max, [letters.indexOf(question.answer), index1]);
    var option1 = document.getElementById(letters[index1]);
    var option2 = document.getElementById(letters[index2]);
    
    /* Disabling the options chosen */
    option1.classList.remove('btn-primary');
    option2.classList.remove('btn-primary');
    option1.classList.add('btn-danger');
    option2.classList.add('btn-danger');
    option1.disabled = true;
    option2.disabled = true;
    
    /* Disabling the 'hint' button */
    hintButton.classList.remove('btn-primary');
    hintButton.classList.add('btn-secondary');
    hintButton.disabled = true;
    hintButton.title = this.lang.hintused.replace('%s', Math.round(questions.length * 0.3) - hints);
  };

  Quiz.prototype.next = function () {
    this.index++;
    this.populate();
  };

  return Quiz;
}());

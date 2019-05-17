interface QuizData {
  questions: Array<Question>;
  lang: Language;
}

interface Question {
  prompt: string;
  options: Array<string>;
  answer: number;
  description: string;
  weight: number;
}

interface Language {
  hintnotused: string;
  hintsfinished: string;
  hintused: string;
  questionindex: string;
  descriptioncorrect: string;
  descriptionwrong: string;
  nextquestion: string;
  finish: string;
}

interface Score {
  score: number;
  weight: number;
}

class Quiz {

  /**
   * This field will contain all the questions of the Quiz.
   */
  private questions: Array<Question>;
  /**
   * This field will contain an object (Language) with all other 
   * translations for the Quiz.
   */
  private lang: Language;
  /**
   * The index of the current Question.
   */
  private index: number = 0;
  /**
   * Whether a hint has been used or not for the current Question.
   */
  private hintUsed: boolean = false;
  /**
   * The total number of hints used.
   */
  private hints: number = 0;
  /**
   * An Array of Score(s) which will contain the points for each 
   * Question and their respective weight.
   */
  private scores: Array<Score> = [];

  /**
   * The constructor of the class, fields 'questions' and 'lang' are
   * initialized here.
   * @param data An Object matching QuizData which will represent all 
   * the contents of the Quiz.
   */
  constructor (data: QuizData) {
    this.questions = data.questions;
    this.lang = data.lang;
  }

  /**
   * Calculates and returns the score of all questions answered.
   * @returns The score of the Quiz.
   */
  public getScore() {
    let totalScore = 0.0;
    let weights = [];
    /* Looping to find and collect all unique weights */
    for (let i = 0; i < this.scores.length; i++) {
      let score = this.scores[i];
      /* Check if 'weights' doesn't contain */
      if (weights.indexOf(score.weight) == -1) {
        /* Adding the current weight to weights */
        weights.push(score.weight);
      }
    }
    for (let w = 0; w < weights.length; w++) {
      let weight = weights[w];
      /* 'scores' will be the sum of the scores with the same weight
      and 'number' will be the number of them */
      let scores = 0;
      let number = 0;
      for (let i = 0; i < this.scores.length; i++) {
        let score = this.scores[i];
        /* Checking if the weight of the score and the weight from 
        'weights' are equal */
        if (score.weight == weight) {
          scores += score.score;
          number++;  /* Increasing number by 1 */
        }
      }
      /* Increasing 'totalScore' by the average of the scores with 
      the same weight multiplied by their weight */
      totalScore += scores / number * weight;
    }
    /* Returning the score as a percentage */
    totalScore = Math.round(totalScore * 100);
    return totalScore;
  }

  public populate() {
    if (this.index == 0) {
      /* Scrambling questions */
      for (let i = this.questions.length - 1; i > 0; i--) {
        let j = Math.floor(Math.random() * (i + 1));
        let tmp = this.questions[i];
        this.questions[i] = this.questions[j];
        this.questions[j] = tmp;
      }
      document.getElementById('next-question').innerText = this.lang.nextquestion;
    }

    this.hintUsed = false;

    /* Hinding the description and the 'Next' button of the question */
    document.getElementById('description').classList.add('hidden');
    document.getElementById('next-question').classList.add('hidden');
    
    /* Unhiding the question's options */
    document.getElementById('question-options').classList.remove('hidden');

    /* Updating hints */
    let hint = <HTMLButtonElement> document.getElementById('hint');
    hint.classList.remove('hidden');
    
    /* Checking whether the hints are finished or not */
    if (this.hints < this.questions.length * 0.3) {
      hint.classList.remove('btn-secondary');
      hint.classList.add('btn-primary');
      hint.disabled = false;
      hint.title = this.lang.hintnotused.replace('%s', String(Math.round(this.questions.length * 0.3) - this.hints));
    } else {
      hint.classList.remove('btn-primary');
      hint.classList.add('btn-secondary');
      hint.disabled = true;
      hint.title = this.lang.hintsfinished;
    }
  
    let question = this.questions[this.index];
  
    /* Updating the question header and body */
    document.getElementById('question-header').innerText = question.prompt;
    document.getElementById('question-index').innerText = this.lang.questionindex.replace('%s', String(this.index + 1));
  
    let options = document.getElementById('question-options');

    /* Clearing all options */
    while (options.firstChild) {
      options.removeChild(options.firstChild);
    }

    /* Iterating over each option to update their text to the corresponding 
    question option text */
    for (let i = 0; i < question.options.length; i++) {
      let questionOption = document.createElement('div');
      questionOption.classList.add('question-option');
      let option = document.createElement('button');
      option.id = 'option-' + i;
      option.innerText = question.options[i];
      option.classList.add('btn');
      option.classList.add('btn-primary');
      /* Setting 'onclick' function, this is a wrapped function 
      because 'quiz' and 'i' are in a different scope than the 
      function definition */
      option.onclick = ((quiz: Quiz, i: number) => {
        return () => {
          quiz.check(i);
        };
      })(this, i);
      questionOption.appendChild(option);
      options.appendChild(questionOption);
    }

    /* Scrambling the order of the question options */
    for (let i = options.children.length; i >= 0; i--) {
      options.appendChild(options.children[Math.random() * i | 0]);
    }
  }

  /**
   * This method checks whether 
   * @param answer The answer chosen by the user.
   */
  public check(answer: number) {
    let description = document.getElementById('description');
    let descHeader = document.getElementById('description-header');
    let descBody = document.getElementById('description-body');
    let nextButton = document.getElementById('next-question');
    let submit = document.getElementById('submit');
    let submitScore = <HTMLInputElement> document.getElementById('submit-score');
    let submitButton = <HTMLInputElement> document.getElementById('submit-btn');
    let question = this.questions[this.index];

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
    descBody.innerHTML = question.description;

    /* Checking if the answer is correct */
    if (question.answer == answer) {
      let score = 0;

      if (this.hintUsed) {
        score = 0.6;
      } else {
        score = 1.0;
      }

      /* Adding the score to the 'scores' field */
      this.scores.push({score: score, weight: question.weight});

      /* Setting the quiz' description header */
      descHeader.innerText = this.lang.descriptioncorrect;

      description.classList.add('bg-success');

      /* Updating the 'Next' button and 'Finish' form last to avoid 
      error 400 bad request, by Python */
      /* Checking if the quiz is finished */
      if (this.index == (this.questions.length - 1)) {
        /* If it is this shows the form */
        submitScore.value = String(this.getScore());
        submitButton.classList.add('btn-success');
        submitButton.value = this.lang.finish;
        /* Avoiding 400 bad request error by unhiding the form last */
        submit.classList.remove('hidden');
      } else {
        /* If it's not shows the 'Next' button */
        nextButton.classList.add('btn-success');
        nextButton.classList.remove('hidden');
      }
    } else {
      /* Adding the score to the 'scores' field */
      this.scores.push({score: 0.0, weight: question.weight});

      /* Setting the quiz' description header */
      descHeader.innerText = this.lang.descriptionwrong;

      description.classList.add('bg-danger');

      /* Updating the 'Next' button and 'Finish' form last to avoid 
      error 400 bad request, by Python */
      /* Checking if the quiz is finished */
      if (this.index == (this.questions.length - 1)) {
        /* If it is this shows the form */
        submitScore.value = String(this.getScore());
        submitButton.classList.add('btn-danger');
        submitButton.value = this.lang.finish;
        /* Avoiding 400 bad request error by unhiding the form last */
        submit.classList.remove('hidden');
      } else {
        /* If it's not shows the 'Next' button */
        nextButton.classList.remove('hidden');
        nextButton.classList.add('btn-danger');
      }
    }
  }

  /**
   * Disables two wrong options randomly and increases the number of
   * hints used. This will also set Quiz.hintUsed to true.
   */
  public hint() {
    /* Custom function to get a random number and avoid all values in except */
    function random(min: number, max: number, except: Array<number>) {
      let num = Math.floor(Math.random() * (max - min + 1)) + min;
      /* Checking if except contains the number generated */
      if (except.indexOf(num) > -1) {
        /* If it does this function will generate a new number */
        return random(min, max, except);
      } else {
        /* If not it will just return the number generated */
        return num;
      }
    }
    this.hints++;
    this.hintUsed = true;

    let question = this.questions[this.index];
    let hintButton = <HTMLButtonElement> document.getElementById('hint');
    let exclusions = [question.answer];
    
    /* Removing half of the question's options */
    for (let i = 0; i < question.options.length / 2; i++) {
      /* Choosing a random index */
      let index = random(0, question.options.length - 1, exclusions);
      let option = <HTMLButtonElement> document.getElementById('option-' + index);
      /* Disabling the option chosen */
      option.classList.remove('btn-primary');
      option.classList.add('btn-danger');
      option.disabled = true;
      /* Adding the current index to the exclusions */
      exclusions.push(index);
    }
    
    /* Disabling the 'hint' button */
    hintButton.classList.remove('btn-primary');
    hintButton.classList.add('btn-secondary');
    hintButton.disabled = true;
    hintButton.title = this.lang.hintused.replace('%s', String(Math.round(this.questions.length * 0.3) - this.hints));
  }

  /**
   * Jumps to the next question and updates (repopulates) the page.
   */
  public next() {
    this.index++;
    this.populate();
  }
}
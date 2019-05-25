var Quiz = /** @class */ (function () {
    /**
     * The constructor of the class, fields 'questions' and 'lang' are
     * initialized here.
     * @param data An Object matching QuizData which will represent all
     * the contents of the Quiz.
     */
    function Quiz(data) {
        /**
         * The index of the current Question.
         */
        this.index = 0;
        /**
         * Whether a hint has been used or not for the current Question.
         */
        this.hintUsed = false;
        /**
         * The total number of hints used.
         */
        this.hints = 0;
        /**
         * An Array of Score(s) which will contain the points for each
         * Question and their respective weight.
         */
        this.scores = [];
        this.questions = data.questions;
        this.lang = data.lang;
    }
    /**
     * Calculates and returns the score of all questions answered.
     * @returns The score of the Quiz.
     */
    Quiz.prototype.getScore = function () {
        var totalScore = 0.0;
        var weights = [];
        /* Looping to find and collect all unique weights */
        for (var i = 0; i < this.scores.length; i++) {
            var score = this.scores[i];
            /* Check if 'weights' doesn't contain */
            if (weights.indexOf(score.weight) == -1) {
                /* Adding the current weight to weights */
                weights.push(score.weight);
            }
        }
        for (var w = 0; w < weights.length; w++) {
            var weight = weights[w];
            /* 'scores' will be the sum of the scores with the same weight
            and 'number' will be the number of them */
            var scores = 0;
            var number = 0;
            for (var i = 0; i < this.scores.length; i++) {
                var score = this.scores[i];
                /* Checking if the weight of the score and the weight from
                'weights' are equal */
                if (score.weight == weight) {
                    scores += score.score;
                    number++; /* Increasing number by 1 */
                }
            }
            /* Increasing 'totalScore' by the average of the scores with
            the same weight multiplied by their weight */
            totalScore += scores / number * weight;
        }
        /* Returning the score as a percentage */
        totalScore = Math.round(totalScore * 100);
        return totalScore;
    };
    Quiz.prototype.populate = function () {
        if (this.index == 0) {
            /* Scrambling questions */
            for (var i = this.questions.length - 1; i > 0; i--) {
                var j = Math.floor(Math.random() * (i + 1));
                var tmp = this.questions[i];
                this.questions[i] = this.questions[j];
                this.questions[j] = tmp;
            }
            document.getElementById('next-question').innerHTML = this.lang.nextquestion;
        }
        this.hintUsed = false;
        /* Hinding the description and the 'Next' button of the question */
        document.getElementById('description').classList.add('hidden');
        document.getElementById('next-question').classList.add('hidden');
        /* Unhiding the question's options */
        document.getElementById('question-options').classList.remove('hidden');
        /* Updating hints */
        var hint = document.getElementById('hint');
        hint.classList.remove('hidden');
        /* Checking whether the hints are finished or not */
        if (this.hints < this.questions.length * 0.3) {
            hint.classList.remove('btn-secondary');
            hint.classList.add('btn-primary');
            hint.disabled = false;
            hint.title = this.lang.hintnotused.replace('%s', String(Math.round(this.questions.length * 0.3) - this.hints));
        }
        else {
            hint.classList.remove('btn-primary');
            hint.classList.add('btn-secondary');
            hint.disabled = true;
            hint.title = this.lang.hintsfinished;
        }
        var question = this.questions[this.index];
        /* Updating the question header and body */
        document.getElementById('question-header').innerHTML = question.prompt;
        document.getElementById('question-index').innerHTML = this.lang.questionindex.replace('%s', String(this.index + 1));
        var options = document.getElementById('question-options');
        /* Clearing all options */
        while (options.firstChild) {
            options.removeChild(options.firstChild);
        }
        /* Iterating over each option to update their text to the corresponding
        question option text */
        for (var i = 0; i < question.options.length; i++) {
            var questionOption = document.createElement('div');
            questionOption.classList.add('question-option');
            var option = document.createElement('button');
            option.id = 'option-' + i;
            option.innerHTML = question.options[i];
            option.classList.add('btn');
            option.classList.add('btn-primary');
            /* Setting 'onclick' function, this is a wrapped function
            because 'quiz' and 'i' are in a different scope than the
            function definition */
            option.onclick = (function (quiz, i) {
                return function () {
                    quiz.check(i);
                };
            })(this, i);
            questionOption.appendChild(option);
            options.appendChild(questionOption);
        }
        /* Scrambling the order of the question options */
        for (var i = options.children.length; i >= 0; i--) {
            options.appendChild(options.children[Math.random() * i | 0]);
        }
    };
    /**
     * This method checks whether
     * @param answer The answer chosen by the user.
     */
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
        descBody.innerHTML = question.description;
        /* Checking if the answer is correct */
        if (question.answer == answer) {
            var score = 0;
            if (this.hintUsed) {
                score = 0.6;
            }
            else {
                score = 1.0;
            }
            /* Adding the score to the 'scores' field */
            this.scores.push({ score: score, weight: question.weight });
            /* Setting the quiz' description header */
            descHeader.innerHTML = this.lang.descriptioncorrect;
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
            }
            else {
                /* If it's not shows the 'Next' button */
                nextButton.classList.add('btn-success');
                nextButton.classList.remove('hidden');
            }
        }
        else {
            /* Adding the score to the 'scores' field */
            this.scores.push({ score: 0.0, weight: question.weight });
            /* Setting the quiz' description header */
            descHeader.innerHTML = this.lang.descriptionwrong;
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
            }
            else {
                /* If it's not shows the 'Next' button */
                nextButton.classList.remove('hidden');
                nextButton.classList.add('btn-danger');
            }
        }
    };
    /**
     * Disables two wrong options randomly and increases the number of
     * hints used. This will also set Quiz.hintUsed to true.
     */
    Quiz.prototype.hint = function () {
        /* Custom function to get a random number and avoid all values in except */
        function random(min, max, except) {
            var num = Math.floor(Math.random() * (max - min + 1)) + min;
            /* Checking if except contains the number generated */
            if (except.indexOf(num) > -1) {
                /* If it does this function will generate a new number */
                return random(min, max, except);
            }
            else {
                /* If not it will just return the number generated */
                return num;
            }
        }
        this.hints++;
        this.hintUsed = true;
        var question = this.questions[this.index];
        var hintButton = document.getElementById('hint');
        var exclusions = [question.answer];
        /* Removing half of the question's options */
        for (var i = 0; i < question.options.length / 2; i++) {
            /* Choosing a random index */
            var index = random(0, question.options.length - 1, exclusions);
            var option = document.getElementById('option-' + index);
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
    };
    /**
     * Jumps to the next question and updates (repopulates) the page.
     */
    Quiz.prototype.next = function () {
        this.index++;
        this.populate();
    };
    return Quiz;
}());

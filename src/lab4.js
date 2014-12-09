;(function () {
  'use strict';
  /*
  * @constructor Quiz
  * runs an AJAX-based Quiz with first-grader math questions
  * */
  function Quiz () {
    this.postURL = ''; // contains the current url for post requests
    this.correctAnswers = 0; // used for insertion into DOM
    this.posts = 0; // total number of times user posted an answer
    /*
    * @object domElements
    * contains all references to elements already in DOM
    * */
    let domElements = {
      submit: document.querySelector('#submit'),
      answer: document.querySelector('#answer'),
      questionContainer: document.querySelector('#question-container'),
      correctAnswersContainer: document.querySelector('#correct-answers'),
      errorFlash: document.querySelector('#error-flash')
    };
    /*
    * @function addCorrectAnswer
    * inserts correct answer into DOM
    * @param String answer
    * */
    let addCorrectAnswer = (answer) => {
      let li = document.createElement('li');
      let p = document.createElement('p');
      let answerParagraph = document.createElement('p');
      p.innerHTML = '<strong>Fråga ' + this.correctAnswers + ': </strong>';
      p.setAttribute('class', 'strong');
      answerParagraph.textContent = answer;
      li.appendChild(p);
      li.appendChild(answerParagraph);
      domElements.correctAnswersContainer.appendChild(li);
    };
    /*
    * @function flashWrongAnswer
    * lets user know that they answered incorrectly by updating the send button to red and flashing error message
    * @param String answer: the wrong answer submitted by user
    */
    let flashWrongAnswer = (answer) => {
      domElements.errorFlash.innerHTML = 'Oj! <strong>'+ answer +'</strong> är fel svar.';
      domElements.answer.focus();
    };
    let gameOver = () => {
      let hooray = document.createElement('h3');
      let cheer = document.createElement('p');
      let happyContainer = document.createElement('div');
      happyContainer.setAttribute('class', 'alert alert-success');
      hooray.textContent =  'Grattis! Du klarade det!';
      cheer.textContent = 'Det tog dig ' + this.posts + ' försök för att klara ' + this.correctAnswers + ' frågor. Inte illa pinkat!';
      happyContainer.appendChild(hooray);
      happyContainer.appendChild(cheer);
      domElements.questionContainer.innerHTML = '';
      domElements.questionContainer.appendChild(happyContainer);
    };
    /*
    * @function updateQuestion
    * replaces the active question with the new one, when user answers correctly
    * @param String question
    * */
    let updateQuestion = (question) => {
      let p = document.createElement('p');
      p.textContent = question;
      domElements.questionContainer.innerHTML = '';
      domElements.questionContainer.appendChild(p);
    };
    /*
    * @method get
    * gets an URL, updates the URL for next post
    * @param String url
    * */
    this.get = (url) => {
      let xhr = XMLHttpRequest ? new XMLHttpRequest() : new ActiveXObject();
      xhr.open('get', url, false);
      xhr.addEventListener('load', () => {
        if (xhr.status < 400) {
          this.postURL = JSON.parse(xhr.responseText).nextURL; // new URL to post to, update reference
          updateQuestion(JSON.parse(xhr.responseText).question); // new question, update DOM
        }
      });
      xhr.send(null);
    };
    /*
    * @function post
    * posts the answer to the server, receives a new URL, gets the new URL on correct answer
    * flashes error message if wrong answer
    * @param Event e: the click-event
    * @param String answer: user-submitted answer
    * */
    let post = (e, answer) => {
      e = e || event;
      e.preventDefault();
      let json = JSON.stringify({answer});
      let xhr = XMLHttpRequest ? new XMLHttpRequest() : new ActiveXObject();
      xhr.addEventListener('load', () => {
        this.posts += 1;
        domElements.submit.setAttribute('class', 'btn btn-lg btn-info pull-right');
        domElements.errorFlash.innerHTML = '';
        if (xhr.status < 400) {
            this.correctAnswers += 1;
            addCorrectAnswer(answer);
            domElements.answer.value = '';
            domElements.answer.focus();
          JSON.parse(xhr.responseText).nextURL ?
              this.get(JSON.parse(xhr.responseText).nextURL):
              gameOver();
            }
          else {
            domElements.submit.setAttribute('class', 'btn btn-lg btn-danger pull-right');
            flashWrongAnswer(answer);
          }
      });
      xhr.open('post', this.postURL, true);
      xhr.setRequestHeader('Content-Type', 'application/json;charset=UTF-8');
      xhr.send(json);
    };
    domElements.submit.addEventListener('click', (e) => {
      if (domElements.answer.value) {
        post(e, domElements.answer.value.trim());
      }
    },
      false);
  }
  let run = () => new Quiz().get('http://vhost3.lnu.se:20080/question/1');
  window.onload = run;
})();

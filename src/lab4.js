;(function () {
  'use strict';
  /*
  * @constructor Quiz
  * runs an AJAX-based Quiz with first-grader math questions
  * */
  function Quiz () {
    this.postURL = ''; // contains the current url for post requests
    this.correctAnswers = []; // used for insertion into DOM
    this.posts = 0; // total number of times user posted an answer
    /*
    * @object domElements
    * contains all references to elements already in DOM
    * */
    let domElements = {
      submit: document.querySelector('#submit'),
      answer: document.querySelector('#answer'),
      questionContainer: document.querySelector('#question-container'),
      correctAnswersContainer: document.querySelector('#correct-answers')
    };
    /*
    * @function addCorrectAnswer
    * inserts correct answer into DOM
    * @param String answer
    * */
    let addCorrectAnswer = (answer) => {
      this.correctAnswers.push(answer);
      let li = document.createElement('li');
      let p = document.createElement('p');
      p.textContent = answer;
      li.appendChild(p);
      domElements.correctAnswersContainer.appendChild(li);
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
      console.log('get url: ' + url);
      let xhr = XMLHttpRequest ? new XMLHttpRequest() : new ActiveXObject();
      xhr.open('get', url, false);
      xhr.addEventListener('load', () => {
        if (xhr.status < 400) {
          this.postURL = JSON.parse(xhr.responseText).nextURL; // new URL to post to, update reference
          console.log('received postURL: ' + this.postURL);
          updateQuestion(JSON.parse(xhr.responseText).question); // new question, update DOM
          console.log('received question: ' + JSON.parse(xhr.responseText).question);
          console.log(xhr.responseText);
        }
      });
      xhr.send(null);
    };
    /*
    * @function flashWrongAnswer
    * lets user know that they answered incorrectly by updating the send button to red and flashing error message
    * @param String answer: the wrong answer submitted by user
    */
    let flashWrongAnswer = (answer) => {
      alert(answer + 'är fel svar.');
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
        this.posts += this.posts + 1;
        if (xhr.status < 400) {
            console.log(JSON.parse(xhr.responseText).nextURL);
            this.get(JSON.parse(xhr.responseText).nextURL);
          }
          else {
            console.log('post: unsuccessful post. status code ' + xhr.status);
            domElements.submit.setAttribute('class', 'btn btn-lg btn-danger pull-right');
            flashWrongAnswer(answer);
          }
      });
      xhr.open('post', this.postURL, true);
      xhr.setRequestHeader('Content-Type', 'application/json;charset=UTF-8');
      xhr.send(json);
    };
    domElements.submit.addEventListener('click', function (e) {
      return post(e, domElements.answer.value);
    }, false);
  }
  let run = () => new Quiz().get('http://vhost3.lnu.se:20080/question/1');
  window.onload = run;
})();

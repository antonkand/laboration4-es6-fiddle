;(function () {
  'use strict';
  function Quiz () {
    this.postURL = '';
    this.correctAnswers = [];
    let domElements = {
      submit: document.querySelector('#submit'),
      answer: document.querySelector('#answer'),
      questionContainer: document.querySelector('#question-container'),
      correctAnswersContainer: document.querySelector('#correct-answers')
    };
    let addCorrectAnswer = (answer) => {
      this.correctAnswers.push(answer);
      let li = document.createElement('li');
      let p = document.createElement('p');
      p.textContent = answer;
      li.appendChild(p);
      domElements.correctAnswersContainer.appendChild(li);
    };
    let updateQuestion = (question) => {
      let p = document.createElement('p');
      p.textContent = question;
      domElements.questionContainer.innerHTML = '';
      domElements.questionContainer.appendChild(p);
    };
    this.get = (url) => {
      console.log('get url: ' + url);
      let xhr = XMLHttpRequest ? new XMLHttpRequest() : new ActiveXObject();
      xhr.open('get', url, false);
      xhr.addEventListener('load', () => {
        if (xhr.status < 400) {
          this.postURL = JSON.parse(xhr.responseText).nextURL;
          console.log('received postURL: ' + this.postURL);
          updateQuestion(JSON.parse(xhr.responseText).question);
          console.log('received question: ' + JSON.parse(xhr.responseText).question);
          console.log(xhr.responseText);
        }
      });
      xhr.send(null);
    };
    let post = (e, answer) => {
      e = e || event;
      e.preventDefault();
      let json = JSON.stringify({answer});
      let xhr = XMLHttpRequest ? new XMLHttpRequest() : new ActiveXObject();
      xhr.addEventListener('load', () => {
        if (xhr.status < 400) {
            console.log(JSON.parse(xhr.responseText).nextURL);
            this.get(JSON.parse(xhr.responseText).nextURL);
          }
          else {
            console.log('post: unsuccessful post. status code ' + xhr.status);
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

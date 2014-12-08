;(function () {
  'use strict';
  function Quiz () {
    this.postURL = 'http://vhost3.lnu.se:20080/answer/1';
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
        }
      });
      xhr.send(null);
    };
    let post = () => {
      let xhr = XMLHttpRequest ? new XMLHttpRequest() : new ActiveXObject();
      xhr.open('post', this.postURL);
      console.log('post url: ' + this.postURL);
      xhr.setRequestHeader('Content-Type', 'application/json;charset=UTF-8');
      xhr.onreadystatechange = () => {
        if(xhr.readyState === 4 && xhr.status === 200) {
          alert(xhr.responseText);
          this.get('http://vhost3.lnu.se:20080/question/1');
        }
       xhr.send(JSON.stringify({ answer: 2}));
      };
    };
    domElements.submit.addEventListener('click', post(), false);
  }
  let run = () => new Quiz().get('http://vhost3.lnu.se:20080/question/1');
  window.onload = run;
})();

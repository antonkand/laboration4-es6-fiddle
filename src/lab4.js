;(function () {
  'use strict';
  function Quiz () {
    this.getURL = '';
    this.postURL = '';
    this.correctAnswers = [];
    this.updateQuestion = (question) => {
        let addCorrectAnswerToDOM = (answer) => {
          this.correctAnswers.push(answer);
          let correctAnswersContainer = document.querySelector('#correct-answers');
          let li = document.createElement('li');
          let p = document.createElement('p');
          p.textContent = answer;
          li.appendChild(p);
          correctAnswersContainer.appendChild(li);
        };
        let questionContainer = document.querySelector('#question-container');
        let p = questionContainer.firstChild;
        if (p.textContent) {
          addCorrectAnswerToDOM(p.textContent);
        }
        p.textContent = question;
    };
    this.post = (url, answer) => {
      console.log('Quiz.post(url):\n' +url);
      this.getURL = answer;
    };
    this.get = (url) => {
      console.log('Quiz.get(url):\n' + url);
      let xhr = XMLHttpRequest ? new XMLHttpRequest() : new ActiveXObject();
      xhr.open('get', url, false);
      xhr.addEventListener('load', function() {
        if (xhr.status < 400) {
          this.postURL = JSON.parse(xhr.responseText).nextURL;
          console.log('xhr.status < 400, this.postURL: ' + this.postURL);
          this.updateQuestion(JSON.parse(xhr.responseText).question);
          console.log('xhr.status < 400, JSON.parse(xhr.responseText).question: ' + JSON.parse(xhr.responseText).question);
        }
      });
      xhr.send(null);

      this.post('postURL', '42');
    };
  }
  let run = () => new Quiz().get('http://vhost3.lnu.se:20080/question/1');
  window.onload = run;
})();

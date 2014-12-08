"use strict";
;
(function() {
  'use strict';
  function Quiz() {
    var $__0 = this;
    this.postURL = 'http://vhost3.lnu.se:20080/answer/1';
    this.correctAnswers = [];
    var domElements = {
      submit: document.querySelector('#submit'),
      answer: document.querySelector('#answer'),
      questionContainer: document.querySelector('#question-container'),
      correctAnswersContainer: document.querySelector('#correct-answers')
    };
    var addCorrectAnswer = (function(answer) {
      $__0.correctAnswers.push(answer);
      var li = document.createElement('li');
      var p = document.createElement('p');
      p.textContent = answer;
      li.appendChild(p);
      domElements.correctAnswersContainer.appendChild(li);
    });
    var updateQuestion = (function(question) {
      var p = document.createElement('p');
      p.textContent = question;
      domElements.questionContainer.innerHTML = '';
      domElements.questionContainer.appendChild(p);
    });
    this.get = (function(url) {
      console.log('get url: ' + url);
      var xhr = XMLHttpRequest ? new XMLHttpRequest() : new ActiveXObject();
      xhr.open('get', url, false);
      xhr.addEventListener('load', (function() {
        if (xhr.status < 400) {
          $__0.postURL = JSON.parse(xhr.responseText).nextURL;
          console.log('received postURL: ' + $__0.postURL);
          updateQuestion(JSON.parse(xhr.responseText).question);
          console.log('received question: ' + JSON.parse(xhr.responseText).question);
        }
      }));
      xhr.send(null);
    });
    var post = (function() {
      var xhr = XMLHttpRequest ? new XMLHttpRequest() : new ActiveXObject();
      xhr.open('post', $__0.postURL);
      console.log('post url: ' + $__0.postURL);
      xhr.setRequestHeader('Content-Type', 'application/json;charset=UTF-8');
      xhr.onreadystatechange = (function() {
        if (xhr.readyState === 4 && xhr.status === 200) {
          alert(xhr.responseText);
          $__0.get('http://vhost3.lnu.se:20080/question/1');
        }
        xhr.send(JSON.stringify({answer: 2}));
      });
    });
    domElements.submit.addEventListener('click', post(), false);
  }
  var run = (function() {
    return new Quiz().get('http://vhost3.lnu.se:20080/question/1');
  });
  window.onload = run;
})();

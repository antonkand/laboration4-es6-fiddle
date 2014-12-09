"use strict";
;
(function() {
  'use strict';
  function Quiz() {
    var $__0 = this;
    this.postURL = '';
    this.correctAnswers = 0;
    this.posts = 0;
    var domElements = {
      submit: document.querySelector('#submit'),
      answer: document.querySelector('#answer'),
      questionContainer: document.querySelector('#question-container'),
      correctAnswersContainer: document.querySelector('#correct-answers'),
      errorFlash: document.querySelector('#error-flash')
    };
    var addCorrectAnswer = (function(answer) {
      var li = document.createElement('li');
      var p = document.createElement('p');
      var answerParagraph = document.createElement('p');
      p.innerHTML = '<strong>Fråga ' + $__0.correctAnswers + ': </strong>';
      p.setAttribute('class', 'strong');
      answerParagraph.textContent = answer;
      li.appendChild(p);
      li.appendChild(answerParagraph);
      domElements.correctAnswersContainer.appendChild(li);
    });
    var flashWrongAnswer = (function(answer) {
      domElements.errorFlash.innerHTML = 'Oj! <strong>' + answer + '</strong> är fel svar.';
      domElements.answer.focus();
    });
    var gameOver = (function() {
      var hooray = document.createElement('h3');
      var cheer = document.createElement('p');
      var happyContainer = document.createElement('div');
      happyContainer.setAttribute('class', 'alert alert-success');
      hooray.textContent = 'Grattis! Du klarade det!';
      cheer.textContent = 'Det tog dig ' + $__0.posts + ' försök för att klara ' + $__0.correctAnswers + ' frågor. Inte illa pinkat!';
      happyContainer.appendChild(hooray);
      happyContainer.appendChild(cheer);
      domElements.questionContainer.innerHTML = '';
      domElements.questionContainer.appendChild(happyContainer);
    });
    var updateQuestion = (function(question) {
      var p = document.createElement('p');
      p.textContent = question;
      domElements.questionContainer.innerHTML = '';
      domElements.questionContainer.appendChild(p);
    });
    this.get = (function(url) {
      var xhr = XMLHttpRequest ? new XMLHttpRequest() : new ActiveXObject();
      xhr.open('get', url, false);
      xhr.addEventListener('load', (function() {
        if (xhr.status < 400) {
          $__0.postURL = JSON.parse(xhr.responseText).nextURL;
          updateQuestion(JSON.parse(xhr.responseText).question);
        }
      }));
      xhr.send(null);
    });
    var post = (function(e, answer) {
      e = e || event;
      e.preventDefault();
      var json = JSON.stringify({answer: answer});
      var xhr = XMLHttpRequest ? new XMLHttpRequest() : new ActiveXObject();
      xhr.addEventListener('load', (function() {
        $__0.posts += 1;
        domElements.submit.setAttribute('class', 'btn btn-lg btn-info pull-right');
        domElements.errorFlash.innerHTML = '';
        if (xhr.status < 400) {
          $__0.correctAnswers += 1;
          addCorrectAnswer(answer);
          domElements.answer.value = '';
          domElements.answer.focus();
          JSON.parse(xhr.responseText).nextURL ? $__0.get(JSON.parse(xhr.responseText).nextURL) : gameOver();
        } else {
          domElements.submit.setAttribute('class', 'btn btn-lg btn-danger pull-right');
          flashWrongAnswer(answer);
        }
      }));
      xhr.open('post', $__0.postURL, true);
      xhr.setRequestHeader('Content-Type', 'application/json;charset=UTF-8');
      xhr.send(json);
    });
    domElements.submit.addEventListener('click', (function(e) {
      if (domElements.answer.value) {
        post(e, domElements.answer.value.trim());
      }
    }), false);
  }
  var run = (function() {
    return new Quiz().get('http://vhost3.lnu.se:20080/question/1');
  });
  window.onload = run;
})();

"use strict";
;
(function() {
  'use strict';
  function Quiz() {
    var $__0 = this;
    this.postURL = '';
    this.correctAnswers = [];
    this.posts = 0;
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
          console.log(xhr.responseText);
        }
      }));
      xhr.send(null);
    });
    var flashWrongAnswer = (function(answer) {
      alert(answer + 'är fel svar.');
    });
    var post = (function(e, answer) {
      e = e || event;
      e.preventDefault();
      var json = JSON.stringify({answer: answer});
      var xhr = XMLHttpRequest ? new XMLHttpRequest() : new ActiveXObject();
      xhr.addEventListener('load', (function() {
        $__0.posts += $__0.posts + 1;
        if (xhr.status < 400) {
          console.log(JSON.parse(xhr.responseText).nextURL);
          $__0.get(JSON.parse(xhr.responseText).nextURL);
        } else {
          console.log('post: unsuccessful post. status code ' + xhr.status);
          domElements.submit.setAttribute('class', 'btn btn-lg btn-danger pull-right');
          flashWrongAnswer(answer);
        }
      }));
      xhr.open('post', $__0.postURL, true);
      xhr.setRequestHeader('Content-Type', 'application/json;charset=UTF-8');
      xhr.send(json);
    });
    domElements.submit.addEventListener('click', function(e) {
      return post(e, domElements.answer.value);
    }, false);
  }
  var run = (function() {
    return new Quiz().get('http://vhost3.lnu.se:20080/question/1');
  });
  window.onload = run;
})();

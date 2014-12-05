"use strict";
;
(function() {
  'use strict';
  function Quiz() {
    var $__0 = this;
    this.getURL = '';
    this.postURL = '';
    this.correctAnswers = [];
    this.updateQuestion = (function(question) {
      var addCorrectAnswerToDOM = (function(answer) {
        $__0.correctAnswers.push(answer);
        var correctAnswersContainer = document.querySelector('#correct-answers');
        var li = document.createElement('li');
        var p = document.createElement('p');
        p.textContent = answer;
        li.appendChild(p);
        correctAnswersContainer.appendChild(li);
      });
      var questionContainer = document.querySelector('#question-container');
      var p = questionContainer.firstChild;
      if (p.textContent) {
        addCorrectAnswerToDOM(p.textContent);
      }
      p.textContent = question;
    });
    this.post = (function(url, answer) {
      console.log('Quiz.post(url):\n' + url);
      $__0.getURL = answer;
    });
    this.get = (function(url) {
      console.log('Quiz.get(url):\n' + url);
      var xhr = XMLHttpRequest ? new XMLHttpRequest() : new ActiveXObject();
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
      $__0.post('postURL', '42');
    });
  }
  var run = (function() {
    return new Quiz().get('http://vhost3.lnu.se:20080/question/1');
  });
  window.onload = run;
})();

(function () {
  'use strict';

  var numFactBtn = document.getElementById("numFactBtn");
  var numFactArea = document.getElementById("numFactArea");

  function getNumFact() {
    var xhr = new XMLHttpRequest();
    var randomNum = Math.floor((Math.random() * 200) + 2);

    xhr.onload = function () {
      if (xhr.status == 200) {
        numFactArea.innerHTML = xhr.response;
      }
    };

    xhr.open("GET", 'http://numbersapi.com/' + randomNum);
    xhr.send();

  }

  document.addEventListener("DOMContentLoaded", getNumFact);

  numFactBtn.addEventListener("click", getNumFact);



  // Dynamically load views (html)

  function renderPartials() {

    var hash = location.hash.split('#')[1];

    var contentarea = document.getElementById('main-content-area');

    var xhr = new XMLHttpRequest();

    xhr.open('GET', '../html/' + hash + '.html');

    xhr.onload = function() {
      if (xhr.status === 200) {
        contentarea.innerHTML = xhr.response;
      }
    }

    xhr.send();

  }

  var navLinks = [].slice.call(document.querySelectorAll('.nav__primaryNav a'));

  window.addEventListener('hashchange', renderPartials);
  window.addEventListener('DOMContentLoaded', renderPartials);

}());
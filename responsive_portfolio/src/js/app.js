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

}());
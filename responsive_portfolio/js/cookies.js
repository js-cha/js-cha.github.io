(function() {
  'use strict';

  var cookie_jar = [];

  function extractCookies(cookie) {
    var cookieValues = cookie.split(';');
    cookieValues.forEach(function(currentItem, index, array) {
      var obj = {};
      var nameValue = currentItem.split('=');
      obj[nameValue[0]] = nameValue[1];
      cookie_jar.push(obj);
    });
  }

  function checkVisitor(item) {
    for (var x in item) {
      return x == "visited" && item[x] == "true";
    }
  }

  document.addEventListener("DOMContentLoaded", function(event) {
    var cookies = document.cookie;

    extractCookies(cookies);

    if (cookie_jar.filter(checkVisitor) == false) {
      document.cookie = "visited=true";
      console.log("welcome");
    } else if (cookie_jar.filter(checkVisitor) == true) {
      console.log("welcome back");
    }
  });

}());
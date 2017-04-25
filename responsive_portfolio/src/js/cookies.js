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
    var message = document.getElementById("personal_message");

    extractCookies(cookies);

    if (cookie_jar.filter(checkVisitor).length === 0) {
      document.cookie = "visited=true";
      message.innerHTML = "You have landed on my portfolio, please feel free to browse. And I almost forgot, don't forget to offer me a six figure salary if you like what you see here";

    } else if (cookie_jar.filter(checkVisitor).length >= 1) {
      console.log("welcome back");
      message.innerHTML = "I see you have returned, I hope your stay is delightful as the first";
    }
  });

}());
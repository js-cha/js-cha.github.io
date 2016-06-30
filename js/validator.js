(function(window){

  var validator = {};

  validator.isEmailAddress = function(input){
    var atSymbol = input.indexOf("@");
    var firstPart = input.substr(0, atSymbol);
    var lastPart = input.substr(atSymbol + 1);
    if (validator.isEmpty(lastPart) == true){
      return false;
    }
    return (atSymbol > 0 && typeof firstPart && typeof lastPart == "string");
  };

  validator.isPhoneNumber = function(input){
    var firstDigit = input[0];
    var secondDigit = input[1];
    var phoneLength = 10;
    return ((firstDigit == "0") && (secondDigit >= "2" && secondDigit <= "8") && (input.length == phoneLength));
  };

  validator.withoutSymbols = function(input){
    var result = "";
    for (i=0; i < input.length; i++){
      if ((input.charCodeAt(i) >= 48 && input.charCodeAt(i) <= 57) ||
        (input.charCodeAt(i) >= 65 && input.charCodeAt(i) <= 90) ||
        (input.charCodeAt(i) >= 97 && input.charCodeAt(i) <= 122) ||
        (input.charCodeAt(i) == 32)){
        result += input[i];
      } else {
        continue;
      }
    }
    return result;
  };

  validator.isDate = function(input){
    var date = new Date(input).getTime();
    return isNaN(date) == false;
  };

  validator.isBeforeDate = function(input, reference){
    var inputDate = new Date(input).getTime();
    var referenceDate = new Date(reference).getTime();
    try {
      if (isNaN(inputDate) || isNaN(referenceDate) == true){
        throw "Invalid date format";
      } else {
        return inputDate > referenceDate;
      }
    }
    catch(error){
      console.log("The following error occured: " + error);
    }
  };

  validator.isAfterDate = function(input, reference){
    var inputDate = new Date(input).getTime();
    var referenceDate = new Date(reference).getTime();
    try {
      if (isNaN(inputDate) || isNaN(referenceDate) == true){
        throw "Invalid date format";
      } else {
        return inputDate < referenceDate;
      }
    }
    catch(error){
      console.log("The following error occured: " + error);
    }
  };

  validator.isBeforeToday = function(input){
    var inputDate = new Date(input).getTime();
    var today = new Date().getTime();
    try {
      if (isNaN(inputDate) == true){
        throw "Invalid date format";
      } else {
        return inputDate < today;
      }
    }
    catch(error){
      console.log("The following error occured: " + error);
    }
  };

  validator.isAfterToday = function(input){
    var inputDate = new Date(input).getTime();
    var today = new Date().getTime();
    try {
      if (isNaN(inputDate) == true){
        throw "Invalid date format";
      } else {
        return inputDate > today;
      }
    }
    catch(error){
      console.log("The following error occured: " + error);
    }
  };

  validator.isEmpty = function(input){
    var emptySpaces = true;
    if (typeof input !== "string"){
      return false;
    } else if (input.length > 0){
        for (i=0; i < input.length; i++){
          if (input.charCodeAt(i) !== 32){
            emptySpaces = false;
            break;
          }
        }
    }
    return input.length == 0 || emptySpaces == true;
  };

  validator.contains = function(input, words){
    var arr;
    var j = 0;
    var result = false;
    var filteredInput = "";
    for (i=0; i < input.length; i++){
      if((input.charCodeAt(i) >= 48 && input.charCodeAt(i) <= 57) ||
        (input.charCodeAt(i) >= 65 && input.charCodeAt(i) <= 90) ||
        (input.charCodeAt(i) >= 97 && input.charCodeAt(i) <= 122) ||
        (input.charCodeAt(i) == 32)){
        filteredInput += input[i];
      } else if (input.charCodeAt(i) == 45 || input.charCodeAt(i) == 95 ||
        input.charCodeAt(i) == 150 || input.charCodeAt(i) == 151 || input.charCodeAt(i) == 47){
        filteredInput += " ";
      }
    }
    arr = filteredInput.toLowerCase().split(" ");
    while (j < words.length){
      for (i=0; i < arr.length; i++){
        if (arr[i] == words[j]){
          result = true;
          break;
        }
      }
      j++
    }
    return result;
  };

  validator.lacks = function(input, words){
    var arr;
    var j = 0;
    var result = false;
    var filteredInput = "";
    for (i=0; i < input.length; i++){
      if((input.charCodeAt(i) >= 48 && input.charCodeAt(i) <= 57) ||
        (input.charCodeAt(i) >= 65 && input.charCodeAt(i) <= 90) ||
        (input.charCodeAt(i) >= 97 && input.charCodeAt(i) <= 122) ||
        (input.charCodeAt(i) == 32)){
        filteredInput += input[i];
      } else if (input.charCodeAt(i) == 45 || input.charCodeAt(i) == 95 ||
        input.charCodeAt(i) == 150 || input.charCodeAt(i) == 151 || input.charCodeAt(i) == 47){
        filteredInput += " ";
      }
    }
    arr = filteredInput.toLowerCase().split(" ");
    while (j < words.length){
      for (i=0; i < arr.length; i++){
        if (arr[i] !== words[j]){
          result = true;
        } else {
          return false;
        }
      }
      j++
    }
    return result;
  };

  validator.isComposedOf = function(input, strings){
    var i = 0;
    var result = validator.withoutSymbols(input);
    var stringsArr = strings.sort(function(a, b){
      return b.length - a.length;
    });
    while (i < input.length){
      for (j=0; j < stringsArr.length; j++){
        if (input.substr(i, stringsArr[j].length) == stringsArr[j]){
          result = result.replace(input.substr(i, stringsArr[j].length), "");
        }
      }
      i++;
    }
    return validator.isEmpty(result);
  };

  validator.isLength = function(input, n){
    return input.length <= n;
  };

  validator.isOfLength = function(input, n){
    return input.length >= n;
  };

  validator.countWords = function(input){
    var arr;
    var filteredInput = "";
    for (i=0; i < input.length; i++){
      if((input.charCodeAt(i) >= 48 && input.charCodeAt(i) <= 57) ||
        (input.charCodeAt(i) >= 65 && input.charCodeAt(i) <= 90) ||
        (input.charCodeAt(i) >= 97 && input.charCodeAt(i) <= 122) ||
        (input.charCodeAt(i) == 32)){
        filteredInput += input[i];
      } else if (input.charCodeAt(i) == 45 || input.charCodeAt(i) == 95 ||
        input.charCodeAt(i) == 150 || input.charCodeAt(i) == 151 || input.charCodeAt(i) == 47){
        filteredInput += " ";
      }
    }
    arr = filteredInput.toLowerCase().split(" ");
    if (validator.isEmpty(arr[0])){
      return 0;
    } else {
      return arr.length;
    }
  };

  validator.lessWordsThan = function(input, n){
    return validator.countWords(input) <= n;
  };

  validator.moreWordsThan = function(input, n){
    return validator.countWords(input) >= n;
  };

  validator.isBetween = function(input, floor, ceil){
    return input >= floor && input <= ceil;
  };

  validator.isAlphaNumeric = function(input){
    for (i=0; i < input.length; i++){
      if(!((input.charCodeAt(i) >= 48 && input.charCodeAt(i) <= 57) ||
        (input.charCodeAt(i) >= 65 && input.charCodeAt(i) <= 90) ||
        (input.charCodeAt(i) >= 97 && input.charCodeAt(i) <= 122))) {
        return false;
        break;
      }
    }
    return true;
  };

  validator.isCreditCard = function(input){
    var filteredInput = "";
    for (i=0; i < input.length; i++){
      if (input.charCodeAt(i) == 45){
        filteredInput += "";
      } else {
        filteredInput += input[i];
      }
    }
    return validator.isBetween(filteredInput.length, 16, 19) == true && validator.isAlphaNumeric(filteredInput) == true;
  };

  validator.isHex = function(input){
    var result = input.toUpperCase();
    if (result.charCodeAt(0) !== 35){
      return false;
    }
    for (i=1; i < result.length; i++){
      if (!((result.charCodeAt(i) >= 48 && result.charCodeAt(i) <= 57) ||
        (result.charCodeAt(i) >= 65 && result.charCodeAt(i) <= 70))){
        return false;
      }
    }
    return result.length == 7 || result.length == 4;
  };

  validator.isRGB = function(input){
    var rgb = [];
    var num = 0;
    var lastChar = input.length - 1;
    var values = input.slice(4, lastChar);
    if (input.substr(0, 4) !== "rgb(" || input[lastChar] !== ")"){
      return false;
    }
    for (i=0; i < values.length; i++){
      if (values.charCodeAt(i) == 32){
        values = values.replace(values[i], "");
      } else if (values.indexOf(",") < 0){
        return false;
      }
    }
    rgb = values.split(",");
    for (i=0; i < rgb.length; i++){
      if (!(rgb[i] <= 255 && rgb[i] >= 0)){
        return false;
      }
    }
    return rgb.length == 3;
  };

  validator.isHSL = function(input){
    var hsl = [];
    var num = 0;
    var lastChar = input.length - 1;
    var values = input.slice(4, lastChar);
    if (input.substr(0, 4) !== "hsl(" || input[lastChar] !== ")"){
      return false;
    }
    for (i=0; i < values.length; i++){
      if (values.charCodeAt(i) == 32){
        values = values.replace(values[i], "");
      } else if (values.indexOf(",") < 0){
        return false;
      }
    }
    hsl = values.split(",");
    return hsl.length == 3 && validator.isBetween(hsl[0], 0, 360) && validator.isBetween(hsl[1], 0, 1) && validator.isBetween(hsl[2], 0, 1);
  };

  validator.isColor = function(input){
    return validator.isHex(input) || validator.isRGB(input) || validator.isHSL(input);
  };

  validator.isTrimmed = function(input){
    var lastChar = input.length - 1;
    for (i=0; i < input.length; i++){
      if (input.charCodeAt(0) == 32 || input.charCodeAt(lastChar) == 32){
        return false;
      } else if (input.charCodeAt(i) == 32 && input.charCodeAt(i+1) == 32){
        return false;
      }
    }
    return true;
  };

  window.validator = validator;
})(window);
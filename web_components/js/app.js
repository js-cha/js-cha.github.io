function validate1(){
  var form1 = document.querySelector('.f1-form'),
      fname = document.querySelector('.fname'),
      lname = document.querySelector('.lname'),
      email = document.querySelector('.email'),
      password = document.querySelector('.password'),
      dob = document.querySelector('.dob'),
      array = [fname, lname, email, password];

  form1.addEventListener("submit", function(event){
    event.preventDefault();
    var i = 0,
        isEmpty,
        isEmail = validator.isEmailAddress(email.value),
        isCorrectDate = validator.isBeforeToday(dob.value),
        passwordLength = validator.isBetween(password.value.length, 6, 8);

    while (i < array.length){
      if (validator.isTrimmed(array[i].value) == false || validator.isEmpty(array[i].value) == true || validator.isOfLength(array[i].value, 2) == false){
        isEmpty = true;
        break;
      } else {
        isEmpty = false;
      }
      i++
    }

    if (isEmpty == false && (isEmail && passwordLength && isCorrectDate) == true){
      form1.className = "f1-form valid";
    } else {
      form1.className = "f1-form invalid";
    }
  });
};

function validate2(){
  var form2 = document.querySelector('.f2-form');
  var search = document.querySelector('.search');

  form2.addEventListener("submit", function(event){
    event.preventDefault();
    if (search.value.length >= 2 && validator.isEmpty(search.value) == false && validator.isTrimmed(search.value) == true){
      form2.className = "f2-form valid";
    } else {
      form2.className = "f2-form invalid";
    }
  });
};

function validate3(){
  var form3 = document.querySelector('.f3-form');
  var radios = document.querySelectorAll('.f3-radio');
  var other = document.querySelector('.f3-write');
  var checked;

  form3.addEventListener("submit", function(event){
    event.preventDefault();
    for (i=0; i < radios.length; i++){
      if (radios[i].checked){
        form3.className = "f3-form valid";
        checked = radios[i];
        break;
      } else {
        form3.className = "f3-form invalid";
      }
    };

    if (checked.value == "other" && validator.isEmpty(other.value) == true){
      form3.className = "f3-form invalid";
    }
  });
};

function validate4(){
  var form4 = document.querySelector('.f4-form'),
      username = document.querySelector('.username'),
      password = document.querySelector('.password'),
      array = [username, password],
      i = 0;

  form4.addEventListener("submit", function(event){
    event.preventDefault();
    while (i < array.length){
      if (validator.isTrimmed(array[i].value) == false || validator.isEmpty(array[i].value) == true || validator.isOfLength(array[i].value, 2) == false){
        form4.className = "f4-form invalid";
        break;
      } else {
        form4.className = "f4-form valid";
      }
      i++
    }
  });
};

function validate6(){
  var form6 = document.querySelector('.f6-form'),
      billing = document.querySelector('.billing'),
      inputs = billing.querySelectorAll('.f6-write'),
      shipping = document.querySelector('.shipping'),
      inputs_2 = shipping.querySelectorAll('.f6-write'),
      checkbox = document.querySelector('.f6-check');

  form6.addEventListener("submit", function(event){
    event.preventDefault();
    for (i=0; i < inputs.length; i++){
      if (validator.isEmpty(inputs[i].value) == true || validator.isTrimmed(inputs[i].value) == false || inputs[i].value.length < 2 == true){
        form6.className = "f6-form invalid";
        break;
      } else {
        form6.className = "f6-form valid";
      }
    }

    if (checkbox.checked){
      var i = 0;
      while (i < inputs.length){
        inputs_2[i].value = inputs[i].value;
        i++
      }
    }
  });
};

function validate7(){
  var form7 = document.querySelector('.f7-form'),
      contactno = document.querySelector('.contactno'),
      message = document.querySelector('.f7-message'),
      email = document.querySelector('.email'),
      date = document.querySelector('.date'),
      array = [email, message];

  form7.addEventListener("submit", function(event){
    event.preventDefault();
    var isNumber = !isNaN(contactno.value) && validator.isTrimmed(contactno) && validator.isOfLength(contactno.value, 2) == true,
        isEmail = validator.isEmailAddress(email.value),
        isAfterToday = validator.isAfterToday(date.value),
        isEmpty = false,
        i = 0;

    while (i < array.length){
      if (validator.isEmpty(array[i].value) == true || validator.isTrimmed(array[i].value) == false || validator.isOfLength(array[i].value, 2) == false){
        isEmpty = false;
        break;
      } else {
        isEmpty = true;
      }
      i++
    }

    if (isEmpty && isNumber && isAfterToday && isEmail){
      form7.className = "f7-form valid";
    } else {
      form7.className = "f7-form invalid";
    }
  });
};

function validate8(){
  var form8 = document.querySelector('.f8-form'),
      fullname = document.querySelector('.fullname'),
      creditcard = document.querySelector('.cardno'),
      csv = document.querySelector('.csv'),
      month = document.querySelector('.month'),
      year = document.querySelector('.year'),
      array = [fullname, creditcard, csv],
      i = 0;

  form8.addEventListener("submit", function(event){
    event.preventDefault();
    var isCreditCard = validator.isCreditCard(creditcard.value),
        isFullName = validator.moreWordsThan(fullname.value, 2),
        isCSV = validator.isEmpty(csv.value.toString()) == false,
        isExpiry = month.value !== "none" && year.value !== "none",
        isTrimmed = true;

    while (i < array.length){
      if (validator.isTrimmed(array[i].value.toString()) == false){
        isTrimmed = false;
        break;
      } else {
        isTrimmed = true;
      }
      i++
    }

    if (isCreditCard && isFullName && isCSV && isExpiry && isTrimmed){
      form8.className = "f8-form valid";
    } else {
      form8.className = "f8-form invalid";
    }
  });
};
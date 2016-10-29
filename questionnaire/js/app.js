(function(){

  var questionnaireData = {
    fullName: "",
    emailAddress: "",
    questions: [[], [], [], []],
    print: function(){
      for (i=0; i < this.questions.length; i++){
        for (var prop in this.questions[i]){
          console.log(this.questions[i][prop]);
        }
      }
    }
  };

  var allSections = document.querySelectorAll('.questionnaire-card');
  var sectionOne = allSections[0];
  var sectionTwo = allSections[1];
  // Skipping section three because it's disabled.
  var sectionFour = allSections[3];
  var sectionFive = allSections[4];

  var sectionOneQuestions = Array.prototype.slice.call(sectionOne.querySelectorAll('.question'));
  var sectionTwoQuestions = Array.prototype.slice.call(sectionTwo.querySelectorAll('.question'));
  var sectionFourQuestions = Array.prototype.slice.call(sectionFour.querySelectorAll('.question'));
  var sectionFiveQuestions = Array.prototype.slice.call(sectionFive.querySelectorAll('.question'));

  var allAnswers = document.querySelectorAll('.user-answer');
  var sectionOneAnswers = Array.prototype.slice.call(sectionOne.querySelectorAll('.user-answer'));
  var sectionTwoAnswers = Array.prototype.slice.call(sectionTwo.querySelectorAll('.user-answer'));
  var sectionFourAnswers = Array.prototype.slice.call(sectionFour.querySelectorAll('.user-answer'));

  var sectionOneBtn = document.getElementById("sectionOneBtn");
  var sectionTwoBtn = document.getElementById("sectionTwoBtn");
  var sectionFourBtn = document.getElementById("sectionFourBtn");
  var submitBtn = document.getElementById("submitBtn");

  function pushToObjectArray(section, number){
    section.forEach(function(item, index, array){
      var questionKey = item.innerHTML;
      var questionObject = {};
      questionObject["question"] = questionKey;
      questionnaireData.questions[number].push(questionObject);
    });
  }

  function checkAnswers(answers, pos){
    var result = true;
    answers.forEach(function(item, index, array){
      if (utils.countWords(item.value) == 0){
        answers[index].classList.add('invalid');
        result = false;
      } else {
        answers[index].classList.remove('invalid');
        questionnaireData.questions[pos][index].answer = answers[index].value;
      }
    });
    return result;
  };

  function isChecked(nodeList, error, pos, num){
    var result = false;
    var thisValue;
    for (i=0; i < nodeList.length; i++){
      if (nodeList[i].checked == true){
        thisValue = nodeList[i];
        error.innerHTML = "";
        result = true;
        questionnaireData.questions[pos][num].answer = thisValue.value;
        break;
      } else {
        error.innerHTML = "Please select an option below";
      }
    }
    return result;
  };

  pushToObjectArray(sectionOneQuestions, 0);
  pushToObjectArray(sectionTwoQuestions, 1);
  pushToObjectArray(sectionFourQuestions, 2);
  pushToObjectArray(sectionFiveQuestions, 3);

  function validateSectionOne(){
    var email = document.getElementById("email");
    var name = document.getElementById("name");
    if (utils.lessWordsThan(name.value, 1)){
      name.setCustomValidity("Please enter your first and last names");
      hName.innerHTML = name.validationMessage;
    } else {
      name.setCustomValidity("");
      hName.innerHTML = name.validationMessage;
    }
    if (!utils.isEmailAddress(email.value)){
      email.setCustomValidity("Invalid Email address. Please enter a valid email address e.g. user@domain.com");
      hEmail.innerHTML = email.validationMessage;
    } else {
      email.setCustomValidity("");
      hEmail.innerHTML = email.validationMessage;
    }
    return checkAnswers(sectionOneAnswers, 0);
  };

  function validateSectionTwo(){
    return checkAnswers(sectionTwoAnswers, 1);
  };

  function validateSectionFour(){
    return checkAnswers(sectionFourAnswers, 2);
  };

  function validateSectionFive(){
    var selectMenu = document.querySelector('.dropdown');
    var radioInputs = document.querySelectorAll('input[type="radio"]');
    var checkBoxInputs = document.querySelectorAll('input[type="checkbox"]');
    var hCheckbox = document.getElementById("hCheckbox");
    var hRadio = document.getElementById("hRadio");
    var hMenu = document.getElementById('hMenu');
    var result = false;
    isChecked(radioInputs, hRadio, 3, 0);
    isChecked(checkBoxInputs, hCheckbox, 3, 1);

    if (selectMenu.value == "blank"){
      selectMenu.setCustomValidity("Please select an option from the above menu");
      hMenu.innerHTML = selectMenu.validationMessage;
    } else {
      selectMenu.setCustomValidity("");
      hMenu.innerHTML = selectMenu.validationMessage;
      questionnaireData.questions[3][2].answer = selectMenu.value;
      result = true;
    }
    return isChecked(radioInputs, hRadio, 3, 0) && isChecked(checkBoxInputs, hCheckbox, 3, 1) && result;
  };

  sectionOneBtn.addEventListener('click', function(event){
    event.preventDefault();
    if (validateSectionOne()){
      sectionOne.classList.add('validated');
      sectionTwo.scrollIntoView();
    }
  });

  sectionTwoBtn.addEventListener('click', function(event){
    event.preventDefault();
    if (validateSectionTwo()){
      sectionTwo.classList.add('validated');
      sectionFour.scrollIntoView();
    }
  });

  sectionFourBtn.addEventListener('click', function(event){
    event.preventDefault();
    if (validateSectionFour()){
      sectionFour.classList.add('validated');
      sectionFive.scrollIntoView();
    }
  });

  submitBtn.addEventListener('click', function(event){
    event.preventDefault();
    if (validateSectionFive()){
      sectionFive.classList.add('validated');
    }
    var array = [sectionFive, sectionFour, sectionTwo, sectionOne];
    for (i=0; i < array.length; i++){
      if (!array[i].classList.contains("validated")){
        array[i].scrollIntoView();
      } else {
        questionnaireData.print();
      }
    }
  });

})();
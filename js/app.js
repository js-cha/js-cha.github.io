var form1 = document.querySelector('.f1-form');
var email = document.querySelector('.email');
var fname = document.querySelector('.fname');
var lname = document.querySelector('.lname');
var array = [email, fname];

email.addEventListener("change", function(event){
  if (validator.isEmailAddress(email.value) == false){
    email.setCustomValidity("Please enter a valid email address, or else...");
    event.preventDefault();
  } else {
    email.setCustomValidity("");
  }
});

form1.addEventListener("submit", function(event){
  // if (fname.value.length < 2){
  //   fname.setCustomValidity("Please enter two or more characters");
  //   event.preventDefault();
  // } else {
  //   fname.setCustomValidity("");
  // }
  // if (email.value.length < 2){
  //   email.setCustomValidity("Please enter two or more characters");
  //   event.preventDefault();
  // } else {
  //   email.setCustomValidity("");
  // }
  for (i=0; i < array.length; i++){
    if (array[i].value.length < 2){
      array[i].setCustomValidity("Please enter two or more characters");
      event.preventDefault();
    } else {
      array[i].setCustomValidity("");
    }
  }
});
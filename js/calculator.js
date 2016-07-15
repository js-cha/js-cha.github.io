function calculate(){
  var numOps =  Array.prototype.slice.call(document.querySelectorAll('.num, .operation')),
      clear = document.querySelector('.clear'),
      del = document.querySelector('.del'),
      screen = document.querySelector('.screen'),
      equals = document.querySelector('.equals');

  numOps.forEach(function(item, index, arr){
    item.onclick = function(){
      screen.value += this.firstChild.firstChild.nodeValue;
    };
  });

  equals.addEventListener("click", function(event){
    var result = eval(screen.value);
    screen.value = result;
  });

  clear.addEventListener("click", function(event){
    screen.value = "";
  });

  del.addEventListener("click", function(event){
    screen.value = screen.value.slice(0, screen.value.length - 1);
  });
};
var puzzleContainer = document.getElementById('puzzle_container');
var puzzlePieceContainer = document.getElementById('pieces_container');
var pieceContainers = document.querySelectorAll('.square');
var pieceContainersArray = [].slice.call(pieceContainers);
var hintBtn = document.getElementById("hints");
var hintCount = document.getElementById("hintCount");
var levelMode = document.querySelector('.levelMode');
var levelEdit = document.querySelector('.levelEdit');

var settings = {
  "user_difficulty": "easy",
  "easy": {
    "duration": 300,
    "hints": 3,
    "checkHintCount": function() {
      if (this.hints <= 0) {
        hintBtn.setAttribute("disabled", "");
        puzzleContainer.classList.remove("reveal_puzzle");
      }
    }
  },
  "hard": {
    "hints": 0,
    "duration": 180,
    "disableHintBtn": function() {
      hintBtn.setAttribute("disabled", "");
    }
  }
};

function swapElements(n1, n2) {
  var node1 = document.getElementById(n1);
  var node2 = document.getElementById(n2);

  var range1 = document.createRange();
  var range2 = document.createRange();

  range1.setStartBefore(node1);
  range1.setEndAfter(node1);

  range2.setStartBefore(node2);
  range2.setEndAfter(node2);

  try {
    range1.insertNode(node2);
    range2.insertNode(node1);
    return true;
  } catch (err) {
    return false;
  }
}

function dragStart(event) {
  event.dataTransfer.setData('text/plain', event.target.id);
}

function dropEnd(event) {
  event.preventDefault();
  var imageId = event.dataTransfer.getData("text");

  if (event.target.tagName == "IMG") {
    swapElements(imageId, event.target.id);
  } else {
    event.target.appendChild(document.getElementById(imageId));
  }
}

function dragOver(event) {
  event.preventDefault();
  event.dataTransfer.dropEffect = "move";
}

function startPuzzle(event) {
  var selectedSettings = settings.user_difficulty;
  var getAllPieces = document.querySelectorAll('.square img');
  var piecesArray = [].slice.call(getAllPieces);

  // move all pieces from board to puzzle pieces container
  piecesArray.forEach(function(currentValue, index, array) {
    puzzlePieceContainer.appendChild(currentValue);
  });

  // start countdown
  countdown(settings[selectedSettings].duration);

  levelEdit.removeAttribute("onclick");
  levelEdit.classList.add("levelEdit--disabled")

  event.target.setAttribute("disabled", "");
}

function resetHard() {
  location.reload();
}

function countdown(duration) {
  var timer = duration;
  var minutes;
  var seconds;

  function startCountDown() {
    if (timer <= 0) {
      clearInterval(countdownInterval);
      resetHard();
    } else if (checkAllPiecesInPlace()) {
      if (checkPuzzleComplete()) {
        clearInterval(countdownInterval);
        addAnimStyles();
      }
    }
    minutes = parseInt(timer / 60, 10);
    seconds = parseInt(timer % 60, 10);
    seconds = seconds < 10 ? "0" + seconds : seconds;
    document.getElementById("timer").innerHTML = minutes + ":" + seconds;
    --timer;
  };
  startCountDown();
  var countdownInterval = setInterval(startCountDown, 1000);
}

function toggleHint(event, type) {
  var solvedImage = document.querySelector('.hintOverlay');

  if (type == "show") {
    solvedImage.classList.add('reveal');
    hintManagement("reduceCount");
  } else if (type == "hide") {
    hintManagement("checkHintCount");
    solvedImage.classList.remove('reveal');
  }
}

function hintManagement(manage) {
  if (manage == "reduceCount") {
    settings.easy.hints = settings.easy["hints"] - 1;
    hintCount.innerHTML = Number(hintCount.innerHTML) - 1;
  } else if (manage == "checkHintCount") {
    settings.easy.checkHintCount();
  }
}

function changeMode() {
  if (settings.user_difficulty == "hard") {
    settings.user_difficulty = "easy";
    hintBtn.removeAttribute("disabled");

    timer.innerHTML = settings.easy.duration / 60 + ":" + "00";
    levelMode.innerHTML = "Easy"
    levelEdit.innerHTML = "(Click here to change to Hard)";
    hintCount.innerHTML = settings.easy.hints;

  } else if (settings.user_difficulty == "easy") {
    settings.user_difficulty = "hard";
    settings.hard.disableHintBtn();

    timer.innerHTML = settings.hard.duration / 60 + ":" + "00";
    levelMode.innerHTML = "Hard"
    levelEdit.innerHTML = "(Click here to change to Easy)";
    hintCount.innerHTML = settings.hard.hints;
  }
}

function checkPieceEmpty(currentValue, index, array) {
  return currentValue.firstElementChild;
}

function checkPieceMatch(currentValue, index, array) {
  return currentValue.getAttribute("data-piece-no") == currentValue.firstElementChild.id;
}

function checkAllPiecesInPlace() {
  return pieceContainersArray.every(checkPieceEmpty);
}

function checkPuzzleComplete() {
  return pieceContainersArray.every(checkPieceMatch);
}

function addAnimStyles() {
  var sheet = document.createElement('style');
  sheet.innerHTML = ".square img {-webkit-animation: spin 3s linear 0s 2 alternate; -moz-animation: spin 3s linear 0s 2 alternate; -ms-animation: spin 3s linear 0s 2 alternate; -o-animation: spin 3s linear 0s 2 alternate; animation: spin 3s linear 0s 2 alternate;}";
  document.body.appendChild(sheet);
}

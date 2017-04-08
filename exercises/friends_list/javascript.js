(function() {
  'use strict';

  if ('indexedDB' in window) {

    var request = window.indexedDB.open('my_db', 1);
    var friendsList = document.getElementById("friends_list");

    request.onupgradeneeded = function (event) {
      var db = event.target.result;
      var objectStore = db.createObjectStore('friends', {autoIncrement: true});

      objectStore.createIndex('name', 'name');

      objectStore.transaction.oncomplete = function(event) {
        var transaction = db.transaction('friends', 'readwrite');
        var objectStore = transaction.objectStore('friends');
        var friends = [{name: 'John', email: 'john@friends.com', phone: 99241145}, {name: 'Alice', email: 'alice@friends.com', phone: 92494225}, {name: 'Boon', email: 'boon@friends.com', phone: 88520042}, {name: 'Ali', email: 'ali@friends.com', phone: 68534012}, {name: 'Janice', email: 'janice@friends.com', phone: 24567312}];

        friends.forEach(function(currentItem, index, array) {
          objectStore.add(currentItem, currentItem.name);
        });

      }
    }

    request.onsuccess = function(event) {
      var db = event.target.result;
      var transaction = db.transaction('friends', 'readonly');
      var objectStore = transaction.objectStore('friends');

      objectStore.openCursor().onsuccess = function(event) {
        var cursor = event.target.result;
        if (cursor) {
          var friend = document.createElement('div');
          friend.classList.add(cursor.value.name);
          friend.innerHTML =
            "<p>Name:  " + cursor.value.name  + "</p>"
          + "<p>Email: " + "<input type='email' class='email' value='" + cursor.value.email + "'></p>"
          + "<p>Phone: " + "<input type='phone' class='phone' value='" + cursor.value.phone + "'></p>"
          + "<button class='del'>Delete</button>"
          + "<button class='edit'>Save changes</button>"
          + "<hr>";

          friendsList.appendChild(friend);
          cursor.continue();
        }

        var delbuttons = document.querySelectorAll('button.del');
        var delbuttonsArray = [].slice.call(delbuttons);
        var editbuttons = document.querySelectorAll('button.edit');
        var editbuttonsArray = [].slice.call(editbuttons);

        delbuttonsArray.forEach(function(currentItem, index, array) {
          currentItem.addEventListener('click', deleteFriend);
        });

        editbuttonsArray.forEach(function(currentItem, index, array) {
          currentItem.addEventListener('click', editFriend);
        });
      }

    };

    function deleteFriend() {
      var getId = this.parentElement.getAttribute('class');

      var request = window.indexedDB.open('my_db', 1);

      request.onsuccess = function(event) {
        var db = event.target.result;
        var transaction = db.transaction('friends', 'readwrite');
        var objectStore = transaction.objectStore('friends');
        var deleteRequest = objectStore.delete(getId);

        deleteRequest.onsuccess = function(event) {
          var thisFriend = document.querySelector('.' + getId);
          friendsList.removeChild(thisFriend);
        }
      }
    }

    function editFriend() {
      var getId = this.parentElement.getAttribute('class');
      var thisFriend = document.querySelector('.' + getId);
      var emailValue = thisFriend.querySelector('.email').value;
      var phoneValue = thisFriend.querySelector('.phone').value;


      var request = window.indexedDB.open('my_db', 1);

      request.onsuccess = function(event) {
        var db = event.target.result;
        var transaction = db.transaction('friends', 'readwrite');
        var objectStore = transaction.objectStore('friends');
        var objectStoreThisFriend = objectStore.get(getId);

        objectStoreThisFriend.onsuccess = function(event) {
          var data = objectStoreThisFriend.result;

          data.email = emailValue;
          data.phone = phoneValue;

          var updateObjectStore = objectStore.put(data, data.name);

          updateObjectStore.onsuccess = function(event) {
            console.log('success');
          }

        }

      }
    }

  }

}());
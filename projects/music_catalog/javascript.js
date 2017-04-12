(function() {
  'use strict';

  var xhr = new XMLHttpRequest();
  var my_key = "OO6CMFE78S5RKERR";
  var albums_array = [];
  var music_catalog = document.getElementById("music_catalog");

  function getTrackList() {
    var num = 0;

    albums_array.forEach(function(currentItem, index, array) {
      var xhr_tracks = new XMLHttpRequest();

      xhr_tracks.onload = function() {
        var track_data = JSON.parse(xhr_tracks.response);
        var track_list = [];
        for (var i = 0; i < track_data.dataset.length; i++) {
          track_list.push(track_data.dataset[i].track_title);
        }
        num++
        updateObjectStore(currentItem.album_id, track_list, num);
      }

      xhr_tracks.open('GET', 'https://freemusicarchive.org/api/get/tracks.json?api_key=' + my_key + "&album_id=" + currentItem.album_id);
      xhr_tracks.send();
    });
  }

  function updateObjectStore(key, value, index) {
    var indexedDB = window.indexedDB.open('music_db', 1);

    indexedDB.onsuccess = function(event) {
      var db = event.target.result;
      var transaction = db.transaction('albums', 'readwrite');
      var objectStore = transaction.objectStore('albums');
      var getObjectStore = objectStore.get(key);

      getObjectStore.onsuccess = function(event) {
        var data = getObjectStore.result;
        data.track_list = value;
        var update = objectStore.put(data, data.album_id);

        update.onsuccess = function(event) {
          if (index == albums_array.length) {
            displayCatalog();
          }
        }
      }
    }
  }

  function displayCatalog() {
    var indexedDB = window.indexedDB.open('music_db', 1);

    indexedDB.onsuccess = function(event) {
      var db = event.target.result;
      var transaction = db.transaction('albums', 'readwrite');
      var objectStore = transaction.objectStore('albums');

      objectStore.openCursor().onsuccess = function(event) {
        var cursor = event.target.result;
        if (cursor) {
          var album = document.createElement('div');
          var album_info = document.createElement('div');
          var track_list = document.createElement('ol');
          track_list.setAttribute("class", "track_list");
          album.setAttribute("id", cursor.value.album_id);
          album.setAttribute("class", "album");
          album_info.setAttribute("class", "album_info");

          for (var i = 0; i < cursor.value.track_list.length; i++) {
            track_list.innerHTML += "<li>" + cursor.value.track_list[i] + "</li>";
          }

          album.innerHTML =
          "<div class='album_image'>" + "<img src='" + cursor.value.album_image_file + "' >" + "</div>"

          album_info.innerHTML =
          "<div class='artist_name'>" + cursor.value.album_artist + "</div>"
        + "<div class='album_title'>" + cursor.value.album_title + "</div>"


          album_info.appendChild(track_list);
          album.appendChild(album_info);
          music_catalog.appendChild(album);
          cursor.continue();
        }
      }
    }
  }

  function openDB() {
    var indexedDB = window.indexedDB.open('music_db', 1);

    indexedDB.onupgradeneeded = function(event) {
      var db = event.target.result;
      var objectStore = db.createObjectStore('albums');
      objectStore.createIndex('album_id', 'album_id');

      objectStore.transaction.oncomplete = function(event) {
        var transaction = db.transaction('albums', 'readwrite');
        var objectStore = transaction.objectStore('albums');
        albums_array.forEach(function(currentItem, index, array) {
          objectStore.add(currentItem, currentItem.album_id);
        });
      }
    }
    getTrackList();
  }

  if (localStorage.getItem('dataloaded') == null) {
    xhr.onload = function() {
      if (xhr.status === 200) {
        var dataset = JSON.parse(xhr.response).dataset;

        for (var i in dataset) {
          var obj = {
            'album_id': dataset[i].album_id,
            'album_artist': dataset[i].artist_name,
            'album_title': dataset[i].album_title,
            'album_image_file': dataset[i].album_image_file
          }
          albums_array.push(obj);
        }
        openDB();
        localStorage.setItem('dataloaded', 'true');
      }
    }

    xhr.open('GET', 'https://freemusicarchive.org/api/get/albums.json?api_key=' + my_key + "&limit=5");
    xhr.send();

  } else {
    displayCatalog();
  }

}());
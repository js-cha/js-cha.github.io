;(function($) {

  var defaults = {
    // set defaults here
    albumUrl: 'https://jsonplaceholder.typicode.com/albums/',
    photoUrl: 'https://jsonplaceholder.typicode.com/photos/',
    array: [],
    coverImg: [],
    albumCounter: 1,
    photoCounter: 1,
    pagecounter: 1,
    itemsPerPage: 20
  };


  function Photoalbum(element, options) {
    this.config = $.extend({}, defaults, options);
    this.element = element;
    this.element.data('photoalbum', this);
    this.init();
  }

  Photoalbum.prototype.init =  function() {
    this.getAlbums();
    this.getAlbumCovers();
    this.renderAlbums();
  };

  Photoalbum.prototype.options = function(option, val) {
    this.config[option] = val;
  };

  Photoalbum.prototype.getAlbums = function() {
    $('.pre-loader').fadeIn();

    if (defaults.albumCounter < 51) {
      $.ajax({
        url: defaults.albumUrl + defaults.albumCounter,
        type: 'GET',
        success: function (response) {
          defaults.array.push(response);
          Photoalbum.prototype.getAlbums();
        }
      });
      defaults.albumCounter++;
    }
  };

  Photoalbum.prototype.getAlbumCovers = function() {
    if (defaults.photoCounter < 2501) {
      $.ajax({
        url: defaults.photoUrl + defaults.photoCounter,
        type: 'GET',
        success: function (response) {
          defaults.coverImg.push(response);
          Photoalbum.prototype.getAlbumCovers();
        }
      });
      defaults.photoCounter += 50;
    }
  };

  Photoalbum.prototype.renderAlbums = function() {
    $(document).ajaxStop(function() {
      $.each(defaults.array, function(index, value) {
        $('#album-viewer').append('<div class="album" id="alb-' + value.id + '">' + value.title + '</div>');
      });
      paginateAlbums();
      initPagination();
      renderCover();
    });
  };

  function paginateAlbums() {
    var pagination = document.createElement('div');
    $(pagination).attr('class', 'pagination');

    function createPages() {
      var div = document.createElement('div');
      $(div).attr('class', 'page-' + defaults.pagecounter);
      $('#album-viewer').append(div);
    }

    function createPaginations() {
      var pagenum = document.createElement('button');
      $(pagenum).attr('class', 'go-' + defaults.pagecounter);
      $(pagenum).text(defaults.pagecounter);
      $(pagination).append(pagenum);
    }

    function sortAlbums() {
      $.each($('#album-viewer > .album'), function(index, value) {
        if ($('.page-' + defaults.pagecounter).children().length >= 20) {
          defaults.pagecounter++;
          createPages();
          createPaginations();
          $('.page-' + defaults.pagecounter).append(value);
        } else {
          $('.page-' + defaults.pagecounter).append(value);
        }
      });
    }

    createPages();
    createPaginations();
    sortAlbums();

    $('#album-viewer').append(pagination);
  }

  function initPagination() {

    function activatePage(pagenum) {
      $.each($('[class^="page-"'), function(index, value) {
        if ($(value).hasClass('page-' + pagenum)) {
          $(value).removeClass('hidden');
        } else {
          $(value).addClass('hidden');
        }
      });
    }

    $.each($('[class^="page-"]'), function(index, value) {
      if (index !== 0) {
        $(value).addClass('hidden');
      }
    });

    $.each($('[class^="go-"'), function(index, value) {
      $(value).on('click', function() {
        var pagenum = $(this).text();
        activatePage(pagenum);
      });
    });
  }

  function renderCover() {
    $.each(defaults.coverImg, function(index, value) {
      var cover = document.createElement('img');
      $(cover).attr('src', value.thumbnailUrl);
      $('#alb-' + value.albumId).prepend(cover);
    });

    $('.pre-loader').fadeOut();
  }

  $.fn.photoalbum = function (options) {

    var args = $.makeArray(arguments);
    var after = args.slice(1);

    this.each(function () {
      var $el = $(this),
          instance;
      if (instance = $el.data('photoalbum')) {
        if (typeof(options) === 'string' && typeof(instance[options]) == 'function') {
          instance[options].apply(instance, after);
        } else {
          console.warn('photoalbum already initialized on', this, 'and', options, 'is not a valid instance method');
        }
        return;
      }
      new Photoalbum($el, options);
    });
    return this;
  };

})(jQuery);
;(function($) {

  var defaults = {
    // set defaults here
    photoUrl: 'https://jsonplaceholder.typicode.com/photos/',
    photos: [],
    photoCounter: 1
  };


  function Photobox(element, options) {
    this.config = $.extend({}, defaults, options);
    this.element = element;
    this.element.data('photobox', this);
    this.init();
  }

  Photobox.prototype.init =  function() {
    this.getPhotos();
    this.logPhotos();
  }

  Photobox.prototype.options = function(option, val) {
    this.config[option] = val;
  };

  Photobox.prototype.getPhotos = function() {
    if (defaults.photoCounter < 2501) {
      $.ajax({
        url: defaults.photoUrl + defaults.photoCounter,
        type: 'GET',
        success: function (response) {
          defaults.photos.push(response);
          Photobox.prototype.getPhotos();
        }
      });
      defaults.photoCounter+=50;
    }
  };

  Photobox.prototype.logPhotos = function() {
    $(document).ajaxStop(function() {
      $.each(defaults.photos, function(index, value) {
        var photobox = document.createElement('div');
        var img = document.createElement('img');
        $(img).attr('src', value.thumbnailUrl + '.png');
        $(photobox).attr('class', 'photobox');
        $(photobox).addClass('hidden');
        $(photobox).append(img);
        $('#alb-' + value.albumId).append(photobox);
      });

      Photobox.prototype.openPhotos();
    });
  };

  Photobox.prototype.openPhotos = function() {

    function activateModal(id) {
      $.each($('.photobox'), function(index, value) {
        if (value.parentNode.id == id) {
          $(value).removeClass('hidden');
        } else {
          $(value).addClass('hidden');
        }
      });
    }

    $.each($('.album'), function(index, value) {
      $(value).on('click', function() {
        activateModal(value.id);
      });
    });


    $(document).on('click', function(e) {
      if ($(e.target.parentNode).hasClass('album') == false) {
        $.each($('.photobox'), function(index, value) {
          $(value).addClass('hidden');
        });
      }
    });

  };

  $.fn.photobox = function (options) {

    var args = $.makeArray(arguments);
    var after = args.slice(1);

    this.each(function () {
      var $el = $(this),
          instance;
      if (instance = $el.data('photobox')) {
        if (typeof(options) === 'string' && typeof(instance[options]) == 'function') {
          instance[options].apply(instance, after);
        } else {
          console.warn('photobox already initialized on', this, 'and', options, 'is not a valid instance method');
        }
        return;
      }
      new Photobox($el, options);
    });
    return this;
  };

})(jQuery);
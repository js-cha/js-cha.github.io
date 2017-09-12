;(function($) {

  var defaults = {
    // set defaults here
  };

  function PhotoBlog(element, options) {
    this.config = $.extend({}, defaults, options);
    this.element = element;
    this.element.data('photoblog', this);
    this.nodesArray = [];
    this.init();
  }

  PhotoBlog.prototype.init =  function() {
    this.processConfig();
    this.render();
  };

  PhotoBlog.prototype.processConfig = function() {
    var self = this;
    $.each(this.config, function(index, value) {
      self.createMarkup(value);
    });
  };

  PhotoBlog.prototype.createMarkup = function(obj) {
    var src = obj.link,
        alt = obj.alt,
        text = obj.text,
        credit = obj.credit;

    var section = document.createElement('section');
        section.setAttribute('class', 'photo-blog__section');

    var image = document.createElement('img');
        image.setAttribute('class', 'photo-blog__media');
        image.setAttribute('src', src);
        image.setAttribute('alt', alt);

    var description = document.createElement('p');
        description.setAttribute('class', 'photo-blog__text');
        description.innerText = text;

    var author = document.createElement('small');
        author.setAttribute('class', 'photo-blog__media-credit');
        author.innerText = credit;

    section.append(description);
    section.append(image);
    section.append(author);

    this.nodesArray.push(section);
  };

  PhotoBlog.prototype.render = function() {
    var docFrag = document.createDocumentFragment();

    this.nodesArray.forEach(function(value) {
      docFrag.append(value);
    });

    this.element.append(docFrag);
  }

  PhotoBlog.prototype.options = function(option, val) {
    this.config[option] = val;
  };

  $.fn.photoblog = function (options) {
    var args = $.makeArray(arguments);
    var after = args.slice(1);
    this.each(function () {
      var $el = $(this);
      var instance;
      if (instance = $el.data('photoblog')) {
        if (typeof(options) === 'string' && typeof(instance[options]) == 'function') {
          instance[options].apply(instance, after);
        } else {
          console.warn(' already initialized on', this, 'and', options, 'is not a valid instance method');
        }
        return;
      }
      new PhotoBlog($el, options);
    });
    return this;
  };

})(jQuery);
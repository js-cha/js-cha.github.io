function PhotoBlog(title, options) {
  this.element = document.getElementById('photo-blog-component');
  this.title = title;
  this.options = options;
  this.nodesArray = [];
  this.init();
}

function createSection() {
  var section = document.createElement('section');
  section.setAttribute('class', 'photo-blog__section');

  return section;
}

function createImageObject(obj) {
  if (obj.media.src.constructor === Array) {
    var imageContainer = document.createElement('div');
    var images = obj.media.src;
    var cycleButton = document.createElement('button');
    var mainImage = document.createElement('img');
    mainImage.setAttribute('class', 'photo-blog__media');
    mainImage.setAttribute('data-img-pos', '0');
    mainImage.setAttribute('src', images[0]);

    imageContainer.append(mainImage);
    imageContainer.append(cycleButton);
    imageContainer.setAttribute('class', 'img-container');

    cycleButton.innerText = 'Next';

    cycleButton.addEventListener('click', function cycle() {
      var siblingImage = this.previousSibling;
      var currPos = Number(siblingImage.getAttribute('data-img-pos'));

      if (currPos === images.length - 1 ) {
        siblingImage.setAttribute('data-img-pos', '0');
        siblingImage.setAttribute('src', images[Number(0)]);
      } else {
        siblingImage.setAttribute('data-img-pos', Number(currPos + 1));
        siblingImage.setAttribute('src', images[Number(currPos + 1)]);
      }
    });

    return imageContainer;
  } else {
    var image = document.createElement('img');
    image.setAttribute('class', 'photo-blog__media');
    image.setAttribute('src', obj.media.src);
    image.setAttribute('alt', obj.media.alt);
    return image;
  }

}

function createVideoObject(obj) {
  var videoContainer = document.createElement('div');
  videoContainer.setAttribute('class', 'video-container');
  videoContainer.classList.add('play-btn');

  var poster = document.createElement('img');
  poster.setAttribute('src', obj.media.poster);

  videoContainer.append(poster);

  videoContainer.addEventListener('click', function lazyLoad(event) {
    var video = document.createElement('video');
    video.setAttribute('width', '100%');
    video.setAttribute('class', 'photo-blog__media');
    video.setAttribute('src', obj.media.src);
    video.setAttribute('poster', obj.media.poster);
    video.setAttribute('controls', '');
    video.setAttribute('autoplay', '');

    this.innerHTML = '';
    this.append(video);
    this.classList.remove('play-btn');
    this.removeEventListener('click', lazyLoad);
  });

  return videoContainer;
}

function createMediaObject(obj) {
  var media;

  if (obj.media.type === 'img') {
    media = createImageObject(obj);
  } else if (obj.media.type === 'video') {
    media = createVideoObject(obj);
  } else {
    throw 'invalid media type';
    return false;
  }

  return media;
}

function createMediaCredit(obj) {
  var author = document.createElement('small');
  author.setAttribute('class', 'photo-blog__media-credit');
  author.innerText = obj.media.credit;

  return author;
}

function createHeading(string) {
  var heading = document.createElement('h3');
  heading.setAttribute('class', 'photo-blog__heading');
  heading.innerText = string;

  return heading;
}

function createDescription(string) {
  var description = document.createElement('p');
  description.setAttribute('class', 'photo-blog__text');
  description.innerText = string;

  return description;
}

PhotoBlog.prototype.init =  function() {
  this.processConfig();
  this.render();
};

PhotoBlog.prototype.processConfig = function() {
  this.options.forEach(function(value) {
    this.createMarkup(value);
  }.bind(this));
};

PhotoBlog.prototype.createMarkup = function(obj) {
  var media = createMediaObject(obj),
      credit = createMediaCredit(obj),
      desc = createDescription(obj.text),
      section = createSection();

  if (obj.heading) {
    var heading = createHeading(obj.heading);
    section.append(heading);
    section.append(media);
    section.append(credit);
    section.append(desc);
  } else {
    section.append(desc);
    section.append(media);
    section.append(credit);
  }

  this.nodesArray.push(section);
};

PhotoBlog.prototype.render = function() {
  var docFrag = document.createDocumentFragment();

  var mainTitle = document.createElement('h1');
  mainTitle.innerText = this.title;

  this.nodesArray.forEach(function(value) {
    docFrag.append(value);
  });

  this.element.append(mainTitle);
  this.element.append(docFrag);
}

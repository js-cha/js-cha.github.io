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
    var docFrag = document.createDocumentFragment();
    var imageContainer = document.createElement('div');
    var mainImage = document.createElement('img');
    var cycleButton = document.createElement('button');
    var images = obj.media.src;
    var mediaCredit = createMediaCredit(obj.media.src[0].credit);

    mainImage.setAttribute('class', 'photo-blog__media');
    mainImage.setAttribute('data-img-pos', '0');
    mainImage.setAttribute('src', images[0].src);
    mainImage.setAttribute('alt', images[0].alt);

    imageContainer.append(mainImage);
    imageContainer.append(cycleButton);
    imageContainer.setAttribute('class', 'img-container');

    cycleButton.innerText = 'Next';
    cycleButton.addEventListener('click', function cycle() {
      var siblingImage = this.previousSibling;
      var currPos = Number(siblingImage.getAttribute('data-img-pos'));

      if (currPos === images.length - 1 ) {
        siblingImage.setAttribute('data-img-pos', '0');
        siblingImage.setAttribute('src', images[Number(0)].src);
        siblingImage.setAttribute('alt', images[Number(0)].alt);
        mediaCredit.innerText = images[Number(0)].credit
      } else {
        siblingImage.setAttribute('data-img-pos', Number(currPos + 1));
        siblingImage.setAttribute('src', images[Number(currPos + 1)].src);
        siblingImage.setAttribute('alt', images[Number(currPos + 1)].alt);
        mediaCredit.innerText = images[Number(currPos + 1)].credit
      }
    });

    docFrag.appendChild(imageContainer);
    docFrag.appendChild(mediaCredit);

    return docFrag;
  } else {
    var docFrag = document.createDocumentFragment();
    var image = document.createElement('img');
    var mediaCredit = createMediaCredit(obj.media.credit);

    image.setAttribute('class', 'photo-blog__media');
    image.setAttribute('src', obj.media.src);
    image.setAttribute('alt', obj.media.alt);

    docFrag.appendChild(image)
    docFrag.appendChild(mediaCredit)

    return docFrag;
  }

}

function createVideoObject(obj) {
  var docFrag = document.createDocumentFragment();

  var mediaCredit = createMediaCredit(obj.media.credit);

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

  docFrag.appendChild(videoContainer)
  docFrag.appendChild(mediaCredit);

  return docFrag;
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

function createMediaCredit(credit) {
  var author = document.createElement('small');
  author.setAttribute('class', 'photo-blog__media-credit');
  author.innerText = credit;

  return author;
}

function createHeading(str) {
  var heading = document.createElement('h3');
  heading.setAttribute('class', 'photo-blog__heading');
  heading.innerText = str;

  return heading;
}

function createDescription(str) {
  var description = document.createElement('p');
  description.setAttribute('class', 'photo-blog__text');
  description.innerText = str;

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
      desc = createDescription(obj.text),
      section = createSection();

  if (obj.heading) {
    var heading = createHeading(obj.heading);
    section.append(media);
    section.append(heading);
    section.append(desc);
  } else {
    section.append(media);
    section.append(desc);
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

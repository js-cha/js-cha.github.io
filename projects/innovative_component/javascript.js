function PhotoBlog(title, options) {
  this.element = document.getElementById('photo-blog-component');
  this.title = title;
  this.options = options;
  this.nodesArray = [];
  this.init();
}

function setMultiAttrs(element, obj) {
  for (var prop in obj) {
    element.setAttribute(prop, obj[prop]);
  }
}

function generateHTML(tag, klass, inner) {
  var element = document.createElement(tag);
  element.setAttribute('class', klass);
  if (typeof inner !== undefined) {
    element.innerHTML = inner || '';
  }
  return element;
}

function createImageCarousel(obj) {
  var docFrag         = document.createDocumentFragment(),
      mainImage       = document.createElement('img'),
      cycleButton     = document.createElement('button'),
      imageContainer  = generateHTML('div', 'img-container'),
      mediaCredit     = generateHTML('small', 'photo-blog__media-credit', obj.media.src[0].credit);
      images          = obj.media.src,

  setMultiAttrs(mainImage, {
    class: 'photo-blog__media',
    data_img_pos: '0',
    src: images[0].src,
    alt: images[0].alt
  });

  imageContainer.append(mainImage);
  imageContainer.append(cycleButton);

  cycleButton.innerText = 'Next';
  cycleButton.addEventListener('click', function cycle() {
    var siblingImage = this.previousSibling;
    var currPos = Number(siblingImage.getAttribute('data_img_pos'));
    if (currPos === images.length - 1 ) {
      setMultiAttrs(siblingImage, {
        data_img_pos: '0',
        src: images[0].src,
        alt: images[0].alt
      })
      mediaCredit.innerText = images[Number(0)].credit
    } else {
      setMultiAttrs(siblingImage, {
        data_img_pos: Number(currPos + 1),
        src: images[Number(currPos + 1)].src,
        alt: images[Number(currPos + 1)].alt
      })
      mediaCredit.innerText = images[Number(currPos + 1)].credit
    }
  });

  docFrag.appendChild(imageContainer);
  docFrag.appendChild(mediaCredit);
  return docFrag;
}

function createImageObject(obj) {
  if (Array.isArray(obj.media.src)) {
    var carousel = createImageCarousel(obj);
    return carousel;
  } else {
    var docFrag     = document.createDocumentFragment(),
        image       = document.createElement('img'),
        mediaCredit = generateHTML('small', 'photo-blog__media-credit', obj.media.credit);

    setMultiAttrs(image, {
      class: 'photo-blog__media',
      src: obj.media.src,
      alt: obj.media.alt
    });

    docFrag.appendChild(image)
    docFrag.appendChild(mediaCredit)
    return docFrag;
  }
}

function createVideoObject(obj) {
  var docFrag        = document.createDocumentFragment(),
      poster         = document.createElement('img');
      videoContainer = generateHTML('div', 'video-container'),
      mediaCredit    = generateHTML('small', 'photo-blog__media-credit', obj.media.credit),

  poster.setAttribute('src', obj.media.poster);
  videoContainer.classList.add('play-btn');
  videoContainer.append(poster);

  videoContainer.addEventListener('click', function lazyLoad(event) {
    var video = document.createElement('video');
    setMultiAttrs(video, {
      width: '100%',
      class: 'photo-blog__media',
      src: obj.media.src,
      poster: obj.media.poster,
      controls: '',
      autoplay: '',
    });
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


PhotoBlog.prototype.processConfig = function() {
  this.options.forEach(function(value) {
    this.createMarkup(value);
  }.bind(this));
};

PhotoBlog.prototype.createMarkup = function(obj) {
  var media   = createMediaObject(obj),
      desc    = generateHTML('p', 'photo-blog__text', obj.text),
      section = generateHTML('section', 'photo-blog__section');

  if (obj.heading) {
    var heading = generateHTML('h3', 'photo-blog__heading', obj.heading);
    section.append(heading);
    section.append(media);
    section.append(desc);
  } else {
    section.append(media);
    section.append(desc);
  }

  this.nodesArray.push(section);
};

PhotoBlog.prototype.render = function() {
  var docFrag   = document.createDocumentFragment();
  var mainTitle = document.createElement('h1');
  mainTitle.innerText = this.title;
  this.nodesArray.forEach(function(value) {
    docFrag.append(value);
  });
  this.element.append(mainTitle);
  this.element.append(docFrag);
}

PhotoBlog.prototype.nav = function() {
  var componentBCR = this.element.getBoundingClientRect();

  window.addEventListener('load', function() {
    var container = document.querySelector('.photo-blog-container'),
        docFrag   = document.createDocumentFragment(),
        nav       = document.createElement('div'),
        sections  = document.querySelectorAll('.photo-blog__section'),
        sectionCoords = [];

    for (i = 0; i < sections.length; i++) {
      var indicator = document.createElement('div');
      indicator.classList.add('indicator');

      sectionCoords.push({
        start: sections[i].offsetTop,
        end: sections[i].offsetTop + sections[i].offsetHeight - 1,
      });

      nav.classList.add('nav');
      nav.append(indicator);
    }

    docFrag.append(nav);
    container.insertBefore(docFrag, this.element);
    nav.style.top = componentBCR.top + 'px';

    var indicators = [].slice.call(document.querySelectorAll('.indicator'));

    function indicatorClick() {
      indicators.forEach(function(value, index) {
        if (event.target == value) {
          indicators[index].classList.add('active-section');
          sections[index].scrollIntoView();
        } else {
          indicators[index].classList.remove('active-section');
        }
      });
    }

    function indicatorScroll() {
      sectionCoords.forEach(function(value, index, arr) {
        if (window.scrollY >= value.start && window.scrollY <= value.end) {
          indicators[index].classList.add('active-section');
        } else {
          indicators[index].classList.remove('active-section');
        }
      });
    }

    function throttle(method, scope) {
      clearTimeout(method._tId);
      method._tId= setTimeout(function(){
          method.call(scope);
      }, 50);
    }

    nav.addEventListener('click', indicatorClick);

    window.addEventListener('scroll', function() {
      throttle(indicatorScroll, window);
    });
  });
}

PhotoBlog.prototype.init =  function() {
  this.processConfig();
  this.render();
  this.nav();
};

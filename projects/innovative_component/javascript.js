function PhotoBlog(options) {
  this.element = document.getElementById('photo-blog-component');
  this.options = options;
  this.nodesArray = [];
  this.init();
}

PhotoBlog.prototype.init =  function() {
  this.processConfig();
  this.render();
};

PhotoBlog.prototype.processConfig = function() {
  var self = this;
  this.options.forEach(function(value) {
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

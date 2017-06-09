var about_template = $('#about-intro').html();

var context = {
  about_me_1: "Hi there! Welcome to my portfolio, my name is Joseph and I'm an aspiring Frontend Developer in Sydney, Australia.",
  about_me_2: "I want to build stuff that people will actually use and derive some sort of benefit.",
  about_me_3: "I want to build stuff that will bring about good in people's lives.",
  about_me_4: "Here are some things I love in life:",
  li_1: "Mountains",
  li_2: "Oceans",
  li_3: "Hot Chips",
  li_4: "Fish n Chips",
  li_5: "Burger n Chips",
  li_6: "Cold Pizza",
  li_7: "Kebabs",
  li_8: "Sports",
  li_9: "e-Sports",
  li_10: "Cats",
  li_11: "Dogs",
  li_12: "Sleeping in",
  li_13: "Getting lost and exploring"
};

var template = Handlebars.compile(about_template);

var html = template(context);

$('#about_me').append(html);

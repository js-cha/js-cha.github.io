(function() {
  'use strict';

  var events_list = [];

  function registerEvent(data) {
    data.id = events_list.length;
    events_list.push(data);
  }


  function renderCalendar() {
    var html = "<div class='calendar-times'><label data-time='0'>9:00 AM</label><label data-time='30'>9:30</label><label data-time='60'>10:00 AM</label><label data-time='90'>10:30</label><label data-time='120'>11:00 AM</label><label data-time='150'>11:30</label><label data-time='180'>12:00 PM</label><label data-time='210'>12:30</label><label data-time='240'>1:00 PM</label><label data-time='270'>1:30</label><label data-time='300'>2:00 PM</label><label data-time='330'>2:30</label><label data-time='360'>3:00 PM</label><label data-time='390'>3:30</label><label data-time='420'>4:00 PM</label><label data-time='450'>4:30</label><label data-time='480'>5:00 PM</label><label data-time='510'>5:30</label><label data-time='540'>6:00 PM</label><label data-time='570'>6:30</label><label data-time='600'>7:00 PM</label><label data-time='630'>7:30</label><label data-time='660'>8:00 PM</label><label data-time='690'>8:30</label><label data-time='720'>9:00 PM</label></div><div class='calendar-events'></div>";
    var container = document.createElement('div');
    container.setAttribute('id', 'my-calendar');
    container.innerHTML = html;
    document.body.appendChild(container);
  }

  function createEvent() {
    var event = document.createElement('div');
    var event_title = document.createElement('h4');
    var event_desc = document.createElement('p');

    event_title.innerHTML = 'Sample Item';
    event_desc.innerHTML = 'Sample Location';

    event.setAttribute('class', 'calendar-event');
    event.appendChild(event_title);
    event.appendChild(event_desc);

    return event;
  }

  function renderEvent(data) {
    var events_container = document.querySelector('.calendar-events');
    var event = createEvent();

    if (data.hasOwnProperty('conflict')) {
      event.classList.add('calendar-event-clash');
    }

    var start = document.querySelector('label[data-time=' + '"' + data.start + '"' + ']');
    var end = document.querySelector('label[data-time=' + '"' + data.end + '"' + ']');

    event.style.top = (start.offsetTop - 48) + 'px';
    event.style.height = (data.end - data.start + 7) + 'px';

    events_container.appendChild(event);
  }

  function layOutDay(events) {
    events.forEach(function(value) {
      checkEventConflict(value);
      registerEvent(value);
    });

    events_list.forEach(function(value) {
      renderEvent(value);
    });
  }

  function checkEventConflict(data) {
    events_list.forEach(function(item) {
      if ((data.end == item.end) || (data.start >= item.start && data.start <= item.end) || (data.start <= item.start && data.end >= item.end)) {
        data.conflict = 'true';
        item.conflict = 'true';
        return true;
      }
    });
  }

  function initCalendar() {
    renderCalendar();
    layOutDay([{start: 30, end: 90}, {start: 180, end: 210}, {start: 150, end: 240}, {start: 390, end: 450}, {start: 420, end: 450}, {start: 540, end: 720}]);
  }

  initCalendar();
})();
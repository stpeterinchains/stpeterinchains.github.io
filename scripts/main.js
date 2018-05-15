// @ts-nocheck

;(function () {
  'use strict';

  var
    current = 0,
    timer = null,
    interval = 5000;

  function display () {
    clearTimeout(timer);
    timer = null;

    var
      slides = document.getElementsByClassName('slideshow-slide'),
      indicators = document.getElementsByClassName('slideshow-indicator'),
      pauseIndicator = document.getElementById('slideshow-pause'),
      i = 0;

    if (current < 0)
      current = slides.length - 1;
    if (current >= slides.length)
      current = 0;

    for (i = 0; i < slides.length; i++)
      slides[i].style.display = 'none';
    for (i = 0; i < indicators.length; i++)
      indicators[i].className =
            indicators[i].className.replace(' slideshow-indicator-active', '');
    pauseIndicator.className = 'slideshow-pause-inactive';

    slides[current].style.display = 'block';
    indicators[current].className += ' slideshow-indicator-active';

    timer = setTimeout(window.slideshow.next, interval);
  }

  window.slideshow = {
    set: function (index)  {  current = index;  display();  },
    next: function ()  {  current++;  display();  },
    previous: function ()  {  current--;  display();  },
    pause: function () {
      clearTimeout(timer);
      timer = null;
      document.getElementById('slideshow-pause').className = 'slideshow-pause-active';
    }
  };

  display();
})();

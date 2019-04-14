(() => {

  'use strict';

  let
    current  = 0,
    timer    = null,
    interval = 5000;

  const display =
    () => {

      clearTimeout(timer);
      timer = null;

      let
        slides         =
          document.getElementsByClassName('slideshow-slide'),
        indicators     =
          document.getElementsByClassName('slideshow-indicator'),
        pauseIndicator =
          document.getElementById('slideshow-pause');

      if (current < 0)
        current = slides.length - 1;
      if (current >= slides.length)
        current = 0;

      for (let index = 0; index < slides.length; index++)
        slides[index].style.display = 'none';
      for (let index = 0; index < indicators.length; index++)
        indicators[index].className =
          indicators[index].className.replace(
            ' slideshow-indicator-active', '');
      pauseIndicator.className =
        'slideshow-pause-inactive';

      slides[current].style.display = 'block';
      indicators[current].className += ' slideshow-indicator-active';

      timer =
        setTimeout(window.slideshow.next, interval);
    }

  window.slideshow =
    { set (index) {  current = index;  display();  },

      next ()     {  current++;  display();  },
      previous () {  current--;  display();  },

      pause () {

        clearTimeout(timer);
        timer = null;

        document.getElementById('slideshow-pause').className =
          'slideshow-pause-active';
      },
    };

  display();

})();

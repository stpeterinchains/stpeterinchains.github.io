const
  _pad =
    number => {

      'use strict';

      return (number < 10 ? '0' : '') + number.toString();
    },

  _getFormattedDate =
    existingDate => {

      'use strict';

      const
        date          = existingDate || new Date,
        year          = date.getFullYear(),
        month         = _pad(date.getMonth() + 1),
        day           = _pad(date.getDate()),
        formattedDate = `${year}${month}${day}`;

      return { date, formattedDate };
    },

  trimIndexSchedule =
    () => {

      'use strict';

      const
        calendarID          = 'index-schedule-calendar',
        calendarElement     = document.getElementById(calendarID),
        targetElements      = calendarElement.children,
        targetDateAttribute = 'diem',
        { date          : today,
          formattedDate : todayDate, } = _getFormattedDate(),
        currentDayOfWeek    = today.getDay(),
        daysToShow          = [ 3, 5, 4, 5, 4, 3, 4 ];

      let
        targetElement,
        targetOffset = 0;

      // eslint-disable-next-line no-cond-assign
      while (targetElement = targetElements[targetOffset]) {

        const
          targetDate = targetElement.dataset[targetDateAttribute],
          future     = new Date(
            today.getFullYear(),
            today.getMonth(),
            today.getDate() + daysToShow[currentDayOfWeek]),
          { formattedDate : futureDate } = _getFormattedDate(future);

        if (targetDate < todayDate || targetDate >= futureDate)
          calendarElement.removeChild(targetElement);
        else
          targetOffset++;
      }

      if (targetElements.length === 0) {

        const
          scheduleContainerID        = 'index-schedule',
          expositionContainerID      = 'exposition',
          scheduleContainerElement   =
            document.getElementById(scheduleContainerID),
          expositionContainerElement =
            document.getElementById(expositionContainerID)

        scheduleContainerElement.style.display     = 'none';
        expositionContainerElement.style.marginTop = 0;
      }

      else {

        const
          firstHeading    =
            calendarElement.
                  getElementsByClassName('index-schedule-diem-day')[0],
          firstChild      = firstHeading.children[0],
          markElement     = document.createElement('span'),
          markTextElement = document.createTextNode('Today');

        markElement.className = 'index-schedule-diem-mark';
        markElement.appendChild(markTextElement);

        firstHeading.insertBefore(markElement, firstChild);
      }
    },

  trimSchedule =
    () => {

      'use strict';

      const
        upcomingCalendarID      = 'schedule-calendar-upcoming-container',
        upcomingCalendarElement = document.getElementById(upcomingCalendarID),
        pastCalendarID          = 'schedule-calendar-past-container',
        pastCalendarElement     = document.getElementById(pastCalendarID),
        targetElements          = upcomingCalendarElement.children,
        targetDateAttribute     = 'diem',
        { formattedDate : todayDate } = _getFormattedDate();

      let
        targetElement,
        headElement = null;

      /* eslint-disable no-cond-assign */
      while
        ( (targetElement = targetElements[0]) &&
          targetElement.dataset[targetDateAttribute] < todayDate )

        headElement =
          pastCalendarElement.insertBefore(targetElement, headElement);
      /* eslint-enable no-cond-assign */
    };

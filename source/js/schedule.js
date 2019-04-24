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
        daysToShow          = [ 4, 5, 4, 3, 4, 3, 5 ];

      let
        targetElement,
        targetOffset = 0;

      // eslint-disable-next-line no-cond-assign
      while (targetElement = targetElements[targetOffset]) {

        const
          // targetDate1  = targetElement.id.substring(targetIDDateOffset),
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

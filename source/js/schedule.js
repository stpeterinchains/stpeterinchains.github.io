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

  trimSchedule =
    () => {

      'use strict';

      const
        upcomingCalendarID      = 'schedule2-calendar-upcoming',
        pastCalendarID          = 'schedule2-calendar-past',
        targetIDPrefix          = 'schedule2-diem-',
        upcomingCalendarElement = document.getElementById(upcomingCalendarID),
        pastCalendarElement     = document.getElementById(pastCalendarID),
        targetElements          = upcomingCalendarElement.children,
        targetIDDateOffset      = targetIDPrefix.length,
        { formattedDate : todayDate } = _getFormattedDate();

      let
        targetElement,
        headElement = null;

      /* eslint-disable no-cond-assign */
      while
        ( (targetElement = targetElements[0]) &&
          targetElement.id.substring(targetIDDateOffset) < todayDate )

        headElement =
          pastCalendarElement.insertBefore(targetElement, headElement);

      /* eslint-enable no-cond-assign */
    },

  trimIndexSchedule =
    () => {

      'use strict';

      const
        offsetDays         = 3,
        calendarID         = 'index-schedule2-calendar',
        targetIDPrefix     = 'index-schedule2-diem-',
        calendarElement    = document.getElementById(calendarID),
        targetElements     = calendarElement.children,
        targetIDDateOffset = targetIDPrefix.length,
        { date          : today,
          formattedDate : todayDate, } = _getFormattedDate();

      let
        targetElement,
        targetOffset = 0;

      // eslint-disable-next-line no-cond-assign
      while (targetElement = targetElements[targetOffset]) {

        const
          targetDate  = targetElement.id.substring(targetIDDateOffset),
          future      = new Date(
            today.getFullYear(),
            today.getMonth(),
            today.getDate() + offsetDays),
          { formattedDate : futureDate } = _getFormattedDate(future);

        if (targetDate < todayDate || targetDate >= futureDate)
          calendarElement.removeChild(targetElement);
        else
          targetOffset++;
      }

      if (targetElements.length === 0) {

        const
          scheduleContainerID        = 'index-schedule2',
          expositionContainerID      = 'exposition',
          scheduleContainerElement   =
            document.getElementById(scheduleContainerID),
          expositionContainerElement =
            document.getElementById(expositionContainerID)

        scheduleContainerElement.style.display     = 'none';
        expositionContainerElement.style.marginTop = 0;
      }
    };

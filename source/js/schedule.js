const
  _todayDate =
    () => {

      'use strict';

      const
        today      = new Date,
        todayYear  = today.getFullYear(),
        todayMonth = (today.getMonth() + 1).toString().padStart(2, '0'),
        todayDay   = today.getDate().toString().padStart(2, '0'),
        todayDate  = `${todayYear}${todayMonth}${todayDay}`;

      return { today, todayDate };
    },

  trimSchedule =
    () => {

      'use strict';

      const
        upcomingCalendarID      = 'schedule2-calendar-upcoming',
        recentCalendarID        = 'schedule2-calendar-recent',
        targetIDPrefix          = 'schedule2-diem-',
        upcomingCalendarElement = document.getElementById(upcomingCalendarID),
        recentCalendarElement   = document.getElementById(recentCalendarID),
        targetElements          = upcomingCalendarElement.children,
        targetIDDateOffset      = targetIDPrefix.length,
        { todayDate }           = _todayDate();

      let
        targetElement,
        headElement = null;

      /* eslint-disable no-cond-assign */
      while
        ( (targetElement = targetElements[0]) &&
          targetElement.id.substring(targetIDDateOffset) < todayDate )

        headElement =
          recentCalendarElement.insertBefore(targetElement, headElement);

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
        { today,
          todayDate, }     = _todayDate();

      let
        targetElement,
        targetOffset = 0;

      // eslint-disable-next-line no-cond-assign
      while (targetElement = targetElements[targetOffset]) {

        const
          future      = new Date(
            today.getFullYear(),
            today.getMonth(),
            today.getDate() + offsetDays),
          futureYear  = future.getFullYear(),
          futureMonth = (future.getMonth() + 1).toString().padStart(2, '0'),
          futureDay   = future.getDate().toString().padStart(2, '0'),
          futureDate  = `${futureYear}${futureMonth}${futureDay}`,
          targetDate  = targetElement.id.substring(targetIDDateOffset);

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

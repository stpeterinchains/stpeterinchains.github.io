const trimSchedule =
  page => {

    'use strict';

    const
      today      = new Date,
      todayYear  = today.getFullYear(),
      todayMonth = (today.getMonth() + 1).toString().padStart(2, '0'),
      todayDay   = today.getDate().toString().padStart(2, '0'),
      todayDate  = `${todayYear}${todayMonth}${todayDay}`;

    if (page === 'index') {

      const
        offsetDays            = 3,
        calendarID           = 'index-schedule2-calendar',
        targetIDPrefix       = 'index-schedule2-diem-',
        targetIDPrefixLength = targetIDPrefix.length,
        targetsSelector      = 'ul.index-schedule2-diem-container',
        calendarElement      = document.getElementById(calendarID),
        targetElements       =
          calendarElement.querySelectorAll(targetsSelector);

      for (const targetElement of targetElements) {

        const
          targetDate  =
            targetElement.id.substring(targetIDPrefixLength),
          future      = new Date(
            today.getFullYear(),
            today.getMonth(),
            today.getDate() + offsetDays),
          futureYear  = future.getFullYear(),
          futureMonth = (future.getMonth() + 1).toString().padStart(2, '0'),
          futureDay   = future.getDate().toString().padStart(2, '0'),
          futureDate  = `${futureYear}${futureMonth}${futureDay}`;

        if (targetDate < todayDate || futureDate <= targetDate)
          calendarElement.removeChild(targetElement);
      }
    }
    else if (page === 'schedule') {

      const
        calendarID             = 'schedule2-calendar',
        targetIDPrefix         = 'schedule2-diem-',
        targetIDPrefixLength   = targetIDPrefix.length,
        targetsSelector        = 'ul.schedule2-diem-container',
        calendarElement        = document.getElementById(calendarID),
        targetElements         =
          calendarElement.querySelectorAll(targetsSelector);

      for (const targetElement of targetElements) {

        const targetDate =
          targetElement.id.substring(targetIDPrefixLength);

        if (targetDate < todayDate)
          calendarElement.removeChild(targetElement);
      }
    }
  };

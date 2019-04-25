"use strict";

const
  { log : writeln } = console,
  { argv }          = process,
  [ , ,
    firstArgument,
    lastArgument, ] = argv;

if (! firstArgument) {

  writeln('Usage: node chrono.js [ <first-date> [ <last-date> ] ]');
  writeln('Date format: YYYY-MM-DD');
  return;
}

const
  { LocalDate,
    DateTimeFormatter,
    ChronoUnit : { DAYS }, } = require('js-joda'),
  calendarProperty           = 'calendar',
  dateProperty               = 'date',
  recurringProperty          = 'recurring',
  today                      = LocalDate.now(),
  firstDate                  = LocalDate.parse(firstArgument),
  lastDate                   =
    lastArgument ?
          LocalDate.parse(lastArgument) :
          LocalDate.of(
            today.year(),
            today.monthValue(),
            today.lengthOfMonth()),
  totalDays                  = firstDate.until(lastDate, DAYS),
  ymdFormat                  = DateTimeFormatter.ofPattern('yyyy/MM/dd');

writeln(`${calendarProperty}:`);

for (let offsetDays = 0; offsetDays <= totalDays; offsetDays++) {

  const
    date       = firstDate.plusDays(offsetDays),
    dayOfWeek  = date.dayOfWeek().name().toLowerCase();

  writeln(`  - ${dateProperty}: ${date.format(ymdFormat)}`);
  writeln(`    ${recurringProperty}: *${dayOfWeek}`);
}

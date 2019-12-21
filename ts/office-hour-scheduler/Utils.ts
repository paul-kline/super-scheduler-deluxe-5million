import { RawStudent, TimeBlock, Interval } from "./Types";
import fall19 from "./fa19.json";
export const daysLookup = ["U", "M", "T", "W", "R", "F", "S"];
export const data = (fall19 as any) as RawStudent[];

/**
 *
 * @param {Date} date the date to modify
 * @param {string} timestr expected form "03:00 PM"
 */
export function setTime(date: Date, timestr: string): Date {
  // "03:00 PM"
  // "12:30 PM"
  //@ts-ignore
  let [_, h, m]: any = timestr.match(/(\d+):(\d+)/);
  h = Number.parseInt(h, 10);
  m = Number.parseInt(m, 10);
  if (timestr.toLowerCase().endsWith("pm") && h < 12) {
    h += 12;
  }
  if (timestr.toLowerCase().endsWith("am") && h == 12) {
    h = 0;
  }
  date.setHours(h);
  date.setMinutes(m);
  date.setSeconds(0);
  date.setMilliseconds(0);
  return date;
}

export function keepDOWAfter(inputDate: Date, mustBeAfterDate: Date): Date {
  const r = new Date(mustBeAfterDate);
  const dow = inputDate.getDay();
  r.setHours(inputDate.getHours());
  r.setMinutes(inputDate.getMinutes());
  r.setSeconds(inputDate.getSeconds());
  r.setMilliseconds(inputDate.getMilliseconds());
  while (r.getDay() != dow) r.setDate(r.getDate() + 1);
  return r;
}
/**
 *move the start date to the first day in list by moving FORWARD.
 * @param {Date} date the date to modify
 * @param {string} days A string like "MWF"
 */
export function adjustDate(date: Date, dayss: string): Date {
  const daysLookup = ["U", "M", "T", "W", "R", "F", "S"];
  const days = dayss.split("");
  const daysAsNumbers = days.map(d => daysLookup.indexOf(d));
  if (daysAsNumbers.includes(date.getDay())) {
    return date;
  } else {
    for (let i = 0; i < 7; i++) {
      date.setDate(date.getDate() + 1);
      if (daysAsNumbers.includes(date.getDay())) {
        return date;
      }
    }
    console.error("impossible adjustDate call + " + date + dayss);
    return date;
  }
  console.log(
    "this should be impossible to reach. No future date was found in adjustDate",
    date,
    days
  );
}

/**
 *
 * @param x an interval
 * @param y another interval
 * @return seconds of overlapping time [0-Infinity]
 */
export function overlap(x: Interval, y: Interval): number {
  const start = (x.start.getTime() >= y.start.getTime() ? x : y).start;
  const end = (x.end.getTime() >= y.end.getTime() ? y : x).end;
  return Math.max(0, (end.getTime() - start.getTime()) / 1000);
}
/**
 *
 * @param interval an Interval
 * @param name The name the interval will have as a Calendar event
 * @return An object which can be used as a Vue Event
 */
export function intervalToVueEvent(interval: Interval, name: string) {
  const ob = {
    name: name,
    start: toVueDateString(interval.start),
    end: toVueDateString(interval.end)
  };
  console.log("Vue Event is:", ob);
  return ob;
}
/**
 *
 * @param d Date to be converted
 * @returns a string of the date/time format expected by the Vue Calendar
 */
export function toVueDateString(d: Date, withTime: boolean = true): string {
  // "2019-01-09 15:30"
  // console.log("date passed to vuedatestring", d);
  let r = `${d.getFullYear()}-${twof(d.getMonth() + 1)}-${twof(d.getDate())}`;
  r += withTime ? ` ${twof(d.getHours())}:${twof(d.getMinutes())}` : ``;
  // console.log("returning datestring", r);
  return r;
}

export function twof(x: number | string): string {
  if (typeof x == "number") {
    if (x < 10) {
      return "0" + x;
    } else {
      return "" + x;
    }
  } else {
    if (x.length < 2) {
      return "0" + x;
    } else {
      return x;
    }
  }
}
export function rawStudentToTimeBlocks(
  rawStudent: RawStudent,
  startingDate?: Date
): TimeBlock[] {
  const result: TimeBlock[] = [];
  console.log("raw events count:", rawStudent.rawEvents.length);
  rawStudent.rawEvents.forEach(event => {
    event.day = event.day.replace("N\\A", "");
    console.log("days are", event.day);
    // console.log(event);
    event.day.split("").forEach(letter => {
      const x: any = { sourceStudent: rawStudent, sourceEvent: event };
      const start = adjustDate(
        setTime(new Date(startingDate || event.startdate), event.starttime),
        letter
      );
      // console.log("start", start);
      const end = setTime(new Date(start), event.endtime);
      x.interval = new Interval(start, end);
      // x.end = end;
      x.day = letter;
      result.push(x);
    });
  });

  return result;
}
export function rawStudentsToTimeBlocks(
  rawStudents: RawStudent[],
  startingDate?: Date
): TimeBlock[] {
  return rawStudents.flatMap(x => rawStudentToTimeBlocks(x, startingDate));
}

export function toIntervals(
  startDate: Date,
  startTimes: string[],
  endTimes: string[],
  startInterval: number,
  intervalLength: number,
  days: number[]
): Interval[] {
  const result: Interval[] = [];
  days.forEach((dow, i) => {
    const first = new Date(startDate);
    first.setDate(first.getDate() + ((dow - first.getDay() + 7) % 7));
    setTime(first, startTimes[i]);
    const last = new Date(first);
    setTime(last, endTimes[i]);
    let from = first;
    let end = new Date(first);
    end.setMinutes(end.getMinutes() + intervalLength * 60);
    console.log("First", first.toLocaleString(), "last", last.toLocaleString());
    while (end <= last) {
      const int: Interval = new Interval(from, end);
      result.push(int);
      from = new Date(from);
      from.setMinutes(from.getMinutes() + startInterval);
      end = new Date(from);
      end.setMinutes(end.getMinutes() + intervalLength * 60);
    } //
  });
  return result;
}

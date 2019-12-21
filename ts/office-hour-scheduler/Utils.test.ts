import * as U from "./Utils";
import { RawStudent, TimeBlock, Interval } from "./Types";
import fall19 from "./fa19.json";
import Person from "./Person";
test("setTime", () => {
  const f = U.setTime;
  const d = new Date();
  expect(f(new Date(), "7:00 PM").getHours()).toBe(19);
  expect(f(new Date(), "7:00 AM").getHours()).toBe(7);
  expect(f(new Date(), "8:00 AM").getHours()).toBe(8);
  expect(f(new Date(), "12:00 AM").getHours()).toBe(0);
  expect(f(new Date(), "12:00 PM").getHours()).toBe(12);
  expect(f(new Date(), "1:00 PM").getHours()).toBe(13);
  expect(f(new Date(), "01:00 PM").getHours()).toBe(13);
});

test("adjustDate", () => {
  const f = U.adjustDate;
  const wednesday = new Date("11/27/2019");
  expect(f(new Date(), "UMTWRFS").getDay()).toBe(new Date().getDay());
  expect(f(new Date(wednesday), "W").getDate()).toBe(27);
  expect(f(new Date(wednesday), "W").getDate()).toBe(27);
  expect(f(new Date(wednesday), "W").getDate()).toBe(27);
  expect(f(new Date(wednesday), "T").getDate()).toBe(3);
  expect(f(new Date(wednesday), "MT").getDate()).toBe(2);
});

test("toIntervals", () => {
  const f = U.toIntervals;
  const start = new Date("12/2/2019");
  const days = "MTWRF".split("").map(x => U.daysLookup.indexOf(x));
  const startTimes = Array(days.length).fill("8:00 AM");
  const endTimes = Array(days.length).fill("5:00 PM");
  // const r = f(start, startTimes, endTimes, 15, 1, days);
  // r.sort((a, b) => a.start.getTime() - b.start.getTime());
  // console.log(
  //   r.map(x => x.start.toLocaleString() + " " + x.end.toLocaleString())
  // );
});
test("overlap", () => {
  const f = U.overlap;
  const _8am = U.setTime(new Date(), "8:00 am");
  const _9am = U.setTime(new Date(), "9:00 am");
  const _830am = U.setTime(new Date(), "8:30 am");
  const _10am = U.setTime(new Date(), "10:00 am");
  expect(f(new Interval(_8am, _9am), new Interval(_830am, _9am))).toBe(30 * 60);
  expect(f(new Interval(_8am, _10am), new Interval(_9am, _10am))).toBe(60 * 60);
  expect(f(new Interval(_8am, _9am), new Interval(_9am, _10am))).toBe(0);
  expect(f(new Interval(_9am, _10am), new Interval(_8am, _9am))).toBe(0);
});

test("Person can attend", () => {
  const p = new Person("Paul Kline");
  const interval_830_930 = new Interval(
    U.setTime(new Date(), "8:30 am"),
    U.setTime(new Date(), "9:30 am")
  );
  const comm_8_850am = {
    name: "8-850",
    interval: new Interval(
      U.setTime(new Date(), "8:00 am"),
      U.setTime(new Date(), "8:50 am")
    )
  };
  const comm_830_9am = {
    name: "830-9",
    interval: new Interval(
      U.setTime(new Date(), "8:30 am"),
      U.setTime(new Date(), "9:00 am")
    )
  };
  const comm_830_10am = {
    name: "830-10",
    interval: new Interval(
      U.setTime(new Date(), "8:30 am"),
      U.setTime(new Date(), "10:00 am")
    )
  };
  p.commitments = [comm_8_850am];
  expect(p.canAttendFor(interval_830_930)).toBe(40);
  p.commitments = [comm_8_850am, comm_830_9am];
  expect(p.canAttendFor(interval_830_930)).toBe(30);
  p.commitments = [comm_8_850am, comm_830_9am, comm_830_10am];
  expect(p.canAttendFor(interval_830_930)).toBe(0);
});

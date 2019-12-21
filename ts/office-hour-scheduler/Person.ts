import { Commitment, Interval, RawStudent } from "./Types";
import { overlap, rawStudentToTimeBlocks } from "./Utils";

export default class Person {
  static fromRawStudent(rawStudent: RawStudent): Person {
    const p = new Person(rawStudent.student);

    const timebloks = rawStudentToTimeBlocks(rawStudent);
    //   console.log("timeblocks", timebloks);
    p.commitments.push(
      ...timebloks.map(tb => {
        return { name: tb.sourceEvent.course, interval: tb.interval };
      })
    );
    // });
    return p;
  }
  constructor(public name: string, public commitments: Commitment[] = []) {}

  canAttendFor(interval: Interval): number {
    const initialLength = interval.length;
    const problemIntervals: Interval[] = [];
    this.commitments.forEach((c, i) => {
      const ovrlp = overlap(c.interval, interval);
      if (ovrlp > 0) {
        //shrink interval
        const s = (c.interval.start > interval.start ? c.interval : interval)
          .start;
        const e = (c.interval.end < interval.end ? c.interval : interval).end;
        problemIntervals.push(new Interval(s, e));
      }
    });
    problemIntervals.sort((a, b) => a.start.getTime() - b.start.getTime());
    let pointer = interval.start;
    let sum = 0;
    problemIntervals.forEach(int => {
      sum += Math.max(0, (int.start.getTime() - pointer.getTime()) / 1000 / 60);
      pointer = int.end;
    });
    sum += Math.max(
      0,
      (interval.end.getTime() - pointer.getTime()) / 1000 / 60
    );
    return sum;
  }
}

export interface Commitment {
  interval: Interval;
  name: string;
}

/**
 * What we get from the student schedule parser.
 */
export interface RawStudent {
  student: string;
  rawEvents: RawEvent[];
}
export interface TimeBlock {
  interval: Interval;
  sourceStudent: RawStudent;
  sourceEvent: RawEvent;
  day: string;
}
export class Interval {
  constructor(public start: Date, public end: Date) {}
  /**
   * in minutes
   */
  get length(): number {
    return Math.max(0, this.end.getTime() - this.start.getTime()) / 1000 / 60;
  }
}
export interface RawEvent {
  course: string;
  day: string;
  enddate?: Date;
  endtime: string;
  instructor: string;
  room: string;
  startdate: Date;
  starttime: string;
  time: string;
  title: string;
}

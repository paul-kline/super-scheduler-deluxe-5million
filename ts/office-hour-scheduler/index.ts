import { RawStudent, TimeBlock, Interval, Commitment } from "./Types";
import fall19 from "./fa19.json";
export * from "./Types";
import { setTime, adjustDate, toIntervals, daysLookup, overlap } from "./Utils";
import Person from "./Person";
export { Person };
export * from "./Utils";
export const data = (fall19 as any) as RawStudent[];
function main() {
  //   console.log(fall19);
  // console.log(data[0], rawStudentToTimeBlocks(data[0]));
  const people: Person[] = data.map(Person.fromRawStudent);
  const r = greedyFindBestTime([], people);
  const h = highestAttendance(r);
  //@ts-ignore
  console.log(h, r.get(h).size);
  // const student1 = Person.fromRawStudent(data[0]);
  // console.log("people", people);
  // const whoCanBeThere = whoCanAttendWhat()
  // console.log("raw", data[0]);
}
export function highestAttendance<K, V extends { size: number }>(
  m: Map<K, V>
): K {
  let i: any;
  let bestl: number = 0;
  m.forEach((v, k) => {
    if (v.size > bestl) {
      bestl = v.size;
      i = k;
    }
  });
  return i;
}
export function getMonday(d: Date) {
  const x = new Date(d);
  x.setDate(x.getDate() + (1 - x.getDay()));
  return x;
}
export function whoCanAttendWhat(
  intervals: Interval[],
  people: Set<Person>,
  attendanceThreshold: number = 30
): Map<Interval, Set<Person>> {
  const whoCanBeThere: Map<Interval, Set<Person>> = new Map();
  intervals.forEach(slot => {
    const set: Set<Person> = new Set();
    const inter = people.keys();
    for (const p of inter) {
      if (p.canAttendFor(slot) >= attendanceThreshold) {
        set.add(p);
      }
    }
    whoCanBeThere.set(slot, set);
  });
  return whoCanBeThere;
}
export function greedyFindBestTime(
  avoid: Interval[],
  people: Person[],
  config: any = {}
) {
  config = {
    minimumSpan: 1,
    mustMeetEveryDay: true,
    fromDate: getMonday(new Date()),
    earliestTimes: Array(5).fill("8:00 AM"),
    latestTimes: Array(5).fill("5:00 PM"),
    startingInterval: 30,
    attendanceThreshold: 30,
    days: "MTWRF",
    ...config
  };
  let unmet: Set<Person> = new Set();
  people.forEach(p => unmet.add(p));

  const candidateSlots = toIntervals(
    config.fromDate,
    config.earliestTimes,
    config.latestTimes,
    config.startingInterval,
    config.minimumSpan,
    config.days.split("").map((l: string) => daysLookup.indexOf(l))
  ).filter(int => !avoid.find(i => overlap(int, i) > 0));
  //not all of them though!

  const whoCanBeThere: Map<Interval, Set<Person>> = whoCanAttendWhat(
    candidateSlots,
    unmet,
    config.attendanceThreshold
  );

  console.log("who can be there", whoCanBeThere);
  console.log("done");
  return whoCanBeThere;
}

main();

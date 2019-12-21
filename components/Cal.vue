<template>
  <div>
    call works
    <v-calendar
      v-if="events && events.length > 0 && start"
      type="week"
      :start="start"
      :events="events"
      :first-interval="firstInterval"
      :interval-count="intervalCount"
      :weekdays="[1, 2, 3, 4, 5]"
    ></v-calendar>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from "vue-property-decorator";
import {
  data,
  Person,
  intervalToVueEvent,
  rawStudentToTimeBlocks,
  rawStudentsToTimeBlocks,
  TimeBlock,
  adjustDate,
  keepDOWAfter,
  toVueDateString
} from "../ts/office-hour-scheduler/index";
// import { TimeBlock } from "office-hour-scheduler";
interface Event {
  name: string;
  start: string;
  end: string;
}
@Component
export default class CalComp extends Vue {
  @Prop() name!: string;

  //@ts-ignore
  // _start: Date;
  // get start(): string {
  //   // console.log("start is", this._start);
  //   let r = this.events.reduce((acc, e) => (acc.start > e.start ? e : acc));
  //   console.log("start date", r.start);
  //   return r.start.split(" ")[0];
  //   // return this._start ? toVueDateString(this._start, false) : "";
  // }
  firstInterval: number = 8;
  intervalCount: number = 9;
  start: string;
  events: Event[] = [];
  mounted() {
    console.log("mounted");
    console.log(data);
    const monday = adjustDate(new Date(), "M");
    console.log("monday is", monday);
    this.start = toVueDateString(monday);
    // this._start = new Date();
    // console.log("start", this._start);
    // console.log("function", rawStudentToTimeBlocks);
    this.events = rawStudentsToTimeBlocks(data).flatMap((tb: TimeBlock) => {
      tb.interval.start = keepDOWAfter(tb.interval.start, monday);
      tb.interval.end = keepDOWAfter(tb.interval.end, monday);
      const r = intervalToVueEvent(
        tb.interval,
        tb.sourceStudent.student + " " + tb.sourceEvent.course
      );

      return r;
    });
    console.log("this events", this.events);
  }
}
</script>

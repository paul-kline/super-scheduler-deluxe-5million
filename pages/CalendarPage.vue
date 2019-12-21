<template>
  <Cal></Cal>
</template>
<script lang="ts">
import { Vue, Component, Prop } from "vue-property-decorator";

import Cal from "~/components/Cal.vue";
@Component({ components: { Cal } })
export default class CalendarPage extends Vue {}
</script>

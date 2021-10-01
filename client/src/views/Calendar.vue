<template>
  <el-main>
    <calendar :data="testData" />
  </el-main>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { ElMain } from "element-plus";
import Calendar from "@/components/Calendar/Calendar";
import { addDays, startOfMonth, setHours } from "date-fns/fp";

function getData(days: Array<any>) {
  const now = new Date();
  const firstDay = startOfMonth(now);

  return days.map(([day, hours]) => ({
    time: setHours(hours, addDays(day - 1, firstDay)).toISOString(),
  }));
}

const testDays = [
  [2, 12],
  [18, 10],
  [5, 11],
  [22, 9],
];
const testData = getData(testDays);

export default defineComponent({
  components: {
    ElMain,
    Calendar,
  },
  setup() {
    return {
      testData,
    };
  },
});
</script>

<template>
  <el-container>
    <el-header>
      <el-menu
        :default-active="activeIndex"
        class="el-menu-demo"
        mode="horizontal"
        @select="handleSelect"
      >
        <el-menu-item index="1">Processing Center</el-menu-item>
        <el-sub-menu index="2">
          <template #title>Workspace</template>
          <el-menu-item index="2-1">item one</el-menu-item>
          <el-menu-item index="2-2">item two</el-menu-item>
          <el-menu-item index="2-3">item three</el-menu-item>
          <el-sub-menu index="2-4">
            <template #title>item four</template>
            <el-menu-item index="2-4-1">item one</el-menu-item>
            <el-menu-item index="2-4-2">item two</el-menu-item>
            <el-menu-item index="2-4-3">item three</el-menu-item>
          </el-sub-menu>
        </el-sub-menu>
        <el-menu-item index="3" disabled>Info</el-menu-item>
        <el-menu-item index="4">Orders</el-menu-item>
      </el-menu>
    </el-header>
    <el-main>
      <div class="calendar__month">
        <div
          v-for="(day, key) in month"
          :key="key"
          class="calendar__day"
          :class="{ 'calendar__day--add': !day.selected }"
        >
          {{ day.format }}
        </div>
      </div>
    </el-main>
  </el-container>
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";
import {
  ElMenuItem,
  ElContainer,
  ElHeader,
  ElMain,
  ElMenu,
  ElSubMenu,
  ElButton,
} from "element-plus";
import {
  startOfMonth,
  endOfMonth,
  getDaysInMonth,
  addDays,
  subDays,
  format,
  getDay,
  addMonths,
  subMonths,
} from "date-fns";
import * as $R from "ramda";

const firstDayOfWeek = 1;

function getDayOfMonthStart(date: Date, selected: boolean, day: number) {
  const start = startOfMonth(date);
  const newDate = addDays(start, day);
  return {
    format: format(newDate, "MM/dd/yyyy"),
    dayOfWeek: getDay(newDate),
    date: newDate,
    selected,
  };
}

function getDayOfMonthEnd(date: Date, selected: boolean, day: number) {
  const end = endOfMonth(date);
  const newDate = subDays(end, day);
  return {
    format: format(newDate, "MM/dd/yyyy"),
    dayOfWeek: getDay(newDate),
    date: newDate,
    selected,
  };
}

function getMonth(date: Date) {
  const dayStart = $R.curry(getDayOfMonthStart);
  const dayEnd = $R.curry(getDayOfMonthEnd);
  const month = $R.times(dayStart(date, true), getDaysInMonth(date));
  const preMonth = $R.times(
    dayEnd(subMonths(date, 1), false),
    $R.head(month).dayOfWeek - firstDayOfWeek
  );
  const postMonth = $R.times(
    dayStart(addMonths(date, 1), false),
    (firstDayOfWeek ? 7 : 6) - $R.last(month).dayOfWeek
  );
  return $R.pipe($R.concat(month), $R.pipe($R.reverse, $R.concat)(preMonth))(postMonth);
}

export default defineComponent({
  components: {
    ElMenuItem,
    ElContainer,
    ElHeader,
    ElMain,
    ElMenu,
    ElSubMenu,
    ElButton,
  },
  setup() {
    const activeIndex = ref("1");
    const activeIndex2 = ref("1");
    const handleSelect = (key, keyPath) => {
      console.log(key, keyPath);
    };
    const month = getMonth(new Date());
    return {
      activeIndex,
      activeIndex2,
      handleSelect,
      month,
    };
  },
});
</script>

<style lang="scss">
html,
body {
  margin: 0;
  padding: 0;
  height: 100%;
  font-family: Helvetica Neue, Helvetica, PingFang SC, Hiragino Sans GB,
    Microsoft YaHei, SimSun, sans-serif;
  color: #2c3e50;
  font-weight: 400;
  -webkit-font-smoothing: antialiased;
  -webkit-tap-highlight-color: transparent;
  -moz-osx-font-smoothing: grayscale;
  -webkit-font-smoothing: antialiased;
}

.calendar {
  &__month {
    display: grid;
    grid-template-columns: repeat(7, auto);
    grid-template-rows: repeat(6, auto);
    border-top: 1px solid gray;
    border-left: 1px solid gray;
  }
  &__day {
    border-bottom: 1px solid gray;
    border-right: 1px solid gray;
    padding: 10px;
    display: grid;
    justify-content: center;
    align-content: center;
    &--add {
      color: rgb(236, 236, 236);
    }
  }
}
</style>

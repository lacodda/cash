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
      <div class="calendar">
        <div class="calendar__header">
          <el-button
            icon="el-icon-arrow-left"
            circle
            @click="prevMonth"
          ></el-button>
          <span>{{ monthName }}</span>
          <el-button
            icon="el-icon-arrow-right"
            circle
            @click="nextMonth"
          ></el-button>
        </div>
        <div class="calendar__week-days">
          <div v-for="(day, key) in week" :key="key">{{ day }}</div>
        </div>
        <div class="calendar__month">
          <div
            v-for="(day, key) in month"
            :key="key"
            class="calendar__day"
            :class="{
              'calendar__day--weekend': day.isWeekend,
              'calendar__day--prev': day.isPrev,
              'calendar__day--next': day.isNext,
            }"
          >
            {{ day.format }}
          </div>
        </div>
      </div>
    </el-main>
  </el-container>
</template>

<script lang="ts">
import { defineComponent, ref, reactive, computed } from "vue";
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
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
} from "date-fns";
import { ru } from "date-fns/locale";
import * as $R from "ramda";

const weekStartsOn = 1;
const calendarSize = 42;
const weekends = [6, 0];

function getWeek() {
  const now = new Date();
  const arr = eachDayOfInterval({
    start: startOfWeek(now, { weekStartsOn }),
    end: endOfWeek(now, { weekStartsOn }),
  });

  return arr.map((i) => format(i, "EEEE", { locale: ru }));
}

function getDayOfMonthStart(date: Date, isNext: boolean, day: number) {
  const start = startOfMonth(date);
  const newDate = addDays(start, day);
  const dayOfWeek = getDay(newDate);
  return {
    format: format(newDate, "dd"),
    dayOfWeek: getDay(newDate),
    isWeekend: weekends.includes(dayOfWeek),
    date: newDate,
    isNext,
  };
}

function getDayOfMonthEnd(date: Date, isPrev: boolean, day: number) {
  const end = endOfMonth(date);
  const newDate = subDays(end, day);
  const dayOfWeek = getDay(newDate);
  return {
    format: format(newDate, "dd"),
    dayOfWeek,
    isWeekend: weekends.includes(dayOfWeek),
    date: newDate,
    isPrev,
  };
}

function getMonth(date: Date) {
  const dayStart = $R.curry(getDayOfMonthStart);
  const dayEnd = $R.curry(getDayOfMonthEnd);
  const month = $R.times(dayStart(date, false), getDaysInMonth(date));
  const preMonth = $R.times(
    dayEnd(subMonths(date, 1), true),
    $R.head(month).dayOfWeek - weekStartsOn
  );
  const cal = $R.concat(preMonth, month);
  const postMonth = $R.times(
    dayStart(addMonths(date, 1), true),
    calendarSize - cal.length
  );
  return $R.concat(cal, postMonth);
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
    const now = new Date();
    let selectedMonth = ref(now);
    const week = getWeek();
    const month = computed(() => getMonth(selectedMonth.value));
    function prevMonth() {
      selectedMonth.value = subMonths(selectedMonth.value, 1);
    }
    function nextMonth() {
      selectedMonth.value = addMonths(selectedMonth.value, 1);
    }
    const monthName = computed(() =>
      format(selectedMonth.value, "LLLL", { locale: ru })
    );
    return {
      activeIndex,
      activeIndex2,
      handleSelect,
      month,
      week,
      prevMonth,
      nextMonth,
      monthName,
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
  --calendar-color-border: rgb(206, 206, 206);
  --calendar-color-text: rgb(83, 83, 83);
  --calendar-color-text-prev-next: rgb(175, 175, 175);
  --calendar-color-background: rgb(255, 255, 255);
  --calendar-color-hover: rgb(234, 255, 249);
  $calendar-color-weekend: rgb(255, 243, 243);
  --calendar-color-weekend: #{$calendar-color-weekend};
  --calendar-color-weekend-hover: #{darken($calendar-color-weekend, 3%)};
  &__header {
    display: grid;
    grid-template-columns: max-content auto max-content;
    grid-template-rows: auto;
    justify-items: center;
    align-items: center;
    padding: 10px;
    text-transform: capitalize;
  }
  &__week-days {
    display: grid;
    grid-template-columns: repeat(7, 1fr);
    grid-template-rows: auto;
    justify-items: center;
    align-items: center;
    padding: 10px;
    text-transform: capitalize;
  }
  &__month {
    display: grid;
    grid-template-columns: repeat(7, 1fr);
    grid-template-rows: repeat(6, auto);
    border-top: 1px solid var(--calendar-color-border);
    border-left: 1px solid var(--calendar-color-border);
  }
  &__day {
    --calendar-day-height: 90px;

    color: var(--calendar-color-text);
    background: var(--calendar-color-background);
    height: var(--calendar-day-height);
    border-bottom: 1px solid var(--calendar-color-border);
    border-right: 1px solid var(--calendar-color-border);
    padding: 10px;
    display: grid;
    justify-content: start;
    align-content: start;
    cursor: pointer;
    &:hover {
      background: var(--calendar-color-hover);
    }
    &--weekend {
      background: var(--calendar-color-weekend);
      &:hover {
        background: var(--calendar-color-weekend-hover);
      }
    }
    &--prev,
    &--next {
      color: var(--calendar-color-text-prev-next);
    }
  }
}
</style>

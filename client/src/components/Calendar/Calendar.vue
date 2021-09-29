<template>
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
          'calendar__day--today': day.isToday,
          'calendar__day--weekend': day.isWeekend,
          'calendar__day--add': !day.isSelectedMonth,
        }"
        @mouseover="calendar[key].hover = true"
        @mouseleave="calendar[key].hover = false"
      >
        <transition name="el-fade-in">
          <div v-show="show" :style="{ display: 'contents' }">
            {{ day.format }}

            <edit-time
              v-model:time="calendar[key].time"
              v-model:show="calendar[key].hover"
            />
          </div>
        </transition>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, reactive, computed, watchEffect } from "vue";
import { ElButton, ElPopover } from "element-plus";
import {
  startOfMonth,
  addDays,
  getDay,
  addMonths,
  subMonths,
  startOfWeekWithOptions,
  endOfWeekWithOptions,
  eachDayOfInterval,
  isWeekend,
  isSameMonth,
  isSameDay,
  setHours,
  parseISO,
  formatWithOptions,
} from "date-fns/fp";

import { ru } from "date-fns/locale";
import * as $R from "ramda";
import { IDay, IMonth, IDayData } from "@/models/CalendarModel";
import EditTime from "./EditTime";

const now: Date = new Date();
const weekStartsOn = 1;
const calendarSize = 42;
const startOfWeek = startOfWeekWithOptions({ weekStartsOn });
const endOfWeek = endOfWeekWithOptions({ weekStartsOn });
const formatLng = formatWithOptions({ locale: ru });
const formatDayOfWeek = formatLng("EEEE");
const formatMonthName = formatLng("LLLL y");
const formatDay = formatLng("dd");
const defaultTime = setHours(8, startOfWeek(now));

function getWeek() {
  return $R.pipe(
    eachDayOfInterval,
    $R.map(formatDayOfWeek)
  )({
    start: startOfWeek(now),
    end: endOfWeek(now),
  });
}

function getMonth(initDate: Date): IMonth {
  const firstDayOfMonth = startOfMonth(initDate);
  const start = startOfWeek(firstDayOfMonth);
  const end = addDays(calendarSize - 1, start);

  const day = (date: Date): IDay => ({
    date,
    format: formatDay(date),
    dayOfWeek: getDay(date),
    isWeekend: isWeekend(date),
    isToday: isSameDay(date, new Date()),
    isSelectedMonth: isSameMonth(initDate, date),
  });

  return $R.pipe(
    eachDayOfInterval,
    $R.map(day)
  )({
    start,
    end,
  });
}

function getCalendar(data: Array<IDayData>, month: IMonth) {
  const timeLens = $R.lensProp("time");
  const parseDate = $R.over(timeLens, parseISO);
  data = $R.map(parseDate, data);

  const sameDay = (date: Date) => $R.propSatisfies(isSameDay(date), "time");
  const setTime = (date: Date) => $R.find(sameDay(date), data);
  const setDefaultTime = $R.when($R.isNil, $R.always({ time: defaultTime }));
  const setHover = $R.assoc("hover", false);
  const getDate = $R.pipe(
    $R.prop("date"),
    setTime,
    setDefaultTime,
    setHover,
    reactive
  );

  return $R.map(getDate, month);
}

export default defineComponent({
  components: {
    ElButton,
    ElPopover,
    EditTime,
  },
  props: {
    data: {
      type: Array,
    },
  },
  setup(props) {
    const now = new Date();
    let show = ref(true);
    let selectedMonth = ref(now);
    const week = getWeek();
    const month = computed(() => getMonth(selectedMonth.value));
    function prevMonth() {
      selectedMonth.value = subMonths(1, selectedMonth.value);
    }
    function nextMonth() {
      selectedMonth.value = addMonths(1, selectedMonth.value);
    }
    const monthName = computed(() => formatMonthName(selectedMonth.value));
    const calendar = getCalendar(props.data, month.value);

    return {
      calendar,
      show,
      month,
      week,
      monthName,
      prevMonth,
      nextMonth,
    };
  },
});
</script>

<style lang="scss">
.calendar {
  --cal-color-border: rgb(206, 206, 206);

  --cal-color: rgb(83, 83, 83);
  --cal-bg: rgb(255, 255, 255);
  --cal-bg-hover: rgb(234, 255, 249);

  --cal-color-add: rgb(175, 175, 175);
  --cal-bg-add: rgb(247, 247, 247);
  --cal-bg-add-hover: rgb(235, 235, 235);

  $cal-bg-today: rgb(212, 255, 230);
  --cal-bg-today: #{$cal-bg-today};
  --cal-bg-today-hover: #{darken($cal-bg-today, 3%)};

  $cal-bg-weekend: rgb(255, 243, 243);
  --cal-bg-weekend: #{$cal-bg-weekend};
  --cal-bg-weekend-hover: #{darken($cal-bg-weekend, 3%)};

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
    border-top: 1px solid var(--cal-color-border);
    border-left: 1px solid var(--cal-color-border);
  }
  &__day {
    --cal-day-height: 90px;

    color: var(--cal-color);
    background: var(--cal-bg);
    height: var(--cal-day-height);
    border-bottom: 1px solid var(--cal-color-border);
    border-right: 1px solid var(--cal-color-border);
    padding: 10px;
    display: grid;
    grid-template-columns: repeat(2, auto);
    justify-content: space-between;
    align-content: start;
    cursor: pointer;

    &:hover {
      background: var(--cal-bg-hover);
    }
    &--weekend {
      background: var(--cal-bg-weekend);
      &:hover {
        background: var(--cal-bg-weekend-hover);
      }
    }
    &--today {
      background: var(--cal-bg-today);
      &:hover {
        background: var(--cal-bg-today-hover);
      }
    }
    &--add {
      color: var(--cal-color-add);
      background: var(--cal-bg-add);
      &:hover {
        background: var(--cal-bg-add-hover);
      }
    }
  }
}

.fade-enter-active,
.fade-leave-active {
  transition: all 0.3s ease-in-out;
}
.fade-enter,
.fade-leave-to {
  opacity: 0;
}
</style>

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
          'calendar__day--weekend': day.isWeekend,
          'calendar__day--prev': day.isPrev,
          'calendar__day--next': day.isNext,
          'calendar__day--today': day.isToday,
        }"
        @mouseover="hover[key] = true"
        @mouseleave="hover[key] = false"
      >
        <transition name="el-fade-in">
          <div v-show="show" :style="{ display: 'contents' }">
            {{ day.format }}

            <edit-button :show="hover[key]" />
          </div>
        </transition>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, reactive, computed } from "vue";
import {
  ElScrollbar,
  ElMenuItem,
  ElContainer,
  ElHeader,
  ElMain,
  ElMenu,
  ElSubMenu,
  ElButton,
  ElPopover,
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
  isToday,
} from "date-fns";
import { ru } from "date-fns/locale";
import * as $R from "ramda";
import EditButton from "./EditButton.vue";

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
    isToday: isToday(newDate),
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
    ElScrollbar,
    ElMenuItem,
    ElContainer,
    ElHeader,
    ElMain,
    ElMenu,
    ElSubMenu,
    ElButton,
    ElPopover,

    EditButton,
  },
  setup() {
    const now = new Date();
    let show = ref(true);
    let selectedMonth = ref(now);
    let hover = ref($R.times($R.always(false), calendarSize));
    const week = getWeek();
    const month = computed(() => getMonth(selectedMonth.value));
    function prevMonth() {
      show.value = false;
      setTimeout(() => {
        selectedMonth.value = subMonths(selectedMonth.value, 1);
        show.value = true;
      }, 500);
    }
    function nextMonth() {
      show.value = false;
      setTimeout(() => {
        selectedMonth.value = addMonths(selectedMonth.value, 1);
        show.value = true;
      }, 500);
    }
    const monthName = computed(() =>
      format(selectedMonth.value, "LLLL", { locale: ru })
    );
    return {
      show,
      hover,
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
.calendar {
  --calendar-color-border: rgb(206, 206, 206);
  --calendar-color-text: rgb(83, 83, 83);
  --calendar-color-text-prev-next: rgb(175, 175, 175);
  --calendar-color-background: rgb(255, 255, 255);
  --calendar-color-hover: rgb(234, 255, 249);
  $calendar-color-today: rgb(212, 255, 230);
  --calendar-color-today: #{$calendar-color-today};
  --calendar-color-today-hover: #{darken($calendar-color-today, 3%)};
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
    grid-template-columns: repeat(2, auto);
    justify-content: space-between;
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
    &--today {
      background: var(--calendar-color-today);
      &:hover {
        background: var(--calendar-color-today-hover);
      }
    }
    &--prev,
    &--next {
      color: var(--calendar-color-text-prev-next);
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

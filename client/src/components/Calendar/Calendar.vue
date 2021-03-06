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
        @mouseover="hover[key] = true"
        @mouseleave="hover[key] = false"
      >
        <transition name="el-fade-in">
          <div
            v-show="show"
            :style="{ display: 'contents' }"
            class="calendar__edit-time"
          >
            {{ day.formatted }}

            <edit-time
              v-if="day.isSelectedMonth"
              v-model:show="hover[key]"
              :dayData="calendar[key]"
              :defaultTime="defaultTime"
              @save="save"
            />
          </div>
        </transition>
        <div
          class="calendar__work-time"
          :class="{
            'calendar__work-time--success': calendar[key].success,
            'calendar__work-time--failure': calendar[key].failure,
          }"
        >
          {{ calendar[key].formatted }}
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import {
  defineComponent,
  ref,
  reactive,
  computed,
  watchEffect,
  watch,
} from 'vue';
import { ElButton, ElPopover } from 'element-plus';
import {
  startOfMonth,
  endOfMonth,
  startOfDay,
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
  setSeconds,
  parseISO,
  formatWithOptions,
  differenceInSeconds,
} from 'date-fns/fp';

import { ru } from 'date-fns/locale';
import * as $R from 'ramda';
import { IDay, IMonth, IDayData } from '@/models/calendar.model';
import EditTime from './EditTime';

const now: Date = new Date();
const weekStartsOn = 1;
const calendarSize = 42;
const startOfWeek = startOfWeekWithOptions({ weekStartsOn });
const endOfWeek = endOfWeekWithOptions({ weekStartsOn });
const formatLng = formatWithOptions({ locale: ru });
const formatDayOfWeek = formatLng('EEEE');
const formatMonthName = formatLng('LLLL y');
const formatDay = formatLng('dd');
const formatTime = formatLng('HH:mm');
const defaultWorkTime = 28800;
const defaultTime = setSeconds(defaultWorkTime, startOfDay(now));

function getWeek(): Array<string> {
  return $R.pipe(
    eachDayOfInterval,
    $R.map(formatDayOfWeek),
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
    // s:'',
    formatted: formatDay(date),
    dayOfWeek: getDay(date),
    isWeekend: isWeekend(date),
    isToday: isSameDay(date, new Date()),
    isSelectedMonth: isSameMonth(initDate, date),
  });

  return $R.pipe(
    eachDayOfInterval,
    $R.map(day),
  )({
    start,
    end,
  });
}

function getCalendar(data: Array<IDayData>, month: IMonth): Array<IDayData> {
  const dateLens = $R.lensProp('date');
  const timeLens = $R.lensProp('time');
  const setStatus = $R.ifElse(
    $R.propSatisfies($R.gte($R.__, defaultWorkTime), 'time'),
    $R.assoc('success', true),
    $R.assoc('failure', true),
  );
  const setTime = (dayData: IDayData) =>
    $R.over(
      timeLens,
      (time: number) => setSeconds(time, dayData.date),
      dayData,
    );
  const setFormatted = (dayData: IDayData) =>
    $R.assoc('formatted', formatTime($R.view(timeLens, dayData)), dayData);

  data = $R.map(
    $R.pipe(
      $R.over(dateLens, $R.pipe(parseISO, startOfDay)),
      setStatus,
      setTime,
      setFormatted,
    ),
    data,
  );

  const sameDay = (date: Date) => $R.propSatisfies(isSameDay(date), 'date');
  const findSameDay = (date: Date) => $R.find(sameDay(date), data);
  const merge = ({ date }: IDay) => $R.mergeRight({ date }, findSameDay(date));
  const getDate = $R.pipe($R.pick(['date']), merge);

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
  emits: ['save', 'remove', 'selectMonth'],

  setup(props, { emit }) {
    const show = ref(true);
    const selectedMonth = ref(now);
    const week: Array<string> = getWeek();
    const month: IMonth = computed(() => getMonth(selectedMonth.value));
    const monthName = computed(() => formatMonthName(selectedMonth.value));
    const hover: Array<boolean> = reactive($R.times($R.F, calendarSize));
    const calendar = computed(() =>
      reactive(getCalendar(props.data, month.value)),
    );

    watch(
      selectedMonth,
      (value) => {
        if (value) {
          selectMonth(selectedMonth.value);
        }
      },
      { immediate: true },
    );

    function prevMonth(): void {
      selectedMonth.value = subMonths(1, selectedMonth.value);
    }

    function nextMonth(): void {
      selectedMonth.value = addMonths(1, selectedMonth.value);
    }

    function selectMonth(month: Date): void {
      emit('selectMonth', {
        from: startOfMonth(month),
        to: endOfMonth(month),
      });
    }

    function save(dayData: IDayData): void {
      const time = $R.pipe(
        startOfDay,
        differenceInSeconds(dayData.time),
        Math.abs,
      )(dayData.time);

      if (time) {
        emit('save', { ...dayData, time });
        return;
      }

      emit('remove', dayData);
    }

    return {
      calendar,
      hover,
      show,
      month,
      week,
      monthName,
      defaultTime,
      prevMonth,
      nextMonth,
      save,
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

  --work-time-success: rgb(159 255 151);
  --work-time-failure: rgb(255 166 166);

  &__header {
    display: grid;
    grid-template-columns: max-content auto max-content;
    grid-template-rows: auto;
    justify-items: center;
    align-items: center;
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
    --cal-day-height: 70px;

    color: var(--cal-color);
    background: var(--cal-bg);
    height: var(--cal-day-height);
    border-bottom: 1px solid var(--cal-color-border);
    border-right: 1px solid var(--cal-color-border);
    padding: 10px;
    display: grid;
    grid-template-columns: auto 28px;
    grid-template-rows: 28px auto;
    justify-content: space-between;
    align-content: start;
    cursor: default;
    grid-template-areas:
      'day-num edit-time'
      'work-time work-time';

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
  &__day-num {
    grid-area: day-num;
  }
  &__edit-time {
    grid-area: edit-time;
  }
  &__work-time {
    grid-area: work-time;
    font-size: 25px;
    font-weight: 700;
    color: gray;
  }
  &__work-time--success {
    color: var(--work-time-success);
  }
  &__work-time--failure {
    color: var(--work-time-failure);
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

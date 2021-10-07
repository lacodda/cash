export interface IDay {
  date: Date;
  format: string;
  dayOfWeek: string;
  isWeekend: boolean;
  isToday: boolean;
  isSelectedMonth: boolean;
}

export interface IMonth {
  [index: number]: IDay;
}

export interface IDayData {
  _id: string;
  dateTime: string;
}

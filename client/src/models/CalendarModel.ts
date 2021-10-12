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
  date: string;
  time?: number | Date;
  _id?: string;
}

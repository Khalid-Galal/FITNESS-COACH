export interface Message {
  role: 'user' | 'model';
  text: string;
  timestamp: Date;
}

export enum DayOfWeek {
  Monday = 'Monday',
  Tuesday = 'Tuesday',
  Wednesday = 'Wednesday',
  Thursday = 'Thursday',
  Friday = 'Friday',
  Saturday = 'Saturday',
  Sunday = 'Sunday',
}

export interface DailyTargets {
  protein: number;
  steps: number;
  water: number;
  caloriesMin: number;
  caloriesMax: number;
}

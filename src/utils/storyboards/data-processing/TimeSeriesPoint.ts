export interface TimeSeriesPoint {
  date: Date;
  y?: number;
  [key: string]: any;
}
 
export type TimeSeriesData = TimeSeriesPoint[];

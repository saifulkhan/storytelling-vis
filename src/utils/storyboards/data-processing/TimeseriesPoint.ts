export interface TimeSeriesPoint {
  date: Date;
  y: number;
  [key: string]: any;
}

export interface MLTimeseriesData extends Omit<TimeSeriesPoint, 'y'> {
  y?: number;
}

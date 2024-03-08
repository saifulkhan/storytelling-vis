export type TimeseriesDataType = {
  date: Date;
  y: number;
};

export type ML_TimeseriesDataType = Omit<TimeseriesDataType, "y"> & {
  mean_test_accuracy: number;
  mean_training_accuracy: number;
  channels: number;
  kernel_size: number;
  layers: number;
  samples_per_class: number;
};

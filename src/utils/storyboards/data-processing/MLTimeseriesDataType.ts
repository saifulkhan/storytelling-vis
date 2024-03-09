export type MLTimeseriesDataType = {
  date: Date;
  mean_test_accuracy: number;
  mean_training_accuracy: number;
  channels: number;
  kernel_size: number;
  layers: number;
  samples_per_class: number;
};

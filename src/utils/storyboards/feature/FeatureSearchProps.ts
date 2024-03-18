export type FeatureSearchProps = {
  metric?: string;
  window?: number;
  smoothing?: number;
};

export const defaultFeatureSearchProps: FeatureSearchProps = {
  metric: "",
  window: 10,
  smoothing: 10,
};

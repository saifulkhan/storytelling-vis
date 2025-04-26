export type {
  HorizontalAlign,
  VerticalAlign,
  TimeSeriesPoint,
  TimeSeriesData,
  Coordinate,
  TimelineActions,
} from './types';

export { Colors, getSchemeTableau10 } from './components/Colors';

export type {
  ActionTableRow,
  FeatureActionTableRow,
  FeatureActionTableData,
  AnimationType,
  LineProps,
} from './components';

export {
  Circle,
  Connector,
  Dot,
  ActionGroup,
  TextBox,
  ActionName,
  ActionPropertiesTable,
  FeaturePropertiesTable,
  ActionTable,
  LinePlot,
  MirroredBarChart,
  ParallelCoordinatePlot,
} from './components';

export {
  FeatureActionFactory,
  CategoricalFeature,
  sortTimeseriesData,
  searchPeaks,
  Peak,
  sliceTimeseriesByDate,
  generateGaussForPeaks,
  generateGaussForCatFeatures,
  maxAcrossSeries,
  combineSeries,
  gmm,
  segmentByImportantPeaks,
} from './utils';

export { usePlayPauseLoop, useSynchronizedPlots } from './hooks/';

import { TimeSeriesData, TimeSeriesPoint } from '../types';
import { findDateIdx } from '../common';
import { Peak } from './Peak';
import { CategoricalFeature } from './CategoricalFeature';
import { searchPeaks } from './feature-search';
import { rankPeaksByNormHeight } from './ranking';

// TODO: These magic numbers should be defined better way
const WINDOW_SIZE = 10;

/**
 * Generates a combined Gaussian Mixture Model (GMM) time series from numerical and categorical features.
 *
 * This function creates Gaussian curves for both numerical peaks and categorical features in the input time series data.
 * It then computes the maximum value across all generated Gaussian series for each type (numerical and categorical),
 * and finally combines these into a single time series using the provided combineSeries utility.
 *
 * @param {TimeSeriesData} data - The input time series data to process.
 * @param {CategoricalFeature[]} categoricalFeatures - The categorical features to include in Gaussian generation.
 * @returns {TimeSeriesData} The combined time series data representing the GMM.
 */
export function gmm(
  data: TimeSeriesData,
  categoricalFeatures: CategoricalFeature[],
): TimeSeriesData {
  const ntsGauss: TimeSeriesData[] = generateGaussForPeaks(data);
  const ctsGauss: TimeSeriesData[] = generateGaussForCatFeatures(
    data,
    categoricalFeatures,
  );
  const ntsBoundGauss: TimeSeriesData = maxAcrossSeries(data, ntsGauss);
  const ctsBoundGauss: TimeSeriesData = maxAcrossSeries(data, ctsGauss);

  console.log('gmm: ntsBoundGauss:', ntsBoundGauss);
  console.log('gmm: ctsBoundGauss:', ctsBoundGauss);

  const combined = combineSeries(data, [ntsBoundGauss, ctsBoundGauss]);
  console.log('gmm: combined:', combined);

  return combined;
}

/**
 * Generates Gaussian time series curves for each detected peak in the input data.
 *
 * For each peak (numerical feature) detected in the time series, this function:
 *   - Finds the index of the peak in the data
 *   - Uses the normalized height of the peak as the amplitude
 *   - Creates a Gaussian curve centered at the peak
 *
 * @param data - The input time series data
 * @param metric - The metric to use for peak detection
 * @param window - The window size for peak detection
 * @returns An array of TimeSeriesData, each representing a Gaussian curve for a peak
 */
export function generateGaussForPeaks(
  data: TimeSeriesData,
  metric: string = '',
  window: number = WINDOW_SIZE,
): TimeSeriesData[] {
  if (!data || data.length === 0) {
    throw new Error('No data provided');
  }

  const peaks = searchPeaks(data, 0, metric, window);
  rankPeaksByNormHeight(peaks); // or rankPeaksByHeight

  // prettier-ignore
  console.debug('generateGaussForPeaks: peaks:', peaks.map((d) => d.getNormHeight()));

  const gaussTSData: TimeSeriesData[] = peaks.map((d: Peak) => {
    const index = findDateIdx(d.getDate(), data);
    const height = d.getNormHeight();
    const gauss: number[] = gaussian(index, height, data.length);
    return mapGaussToTimeSeries(gauss, data);
  });

  return gaussTSData;
}

/**
 * Generates Gaussian time series curves for each categorical feature/event in the input data.
 *
 * For each categorical feature (event), this function:
 *   - Finds the index of the event in the data (by date)
 *   - Uses the event's rank as the amplitude
 *   - Creates a Gaussian curve centered at the event
 *
 * @param data - The input time series data
 * @param categoricalFeatures - Array of categorical features/events
 * @returns An array of TimeSeriesData, each representing a Gaussian curve for a categorical feature
 */
export function generateGaussForCatFeatures(
  data: TimeSeriesData,
  categoricalFeatures: CategoricalFeature[],
): TimeSeriesData[] {
  const gaussTSData: TimeSeriesData[] = categoricalFeatures.map(
    (feature: CategoricalFeature) => {
      const index = findDateIdx(feature.getDate(), data);
      const height = feature.getRank();
      const gauss: number[] = gaussian(index, height, data.length);
      return mapGaussToTimeSeries(gauss, data);
    },
  );

  return gaussTSData;
}

/**
 * Maps a gaussian array (number[]) to TimeSeriesData using the dates from a reference series.
 * @param gauss - Array of y-values (e.g., a Gaussian curve)
 * @param reference - Reference time series with date properties
 * @returns Array of { date, y } objects
 */
function mapGaussToTimeSeries(
  gauss: number[],
  reference: TimeSeriesData,
): TimeSeriesData {
  return gauss.map((y, i) => ({ date: reference[i].date, y }));
}

/**
 * Generates a Gaussian curve as an array of numbers.
 * This code can be improved, based on requirement.
 *
 * The curve is centered at `mean`, has amplitude `h`, and is spread according to `w` (width).
 * If `w` is not provided, a default width is calculated to keep the curve's shape consistent.
 *
 * The formula for each value is:
 *   y[i] = h * exp(-((i - μ)^2) / (2 * σ^2))
 * where σ = w / 3 (if w provided), or (h * EIGHT) / THREE otherwise.
 *
 * @param μ The center index (mean) of the Gaussian peak.
 * @param h The height (amplitude) of the peak.
 * @param len The length of the output array.
 * @param w (Optional) The width of the peak. If not specified, a default is calculated.
 * @returns Array of length `len` containing the Gaussian curve values.
 */

function gaussian(μ: number, h: number, len: number, w?: number): number[] {
  const σ = w
    ? w / 3 // 99.7% of the area under the curve lies within ±3 standard deviations from the mean.
    : h * 2.355; // 2 * sqrt(2 * ln(2)) is the full-width at half-maximum (FWHM) of a Gaussian distribution, used to calculate the width of the peak.

  // console.log(`gaussian:  μ: ${μ}, h: ${h}, len: ${len}, w: ${w}, σ: ${σ}`);

  const gauss: number[] = Array(len).fill(0);
  for (let i = 0; i < len; i++) {
    gauss[i] = h * Math.exp(-((i - μ) ** 2) / (2 * σ ** 2));
  }
  return gauss;
}

/**
 * Computes the upper envelope (maximum y-value at each time point) across multiple gaussian timeseries.
 *
 * Given an array of time series (e.g., Gaussian curves), this function finds, for each time index,
 * the maximum y-value across all series and constructs a new time series with these maxima.
 *
 * @param referenceData - The reference time series providing the date values for the output.
 * @param inputSeries - An array of time series (arrays of {date, y}) to compare.
 * @returns A new time series where each point contains the date from the reference series and the maximum y-value across all input series at that index.
 */
export function maxAcrossSeries(
  referenceData: TimeSeriesData,
  inputSeries: TimeSeriesData[],
): TimeSeriesData {
  const featuresGauss = inputSeries.map((g) => g.map((d) => d.y ?? 0));
  // console.log('featuresGauss: ', featuresGauss);

  const len = featuresGauss[0].length;
  const maxValues = Array(len).fill(Number.NEGATIVE_INFINITY);

  featuresGauss.forEach((g) =>
    g.forEach(
      (d, i) =>
        typeof d === 'number' &&
        !isNaN(d) &&
        (maxValues[i] = Math.max(maxValues[i], d)),
    ),
  );

  // console.log('maxValues: ', maxValues);

  return maxValues.map((d, i) => ({
    date: referenceData[i].date,
    y: d,
  }));
}

/**
 * Combines multiple time series into a single representative timeseries.
 *
 * This versatile function can:
 * 1. Compute the average (mean) of multiple time series
 * 2. Create a new timeseries with values derived from multiple input series
 *
 * It handles both raw numeric arrays and TimeSeriesData objects, extracting y-values
 * when needed and mapping the result back to the original date format.
 *
 * @param referenceData - The reference timeseries providing the date values for the output.
 * @param inputSeries - Array of timeseries to combine. Can be either:
 *                     - An array of TimeSeriesData objects
 *                     - An array of numeric arrays (already extracted y-values)
 * @returns A new timeseries where each point contains the date from the reference timeseries
 *          and the combined y-value across all input timeseries at that index.
 */
export function combineSeries(
  referenceData: TimeSeriesData,
  inputSeries: TimeSeriesData[],
): TimeSeriesData {
  if (
    !referenceData ||
    !referenceData.length ||
    !inputSeries ||
    !inputSeries.length
  ) {
    console.error('Invalid inputs to combineSeries');
    return [];
  }

  const numericData: number[][] = inputSeries.map((series: TimeSeriesData) =>
    series.map((point: TimeSeriesPoint) => point.y ?? 0),
  );

  let result: number[];

  const len = numericData[0].length;
  const numSeries = numericData.length;
  result = Array(len).fill(0);

  numericData.forEach((series) =>
    series.forEach((value, i) => {
      if (typeof value === 'number' && !isNaN(value)) {
        result[i] += value / numSeries;
      }
    }),
  );

  // map back to TimeSeriesData format
  return result.map((value, i) => ({
    date: referenceData[i].date,
    y: value,
  }));
}

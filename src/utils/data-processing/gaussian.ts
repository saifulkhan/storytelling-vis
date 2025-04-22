import { TimeSeriesData } from '../../types/';
import { findDateIdx } from '../common';
import { Peak, searchPeaks, CategoricalFeature } from '../feature-action';
import { rankPeaksByNormHeight } from './ranking';

// TODO: These magic numbers should be defined better way
const WINDOW_SIZE = 10;

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
  window: number = WINDOW_SIZE
): TimeSeriesData[] {
  const peaks = searchPeaks(data, 0, metric, window);
  rankPeaksByNormHeight(peaks); // or rankPeaksByHeight

  console.log(
    'generateGaussForPeaks: peaks:',
    peaks.map((d) => d.getNormHeight())
  );

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
  categoricalFeatures: CategoricalFeature[]
): TimeSeriesData[] {
  const gaussTSData: TimeSeriesData[] = categoricalFeatures.map(
    (feature: CategoricalFeature) => {
      const index = findDateIdx(feature.getDate(), data);
      const height = feature.getRank();
      const gauss: number[] = gaussian(index, height, data.length);
      return mapGaussToTimeSeries(gauss, data);
    }
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
  reference: TimeSeriesData
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

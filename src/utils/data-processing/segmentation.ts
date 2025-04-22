import { TimeSeriesData, TimeSeriesPoint } from 'src/types';
import { Peak, searchPeaks } from '../feature-action';
import { rankPeaksByNormHeight } from './ranking';

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

/**
 * Segments a time series by identifying important peaks.
 *
 * The algorithm selects peaks with at least a minimal gap (deltaMax) between neighboring peaks.
 * In this way, we ensure that the most important temporal points are selected and
 * located at the section boundaries. The algorithm prioritizes peaks that are:
 * 1. Far from already selected peaks (to ensure good distribution)
 * 2. Have significant height (unless ignoreHeight is true)
 *
 * @param data - The time series data to segment
 * @param deltaMax - Minimum distance between peaks (as a fraction of the total data length, 0-1)
 * @param ignoreHeight - If true, peak height is ignored when calculating importance
 * @returns A tuple containing [all peaks found, ordered important peaks]
 */
export function segmentByImportantPeaks(
  data: TimeSeriesData,
  deltaMax = 0.1, // default minimum gap of 10% of the data length
  ignoreHeight = false,
): [Peak[], { idx: number; h: number }[]] {
  // Find and rank all peaks in the data
  let peaks: Peak[] = searchPeaks(data);
  rankPeaksByNormHeight(peaks);
  const dataLength = data.length;

  // Create a simplified representation of peaks with just index and height
  const peakIndices: { idx: number; h: number }[] = peaks.map((d: Peak) => ({
    idx: d.getDataIndex(),
    h: d.getNormHeight(),
  }));

  // Sort peaks by height (highest first) for better peak selection
  const sortedPeaks = [...peakIndices].sort((a, b) => b.h - a.h);
  console.log('segmentByImportantPeaks: peakIndices: ', peakIndices);
  console.log('segmentByImportantPeaks: sortedPeaks: ', sortedPeaks);

  // Convert deltaMax from a fraction to actual indices
  const minGapIndices = Math.floor(deltaMax * dataLength);

  // Array to store the selected peaks in order of importance
  const ordering: { idx: number; h: number }[] = [];

  // First, add the highest peak to start
  if (sortedPeaks.length > 0) {
    const highestPeakIndex = peakIndices.findIndex(
      (p) => p.idx === sortedPeaks[0].idx && p.h === sortedPeaks[0].h,
    );
    if (highestPeakIndex !== -1) {
      ordering.push(peakIndices[highestPeakIndex]);
      peakIndices.splice(highestPeakIndex, 1);
    }
  }

  // Then select remaining peaks that maintain the minimum gap
  while (peakIndices.length > 0) {
    let bestPeak:
      | {
          valley: { idx: number; h: number };
          idx: number;
          score: number;
          minGap: number;
        }
      | undefined;

    peakIndices.forEach((candidate, i) => {
      // Calculate the minimum distance to any already selected peak
      const minDistToSelected = ordering.reduce(
        (closest, selected) =>
          Math.min(closest, Math.abs(candidate.idx - selected.idx)),
        dataLength, // Initialize with max possible distance
      );

      // Calculate distance to boundaries as well
      const distToBoundaries = Math.min(
        candidate.idx,
        dataLength - candidate.idx,
      );

      // The effective minimum gap is the smaller of the two distances
      const effectiveMinGap = Math.min(minDistToSelected, distToBoundaries);

      // Only consider this peak if it maintains the minimum gap requirement
      if (effectiveMinGap >= minGapIndices) {
        // Score is based on a combination of gap size and peak height
        const gapScore = effectiveMinGap / dataLength;
        const heightScore = ignoreHeight ? 1 : candidate.h;
        const score = gapScore * heightScore;

        // Update best peak if this one has a better score
        if (!bestPeak || score > bestPeak.score) {
          bestPeak = {
            valley: candidate,
            idx: i,
            score: score,
            minGap: effectiveMinGap,
          };
        }
      }
    });

    // If we found a valid peak, add it to our ordering
    if (bestPeak) {
      peakIndices.splice(bestPeak.idx, 1);
      ordering.push(bestPeak.valley);
    } else {
      // If no peak satisfies the gap requirement, we're done
      break;
    }
  }

  return [peaks, ordering];
}

/**
 * Segments time series data by finding important peaks with a minimum distance constraint.
 * This function directly analyzes the time series data to find peaks, without requiring
 * pre-processing through the Peak class.
 *
 * @param data - The time series data to segment
 * @param k - Number of segments to create (k-1 peaks)
 * @param deltaMax - Minimum distance between peaks as a fraction (0-1) of total data length
 * @returns Array of indices representing the most important peaks
 */
export function segmentTimeSeries(
  data: TimeSeriesData,
  k: number,
  deltaMax = 0.1,
): number[] {
  if (k <= 1 || data.length === 0) {
    return [];
  }

  // Calculate the actual minimum distance in data points
  const minDistance = Math.ceil(deltaMax * data.length);

  // Calculate the prominence of each point (how much it stands out)
  const prominences: { index: number; value: number }[] = [];

  for (let i = 1; i < data.length - 1; i++) {
    const current = data[i].y ?? 0;
    const prev = data[i - 1].y ?? 0;
    const next = data[i + 1].y ?? 0;

    // A point is a peak if it's higher than its neighbors
    if (current > prev && current > next) {
      // Calculate prominence (how much the peak stands out)
      // Simple way: how much higher the peak is compared to its neighbors
      const prominence = Math.min(current - prev, current - next);
      prominences.push({ index: i, value: prominence });
    }
  }

  // Sort peaks by prominence (highest first)
  prominences.sort((a, b) => b.value - a.value);

  // Select peaks with the distance constraint
  const selectedPeaks: number[] = [];

  for (const peak of prominences) {
    // Check if this peak is far enough from already selected peaks
    const isFarEnough = selectedPeaks.every(
      (selectedIndex) => Math.abs(peak.index - selectedIndex) >= minDistance,
    );

    if (isFarEnough) {
      selectedPeaks.push(peak.index);

      // Break once we have k-1 peaks
      if (selectedPeaks.length === k - 1) {
        break;
      }
    }
  }

  // Sort peaks by their position in the time series
  return selectedPeaks.sort((a, b) => a - b);
}

import { TimeSeriesData } from '../types';
import { Peak } from './Peak';
import { rankPeaksByNormHeight } from './ranking';
import { Segment } from '../types';
import { searchPeaks } from './feature-search';

/**
 * Segments by the k most important peaks.
 *
 * Returns an array of objects containing the index and the corresponding date of each segmentation point.
 *
 * @param data - The time series data to segment
 * @param k - Number of segments (number of peaks to select)
 * @returns Array of objects: { idx: number, date: Date }
 */
export function segmentByPeaks(data: TimeSeriesData, k: number): Segment[] {
  let peaks: Peak[] = searchPeaks(data);
  rankPeaksByNormHeight(peaks);

  // create peaks with just index and height
  const peakIndices: { idx: number; h: number }[] = peaks.map((d: Peak) => ({
    idx: d.getDataIndex(),
    h: d.getNormHeight(),
  }));

  peakIndices.sort((a, b) => b.h - a.h);

  return peakIndices
    .slice(0, k - 1)
    .map((d) => ({ idx: d.idx, date: data[d.idx]?.date }));
}

/**
 * Segments a time series by identifying the k most important peaks with a minimum gap.
 *
 * Returns an array of objects containing the index and the corresponding date of each segmentation point.
 *
 * @param data - The time series data to segment
 * @param k - Number of segments (number of peaks to select)
 * @param deltaMax - Minimum distance between peaks (as a fraction of the total data length, 0-1)
 * @returns Array of objects: { idx: number, date: Date }
 */
export function segmentByImportantPeaks(
  data: TimeSeriesData,
  k: number,
  deltaMax = 0.1,
): Segment[] {
  // Find and rank all peaks in the data
  let peaks: Peak[] = searchPeaks(data);
  rankPeaksByNormHeight(peaks);
  const dataLength = data.length;

  // Create a simplified representation of peaks with just index and height
  const peakIndices: { idx: number; h: number }[] = peaks.map((d: Peak) => ({
    idx: d.getDataIndex(),
    h: d.getNormHeight(),
  }));

  const ordering: { idx: number; h: number }[] = [];

  while (peakIndices.length) {
    let bestPeak:
      | { valley: { idx: number; h: number }; idx: number; score: number }
      | undefined;

    peakIndices.forEach((v1, i) => {
      let closestDist = ordering.reduce(
        (closest, v2) => Math.min(closest, Math.abs(v1.idx - v2.idx)),
        Math.min(v1.idx, dataLength - v1.idx),
      );
      let score = (closestDist / dataLength) * (v1.h / 2);
      bestPeak =
        bestPeak && bestPeak.score > score
          ? bestPeak
          : { valley: v1, idx: i, score: score };
    });
    peakIndices.splice(bestPeak!.idx, 1);
    ordering.push(bestPeak!.valley);
  }

  return ordering
    .slice(0, k - 1)
    .map((d) => ({ idx: d.idx, date: data[d.idx]?.date }));
}

/**
 * Segments time series data by finding important peaks with a minimum distance constraint.
 * This function directly analyzes the time series data to find peaks, without requiring
 * pre-processing through the Peak class.
 *
 * @param data - The time series data to segment
 * @param k - Number of segments to create (k-1 peaks)
 * @param deltaMax - Minimum distance between peaks as a fraction (0-1) of total data length
 * @returns Array of objects: { idx: number, date: Date }
 */
export function segmentByImportantPeaks1(
  data: TimeSeriesData,
  k: number,
  deltaMax = 0.1,
): Segment[] {
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

  // Sort peaks by their position in the time series and map to objects with idx and date
  return selectedPeaks
    .sort((a, b) => a - b)
    .map((idx) => ({ idx, date: data[idx]?.date }));
}

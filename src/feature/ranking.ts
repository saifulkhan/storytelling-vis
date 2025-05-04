import { scaleValue } from '../common';
import { Peak } from './Peak';

/* Rank used between 0 and MAX_RANK */
const MAX_RANK = 10;

/**
 * Assigns discrete ranks to an array of Peak objects based on their height.
 * Discrete, grouped ranks (good for categorical/bucketed analysis).
 *
 * - Sorts the peaks in ascending order of height.
 * - Divides the sorted peaks into MAX_RANK equal groups.
 * - Assigns a discrete rank between [1, MAX_RANK] to each peak according to its group,
 *   so the smallest peak gets rank 1, the next group gets rank 2, etc.
 *
 * @param peaks Array of Peak objects to be ranked.
 * @returns The same array of Peak objects, each with its rank set via setRank().
 */
export function rankPeaksByHeight(peaks: Peak[]) {
  if (peaks.length === 0) return;
  // create a sorted copy for ranking
  const sorted = [...peaks].sort((p1, p2) => p1.getHeight() - p2.getHeight());
  const numPeaks = sorted.length;
  const groupSize = numPeaks / MAX_RANK;

  // map from Peak to its rank
  const peakToRank = new Map<Peak, number>();
  sorted.forEach((p: Peak, i: number) => {
    const rank = 1 + Math.floor(i / groupSize);
    peakToRank.set(p, rank);
  });

  // assign rank in original order
  peaks.forEach((p) => {
    p.setRank(peakToRank.get(p) || 1);
  });
}

/**
 * Assigns normalized height to an array of Peak objects based on their height.
 * Continuous, normalized values (good for smooth, relative comparisons).
 *
 * - Sorts the peaks in ascending order of height.
 * - Finds the maximum and minimum height values.
 * - For each peak, calculates a normalized value (using scaleValue) that
 *   linearly maps its height to a continuous value between [1, MAX_RANK].
 *
 * @param peaks Array of Peak objects to be ranked.
 * @returns The same array of Peak objects, each with its normalized rank set via setNormHeight().
 */
export function setPeaksNormHeight(peaks: Peak[]) {
  if (peaks.length === 0) return;
  // create a sorted copy for normalization
  const sorted = [...peaks].sort((p1, p2) => p1.getHeight() - p2.getHeight());

  const maxValue = sorted[sorted.length - 1].getHeight();
  const minValue = sorted[0].getHeight();

  // map from Peak to its normalized height
  const peakToNorm = new Map<Peak, number>();
  sorted.forEach((p) => {
    peakToNorm.set(
      p,
      scaleValue(p.getHeight(), minValue, maxValue, 1, MAX_RANK),
    );
  });

  // assign normalized height in original order
  peaks.forEach((p) => {
    p.setNormHeight(peakToNorm.get(p) || 1);
  });
}

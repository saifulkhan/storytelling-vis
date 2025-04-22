import { scaleValue } from "../common";
import { Peak } from "../feature-action";

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
  peaks.sort((p1, p2) => p1.getHeight() - p2.getHeight());
  // console.log("rankPeaksByHeight: peaks:", peaks);
  const numPeaks = peaks.length;
  const groupSize = numPeaks / MAX_RANK;

  peaks.forEach((p: Peak, i: number) => {
    const rank = 1 + Math.floor(i / groupSize);
    p.setRank(rank);
  });

  // console.log("rankPeaksByHeight: peaks:", peaks);
  return peaks;
}

/**
 * Assigns normalized ranks to an array of Peak objects based on their height.
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
export function rankPeaksByNormHeight(peaks: Peak[]) {
  peaks.sort((p1, p2) => p1.getHeight() - p2.getHeight());
  // console.log("rankPeaksByNormHeight: peaks:", peaks);
  const maxValue = peaks.reduce(
    (max: number, obj: Peak) => (obj.getHeight() > max ? obj.getHeight() : max),
    peaks[0].getHeight()
  );

  const minValue = peaks.reduce(
    (min: number, obj: Peak) => (obj.getHeight() < min ? obj.getHeight() : min),
    peaks[0].getHeight()
  );

  peaks.forEach((p: Peak) => {
    p.setNormHeight(scaleValue(p.getHeight(), minValue, maxValue, 1, MAX_RANK));
  });

  // console.log("rankPeaksByNormHeight: peaks:", peaks);
  return peaks;
}

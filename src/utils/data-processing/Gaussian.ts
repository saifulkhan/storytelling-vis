import { Peak } from "src/utils/feature-action/Peak";
import { TimeSeriesPoint, TimeSeriesData } from "src/types/TimeSeriesPoint";
import { searchPeaks } from "src/utils/feature-action/feature-search";
import { NumericalFeature } from "src/utils/feature-action/NumericalFeature";
import { CategoricalFeature } from "src/utils/feature-action/CategoricalFeature";
import { findDateIdx, scaleValue } from "src/utils/common";

const RANK_MAX = 10; /** or r_max  */

export function gmm(data: TimeSeriesData, metric: string, window: number) {
  // step 1. create nts
  let peaks = searchPeaks(data, 0, metric, window);
  // step 1.a. rank peaks by its height, assign rank between 1 to MAX_RANK
  peaks = rankByNormHeight(peaks);
  console.log("gmm: ranked nts: ", peaks);

  // step 2. calculate gaussian for nts
  const _gaussian = toGaussian(peaks, data);
  console.log("gmm: gaussian: ", _gaussian);
  const maxbounds = maxBounds(_gaussian);
  console.log("gmm: maxbounds: ", maxbounds);

  // step 3. create cts
  // let _cts = cts();
  // console.log("gmm: ranked nts: ", _nts);

  // // step 2. calculate gaussian for nts
  // const gaussian = featureToGaussian(_nts, data);
  // console.log("gmm: gaussian: ", gaussian);
  // const bounds = maxBounds(gaussian);
  // console.log("gmm: bounds: ", bounds);

  return _gaussian;
}

/**
 ** Create numerical timeseries (nts)
 **/
export function nts(
  data: TimeSeriesData,
  metric: string,
  window: number
): Peak[] {
  return searchPeaks(data, 0, metric, window);
}

function rankByHeight(peaks: Peak[]) {
  peaks.sort((p1, p2) => p1.getHeight() - p2.getHeight());

  console.log("rankByHeight: peaks:", peaks);

  const nPeaks = peaks.length;
  // size of each ranking group
  const groupSize = nPeaks / RANK_MAX;

  peaks.forEach((p, i) => {
    console.log("rankByHeight:", 1 + Math.floor(i / groupSize));
    p.setRank(1 + Math.floor(i / groupSize));
  });

  return peaks;
}

function rankByNormHeight(peaks: Peak[]) {
  peaks.sort((p1, p2) => p1.getHeight() - p2.getHeight());

  // Find maximum
  const maxValue = peaks.reduce(
    (max, obj) => (obj.getHeight() > max ? obj.getHeight() : max),
    peaks[0].getHeight()
  );

  // Find minimum
  const minValue = peaks.reduce(
    (min, obj) => (obj.getHeight() < min ? obj.getHeight() : min),
    peaks[0].getHeight()
  );

  peaks.forEach((p, i) => {
    p.setNormHeight(scaleValue(p.getHeight(), minValue, maxValue, 0, RANK_MAX));
  });

  return peaks;
}

/**
 ** Create categorical timeseries (cts)
 **/

const EIGHT = 8,
  THREE = 3;

/**
 ** Given an an array of features it calculates gaussian curves to represent
 ** their ranks.
 ** Arguments: [feature1, feature2, ...].
 ** Returns: Array of gaussian of each input feature, e.g., [gauss1, gauss2, ...]
 **/
export function toGaussian(
  features: NumericalFeature[] | CategoricalFeature[] | Peak[],
  data: TimeSeriesPoint[]
): number[][] {
  console.log("toGaussian: features:", features);

  // Ensure we have features to process
  if (!features || features.length === 0) {
    return [];
  }

  const featuresGauss: number[][] = features.map(
    (d: NumericalFeature | CategoricalFeature | Peak) => {
      // Make sure we can get a date from the feature
      if (!d || typeof d.getDate !== 'function') {
        console.error('Invalid feature object:', d);
        return Array(data.length).fill(0);
      }
      
      const index = findDateIdx(d.getDate(), data);
      
      // Use type guard to check if getNormHeight exists on the object
      let height: number;
      if ('getNormHeight' in d && typeof d.getNormHeight === 'function') {
        height = d.getNormHeight();
      } else if ('getRank' in d && typeof d.getRank === 'function') {
        height = d.getRank();
      } else {
        console.error('Feature missing required methods:', d);
        height = 0;
      }
      
      return gaussian(index, height, data.length);
    }
  );

  return featuresGauss;
}

/**
 ** Creates a gaussian distribution with mean, height and width parameters.
 ** len is used to size the return vector to the same length as the timeseries data.
 ** If width is not specified we calculate a default one to keep gaussian curves a similar shape.
 ** Returns: Array of numbers [y1, y2, ...]
 **/
// TODO: scope of improvement: w, len
function gaussian(mean: number, h: number, len: number, w?: number): number[] {
  const std = w ? w / 3 : (h * EIGHT) / THREE;
  // prettier-ignore
  console.log(`gaussian: mean: ${mean}, h: ${h}, len: ${len}, w: ${w}, std: ${std}`);
  const gauss: number[] = [...Array(len).fill(0)];
  for (let i = 0; i < len; i++) {
    gauss[i] = h * Math.exp(-((i - mean) ** 2) / (2 * std ** 2));
  }
  return gauss;
}

/**
 ** Given a group of gaussian curve it extracts the line that touches the max
 ** value at each point.
 ** Takes an array of gaussian [gauss1, gauss2, ...].
 ** Return: Array as output [y1,y2,...yN].
 **/
export function maxBounds(featuresGauss: number[][]): number[] {
  const len = featuresGauss[0].length;
  const max = [...Array(len).fill(0)];

  featuresGauss.forEach((g) =>
    g.forEach((d, i) => (max[i] = Math.max(max[i], d)))
  );
  return max;
}


export function semanticGaussians(
  data: TimeSeriesData,
  categoricalFeatures: CategoricalFeature[],
  smoothing = 11
): Array<{ date: Date; y: number }[]> {
  const smooth = gaussianSmoothTS(data, 3, smoothing);
  const gaussians = categoricalFeatures.map((e: CategoricalFeature) => {
    // Get the indexes of the range of the points included in the data feature
    let idx = findDateIdx(e.getDate(), data);
    let gauss = gaussian(idx, e.getRank(), data.length);
    // Convert number[] to array of objects with date and y properties
    return gauss.map((d, i) => {
      return { date: data[i].date, y: d };
    });
  });
  return gaussians;
}

export function smoothing(
  data: TimeSeriesData,
  smoothingVal = 11
): Array<{ date: Date; y: number }[]> {
  const smoothData = gaussianSmoothTS(data, 3, smoothingVal);
  console.log("smoothing: smoothData: ", smoothData);

  const peaks = searchPeaks(data, 0, "y", 10);
  console.log("smoothing: peaks: ", peaks);

  const gaussians = peaks.map((e: Peak) => {
    let midIdx = findDateIdx(e.getDate(), data);
    let gauss = gaussian(midIdx, e.getRank(), data.length);
    // Convert number[] to array of objects with date and y properties
    return gauss.map((d: number, i: number) => {
      return { date: data[i].date, y: d };
    });
  });

  console.log("smoothing: gaussians: ", gaussians);

  return gaussians;
}
export const gaussianSmoothTS = (
  data: TimeSeriesData,
  sigma: number,
  n: number
) => {
  return smoothToTS(
    gaussianSmooth(
      data.map((o: TimeSeriesPoint) => o.y ?? 0),
      sigma,
      n
    ),
    data,
    n
  );
};

export const smoothToTS = (
  smoothData: number[],
  originalData: TimeSeriesData,
  n: number
) => {
  const half = Math.floor(n / 2);
  return smoothData.map((d: number, i: number) => {
    return { date: originalData[i + half].date, y: d };
  });
};

export const gaussianSmooth = (data: number[], sigma: number, n: number) => {
  const gaussian = (sigma: number, n: number) => {
    const even = n % 2 == 0;
    if (even) throw "Cannot use even filter size for gaussian smoothing.";

    const half = Math.floor(n / 2);
    const xs = [...Array(n)].map((_: any, i: number) => i - half);

    const gs = xs.map(
      (x: number) =>
        (1 / (sigma * (2 * Math.PI) ** 0.5)) *
        Math.exp(-(x ** 2) / (2 * sigma ** 2))
    );
    const gsSum = gs.reduce((s, e) => s + e);
    return gs.map((g) => g / gsSum);
  };

  const gaussKernel = gaussian(sigma, n);

  const half = Math.floor(n / 2);
  const validRegion = half == 0 ? data : data.slice(half, -half);

  const smoothData = validRegion.map((_: number, i: number) =>
    gaussKernel.reduce(
      (s: number, g: number, j: number) => s + g * data[i + j],
      0
    )
  );

  return smoothData;
};


export function semanticBounds(
  data: TimeSeriesData,
  semanticGaussians: Array<{ date: Date; y: number }[]>
) {
  return maxBounds(
    semanticGaussians.map((g: { date: Date; y: number }[]) =>
      g.map((d: { date: Date; y: number }) => d.y)
    )
  ).map((d: number, i: number) => {
    return { date: data[i].date, y: d };
  });
}


/**
 ** Combines ranked timeseries by averaging their bounds at each point.
 ** Takes an array of max bounds as input [bounds1, bounds2, ...].
 ** Returns a single combined bound.
 **/
function combineBounds(bounds: number[][]) {
  const len = bounds[0].length;
  const numBounds = bounds.length;
  const combination = [...Array(len).fill(0)];
  bounds.forEach((b: number[]) =>
    b.forEach((d: number, i: number) => (combination[i] += d / numBounds))
  );
  return combination;
}

export function combinedBounds(
  data: TimeSeriesData,
  dataBounds: Array<{ date: Date; y: number }>,
  semanticBounds: Array<{ date: Date; y: number }>
): Array<{ date: Date; y: number }> {
  console.log("bounds:", data, dataBounds, semanticBounds);

  // Validate inputs
  if (!data || !data.length || !dataBounds || !semanticBounds) {
    console.error('Invalid inputs to combinedBounds');
    return data.map(d => ({ date: d.date, y: 0 }));
  }

  // Extract y values from both bounds arrays
  const bounds = [dataBounds, semanticBounds].map(
    (b: Array<{ date: Date; y: number }>) =>
      b.map((d: { date: Date; y: number }) => d.y)
  );
  
  console.log("bounds:", bounds);
  
  // Combine the bounds
  const comb = combineBounds(bounds);
  
  // Map back to TimeSeriesData format
  return comb.map((d: number, i: number) => {
    return { date: data[i].date, y: d };
  });
}

//
//
//

export function peakSegment(
  peaks: Peak[],
  dataLength: number,
  ignoreHeight = false
) {
  const peaksCpy = peaks.map((d: Peak, _: number) => {
    return { idx: d.getDataIndex(), h: d.getNormHeight() };
  });

  console.log("peaksCpy: ", peaksCpy);
  // return
  const ordering: { idx: number; h: number }[] = [];
  while (peaksCpy.length) {
    let bestPeak:
      | { valley: { idx: number; h: number }; idx: number; score: number }
      | undefined;
    peaksCpy.forEach((v1: { idx: number; h: number }, i: number) => {
      let closestDist = ordering.reduce(
        (closest: number, v2: { idx: number; h: number }) =>
          Math.min(closest, Math.abs(v1.idx - v2.idx)),
        Math.min(v1.idx, dataLength - v1.idx)
      );
      let score = (closestDist / dataLength) * (ignoreHeight ? 1 : v1.h / 2);
      bestPeak =
        bestPeak && bestPeak.score > score
          ? bestPeak
          : { valley: v1, idx: i, score: score };
    });
    if (bestPeak) {
      peaksCpy.splice(bestPeak.idx, 1);
      ordering.push(bestPeak.valley);
    }
  }
  return ordering;
}

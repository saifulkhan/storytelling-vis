import { CategoricalFeature } from "../feature/CategoricalFeature";
import { CategoricalFeatures } from "../feature/CategoricalFeatures";
import { Peak } from "../feature/Peak";
import { TimeSeriesPoint } from "./TimeSeriesPoint";
import { searchPeaks } from "../feature/feature-search";
import { NumericalFeature } from "../feature/NumericalFeature";
import { findDateIdx, scaleValue } from "../common";

const RANK_MAX = 10; /** or r_max  */

export function gmm(data: TimeSeriesPoint[], metric: string, window: number) {
  // step 1. create nts
  let peaks = searchPeaks(data, undefined, metric, window);
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
  data: TimeSeriesPoint[],
  metric: string,
  window: number
): Peak[] {
  return searchPeaks(data, undefined, undefined, 10);
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

//
//
//

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

  const featuresGauss: number[][] = features.map((d) => {
    const index = findDateIdx(d.getDate(), data);
    // return gaussian(index, d.getRank(), data.length);
    return gaussian(index, d.getNormHeight(), data.length);
  });

  return featuresGauss;
}

/**
 ** Creates a gaussian distribution with mean, height and width parameters.
 ** len is used to size the return vector to the same length as the timeseries data.
 ** If width is not specified we calculate a default one to keep gaussian curves a similar shape.
 ** Returns: Array of numbers [y1, y2, ...]
 **/
// TODO: scope of improvement: w, len
function gaussian(
  mean: number,
  h: number,
  len: number,
  w = undefined
): number[] {
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

//
//
//

export function semanticGaussians(data, categoricalFeatures, smoothing = 11) {
  const smooth = gaussianSmoothTS(data, 3, smoothing);
  const gaussians = categoricalFeatures.map((e) => {
    // Get the indexes of the range of the points included in the data feature
    let idx = findDateIdx(new Date(e.date), data);
    let gauss = gaussian(idx, e.rank, data.length);
    gauss = gauss.map((d, i) => {
      return { date: data[i].date, y: d };
    });
    return gauss;
  });
  return gaussians;
}

export function smoothing(data: TimeSeriesPoint[], smoothingVal = 11) {
  const smoothData = gaussianSmoothTS(data, 3, smoothingVal);
  console.log("smoothing: smoothData: ", smoothData);

  //const rises = searchPeaks(smoothData, undefined, undefined, 10).map(
  // (d) => console.log(d)
  // new Rise(smoothData[r.start].date)
  //   .setStart(smoothData[r.start].date)
  //   .setEnd(smoothData[r.end].date)
  //   .setMetric(metric)
  //   .setHeight(Math.round(r.height))
  //   .setGrad(r.grad)
  //   .setNormGrad(r.normGrad)
  //   .setRank(r.rank)
  //);

  const peaks = searchPeaks(data, undefined, undefined, 10);
  console.log("smoothing: peaks: ", peaks);

  const gaussians = peaks.map((e) => {
    let midIdx = findDateIdx(e.getDate(), data);
    let gauss = gaussian(midIdx, e.getRank(), data.length);
    gauss = gauss.map((d, i) => {
      return { date: data[i].date, y: d };
    });

    return gauss;
  });

  console.log("smoothing: gaussians: ", gaussians);

  return gaussians;
}
export const gaussianSmoothTS = (data, sigma, n) => {
  return smoothToTS(
    gaussianSmooth(
      data.map((o) => o.y),
      sigma,
      n
    ),
    data,
    n
  );
};

export const smoothToTS = (smoothData, originalData, n) => {
  const half = Math.floor(n / 2);
  return smoothData.map((d, i) => {
    return { date: originalData[i + half].date, y: d };
  });
};

export const gaussianSmooth = (data, sigma, n) => {
  const gaussian = (sigma, n) => {
    const even = n % 2 == 0;
    if (even) throw "Cannot use even filter size for gaussian smoothing.";

    const half = Math.floor(n / 2);
    const xs = [...Array(n)].map((_, i) => i - half);

    const gs = xs.map(
      (x) =>
        (1 / (sigma * (2 * Math.PI) ** 0.5)) *
        Math.exp(-(x ** 2) / (2 * sigma ** 2))
    );
    const gsSum = gs.reduce((s, e) => s + e);
    return gs.map((g) => g / gsSum);
  };

  const gaussKernel = gaussian(sigma, n);

  const half = Math.floor(n / 2);
  const validRegion = half == 0 ? data : data.slice(half, -half);

  const smoothData = validRegion.map((_, i) =>
    gaussKernel.reduce((s, g, j) => s + g * data[i + j], 0)
  );

  return smoothData;
};

//
//
//

export function semanticBounds(data, semanticGaussians) {
  return maxBounds(semanticGaussians.map((g) => g.map((d) => d.y))).map(
    (d, i) => {
      return { date: data[i].date, y: d };
    }
  );
}

//
//
//

/**
 ** Combines ranked timeseries by averaging their bounds at each point.
 ** Takes an array of max bounds as input [bounds1, bounds2, ...].
 ** Returns a single combined bound.
 **/
function combineBounds(bounds) {
  const len = bounds[0].length;
  const numBounds = bounds.length;
  const combination = [...Array(len).fill(0)];
  bounds.forEach((b) => b.forEach((d, i) => (combination[i] += d / numBounds)));
  return combination;
}

export function combinedBounds(data, dataBounds, semanticBounds) {
  console.log("bounds:", data, dataBounds, semanticBounds);

  const bounds = [dataBounds, semanticBounds].map((b) => b.map((d) => d.y));
  console.log("bounds:", bounds);
  const comb = combineBounds(bounds);
  return comb.map((d, i) => {
    return { date: data[i].date, y: d };
  });
}

//
//
//

export function peakSegment(peaks: Peak[], dataLength, ignoreHeight = false) {
  const peaksCpy = peaks.map((d, _) => {
    return { idx: d.getDataIndex(), h: d.getNormHeight() };
  });

  console.log("peaksCpy: ", peaksCpy);
  // return
  const ordering = [];
  while (peaksCpy.length) {
    let bestPeak;
    peaksCpy.forEach((v1, i) => {
      let closestDist = ordering.reduce(
        (closest, v2) => Math.min(closest, Math.abs(v1.idx - v2.idx)),
        Math.min(v1.idx, dataLength - v1.idx)
      );
      let score = (closestDist / dataLength) * (ignoreHeight || v1.h / 2);
      bestPeak =
        bestPeak && bestPeak.score > score
          ? bestPeak
          : { valley: v1, idx: i, score: score };
    });
    peaksCpy.splice(bestPeak.idx, 1);
    ordering.push(bestPeak.valley);
  }
  return ordering;
}

//
// Ported from https://observablehq.com/@scottwjones/graphing-tools-v2
//

export const createDataGroup = (arr, colors = [], domain = false) => {
  return { group: arr, colors: colors, domain: domain };
};

export const normaliseTS = (data) => {
  const normalisedData = normalise(data.map((o) => o.y));
  return data.map((o, i) => {
    return { date: o.date, y: normalisedData[i] };
  });
};

export const normalise = (data) => {
  // Get min and max y values from data (for normalisation)
  const [min, max] = data
    .slice(1)
    .reduce(
      (res, d) => [Math.min(d, res[0]), Math.max(d, res[1])],
      [data[0], data[0]],
    );

  // Normalise y values to be between 0 and 1 using min-max
  return data.map((d) => (d - min) / (max - min));
};

export const smoothToTS = (smoothData, originalData, n) => {
  const half = Math.floor(n / 2);
  return smoothData.map((d, i) => {
    return { date: originalData[i + half].date, y: d };
  });
};

export const meanSmoothTS = (data, n) => {
  return smoothToTS(
    meanSmooth(
      data.map((o) => o.y),
      n,
    ),
    data,
    n,
  );
};

export const meanSmooth = (data, n) => {
  const half = Math.floor(n / 2);
  const validRegion = half == 0 ? data : data.slice(half, -half);

  const smoothData = validRegion.map(
    (_, i) =>
      data.slice(i - half, i + half + 1).reduce((sum, d) => sum + d, 0) / n,
  );
  return smoothData;
};

export const gaussianSmoothTS = (data, sigma, n) => {
  return smoothToTS(
    gaussianSmooth(
      data.map((o) => o.y),
      sigma,
      n,
    ),
    data,
    n,
  );
};

export const gaussianSmooth = (data, sigma, n) => {
  const gaussKernel = gaussian(sigma, n);

  const half = Math.floor(n / 2);
  const validRegion = half == 0 ? data : data.slice(half, -half);

  const smoothData = validRegion.map((_, i) =>
    gaussKernel.reduce((s, g, j) => s + g * data[i + j], 0),
  );

  return smoothData;
};

export const gaussian = (sigma, n) => {
  const even = n % 2 == 0;
  if (even) throw "Cannot use even filter size for gaussian smoothing.";

  const half = Math.floor(n / 2);
  const xs = [...Array(n)].map((_, i) => i - half);

  const gs = xs.map(
    (x) =>
      (1 / (sigma * (2 * Math.PI) ** 0.5)) *
      Math.exp(-(x ** 2) / (2 * sigma ** 2)),
  );
  const gsSum = gs.reduce((s, e) => s + e);
  return gs.map((g) => g / gsSum);
};

export const parseData = (json, location) =>
  Object.entries(json).map((arr: any) => ({
    // @ts-expect-error -- import parseDate instead of using an implicit global function
    date: parseDate(arr[1].index),
    y: +arr[1][location],
  }));

/**
 *   Linear regression function inspired by the answer found at: https://stackoverflow.com/a/31566791.
 *   We remove the need for array x as we assum y data is equally spaced and we only want the gradient.
 */

export function linRegGrad(y) {
  let slope = {};
  const n = y.length;
  let sum_x = 0;
  let sum_y = 0;
  let sum_xy = 0;
  let sum_xx = 0;

  for (let i = 0; i < y.length; i++) {
    sum_x += i;
    sum_y += y[i];
    sum_xy += i * y[i];
    sum_xx += i * i;
  }

  slope = (n * sum_xy - sum_x * sum_y) / (n * sum_xx - sum_x * sum_x);
  return slope;
}

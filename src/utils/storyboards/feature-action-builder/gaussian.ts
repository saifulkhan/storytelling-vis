import { CategoricalFeature } from "../feature/CategoricalFeature";
import { Peak } from "../feature/Peak";
import { TimeseriesDataType } from "./TimeseriesDataType";
import { findDateIdx } from "./common";

/*
    Given an an array of events it calculates gaussian curves to represent their ranks.
    Takes array of events [event1, event2, ...].
    Returns array of gaussians as output [gauss1, gauss2, ...].
  */
export const toGaussian = function (
  features: Peak[] | CategoricalFeature[],
  data: TimeseriesDataType[],
) {
  const gauss_arr = features.map((e) => {
    const dateIdx = findDateIdx(e._date, data);
    return gaussian(dateIdx, e.rank, data.length);
  });

  return gauss_arr;
};

/* 
    Creates a gaussian distribution with mean, height and width parameters.
    DataLen is used to size the return vector to the same length as the
    timeseries data. 
    If width is not specified we calculate a default one to keep gaussian curves    a similar shape.
  
    Returns array of values [y1, y2, ...].
  */
function gaussian(mean, h, dataLen, w = undefined) {
  const std = w ? w / 3 : (h * 8) / 3;
  const gauss_arr = [...Array(dataLen).fill(0)];
  for (let i = 0; i < dataLen; i++) {
    gauss_arr[i] = h * Math.exp(-((i - mean) ** 2) / (2 * std ** 2));
  }
  return gauss_arr;
}

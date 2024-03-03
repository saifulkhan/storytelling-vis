import { Peak, PeakProperties } from "./Peak";
import { Slope, SlopeProperties } from "./Slope";
import { searchPeaks, searchSlopes } from "./feature-search";
import { NumericalFeatureEnum } from "./NumericalFeatureEnum";
import { FallProperties } from "./Fall";
import { RaiseProperties } from "./Raise";
import { TimeseriesDataType } from "../processing/TimeseriesDataType";
import { AbstractFeature } from "./AbstractFeature";
import { AbstractFeatureDetector } from "./AbstractFeatureDetector";

export type TimeseriesFeatureDetectorProperties = {
  metric?: string;
  window?: number;
};

export class TimeseriesFeatureDetector extends AbstractFeatureDetector {
  private _data: TimeseriesDataType[];
  private _properties: TimeseriesFeatureDetectorProperties;

  constructor(
    data: TimeseriesDataType[],
    timeseriesProcessingProperties: TimeseriesFeatureDetectorProperties,
  ) {
    super();
    this._data = data;
    this._properties = timeseriesProcessingProperties;

    // prettier-ignore
    console.log("FeatureDetector: timeseriesProcessingProperties =", this._properties);
    // prettier-ignore
    console.log("FeatureDetector: data =", this._data);
  }

  public detect(
    feature: NumericalFeatureEnum,
    properties:
      | PeakProperties
      | RaiseProperties
      | SlopeProperties
      | FallProperties,
  ): AbstractFeature[] {
    // prettier-ignore
    console.log("FeatureDetector:detect: timeseriesProcessingProperties =", this._properties);
    // prettier-ignore
    console.log("FeatureDetector:detect: data =", this._data);

    switch (feature) {
      case NumericalFeatureEnum.SLOPE:
        return this.detectSlopes(properties);
      case NumericalFeatureEnum.PEAK:
        return this.detectPeaks(properties);
      default:
        console.error(`Feature ${feature} is not implemented!`);
    }
  }

  private detectPeaks(properties: PeakProperties): Peak[] {
    // prettier-ignore
    console.log("FeatureDetector:detectPeaks: timeseriesProcessingProperties =", this._properties);
    // prettier-ignore
    console.log("FeatureDetector:detectPeaks: data =", this._data);

    const peaks = searchPeaks(
      this._data,
      this._properties.metric,
      this._properties.window,
    );

    return peaks;
  }

  private detectSlopes(properties: SlopeProperties): Slope[] {
    let slopes = searchSlopes(this._data, this._properties.window);
    // console.log("detectSlopes: slopes = ", slopes);
    // console.log("detectSlopes: properties = ", properties);

    for (const [key, value] of Object.entries(properties)) {
      slopes = slopes.filter(this.predicate(key, value, "slope"));
      // prettier-ignore
      // console.log(`detectSlopes: key = ${key}, value = ${value}, slopes = `, slopes);
    }
    return slopes;
  }
}

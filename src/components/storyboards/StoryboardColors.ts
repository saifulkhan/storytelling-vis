import * as d3 from "d3";
import { FeatureType } from "../../utils/storyboards/feature/FeatureType";

export enum StoryboardColors {
  DarkGreen = "#006400",
  ForestGreen = "#228B22",
  Green = "#008000",
  KellyGreen = "#4CBB17",
  LightGreen = "#90EE90",
  Green1 = "#00bfa0",
  DarkCyan = "#00aeae",
  Cyan = "#00FFFF",
  PaleCyan = "#aaf2ef",
  CornflowerBlue = "#6495ED",
  DarkPurple = "#770737",
  Purple = "#800080",
  PurpleA = "#AA336A",
  PurpleB = "#BF40BF",
  PalePurple = "#D8BFD8",
  DarkOrange = "#EC5800",
  Orange = "#FFA500",
  PaleOrange = "#FAC898	",
  DarkGrey = "#686868",
  Grey = "#808080",
  LightGrey1 = "#A9A9A9",
  LightGrey2 = "#D3D3D3",
  PlatinumGrey = "#E5E4E2",
  WhiteGrey = "#F5F5F5",
  Red = "#E84A5F",
}

export const LineColor = {} as any;
LineColor[FeatureType.CURRENT] = StoryboardColors.Orange;
LineColor[FeatureType.LAST] = StoryboardColors.PaleCyan;
LineColor[FeatureType.MAX] = StoryboardColors.Green;
LineColor[FeatureType.MIN] = StoryboardColors.Purple;
LineColor[FeatureType.PEAK] = StoryboardColors.LightGreen;
LineColor[FeatureType.VALLEY] = StoryboardColors.PalePurple;

export const DotColor = {} as any;
DotColor[FeatureType.CURRENT] = StoryboardColors.Orange;
DotColor[FeatureType.LAST] = StoryboardColors.PaleCyan;
DotColor[FeatureType.MAX] = StoryboardColors.Green;
DotColor[FeatureType.MIN] = StoryboardColors.Purple;
DotColor[FeatureType.PEAK] = StoryboardColors.LightGreen;
DotColor[FeatureType.VALLEY] = StoryboardColors.PalePurple;

export const TextColor = {} as any;
TextColor[FeatureType.CURRENT] = StoryboardColors.DarkOrange;
TextColor[FeatureType.LAST] = StoryboardColors.DarkCyan;
TextColor[FeatureType.MAX] = StoryboardColors.DarkGreen;
TextColor[FeatureType.MIN] = StoryboardColors.DarkPurple;
TextColor[FeatureType.PEAK] = StoryboardColors.LightGreen;
TextColor[FeatureType.VALLEY] = StoryboardColors.PalePurple;

export function getSchemeTableau10(n: number) {
  const colorScheme = d3.schemeTableau10;
  return colorScheme[n % colorScheme.length];
}

import * as d3 from "d3";
import { NumericalFeatures } from "../../utils/storyboards/feature/NumericalFeatures";

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
LineColor[NumericalFeatures.CURRENT] = StoryboardColors.Orange;
LineColor[NumericalFeatures.LAST] = StoryboardColors.PaleCyan;
LineColor[NumericalFeatures.MAX] = StoryboardColors.Green;
LineColor[NumericalFeatures.MIN] = StoryboardColors.Purple;
LineColor[NumericalFeatures.PEAK] = StoryboardColors.LightGreen;
LineColor[NumericalFeatures.VALLEY] = StoryboardColors.PalePurple;

export const DotColor = {} as any;
DotColor[NumericalFeatures.CURRENT] = StoryboardColors.Orange;
DotColor[NumericalFeatures.LAST] = StoryboardColors.PaleCyan;
DotColor[NumericalFeatures.MAX] = StoryboardColors.Green;
DotColor[NumericalFeatures.MIN] = StoryboardColors.Purple;
DotColor[NumericalFeatures.PEAK] = StoryboardColors.LightGreen;
DotColor[NumericalFeatures.VALLEY] = StoryboardColors.PalePurple;

export const TextColor = {} as any;
TextColor[NumericalFeatures.CURRENT] = StoryboardColors.DarkOrange;
TextColor[NumericalFeatures.LAST] = StoryboardColors.DarkCyan;
TextColor[NumericalFeatures.MAX] = StoryboardColors.DarkGreen;
TextColor[NumericalFeatures.MIN] = StoryboardColors.DarkPurple;
TextColor[NumericalFeatures.PEAK] = StoryboardColors.LightGreen;
TextColor[NumericalFeatures.VALLEY] = StoryboardColors.PalePurple;

export function getSchemeTableau10(n: number) {
  const colorScheme = d3.schemeTableau10;
  return colorScheme[n % colorScheme.length];
}

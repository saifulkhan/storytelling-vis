import * as d3 from "d3";
import { MSBFeatureName } from "src/utils/feature-action/MSBFeatureName";

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
LineColor[MSBFeatureName.CURRENT] = StoryboardColors.Orange;
LineColor[MSBFeatureName.LAST] = StoryboardColors.PaleCyan;
LineColor[MSBFeatureName.MAX] = StoryboardColors.Green;
LineColor[MSBFeatureName.MIN] = StoryboardColors.Purple;
LineColor[MSBFeatureName.PEAK] = StoryboardColors.LightGreen;
LineColor[MSBFeatureName.VALLEY] = StoryboardColors.PalePurple;

export const DotColor = {} as any;
DotColor[MSBFeatureName.CURRENT] = StoryboardColors.Orange;
DotColor[MSBFeatureName.LAST] = StoryboardColors.PaleCyan;
DotColor[MSBFeatureName.MAX] = StoryboardColors.Green;
DotColor[MSBFeatureName.MIN] = StoryboardColors.Purple;
DotColor[MSBFeatureName.PEAK] = StoryboardColors.LightGreen;
DotColor[MSBFeatureName.VALLEY] = StoryboardColors.PalePurple;

export const TextColor = {} as any;
TextColor[MSBFeatureName.CURRENT] = StoryboardColors.DarkOrange;
TextColor[MSBFeatureName.LAST] = StoryboardColors.DarkCyan;
TextColor[MSBFeatureName.MAX] = StoryboardColors.DarkGreen;
TextColor[MSBFeatureName.MIN] = StoryboardColors.DarkPurple;
TextColor[MSBFeatureName.PEAK] = StoryboardColors.LightGreen;
TextColor[MSBFeatureName.VALLEY] = StoryboardColors.PalePurple;

export function getSchemeTableau10(n: number) {
  const colorScheme = d3.schemeTableau10;
  return colorScheme[n % colorScheme.length];
}

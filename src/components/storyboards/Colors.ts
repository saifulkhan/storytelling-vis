import * as d3 from "d3";
import { NumericalFeatures } from "../../utils/storyboards/feature/NumericalFeatures";

export enum Color {
  ForestGreen = "#228B22",
  DarkGreen = "#006400",
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

export const LineColor = {};
LineColor[NumericalFeatures.DEFAULT] = Color.LightGrey1;
LineColor[NumericalFeatures.CURRENT] = Color.Orange;
LineColor[NumericalFeatures.LAST] = Color.PaleCyan;
LineColor[NumericalFeatures.MAX] = Color.Green;
LineColor[NumericalFeatures.MIN] = Color.Purple;
LineColor[NumericalFeatures.PEAK] = Color.LightGreen;
LineColor[NumericalFeatures.VALLEY] = Color.PalePurple;

export const DotColor = {};
DotColor[NumericalFeatures.DEFAULT] = Color.DarkGrey;
DotColor[NumericalFeatures.CURRENT] = Color.Orange;
DotColor[NumericalFeatures.LAST] = Color.PaleCyan;
DotColor[NumericalFeatures.MAX] = Color.Green;
DotColor[NumericalFeatures.MIN] = Color.Purple;
DotColor[NumericalFeatures.PEAK] = Color.LightGreen;
DotColor[NumericalFeatures.VALLEY] = Color.PalePurple;

export const TextColor = {};
TextColor[NumericalFeatures.DEFAULT] = Color.DarkGrey;
TextColor[NumericalFeatures.CURRENT] = Color.DarkOrange;
TextColor[NumericalFeatures.LAST] = Color.DarkCyan;
TextColor[NumericalFeatures.MAX] = Color.DarkGreen;
TextColor[NumericalFeatures.MIN] = Color.DarkPurple;
TextColor[NumericalFeatures.PEAK] = Color.LightGreen;
TextColor[NumericalFeatures.VALLEY] = Color.PalePurple;

export function getSchemeTableau10(n) {
  const colorScheme = d3.schemeTableau10;
  return colorScheme[n % colorScheme.length];
}

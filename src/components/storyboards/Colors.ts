import { NumericalFeatureEnum } from "src/utils/storyboards/feature/NumericalFeatureEnum";

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
LineColor[NumericalFeatureEnum.DEFAULT] = Color.LightGrey1;
LineColor[NumericalFeatureEnum.CURRENT] = Color.Orange;
LineColor[NumericalFeatureEnum.LAST] = Color.PaleCyan;
LineColor[NumericalFeatureEnum.MAX] = Color.Green;
LineColor[NumericalFeatureEnum.MIN] = Color.Purple;
LineColor[NumericalFeatureEnum.PEAK] = Color.LightGreen;
LineColor[NumericalFeatureEnum.VALLEY] = Color.PalePurple;

export const DotColor = {};
DotColor[NumericalFeatureEnum.DEFAULT] = Color.DarkGrey;
DotColor[NumericalFeatureEnum.CURRENT] = Color.Orange;
DotColor[NumericalFeatureEnum.LAST] = Color.PaleCyan;
DotColor[NumericalFeatureEnum.MAX] = Color.Green;
DotColor[NumericalFeatureEnum.MIN] = Color.Purple;
DotColor[NumericalFeatureEnum.PEAK] = Color.LightGreen;
DotColor[NumericalFeatureEnum.VALLEY] = Color.PalePurple;

export const TextColor = {};
TextColor[NumericalFeatureEnum.DEFAULT] = Color.DarkGrey;
TextColor[NumericalFeatureEnum.CURRENT] = Color.DarkOrange;
TextColor[NumericalFeatureEnum.LAST] = Color.DarkCyan;
TextColor[NumericalFeatureEnum.MAX] = Color.DarkGreen;
TextColor[NumericalFeatureEnum.MIN] = Color.DarkPurple;
TextColor[NumericalFeatureEnum.PEAK] = Color.LightGreen;
TextColor[NumericalFeatureEnum.VALLEY] = Color.PalePurple;

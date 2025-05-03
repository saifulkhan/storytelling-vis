import * as d3 from 'd3';

import { FeatureName } from '../types';

export enum Colors {
  DarkGreen = '#006400',
  ForestGreen = '#228B22',
  Green = '#008000',
  KellyGreen = '#4CBB17',
  LightGreen = '#90EE90',
  Green1 = '#00bfa0',
  DarkCyan = '#00aeae',
  Cyan = '#00FFFF',
  PaleCyan = '#aaf2ef',
  CornflowerBlue = '#6495ED',
  DarkPurple = '#770737',
  Purple = '#800080',
  PurpleA = '#AA336A',
  PurpleB = '#BF40BF',
  PalePurple = '#D8BFD8',
  DarkOrange = '#EC5800',
  Orange = '#FFA500',
  PaleOrange = '#FAC898',
  DarkGrey = '#686868',
  Grey = '#808080',
  LightGrey1 = '#A9A9A9',
  LightGrey2 = '#D3D3D3',
  PlatinumGrey = '#E5E4E2',
  WhiteGrey = '#F5F5F5',
  Red = '#E84A5F',
}

export const LineColor = {} as any;
LineColor[FeatureName.CURRENT] = Colors.Orange;
LineColor[FeatureName.LAST] = Colors.PaleCyan;
LineColor[FeatureName.MAX] = Colors.Green;
LineColor[FeatureName.MIN] = Colors.Purple;
LineColor[FeatureName.PEAK] = Colors.LightGreen;
LineColor[FeatureName.VALLEY] = Colors.PalePurple;

export const DotColor = {} as any;
DotColor[FeatureName.CURRENT] = Colors.Orange;
DotColor[FeatureName.LAST] = Colors.PaleCyan;
DotColor[FeatureName.MAX] = Colors.Green;
DotColor[FeatureName.MIN] = Colors.Purple;
DotColor[FeatureName.PEAK] = Colors.LightGreen;
DotColor[FeatureName.VALLEY] = Colors.PalePurple;

export const TextColor = {} as any;
TextColor[FeatureName.CURRENT] = Colors.DarkOrange;
TextColor[FeatureName.LAST] = Colors.DarkCyan;
TextColor[FeatureName.MAX] = Colors.DarkGreen;
TextColor[FeatureName.MIN] = Colors.DarkPurple;
TextColor[FeatureName.PEAK] = Colors.LightGreen;
TextColor[FeatureName.VALLEY] = Colors.PalePurple;

export function getSchemeTableau10(n: number) {
  const colorScheme = d3.schemeTableau10;
  return colorScheme[n % colorScheme.length];
}

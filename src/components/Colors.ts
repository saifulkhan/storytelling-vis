import * as d3 from 'd3';
import { MSBFeatureName } from '../utils';

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
LineColor[MSBFeatureName.CURRENT] = Colors.Orange;
LineColor[MSBFeatureName.LAST] = Colors.PaleCyan;
LineColor[MSBFeatureName.MAX] = Colors.Green;
LineColor[MSBFeatureName.MIN] = Colors.Purple;
LineColor[MSBFeatureName.PEAK] = Colors.LightGreen;
LineColor[MSBFeatureName.VALLEY] = Colors.PalePurple;

export const DotColor = {} as any;
DotColor[MSBFeatureName.CURRENT] = Colors.Orange;
DotColor[MSBFeatureName.LAST] = Colors.PaleCyan;
DotColor[MSBFeatureName.MAX] = Colors.Green;
DotColor[MSBFeatureName.MIN] = Colors.Purple;
DotColor[MSBFeatureName.PEAK] = Colors.LightGreen;
DotColor[MSBFeatureName.VALLEY] = Colors.PalePurple;

export const TextColor = {} as any;
TextColor[MSBFeatureName.CURRENT] = Colors.DarkOrange;
TextColor[MSBFeatureName.LAST] = Colors.DarkCyan;
TextColor[MSBFeatureName.MAX] = Colors.DarkGreen;
TextColor[MSBFeatureName.MIN] = Colors.DarkPurple;
TextColor[MSBFeatureName.PEAK] = Colors.LightGreen;
TextColor[MSBFeatureName.VALLEY] = Colors.PalePurple;

export function getSchemeTableau10(n: number) {
  const colorScheme = d3.schemeTableau10;
  return colorScheme[n % colorScheme.length];
}

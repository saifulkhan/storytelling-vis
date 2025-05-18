import { ActionProps } from './ActionProps';

export type CircleProps = ActionProps & {
  size: number;
  strokeWidth: number;
  color: string;
  opacity: number;
};

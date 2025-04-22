export enum MSBActionName {
  DOT = 'DOT',
  CIRCLE = 'CIRCLE',
  TEXT_BOX = 'TEXT_BOX',
  CONNECTOR = 'CONNECTOR',
}

export const ActionZOrder: Record<MSBActionName, number> = {
  [MSBActionName.DOT]: 1,
  [MSBActionName.CIRCLE]: 2,
  [MSBActionName.TEXT_BOX]: 3,
  [MSBActionName.CONNECTOR]: 4,
};

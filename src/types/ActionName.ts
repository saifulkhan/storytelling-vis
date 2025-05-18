export enum ActionName {
  DOT = 'DOT',
  CIRCLE = 'CIRCLE',
  TEXT_BOX = 'TEXT_BOX',
  CONNECTOR = 'CONNECTOR',
}

export const ActionZOrder: Record<ActionName, number> = {
  [ActionName.DOT]: 1,
  [ActionName.CIRCLE]: 2,
  [ActionName.TEXT_BOX]: 3,
  [ActionName.CONNECTOR]: 4,
};

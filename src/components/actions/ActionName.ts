export enum ActionName {
  DOT = 'DOT',
  CIRCLE = 'CIRCLE',
  TEXT_BOX = 'TEXT_BOX',
  CONNECTOR = 'CONNECTOR',
  PAUSE = 'PAUSE',
}

export const ActionZOrder: Record<ActionName, number> = {
  [ActionName.DOT]: 1,
  [ActionName.CIRCLE]: 2,
  [ActionName.TEXT_BOX]: 3,
  [ActionName.CONNECTOR]: 4,
  [ActionName.PAUSE]: 5,
};

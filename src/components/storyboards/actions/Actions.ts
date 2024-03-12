export enum Actions {
  DOT = "DOT",
  CIRCLE = "CIRCLE",
  TEXT_BOX = "TEXT_BOX",
  CONNECTOR = "CONNECTOR",
}

export const ActionZOrder: Record<Actions, number> = {
  [Actions.DOT]: 4,
  [Actions.CIRCLE]: 3,
  [Actions.TEXT_BOX]: 2,
  [Actions.CONNECTOR]: 1,
};

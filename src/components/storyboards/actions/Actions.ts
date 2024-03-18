export enum Actions {
  DOT = "DOT",
  CIRCLE = "CIRCLE",
  TEXT_BOX = "TEXT_BOX",
  CONNECTOR = "CONNECTOR",
}

export const ActionZOrder: Record<Actions, number> = {
  [Actions.DOT]: 1,
  [Actions.CIRCLE]: 2,
  [Actions.TEXT_BOX]: 3,
  [Actions.CONNECTOR]: 4,
};

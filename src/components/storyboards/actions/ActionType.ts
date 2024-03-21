export enum ActionType {
  DOT = "DOT",
  CIRCLE = "CIRCLE",
  TEXT_BOX = "TEXT_BOX",
  CONNECTOR = "CONNECTOR",
}

export const ActionZOrder: Record<ActionType, number> = {
  [ActionType.DOT]: 1,
  [ActionType.CIRCLE]: 2,
  [ActionType.TEXT_BOX]: 3,
  [ActionType.CONNECTOR]: 4,
};

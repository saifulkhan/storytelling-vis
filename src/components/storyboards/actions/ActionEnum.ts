export enum ActionEnum {
  DOT = "DOT",
  CIRCLE = "CIRCLE",
  TEXT_BOX = "TEXT_BOX",
  CONNECTOR = "CONNECTOR",
}

export const ActionEnumZOrder: Record<ActionEnum, number> = {
  [ActionEnum.DOT]: 4,
  [ActionEnum.CIRCLE]: 3,
  [ActionEnum.TEXT_BOX]: 2,
  [ActionEnum.CONNECTOR]: 1,
};

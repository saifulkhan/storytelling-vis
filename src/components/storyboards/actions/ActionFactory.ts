import { AbstractAction } from "./AbstractAction";
import { ActionEnum } from "./ActionEnum";
import { Circle, CircleProperties } from "./Circle";
import { Connector, ConnectorProperties } from "./Connector";
import { Dot, DotProperties } from "./Dot";
import { TextBox, TextBoxProperties } from "./TextBox";

export class ActionFactory {
  constructor() {
    //
  }

  public create(
    action: ActionEnum,
    properties:
      | CircleProperties
      | ConnectorProperties
      | DotProperties
      | TextBoxProperties
  ): AbstractAction | undefined {
    // prettier-ignore
    // console.log("ActionBuilder:create: action = ", action, ", properties = ", properties);

    switch (action) {
      case ActionEnum.DOT:
        return new Dot().properties(properties);
      case ActionEnum.TEXT_BOX:
        return new TextBox().properties(properties);
      case ActionEnum.CIRCLE:
        return new Circle().properties(properties);
      case ActionEnum.CONNECTOR:
        return new Connector().properties(properties);
      default:
        console.error(`Action ${action} is not implemented!`);
        alert(`Action ${action} is not implemented!`)
    }
  }
}

import { Action } from "./Action";
import { Actions } from "./Actions";
import { Circle, CircleProperties } from "./Circle";
import { ActionGroup } from "./ActionGroup";
import { Connector, ConnectorProperties } from "./Connector";
import { Dot, DotProperties } from "./Dot";
import { TextBox, TextBoxProperties } from "./TextBox";

export class ActionFactory {
  constructor() {}

  public create(
    action: Actions,
    properties:
      | CircleProperties
      | ConnectorProperties
      | DotProperties
      | TextBoxProperties
  ): Action | undefined {
    // prettier-ignore
    // console.log("ActionBuilder:create: action = ", action, ", properties = ", properties);

    switch (action) {
      case Actions.DOT:
        return new Dot().properties({...properties});
      case Actions.TEXT_BOX:
        return new TextBox().properties({...properties});
      case Actions.CIRCLE:
        return new Circle().properties({...properties});
      case Actions.CONNECTOR:
        return new Connector().properties({...properties});
      default:
        console.error(`Action ${action} is not implemented!`);
        alert(`Action ${action} is not implemented!`)
    }
  }

  public compose(actions: Action[]): Action {
    const action = new ActionGroup();
    return action.push(actions);
  }
}

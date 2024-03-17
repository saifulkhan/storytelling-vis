import { Action } from "./Action";
import { Actions } from "./Actions";
import { Circle, CircleProps } from "./Circle";
import { ActionGroup } from "./ActionGroup";
import { Connector, ConnectorProps } from "./Connector";
import { Dot, DotProps } from "./Dot";
import { TextBox, TextBoxProps } from "./TextBox";

export class ActionFactory {
  constructor() {}

  public create(
    action: Actions,
    properties: CircleProps | ConnectorProps | DotProps | TextBoxProps
  ): Action | undefined {
    // prettier-ignore
    // console.log("ActionBuilder:create: action = ", action, ", properties = ", properties);

    switch (action) {
      case Actions.DOT:
        return new Dot().setProps({...properties});
      case Actions.TEXT_BOX:
        return new TextBox().setProps({...properties});
      case Actions.CIRCLE:
        return new Circle().setProps({...properties});
      case Actions.CONNECTOR:
        return new Connector().setProps({...properties});
      default:
        console.error(`Action ${action} is not implemented!`);
    }
  }

  public compose(actions: Action[]): Action {
    const action = new ActionGroup();
    return action.push(actions);
  }
}

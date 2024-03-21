import { Action } from "./Action";
import { ActionType } from "./ActionType";
import { Circle, CircleProps } from "./Circle";
import { ActionGroup } from "./ActionGroup";
import { Connector, ConnectorProps } from "./Connector";
import { Dot, DotProps } from "./Dot";
import { TextBox, TextBoxProps } from "./TextBox";

export class ActionFactory {
  constructor() {}

  public create(
    action: ActionType,
    props: CircleProps | ConnectorProps | DotProps | TextBoxProps
  ): Action | undefined {
    // prettier-ignore
    // console.log("ActionBuilder:create: action = ", action, ", properties = ", properties);

    switch (action) {
      case ActionType.DOT:
        return new Dot().setProps({...props});
      case ActionType.TEXT_BOX:
        return new TextBox().setProps({...props});
      case ActionType.CIRCLE:
        return new Circle().setProps({...props});
      case ActionType.CONNECTOR:
        return new Connector().setProps({...props});
      default:
        console.error(`Action ${action} is not implemented!`);
    }
  }

  public group(actions: Action[]): Action {
    const action = new ActionGroup();
    return action.group(actions);
  }
}

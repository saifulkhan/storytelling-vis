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
    props: CircleProps | ConnectorProps | DotProps | TextBoxProps
  ): Action | undefined {
    // prettier-ignore
    // console.log("ActionBuilder:create: action = ", action, ", properties = ", properties);

    switch (action) {
      case Actions.DOT:
        return new Dot().setProps({...props});
      case Actions.TEXT_BOX:
        return new TextBox().setProps({...props});
      case Actions.CIRCLE:
        return new Circle().setProps({...props});
      case Actions.CONNECTOR:
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

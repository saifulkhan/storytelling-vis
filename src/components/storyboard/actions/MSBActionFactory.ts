import { MSBAction } from "./MSBAction";
import { MSBActionName } from "./MSBActionName";
import { Circle, CircleProps } from "./Circle";
import { MSBActionGroup } from "./MSBActionGroup";
import { Connector, ConnectorProps } from "./Connector";
import { Dot, DotProps } from "./Dot";
import { TextBox, TextBoxProps } from "./TextBox";

export class MSBActionFactory {
  constructor() {}

  public create(
    action: MSBActionName,
    props: CircleProps | ConnectorProps | DotProps | TextBoxProps
  ): MSBAction | undefined {
    // prettier-ignore
    // console.log("MSBActionFactory:create: action = ", action, ", properties = ", properties);

    switch (action) {
      case MSBActionName.DOT:
        return new Dot().setProps({...props});
      case MSBActionName.TEXT_BOX:
        return new TextBox().setProps({...props});
      case MSBActionName.CIRCLE:
        return new Circle().setProps({...props});
      case MSBActionName.CONNECTOR:
        return new Connector().setProps({...props});
      default:
        console.error(`Action ${action} is not implemented!`);
    }
  }

  public group(actions: MSBAction[]): MSBAction {
    const action = new MSBActionGroup();
    return action.group(actions);
  }
}

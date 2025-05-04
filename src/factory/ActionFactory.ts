import {
  Action,
  ActionName,
  Circle,
  CircleProps,
  ActionGroup,
  Connector,
  ConnectorProps,
  Dot,
  DotProps,
  TextBox,
  TextBoxProps,
  Pause,
  PauseProps,
} from '../components';
import { TimeSeriesPoint } from '../types';

export class ActionFactory {
  constructor() {}

  public create(
    action: ActionName,
    props: CircleProps | ConnectorProps | DotProps | TextBoxProps | PauseProps,
    data?: TimeSeriesPoint,
  ): Action | undefined {
    // prettier-ignore
    // console.log("ActionFactory:create: action = ", action, ", properties = ", properties);

    switch (action) {
      case ActionName.DOT:
        return new Dot().setProps(props as DotProps);
      case ActionName.TEXT_BOX:
        return new TextBox().setProps(props as TextBoxProps);
      case ActionName.CIRCLE:
        return new Circle().setProps(props as CircleProps);
      case ActionName.CONNECTOR:
        return new Connector().setProps(props as ConnectorProps);
      case ActionName.PAUSE:
        return new Pause().setProps(props as PauseProps);
      default:
        console.error(`Action ${action} is not implemented!`);
    }
  }

  public group(actions: Action[]): ActionGroup {
    const action = new ActionGroup();
    return action.group(actions);
  }
}

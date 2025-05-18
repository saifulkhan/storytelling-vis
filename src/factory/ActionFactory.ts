import {
  Action,
  ActionName,
  Circle,
  ActionGroup,
  Connector,
  Dot,
  TextBox,
} from '../components';
import {
  TimeSeriesPoint,
  CircleProps,
  ConnectorProps,
  DotProps,
  TextBoxProps,
} from '../types';

export class ActionFactory {
  constructor() {}

  public create(
    action: ActionName,
    props: CircleProps | ConnectorProps | DotProps | TextBoxProps,
    data?: TimeSeriesPoint,
  ): Action | undefined {
    // prettier-ignore
    // console.debug("ActionFactory:create: action = ", action, ", props = ", props);

    switch (action) {
      case ActionName.DOT:
        return new Dot().setProps(props as DotProps);
      case ActionName.TEXT_BOX:
        return new TextBox().setProps(props as TextBoxProps);
      case ActionName.CIRCLE:
        return new Circle().setProps(props as CircleProps);
      case ActionName.CONNECTOR:
        return new Connector().setProps(props as ConnectorProps);
      default:
        console.error(`Action ${action} is not implemented!`);
    }
  }

  public group(actions: Action[]): ActionGroup {
    const action = new ActionGroup();
    return action.group(actions);
  }
}

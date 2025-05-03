import { Action } from './Action';
import { ActionName } from './ActionName';
import { Circle, CircleProps } from './Circle';
import { ActionGroup } from './ActionGroup';
import { Connector, ConnectorProps } from './Connector';
import { Dot, DotProps } from './Dot';
import { TextBox, TextBoxProps } from './TextBox';
import { TimeSeriesPoint } from '../../types';

export class ActionFactory {
  constructor() {}

  public create(
    action: ActionName,
    props: CircleProps | ConnectorProps | DotProps | TextBoxProps,
    data?: TimeSeriesPoint,
  ): Action | undefined {
    // prettier-ignore
    // console.log("ActionFactory:create: action = ", action, ", properties = ", properties);

    switch (action) {
      case ActionName.DOT:
        return new Dot().setProps(props as DotProps);
      case ActionName.TEXT_BOX:
        return new TextBox().setProps(props as TextBoxProps, data);
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

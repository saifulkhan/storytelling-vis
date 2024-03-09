import { Dot, DotProperties } from "src/components/storyboards/actions/Dot";
import { AbstractAction } from "src/components/storyboards/actions/AbstractAction";
import { ActionEnum } from "src/components/storyboards/actions/ActionEnum";
import {
  TextBox,
  TextBoxProperties,
} from "src/components/storyboards/actions/TextBox";
import {
  Circle,
  CircleProperties,
} from "src/components/storyboards/actions/Circle";
import {
  Connector,
  ConnectorProperties,
} from "src/components/storyboards/actions/Connector";

export class ActionBuilder {
  constructor() {
    //
  }

  public create(
    action: ActionEnum,
    properties:
      | CircleProperties
      | ConnectorProperties
      | DotProperties
      | TextBoxProperties,
  ): AbstractAction {
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

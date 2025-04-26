import { TextBox, TextBoxProps, defaultTextBoxProps } from './TextBox';
import { ActionName } from './ActionName';

export type PauseProps = TextBoxProps & {
  duration?: number;
};

export const defaultPauseProps: PauseProps = {
  ...defaultTextBoxProps,
  duration: 0,
};

/**
 * Pause action for animation sequencing. This action renders a textbox and can be used in an animation timeline to represent a pause.
 */
export class Pause extends TextBox {
  protected props: PauseProps = defaultPauseProps;

  constructor() {
    super();
    this.type = ActionName.PAUSE;
  }

  public setProps(properties: PauseProps = {}) {
    this.props = { ...defaultPauseProps, ...properties };
    return this;
  }

  public updateProps(properties: Partial<PauseProps>): this {
    this.props = { ...this.props, ...properties };
    return this;
  }
  // All rendering and animation logic is inherited from TextBox
}


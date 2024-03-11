import { AbstractAction, Coordinate } from "./AbstractAction";
import { ActionEnumZOrder } from "./ActionEnum";

export class CompositeAction extends AbstractAction {
  private _actions: AbstractAction[];

  constructor(actions: AbstractAction[] = []) {
    super();
    this._actions = actions;
  }

  push(action: AbstractAction) {
    this._actions.push(action);
    return this;
  }

  public properties(properties: unknown): this {
    return this;
  }

  public svg(svg: SVGGElement) {
    this._actions.map((d: AbstractAction) => d.svg(svg));
    return this;
  }

  public draw() {
    this._actions.sort(
      (a: AbstractAction, b: AbstractAction) =>
        ActionEnumZOrder[b.type] - ActionEnumZOrder[a.type]
    );
    this._actions.map((d: AbstractAction) => d.draw());
    return this;
  }

  public coordinate(src: Coordinate, dest: Coordinate) {
    this._actions.map((d: AbstractAction) => d.coordinate(src, dest));
    return this;
  }

  public show(): Promise<number[]> {
    const promises = this._actions.map((d: AbstractAction) => d.show());
    return Promise.all(promises);
  }

  public hide(): Promise<number[]> {
    const promises = this._actions.map((d: AbstractAction) => d.hide());
    return Promise.all(promises);
  }

  // TODO
  public move(dest: Coordinate, delay: number, duration: number): Promise<any> {
    throw new Error("Method not implemented.");
  }
}

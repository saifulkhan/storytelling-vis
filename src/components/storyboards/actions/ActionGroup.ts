import { Action, Coordinate } from "./Action";
import { ActionZOrder } from "./Actions";

export class ActionGroup extends Action {
  private _actions: Action[];

  constructor(actions: Action[] = []) {
    super();
    this._actions = actions;
  }

  push(actions: Action[]) {
    this._actions = [...actions];
    return this;
  }

  public setProps(properties: unknown): this {
    return this;
  }

  public updateProps(extraObj: any) {
    this._actions.map((d: Action) => d.updateProps(extraObj));
    return this;
  }

  public setCanvas(svg: SVGGElement) {
    this._actions.map((d: Action) => d.setCanvas(svg));
    return this;
  }

  public draw() {
    this._actions.sort(
      (a: Action, b: Action) => ActionZOrder[b.type] - ActionZOrder[a.type]
    );
    this._actions.map((d: Action) => d.draw());
    return this;
  }

  public setCoordinate(coordinate: [Coordinate, Coordinate]) {
    this._actions.map((d: Action) => d.setCoordinate(coordinate));
    return this;
  }

  public show(): Promise<number[]> {
    const promises = this._actions.map((d: Action) => d.show());
    return Promise.all(promises);
  }

  public hide(): Promise<number[]> {
    const promises = this._actions.map((d: Action) => d.hide());
    return Promise.all(promises);
  }

  public move(
    coordinate: Coordinate,
    delay?: number | undefined,
    duration?: number | undefined
  ): Promise<any> {
    throw new Error("ActionGroup: move() is not implemented!");
  }
}

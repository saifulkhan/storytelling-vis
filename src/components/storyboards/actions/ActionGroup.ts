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

  public properties(properties: unknown): this {
    return this;
  }

  public extraProperties(extraObj: any) {
    this._actions.map((d: Action) => d.extraProperties(extraObj));
    return this;
  }

  public svg(svg: SVGGElement) {
    this._actions.map((d: Action) => d.svg(svg));
    return this;
  }

  public draw() {
    this._actions.sort(
      (a: Action, b: Action) => ActionZOrder[b.type] - ActionZOrder[a.type]
    );
    this._actions.map((d: Action) => d.draw());
    return this;
  }

  public coordinate(src: Coordinate, dest: Coordinate) {
    this._actions.map((d: Action) => d.coordinate(src, dest));
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

  // TODO
  public move(dest: Coordinate, delay: number, duration: number): Promise<any> {
    throw new Error("Method not implemented.");
  }
}

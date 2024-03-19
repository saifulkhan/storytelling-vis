import { Action, Coordinate } from "./Action";
import { ActionZOrder } from "./Actions";

export class ActionGroup extends Action {
  private actions: Action[];

  constructor() {
    super();
  }

  group(actions: Action[]) {
    this.actions = [...actions];
    return this;
  }

  public setProps(properties: unknown): this {
    return this;
  }

  public updateProps(extraObj: any) {
    this.actions.map((d: Action) => d.updateProps(extraObj));
    return this;
  }

  public setCanvas(svg: SVGGElement) {
    this.actions.sort(
      (a: Action, b: Action) => ActionZOrder[b.type] - ActionZOrder[a.type]
    );
    // console.log("ActionGroup:setCanvas: ordered actions: ", this.actions);
    this.actions.map((d: Action) => d.setCanvas(svg));
    return this;
  }

  public setCoordinate(coordinate: [Coordinate, Coordinate]) {
    this.actions.map((d: Action) => d.setCoordinate(coordinate));
    return this;
  }

  public show(): Promise<number[]> {
    const promises = this.actions.map((d: Action) => d.show());
    return Promise.all(promises);
  }

  public hide(): Promise<number[]> {
    const promises = this.actions.map((d: Action) => d.hide());
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

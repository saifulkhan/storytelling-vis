import { MSBAction } from "./MSBAction";
import { Coordinate } from "src/types/coordinate";
import { ActionZOrder } from "./MSBActionName";

export class MSBActionGroup extends MSBAction {
  private actions: MSBAction[];

  constructor() {
    super();
  }

  group(actions: MSBAction[]) {
    this.actions = [...actions];
    return this;
  }

  public setProps(properties: unknown): this {
    return this;
  }

  public updateProps(extraObj: any) {
    this.actions.map((d: MSBAction) => d.updateProps(extraObj));
    return this;
  }

  public setCanvas(svg: SVGGElement) {
    this.actions.sort(
      (a: MSBAction, b: MSBAction) =>
        ActionZOrder[b.type] - ActionZOrder[a.type]
    );
    // console.log("ActionGroup:setCanvas: ordered actions: ", this.actions);
    this.actions.map((d: MSBAction) => d.setCanvas(svg));
    return this;
  }

  public setCoordinate(coordinate: [Coordinate, Coordinate]) {
    this.actions.map((d: MSBAction) => d.setCoordinate(coordinate));
    return this;
  }

  public show(): Promise<number[]> {
    const promises = this.actions.map((d: MSBAction) => d.show());
    return Promise.all(promises);
  }

  public hide(): Promise<number[]> {
    const promises = this.actions.map((d: MSBAction) => d.hide());
    return Promise.all(promises);
  }

  public move(
    coordinate: Coordinate,
    delay?: number,
    duration?: number
  ): Promise<any> {
    const promises = this.actions.map((d: MSBAction) =>
      d.move(coordinate, delay, duration)
    );
    return Promise.all(promises);
  }
}

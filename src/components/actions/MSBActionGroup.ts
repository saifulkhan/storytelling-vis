import { MSBAction } from "./MSBAction";
import { Coordinate } from "src/types/Coordinate";
import { ActionZOrder } from "./MSBActionName";

export class MSBActionGroup extends MSBAction {
  private actions: MSBAction[] = [];

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
        ActionZOrder[b.getType()] - ActionZOrder[a.getType()]
    );
    // console.log("ActionGroup:setCanvas: ordered actions: ", this.actions);
    this.actions.map((d: MSBAction) => d.setCanvas(svg));
    return this;
  }

  public setCoordinate(coordinate: [Coordinate, Coordinate]) {
    this.actions.map((d: MSBAction) => d.setCoordinate(coordinate));
    return this;
  }

  public show(delay = 0, duration = 1000): Promise<number> {
    const promises = this.actions.map((d: MSBAction) => d.show(delay, duration));
    return Promise.all(promises).then(results => {
      // Return the maximum delay + duration value from all actions
      return Math.max(...results);
    });
  }

  public hide(delay = 0, duration = 1000): Promise<number> {
    const promises = this.actions.map((d: MSBAction) => d.hide(delay, duration));
    return Promise.all(promises).then(results => {
      // Return the maximum delay + duration value from all actions
      return Math.max(...results);
    });
  }

  public move(
    coordinate: Coordinate,
    delay: number = 0,
    duration: number = 1000
  ): Promise<any> {
    const promises = this.actions.map((d: MSBAction) =>
      d.move(coordinate, delay, duration)
    );
    return Promise.all(promises);
  }

  public draw(): void {
    // For a group, draw all child actions
    this.actions.forEach((action: MSBAction) => action.draw());
  }
}

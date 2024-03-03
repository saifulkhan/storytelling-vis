import { createPredicate } from "../processing/common";

export abstract class AbstractFeatureDetector {
  constructor() {
    //
  }

  public abstract detect(feature: unknown, properties: unknown): unknown[];

  protected predicate(
    key: string,
    value: number | string,
    attr: string,
  ): (...args: unknown[]) => unknown {
    switch (key) {
      case "eq":
        return createPredicate(`obj.${attr} == ${value}`);
      case "le":
        return createPredicate(`obj.${attr} <= ${value}`);
      case "ge":
        return createPredicate(`obj.${attr}>= ${value}`);
      case "lt":
        return createPredicate(`obj.${attr} < ${value}`);
      case "gt":
        return createPredicate(`obj.${attr} > ${value}`);
      case "ne":
        return createPredicate(`obj.${attr} != ${value}`);
    }
  }
}

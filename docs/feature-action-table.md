# Feature-Action Table

A meta-story is defined as a *feature-action table*: each row maps a feature of the time series (e.g., a peak) to one or more visual actions (e.g., draw a circle and a text box). The tables are usually authored as JSON and loaded at runtime.

## Data structures

**Numerical Feature Action**

```json
{
    "feature": "...",
    "featureProps": {"..."},
    "rank": "...",
    "actions": [
      {
        "action": "...",
        "actionProps": {
          "size": "...",
          "color": "...",
          "...": "..."
        }
      },
      "..."
    ]
}
```

**Categorical Feature Action**

```json
{
    "feature": "...",
    "date": "...",
    "description": "...",
    "rank": "...",
    "actions": [
      {
        "action": "...",
        "actionProps": {
          "size": "...",
          "color": "...",
          "...": "..."
        }
      },
      "..."
    ]
}
```

## Conditions

Row `properties` filter detected features numerically, e.g., `{ "gt": 100 }`. Supported keys: `eq`, `le`/`lte`, `ge`/`gte`, `lt`, `gt`, `ne`. For `SLOPE` features the slope value is compared; for all other features the height.

## Validation

Tables are usually loaded from JSON; validate them at load time to get all problems reported at once, with paths:

```ts
import { validateFeatureActionTable, assertFeatureActionTable } from 'meta-storyboard';

const { valid, issues } = validateFeatureActionTable(tableJson);
// or throw with a formatted message:
assertFeatureActionTable(tableJson);
```

A JSON Schema is shipped at [`doc/feature-action-table.schema.json`](https://github.com/saifulkhan/meta-storyboard/blob/main/doc/feature-action-table.schema.json) for editor autocomplete and CI validation.

## FeatureActionFactory

The `FeatureActionFactory` translates the meta-stories defined as feature-action tables to MSB feature objects and MSB action objects. It internally uses the [`FeatureFactory`](api/feature.md) and [`ActionFactory`](api/action.md) classes to do so. Instantiate this class as follows:

```js
new FeatureActionFactory(...)
    .setProps(...)
    .setNumericalFeatures(...)
    .setCategoricalFeatures(...)
    .setData(...)
    .create();
```

!!! tip "Playground"
    Try the interactive [feature-action table playground](https://saifulkhan.github.io/meta-storyboard-examples/example/feature-action-tables/) to explore example tables.

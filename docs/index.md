# Meta-Storyboard (MSB)

[![npm version](https://img.shields.io/npm/v/meta-storyboard.svg)](https://www.npmjs.com/package/meta-storyboard)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://github.com/saifulkhan/meta-storyboard/blob/main/LICENSE)
[![Build Status](https://github.com/saifulkhan/meta-storyboard/actions/workflows/ci.yml/badge.svg)](https://github.com/saifulkhan/meta-storyboard/actions)

Meta-Storyboard (MSB) is a JavaScript/TypeScript library that enables the creation of scalable, interactive, and animated data visualizations using the feature-action design pattern. The library offers a set of APIs with the following key features:

- **Feature Detection**: Built-in peak and event detection utilities.
- **Action Mapping**: Map features to visual actions (dots, circles, connectors, text boxes, etc.).
- **Animated Plots**: Animate transitions and storytelling sequences.
- **Extensible Components**: Register custom feature detectors and action types via `FeatureFactory.register()` and `ActionFactory.register()`.
- **Table Validation**: Validate feature-action tables with `validateFeatureActionTable()` and a shipped JSON Schema.
- **Example Stories and Playground**: Test and explore components in isolation.

## Installation

```bash
npm install meta-storyboard # or
yarn add meta-storyboard
```

## Where to go next

- [Getting Started](getting-started.md) — the four-step process for building a story, with copy-paste templates.
- [Feature-Action Table](feature-action-table.md) — the data structures that define a meta-story.
- [API Design](api/feature.md) — feature, action, search, and plot APIs with class diagrams.
- [Live Examples](https://saifulkhan.github.io/meta-storyboard-examples/) — interactive stories running in the browser; see the [Examples](examples.md) page for a guided list.

## References

Our work is described in:

> Khan, S., Jones, S., Bach, B., Cha, J., Chen, M., Meikle, J., Roberts, J. C., Thiyagalingam, J., Wood, J., & Ritsos, P. D. (2024). Feature-Action Design Patterns for Storytelling Visualizations with Time Series Data. _arXiv preprint arXiv:2402.03116_.

See [About](about.md) for the full citation, license, and support information.

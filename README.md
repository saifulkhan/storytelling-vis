# Meta-Storyboard (MSB)

[![npm version](https://img.shields.io/npm/v/meta-storyboard.svg)](https://www.npmjs.com/package/meta-storyboard)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
[![Build Status](https://github.com/saifulkhan/meta-storyboard/actions/workflows/ci.yml/badge.svg)](https://github.com/saifulkhan/meta-storyboard/actions)

[![Documentation](https://img.shields.io/badge/Documentation-meta--storyboard-blue.svg?style=flat&logo=materialformkdocs&logoColor=white)](https://saifulkhan.github.io/meta-storyboard/)
[![Examples](https://img.shields.io/badge/Live%20Examples-meta--storyboard--examples-green.svg?style=flat&logo=github&logoColor=white)](https://saifulkhan.github.io/meta-storyboard-examples/)

Meta-Storyboard (MSB) is a JavaScript/TypeScript library that enables the creation of scalable, interactive, and animated data visualizations using the feature-action design pattern. The library offers a set of APIs with the following key features:

- **Feature Detection**: Built-in peak and event detection utilities.
- **Action Mapping**: Map features to visual actions (dots, circles, connectors, text boxes, etc.).
- **Animated Plots**: Animate transitions and storytelling sequences.
- **Extensible Components**: Register custom feature detectors and action types via `FeatureFactory.register()` and `ActionFactory.register()`.
- **Table Validation**: Validate feature-action tables with `validateFeatureActionTable()` and a shipped JSON Schema (`doc/feature-action-table.schema.json`).
- **Example Stories and Playground**: Test and explore components in isolation.

## Installation

```bash
npm install meta-storyboard # or
yarn add meta-storyboard
```

## Quick start

Story development is a four-step process: (1) load time series data and a feature-action table, (2) create timeline actions with `FeatureActionFactory`, (3) initialize a plot and animation controller, and (4) animate.

```tsx
import * as msb from 'meta-storyboard';
import { useControllerWithState } from 'meta-storyboard/react';

// 1. Load data and feature-action table
const data = ...; // time series data
const numericalFATable = ...; // feature-action table

// 2. Process feature-action table and create timeline actions
const timelineActions = new msb.FeatureActionFactory()
  .setProps({ /* properties */ })
  .setData(data)
  .setNumericalFeatures(numericalFATable)
  .create();

// 3. Initialize a plot and animation controller
const plot = useRef(new msb.LinePlot()).current;
const [controller, isPlaying] = useControllerWithState(msb.PlayPauseController, [plot]);

// 4. Configure plot and animate
plot
  .setData(data)
  .setName(/* name of the plot */)
  .setPlotProps({ /* plot properties */ })
  .setCanvas(/* svg element */)
  .setActions(timelineActions)
  .animate();

onClick={controller.togglePlayPause};
```

## Documentation & examples

- **[Documentation](https://saifulkhan.github.io/meta-storyboard/)** — getting started, feature-action tables, API design, and development guide.
- **[Live examples](https://saifulkhan.github.io/meta-storyboard-examples/)** — interactive stories running in the browser; source code in [meta-storyboard-examples](https://github.com/saifulkhan/meta-storyboard-examples).

## Development

```bash
yarn install
yarn build:lib   # build the library
yarn test        # run tests
```

To preview the documentation locally:

```bash
pip install -r docs/requirements.txt
mkdocs serve
```

See the [development guide](https://saifulkhan.github.io/meta-storyboard/development/) for details.

## License

This project is licensed under the MIT License. See [LICENSE](LICENSE) for details.

## Citation

Our work is described in:

> Khan, S., Jones, S., Bach, B., Cha, J., Chen, M., Meikle, J., Roberts, J. C., Thiyagalingam, J., Wood, J., & Ritsos, P. D. (2024). Feature-Action Design Patterns for Storytelling Visualizations with Time Series Data. _arXiv preprint arXiv:2402.03116_.

Please cite our paper as follows:

```bibtex
@article{khan2024,
    title={Feature-Action Design Patterns for Storytelling Visualizations with Time Series Data},
    author={S. Khan and S. Jones and B. Bach and J. Cha and M. Chen and J. Meikle and J. C. Roberts and J. Thiyagalingam and J. Wood and P. D. Ritsos},
    journal={arXiv preprint arXiv:2402.03116},
    year={2024},
}
```

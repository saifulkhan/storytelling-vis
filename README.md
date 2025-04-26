# Meta-Storyboard


[![npm version](https://img.shields.io/npm/v/meta-storyboard.svg)](https://www.npmjs.com/package/meta-storyboard)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
[![GitHub](https://img.shields.io/badge/GitHub-meta--storyboard-181717.svg?style=flat&logo=github)](https://github.com/saifulkhan/meta-storyboard)
<!-- [![Build Status](https://github.com/saifulkhan/meta-storyboard/actions/workflows/ci.yml/badge.svg)](https://github.com/saifulkhan/meta-storyboard/actions) -->

---

## Table of Contents
- [Overview](#overview)
  - [Features](#features)
  - [Installation](#installation)
  - [Steps & Template](#steps--template)

- [API Design & Development](#api-design--development)
  - [Development Setup](#development-setup)
  - [Examples](#examples)
    - [Stories](#stories)
    - [Playground (Component Testing)](#playground-component-testing)
  - [Project Structure](#project-structure)
  - [Meta-Storyboard (MSB) API](#meta-storyboard-msb-api)
    - [Feature Action Table Data Structures](#feature-action-table-data-structures)
    - [MSB Action API](#msb-action-api)
    - [Animated Plots API](#animated-plots-api)
    - [Creating Story](#creating-story)
    - [Feature Action Tables UI](#feature-action-tables-ui)
  - [Additional Information](#additional-information)
    - [Build & Release](#build--release)
    - [Contribution](#contribution)
    - [License](#license)
    - [Support](#support)
    - [References](#references)

---

# Overview

A JavaScript/TypeScript library for building scalable interactive, animated data stories with the meta-storyboard (MSB) and feature-action design pattern.

## Features
- 🟢 **Feature Detection**: Built-in peak and event detection utilities.
- 🟣 **Action Mapping**: Map features to visual actions (dots, circles, connectors, text boxes, etc.).
- 🔵 **Animated Plots**: Animate transitions and storytelling sequences.
- 🟡 **Extensible Components**: Easily add new plot or action types.
- 🟤 **Example Stories and Playground**: Test and explore components in isolation.
<!-- - 🟠 **Interactive Tables**: UI for editing feature-action tables. -->

## Installation

```bash
npm install meta-storyboard
# or
yarn add meta-storyboard
```

## Steps & Template


Story development is a four-step process:

1. **Load data and feature-action table**:

   1.1 **Load timeseries data**: See some example COVID-19 and Machine Learning training provenance data in GitHub repository `src/assets/data`.

   1.2 **Load feature-action table**: See some example feature-action tables in GitHub repository `src/assets/feature-action-table`.

2. **Create timeline actions**: Use the `FeatureActionFactory` class to create timeline actions from the timeseries data and feature-action table.

3. **Create story**: Create a plot and set its data and plot properties. We provide some example plots such as `LinePlot`, `MirroredBarChart`, `ParallelCoordinatePlot`, available in `src/components/plots` GitHub repository.

4. **Animate the story**: Use play and pause button to animate the story. See example hooks in GitHub repository `src/hooks/`.

For example,

```tsx
import * as msb from 'meta-storyboard';

// 1. Load your data and feature-action table
const data = ...; // time series data
const featureActionTable = ...; // feature-action table

// 2. Create timeline actions
const timelineActions = new msb.FeatureActionFactory()
  .setFAProps({ /* properties */ })
  .setTable(featureActionTable)
  .setData(data)
  .create();

// 3. Create a plot and set its data/properties
const plot = new msb.LinePlot()
  .setData(data)
  .setName('My Plot')
  .setPlotProps({ /* plot properties */ })
  .setCanvas(svgRef)
  .setActions(timelineActions);

// 4. Animate
const { isPlaying, togglePlayPause, pause } = msb.usePlayPauseLoop(plot);
onClick={togglePlayPause};
```

Template using gaussian mixture model for segmenting timeseries based on importance.


```tsx
import * as msb from 'meta-storyboard';

// 1. Load your data and feature-action table
const data = ...; // time series data
const numericalFeatures = ...; // numerical feature-action table
const categoricalFeatures = ...; // categorical features table

// Gaussian Mixture Model (TODO: add more details)
const gaussian = msb.gmm(data, categoricalFeatures);
const segments = msb.segmentByImportantPeaks(gaussian, numSegment);  

// 2. Create timeline actions
const timelineActions = new msb.FeatureActionFactory()
  .setFAProps({ /* properties */ })
  .setTable(numericalFeatures)
  .setData(data)
  .create();

// 3. Create a plot and set its data/properties
const plot = new msb.LinePlot()
  .setData(data)
  .setName('My Plot')
  .setPlotProps({ /* plot properties */ })
  .setCanvas(svgRef)
  .setActions(timelineActions);

// 4. Animate
const { isPlaying, togglePlayPause, pause } = msb.usePlayPauseLoop(plot);
onClick={togglePlayPause};
```

See more complete [examples](#examples) and their implementation in [GitHub](https://github.com/saifulkhan/meta-storyboard/tree/main/src/pages).

---

# API Design & Development

For more details of available APIs or extending the existing APIs, see the documents below.

## Development Setup

The following environment and packages are required.

- Node.js v20.11.1
- yarn or npm

Clone the repository.

```bash
git clone https://github.com/saifulkhan/meta-storyboard.git
cd meta-storyboard

```

Install all dependent packages and start the development server to view the UI.

```bash
yarn install
yarn dev
```

Open <http://localhost:3000> in your browser and access the following examples stories:

## Examples

### Stories

The implementation of the example stories is in [GitHub](https://github.com/saifulkhan/meta-storyboard/tree/main/src/pages/example) and links:

- [COVID-19 Case Story](http://localhost:3000/example/story-covid19-single)
- [COVID-19 Case Story (Gaussian)](http://localhost:3000/example/story-covid19-gaussian)
- [Machine Learning Provenance Story](http://localhost:3000/example/story-ml-mirorred-bar)
- [Machine Learning Multivariate Story](http://localhost:3000/example/story-ml-pcp)
- [Feature-Action Tables UI (experimental)](http://localhost:3000/example/feature-action-tables)

### Playground (Component Testing)

The implementation of the playground pages is in [GitHub](https://github.com/saifulkhan/meta-storyboard/tree/main/src/pages/playground) and links:

- [Test Play/Pause Loop](http://localhost:3000/playground/test-play-pause-loop)
- [Test Actions](http://localhost:3000/playground/test-actions)
- [Test Line Plot](http://localhost:3000/playground/test-line-plot)
- [Test Features](http://localhost:3000/playground/test-features)

- [Test Categorical Features to Gaussian](http://localhost:3000/playground/test-categorical-features-to-gaussian)
- [Test Numerical Features to Gaussian](http://localhost:3000/playground/test-numerical-features-to-gaussian)
- [Test Gaussian Combined](localhost:3000/playground/test-combined-gaussian)

- [Test Action Properties Table](http://localhost:3000/playground/test-action-properties-table)
- [Test Feature Properties Table](http://localhost:3000/playground/test-feature-properties-table)
- [Test Action Table](http://localhost:3000/playground/test-action-table)

---

## Testing

Run unit tests:
```bash
yarn test
```
_Note: Unit tests are under development and may not cover all features._

---

## Project Structure

```
meta-storyboard/
├── doc
├── src
│   ├── components
│   │   ├── actions      # Visualization action components (Circle, Connector, Dot, etc.)
│   │   ├── plots        # Plot components (LinePlot, MirroredBarChart, etc.)
│   │   └── tables       # Tables for features/actions
│   ├── hooks            # Custom React hooks (e.g., play-pause)
│   ├── pages            # Next.js pages (examples, playground, etc.)
│   └── utils
│       ├── data-processing   # Data processing utilities (Gaussian, etc.)
│       └── feature-action    # Feature/action utilities
├── public
├── package.json
└── README.md
```



## Meta-Storyboard (MSB) API

### Feature Action Table Data Structures

We implemented a user interface for meta-story authors for creating and updating feature action tables. The data structures of the tables are shown below. The feature action tables are implemented as nested React.js components.

**Numerical Feature Action**

```json
{
    "featureName": "...",
    "featureProperties": {"..."},
    "rank": "...",
    "actions": [
      {
        "actionName": "...",
        "actionProperties": {
          "size": "...",
          "color": "...",
          "...": "...",
        }
      },
      "..."
    ],
},
```

**Categorical Feature Action**

```json

  {
    "featureName": "...",
    "date": "...",
    "description": "...",
    "rank": "...",
    "actions": [
      {
        "actionName": "...",
        "actionProperties": {
          "size": "...",
          "color": "...",
          "...": "...",
        }
      },
      "..."
    ]
  },
```

TODO: Refactor the key / variable name in the code!

**MSB Feature Action Factory:** The `MSBFeatureActionFactory` translates the meta-stories defined as feature action tables to MSB feature objects and MSB action objects. It internally uses the `MSBFeatureFactory` and `MSBActionFactory` classes, which will be discussed later, to do so. Instantiate this class as follows:

```js
new MSBFeatureActionFactory(...)
    .setProperties(...)
    .setNFATable(...)
    .setNFATable(...)
    .setData(...)
    .create();
```

**Code:** See the implementation of all tables as nested components in `src/components/storyboards/tables` folder and feature action table reader, feature to action mapping classes in `src/utils/storyboards/feature-action` folder. The web templates or pages of feature action tables are in `public/static/storyboards`.

**Example:** See the examples/tests in the UI.

### MSB Feature API

<div>
    <img width="350px" src="https://github.com/saifulkhan/meta-storyboard/raw/main/doc/feature-classes.png" alt="Feature Classes" />
    <br>
    <small><i>Figure 2: The class diagram of the MSB feature classes. Please see the source code for all classes, their methods and attributes. </i></small>
    <br><br>
</div>

The `MSBFeature` is an abstract class that encapsulates both numerical and semantic attributes of time series data through its subclasses, `NumericalFeature` and `CategoricalFeature`. These base classes serve as the foundation for concrete classes such as specific implementations like `Peak`, `Min`, `Max`, etc., it provides a structured approach to define features of time series data. Developers can extend this base class to implement new features.

**Feature Names:** Features are defined as enumerators, e.g.,

```ts
export enum MSBFeatureName {
  FIRST = "FIRST",
  CURRENT = "CURRENT",
  LAST = "LAST",
  MAX = "MAX",
  MIN = "MIN",
  PEAK = "PEAK",
  VALLEY = "VALLEY",
  FALL = "FALL",
  RAISE = "RAISE",
  SLOPE = "SLOPE",
  ...
}
```

**Creating MSB Feature:** To instantiate a feature, use the constructor of a concrete feature class. Set properties using method chaining. For example, when a feature `PEAK` is detected it creates a `Peak` object as follows. The default feature properties are used unless defined in feature-action table. Use the getter functions to retrieve the feature properties.

```ts
new Peak()
    .setDate(...)
    .setHeight(...)
    .setNormWidth(...)
    .setNormHeight(...)
    .setRank(...)
    .setMetric(...)
    .setStart(...)
    .setEnd(...)
    .setDataIndex(...);
```

**MSB Feature Factory:** The `MSBFeatureFactory` class implements a factory design pattern for streamlined feature creation, utilizing search functions to dynamically generate feature instances based on input feature action table and time series data.

```js
new MSBFeatureFactory()
    .setProperties()
    .setData()
    .search(<feature name>, <properties>, ...);
```

**Code:** Explore the `src/utils/storyboards/feature` directory for details on the available features and their implementations.

**Example:** See the examples/tests in the UI.

### MSB Action API

<div>
    <img width="450px" src="https://github.com/saifulkhan/meta-storyboard/raw/main/doc/action-classes.png" alt="Action Classes" />
    <br>
    <small><i>Figure 3: Action classes. Please see the source code for all classes, their methods and attributes. </i></small>
    <br><br>
</div>

The `Action` abstract class serves as a blueprint for defining atomic actions, e.g., circles, dots, etc. represented by `Circle` and `Dot` classes respectively.

**MSB Action Names:** Various actions are defined as enumerators, e.g.,

```ts
export enum ActionName {
  DOT = "DOT",
  CIRCLE = "CIRCLE",
  TEXT_BOX = "TEXT_BOX",
  CONNECTOR = "CONNECTOR",
  ...
}
```

**Creating MSB Actions:** Instantiate a `Circle` action object and display it within an SVG canvas. The default action properties are used unless defined in the feature-action table.

```ts
new Circle()
    .setProps(<props>)
    .setCanvas(<svg>)
    .setCoordinate(<coordinates>)
    .show();
```

Animated movement for objects, e.g., `TextBox`, can be achieved by:

```ts
new TextBox()
    .setProps(...)
    .setCanvas(...)
    .setCoordinate(...)
    .show()
    .move(<coordinates>, ...);
```

**Group MSB Actions:** The `ActionGroup` class employs a composite design pattern to group multiple actions representing a feature, as shown in an example below:

```ts
new ActionGroup()
    .group(<actions>)
    .setCanvas(...)
    .setCoordinate(...)
    .show();
```

**MSB Action Factory:** The `ActionFactory` utilizes a factory design pattern to simplify the creation of action objects, making it more efficient to generate actions from feature action tables.

```js
new ActionFactory()
    .create(<action name>, <action properties>)
```

**Code:** See the available actions in the `src/components/storyboards/actions` folder.

**Example:** See the examples/tests in the UI.

### Feature Search & Gaussian API

The feature search or detection functions are implemented in `feature-search.ts`. These functions are implemented as pure functions. The `gaussian.ts` file contains functions for calculating the Gaussian distributions of both numerical and categorical time series, as well as for generating a combined Gaussian useful for segmentation. These functions are designed as pure functions.

**Feature Detection:** The following are examples API for peak detection.

```ts
searchPeaks(<time series>, <properties, e.g., window>)
```

**Gaussian:** The following are API for computing Gaussian distributions.

```ts
gaussian(<mean>, <std>, ...)
```

**Code:** See the available feature search or detection functions in `src/utils/storyboards/feature/feature-search.ts` and all Gaussian functions in `src/utils/storyboards/data-processing/Gaussian.ts`.

**Example:** See the examples/tests in the UI.

### Animated Plots API

<div>
    <img width="350px" src="https://github.com/saifulkhan/meta-storyboard/raw/main/doc/plot-classes.png" alt="Plot Classes" />
    <br>
    <small><i>Figure 4: Plot classes.</i></small>
    <br><br>
</div>

`Plot` is an abstract class that defines abstract methods used for creating a plot, setting properties, and animating. The concrete plots, e.g., line plot, and parallel coordinate plots implement the actual logic.

**Creating a Plot:** Create a line plot and animate actions,

```ts
new LinePlot()
    .setData(<time series data>)
    .setName(<selected data stream name>)
    .setProps(<props>)
    .setPlotProps(<plot props>)
    .setCanvas(<svg>)
    .setActions(<actions>)
    .animate()
```

**Code:** See various plots and their API in `src/components/storyboards/plots` folder.

**Example:** See the examples/tests in the UI.

### Creating Story

<!-- <div align="center">  -->
<div>
    <img width="1000px" src="https://github.com/saifulkhan/meta-storyboard/raw/main/doc/sequence-diagram.png" alt="sequence diagram" />
    <br>
    <small><i>Figure 1: Sequence diagram demonstrating a story creation process and important classes and methods involved.</i></small>
    <br><br>
</div>

**Code:** See the implementation of story pages in `src/pages/storyboards` folder.

**Example:** See COVID-19 story with a single time series and Machine learning multi-variate story in the UI.

### Feature Action Tables UI

This is an experimental feature and incomplete functionality. To add a new table, see `src/services/TableService.ts`


## Additional Information

### Build & Release

To build the library:
```bash
yarn install
yarn build:lib
```

To publish to npm:
```bash
npm login
npm publish
```

### Contribution

Contributions are welcome! Please open issues or pull requests on [GitHub](https://github.com/saifulkhan/meta-storyboard). For major changes, please discuss them via issue first.

### License

This project is licensed under the MIT License. See [LICENSE](LICENSE) for details. (TODO)

### Support

If you need help, open a [GitHub issue](https://github.com/saifulkhan/meta-storyboard/issues). For additional plots and early prototypes, see:
- [Observable notebook prototype](https://observablehq.com/d/0a6e9c35a809660e)
- [First React.js prototype](https://github.com/saifulkhan/storytelling-vis-v.0.1)


### References

- [d3.js](https://d3js.org/)
- [React.js](https://react.dev)
- [Next.js](https://github.com/vercel/next.js)
- [Material UI](https://mui.com)

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

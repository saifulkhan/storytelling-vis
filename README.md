# About

This repository contains the source code accompanying our research on utilizing feature-action design patterns for creating storytelling visualizations with time series data. Our work is detailed in the paper titled "Feature-Action Design Patterns for Storytelling Visualizations with Time Series Data"[⤴](https://arxiv.org/abs/2402.03116v1).

## Prerequisite

The following environment and packages are required.

- Node.js v20.11.1
- yarn or npm

## Getting Started

Clone the repository.

```bash
git clone https://github.com/saifulkhan/storytelling-vis.git
cd storytelling-vis

```

Install all dependent packages.

```bash
yarn install
```

Start the development server to view the UI:

```bash
yarn dev
```

Open <http://localhost:3000> [⤴]() in your browser to explore the visualizations.

### Tests

Execute unit tests:

```sh
yarn test
```

Note: unit tests are under development and may not cover all features.

# Documentation

## Code Structure

The project is structured following React and Next.js guidelines and practices.

```
.
├── src
│   ├── components          /* UI components */
│   │   ├── storyboards
│   │   │   ├── actions
│   │   │   │   └── ...     /* Various actions implementation */
│   │   │   ├── plots
│   │   │   │   └── ...     /* Various plots implementation */
│   │   │   └── tables
│   │   │       └── ...     /* Tables' implemented as nested components */
│   ├── pages
│   │   └── storyboards     /* Web templates */
│   │       ├── examples
│   │       │   └── ...     /* Example or test vis, e.g., actions, features, plots etc. */
│   │       └── ...         /* Web vis, e.g., stories, tables, etc. */
│   ├── services
│   │   └── ...             /* Time series data, table data, etc. */
│   └── utils
│      └── storyboards
│           ├── data-processing
│           │   └── ...     /* Data processing, e.g., Gaussian */
│           ├── feature
│           │   └── ...     /* Feature search functions */
│           ├── feature-action
│           │   └── ...     /* Feature-action table, feature search, and creating actions */
│           └── workflow
│               └── ...     /* Story-specific workflows */
└── ...                     
```

## API

MSB: Meta-Storyboard

### MSB Feature Action Tables

We implemented UIs for meta-story authors for creating and updating feature action tables. The data structures of the tables are shown below. The feature action tables are implemented as nested React.js components.

TODO: Rename and refactor names, e.g., feature -> featureName, etc.

**Numerical Feature Action**

```json
{
    "feature": "<feature name>",
    "properties": {"..."},
    "rank": "...",
    "actions": [
      {
        "action": "<action name>",
        "properties": {
          "size": "...",
          "color": "...",
          "..."
        }
      },
    "..."
    ]
    "..."
  },
```

**Categorical Feature Action**

```json

  {
    "feature": "<event name>",
    "date": "...",
    "description": "...",
    "rank": "...",
    "actions": [
      {
        "action": "<action name>",
        "properties": {
          "size": "...",
          "color": "...",
          "..."
        }
      }
    ]
    "..."
  },
```

**Table API:**  See the implementation of all tables as nested components in `src/components/storyboards/tables` folder and feature action table reader, feature to action mapping classes in `src/utils/storyboards/feature-action` folder. The web templates or pages of feature action tables are in `public/static/storyboards`.

**MSB Feature Action Factory API:**

TODO: Show an example.

**Example:**

- See the examples of nested components of feature action tables, e.g., feature properties table[⤴](http://localhost:3000/storyboards/examples/test-feature-properties-table), action properties table[⤴](http://localhost:3000/storyboards/examples/test-action-properties-table), and action table[⤴](http://localhost:3000/storyboards/examples/test-action-table).
- Implemented feature action tables, Covid19 single story numerical feature action table [⤴](), Covid19 categorical feature table [⤴](), Machine learning multi-variate story numerical feature action table [⤴]() for meta authors. <TODO links>

### MSB Feature

<div>
    <img width="350px" src="./public/static/doc/feature-classes.png" alt="" />
    <br>
    <small><i>Figure 2: The class diagram of the MSB feature classes. Please see the source code for all classes, their methods and attributes. </i></small>
    <br><br>
</div>

The `MSBFeature` is an abstract class that encapsulates both numerical and semantic attributes of time series data through its subclasses, `NumericalFeature` and `CategoricalFeature`. These base classes serve as the foundation for concrete classes such as specific implementations like `Peak`, `Min`, `Max`, etc., it provides a structured approach to define features of time series data. Developers can extend this base class to implement new features.

**Feature Types:** Features are defined as enumerators, e.g.,

```ts
export enum MSBFeatureName {
  CURRENT = "CURRENT",
  LAST = "LAST",
  MAX = "MAX",
  MIN = "MIN",
  PEAK = "PEAK",
  VALLEY = "VALLEY",
  FALL = "FALL",
  RAISE = "RAISE",
  SLOPE = "SLOPE",
}
```

TODO: Complete the list of feature types.

**Creating MSB Feature:** To instantiate a MSB feature, use the constructor of a concrete feature class. Set properties using method chaining. For example, when a feature `PEAK` is detected it creates a `Peak` object as follows. The default feature properties are used unless defined in feature-action table.

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

Use the getter functions to retrieve the feature properties.

**MSB Feature Factory:** The `MSBFeatureFactory` class implements a factory design pattern for streamlined feature creation, utilizing search functions to dynamically generate feature instances based on input feature action table and time series data.

TODO: Show an example.

**MSB Feature API:** Explore the `src/utils/storyboards/feature` directory for details on the available features and their implementations.

**Example:** See an example of feature detection and its visualization [⤴](http://localhost:3000/storyboards/examples/test-features).

### Feature Search & Gaussian

The feature search or detection functions are implemented in `feature-search.ts`. These functions are implemented as pure functions. The `gaussian.ts` file contains functions for calculating the Gaussian distributions of both numerical and categorical time series, as well as for generating a combined Gaussian useful for segmentation. These functions are designed as pure functions.

**Feature Detection:**

The following are examples API for peak detection and computing Gaussian distributions.

```ts
searchPeaks(<time series>, <properties, e.g., window>)
```

```ts
gaussian(<mean>, <std>, ...)
```

**Feature Search API:** See the available feature search or detection functions in `src/utils/storyboards/feature/feature-search.ts` and all Gaussian functions in `src/utils/storyboards/data-processing/Gaussian.ts`.

**Example:** See examples of visualization of numerical timeseries[⤴](http://localhost:3000/storyboards/examples/test-gaussian-nts), categorical timeseries[⤴](http://localhost:3000/storyboards/examples/test-gaussian-cts) and combined gaussian[⤴](http://localhost:3000/storyboards/examples/test-gaussian-combined).

### MSB Actions

<div>
    <img width="450px" src="./public/static/doc/action-classes.png" alt="" />
    <br>
    <small><i>Figure 3: Action classes.</i></small>
    <br><br>
</div>

The `MSBAction` abstract class serves as a blueprint for defining atomic actions, e.g., circles, dots, etc. represented by `Circle` and `Dot` classes respectively.

**Action Type:** Various actions are defined as enumerators, e.g.,

```ts
export enum MSBActionName {
  DOT = "DOT",
  CIRCLE = "CIRCLE",
  TEXT_BOX = "TEXT_BOX",
  CONNECTOR = "CONNECTOR",
}
```

TODO: Complete the list of action types.

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

**Group MSB Actions:**  The `ActionGroup` class employs a composite design pattern to group multiple actions representing a feature, as shown in an example below:

```ts
new MSBActionGroup()
    .group(<actions>)
    .setCanvas(...)
    .setCoordinate(...)
    .show();
```

**MSB Action Factory:** The `ActionFactory` utilizes a factory design pattern to simplify the creation of action objects, making it more efficient to generate actions from feature action tables.

TODO: Show an example.

**MSB Action API:** See the available actions in the `src/components/storyboards/actions` folder.

**Example:** Example creation and visualization of various actions [⤴](http://localhost:3000/storyboards/examples/test-actions).

### Plots

<div>
    <img width="350px" src="./public/static/doc/plot-classes.png" alt="" />
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

**MSB Action API:** See various plots and their API in `src/components/storyboards/plots` folder.

**Example:** See an example line plot[⤴](<http://localhost:3000/storyboards/examples/test-line-plot>).

### MSB Workflow

<div>
    <img width="350px" src="./public/static/doc/workflow-classes.png" alt="" />
    <br>
    <small><i>Figure 3: Workflow classes.</i></small>
    <br><br>
</div>

The abstract`Workflow` class is created to define the workflow API, and the concrete workflow classes are created for each story. The workflow acts as a facade design pattern and interact with other classes.

**Creating a Workflow:** For example, Covid19 single location workflow is created by,

```ts
new Covid19SLWorkflow()
    .setName(region)
    .setData(regionData)
    .setNFATable(tableNFA)
    .setCanvas(chartRef.current)
    .create();
```

**Workflow API:** See the implementation of various workflows in `src/utils/storyboards/workflow` folder, and how they are instantiated in story pages in `src/pages/storyboards` folder.

**Example:** Covid19 story with single time series [⤴](http://localhost:3000/storyboards/covid19-sl-story), and Machine learning multi-variate story[⤴](http://localhost:3000/storyboards/ml-mv-story).

## Sequence Diagram of a Workflow

<!-- <div align="center">  -->
<div>
    <img width="1000px" src="./public/static/doc/sequence-diagram.png" alt="sequence diagram" />
    <br>
    <small><i>Figure 1: Sequence diagram demonstrating a story creation process and important classes and methods involved.</i></small>
    <br><br>
</div>

## References

Please cite our paper as follows:

```
@article{khan2024,
    title={Feature-Action Design Patterns for Storytelling Visualizations with Time Series Data}, 
    author={S. Khan and S. Jones and B. Bach and J. Cha and M. Chen and J. Meikle and J. C. Roberts and J. Thiyagalingam and J. Wood and P. D. Ritsos},
    journal={arXiv preprint arXiv:2402.03116},
    year={2024},
}
```

- The first version of the prototype was done in  Observable notebook and can be found in Observablehq [⤴](https://observablehq.com/d/0a6e9c35a809660e). The second version of the prototype ported from Observable Notebook to React.js can be found in the GitHub[⤴](https://github.com/saifulkhan/storytelling-vis-v.0.1).
- The previous prototypes contain six stories, however, in this new repository so far we only ported two stories. We will gradually port the remaining four stories and will also add more stories.
- Used React.js[⤴](https://react.dev), Next.js[⤴](https://github.com/vercel/next.js), Material UI[⤴](https://mui.com) libraries for the UI development.

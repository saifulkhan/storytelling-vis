# About

This is the source code of our paper titled Feature-Action Design Patterns for Storytelling Visualizations with Time Series Data.

## Prerequisite

- Node.js v20.11.1
- yarn or npm

## Getting Started

Install the packages and dependencies,

```bash
yarn install
```

To start the UI, run the development server,

```bash
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the UI.

### Tests

```sh
yarn test
```

> Note: Unit tests have yet to be extensively implemented.

## Code Structure

We followed the commonly used React and Next.js project structure to organise the source code, with the important folders and files listed below.

```
TODO
```

## API Documentation

### Sequence Diagram

<!-- <div align="center">  -->
<div>
    <img width="1000px" src="./public/static/doc/sequence-diagram.png" alt="sequence diagram" />
    <br>
    <small><i>Figure 1: Sequence diagram demonstrating the classes' most important interaction using function calls.</i></small>
</div>

### Feature

<div>
    <img width="350px" src="./public/static/doc/feature-classes.png" alt="" />
    <br>
    <small><i>Figure 2: The ULM diagram of the features. We did not show all the classes or their methods and attributes in this diagram. </i></small>
</div>

`Feature` is an abstract class,  `NumericalFeature` and `CategoricalFeature` are two classes inherited from it that describe numerical and semantic features of a time series. The concrete classes, e.g., `Peak`, `Min`, `Max`, etc. holds the numerical properties of timeseries. More firtures can be implemented by extending the base class.

To create a feature object:

```ts
new <FeatureName>()
    .setDate(Date)
    .setHeight(number)
    .setNormWidth(number)
    .setNormHeight(number)
    .setRank(number)
    .setMetric(string)
    .setStart(Date)
    .setEnd(Date)
    .setDataIndex(number);
```

For example, to create a Peak object,

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

Features types are implemented in ``NumericalFeatures` and `CategoricalFeatures` enumerators. The `FeatureFactory` implements a factory design pattern which is used for streamlining feature object creation. See the contents of folder `src/utils/storyboards/feature` for more details.

📈 An example feature detection and visualization[🔗](http://localhost:3000/storyboards/examples/test-features).

### Feature Search

The feature search or feature detection functions are implemented in `feature-search.ts`. Each feature search method is implemented as a pure function.

### Gaussian

The Gaussian functions are implemented in the `gaussian.ts` file. Similar to the feature search method, the Gaussian functions are also implemented as pure functions.  

📈 Example Gaussian

- Numerical timeseries [🔗](http://localhost:3000/storyboards/examples/test-gaussian-nts)
- Categorical timeseries [🔗](http://localhost:3000/storyboards/examples/test-gaussian-cts)
- Combined Gaussian [🔗](http://localhost:3000/storyboards/examples/test-gaussian-combined)

## Drawing Actions

<div>
    <img width="450px" src="./public/static/doc/action-classes.png" alt="" />
    <br>
    <small><i>Figure 3: Action classes.</i></small>
</div>

`Action` is an abstract class defining an action's blue print. All the atomic actions, e.g., the circle is implemented in the `Circle` class, node is implemented in the `Dot` class, and so on, inherit this abstract class. The `ActionGroup` class defines a group of actions as a composite design pattern. While we can create action objects just by creating instances of the classes, we have `ActionFactory`, which implements a factory design pattern to streamline and abstract away action creation directly from the feature action table. See the contents of folder `src/components/storyboards/actions` for more details.

Create an action object,

```ts
new <ActionName>()
    .setProps(<Props>)
    .setCanvas(SVGGElement)
    .setCoordinate([Coordinate, Coordinate])
    .show();
```

Animate action, e.g., show and hide,

```ts
await <action>.show(delay, duration);
await <action>.hide(delay, duration);
```

For example, create a Circle object,

```ts
new Circle()
    .setProps(CircleProps)
    .setCanvas(SVGGElement)
    .setCoordinate([Coordinate, Coordinate])
    .show();
```

We implemented movement for `TextBox` to a specified coordinate:

```ts
const textBox 
= new TextBox()
    .setProps(...)
    .setCanvas(...)
    .setCoordinate(...)
    .show();

await textBox.move(Coordinate, delay, duration);
```

Group multiple actions to a single object,

```ts
new ActionGroup()
    .group([<array of actions>])
    .setCanvas(...)
    .setCoordinate(...)
    .show();
```

📈 Example creation and visualization of various actions [🔗](http://localhost:3000/storyboards/examples/test-actions).

## Plots

<div>
    <img width="350px" src="./public/static/doc/plot-classes.png" alt="" />
    <br>
    <small><i>Figure 4: Plot classes.</i></small>
</div>

`Plot` is an abstract class

```ts
new <PlotName>()
    .setData([<array of data>])
    .setName(string)
    .setPlotProps(PlotProps)
    .set<plot specific>Props([])
    .setCanvas(SVGGElement)
    .setActions([<date and action>])
    .animate()

```

For example, line plot API

```ts
new LinePlot()
    .setData(TimeseriesData[]])
    .setName(name or key)
    .setPlotProps(PlotProps)
    .setLineProps([])
    .setCanvas(SVGGElement)
    .setActions(<action data>)
    .animate()

```

In order to draw static plot, use the `plot()` method, e.g.,

```ts
plot.plot()
```

See the implementation of each plot class for more details.

📈 Example line plot  in action [🔗](http://localhost:3000/storyboards/examples/test-line-plot).

## Feature Action Tables

### Numerical Feature Action

### Categorical Feature Action

TODO
Feature action tables are implemented as nested React components.

📈 Example components feature action tables

- Feature properties table [🔗](http://localhost:3000/storyboards/examples/test-feature-properties-table)
- Action properties table [🔗](http://localhost:3000/storyboards/examples/test-action-properties-table)
- Action table [🔗](http://localhost:3000/storyboards/examples/test-action-table)

## Workflow

<div>
    <img width="350px" src="./public/static/doc/workflow-classes.png" alt="" />
    <br>
    <small><i>Figure 3: Workflow classes.</i></small>
</div>

Story specific workflow

Create workflow of a story:

```ts
new  <WorkflowName>()
    .setName(...)
    .setData(...)
    .setNFATable(...)
    .setCanvas(...)
    .create();
```

For example, Covid19 single location workflow is created by,

```ts
new Covid19SLWorkflow()
    .setName(region)
    .setData(regionData)
    .setNFATable(tableNFA)
    .setCanvas(chartRef.current)
    .create();
```

📈 Example stories

- Covid19 story with single timeseries [🔗](http://localhost:3000/storyboards/covid19-sl-story)
- Machine learning multi-variate story [🔗](http://localhost:3000/storyboards/ml-mv-story)

## References

Please cite our paper as follows:

```
@article{khan2024
    title={Feature-Action Design Patterns for Storytelling Visualizations with Time Series Data}, 
    author={S. Khan and S. Jones and B. Bach and J. Cha and M. Chen and J. Meikle and J. C. Roberts and J. Thiyagalingam and J. Wood and P. D. Ritsos},
    journal={arXiv preprint arXiv:2402.03116},
    year={2024},
}
```

- The first version of the prototype was done in  Observable notebook and can be found in [observablehq](https://observablehq.com/d/0a6e9c35a809660e).
- Second version of prototype ported from Observable notebook to React.js can be found in [GitHub](https://github.com/saifulkhan/storytelling-vis-v.0.1). These prototypes contain six stories, however only two stories are ported to this new software.
- Used [React.js](https://react.dev), [Next.js](https://github.com/vercel/next.js), [MUI](https://mui.com) libraries for the UI development.

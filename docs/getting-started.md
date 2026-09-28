# Getting Started

Story development is a four-step process:

1. **Load data and feature-action table**:
    - **Load timeseries data**: See some example COVID-19 and Machine Learning training provenance data in the examples repository under `react/src/assets/data`.
    - **Load feature-action table**: See some example feature-action tables in the examples repository under `react/src/assets/feature-action-table`.
2. **Create timeline actions**: Use the `FeatureActionFactory` class to create timeline actions from the timeseries data and feature-action table.
3. **Initialize plot and animation controller**: Create a plot and animation controller. We developed some plots, such as `LinePlot`, `MirroredBarChart`, and `ParallelCoordinatePlot`, available in `src/components/plots`, and animation controllers in `src/components/animation`.
4. **Configure plot and animate**: Use play and pause button to animate.

## Basic template

For example (using React but you can use any other framework):

```tsx
import * as msb from 'meta-storyboard';

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
// react hook shipped with the library (optional entry point)
import { useControllerWithState } from 'meta-storyboard/react';
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

## Template with categorical data & Gaussian segmentation

For applications requiring the integration of both numerical and categorical time series with automated segmentation using Gaussian mixture models, the `FeatureActionFactory` provides two additional methods `setCategoricalFeatures` and `segment`; use them as follows:

```tsx
import * as msb from 'meta-storyboard';

// 1. Load data and feature-action table
const data = ...; // time series data
const numericalFATable = ...; // numerical feature-action table

const categoricalEventsData = ...; // categorical events timeseries data
const categoricalFATable = ...; // categorical feature-action table

const numSegment = ...; // number of segments
const method = ...; // segmentation method, e.g., gaussian mixture model

// 2. Process feature-action table and create timeline actions
const timelineActions = new msb.FeatureActionFactory()
  .setProps({ /* properties */ })
  .setData(data)
  .setNumericalFeatures(numericalFeatures)
  .setCategoricalFeatures(categoricalEventsData, categoricalFATable)
  .segment(numSegment, method)
  .create();

// 3. Initialize a plot and animation controller
const plot = useRef(new msb.LinePlot()).current;
// react hook shipped with the library (optional entry point)
import { useControllerWithState } from 'meta-storyboard/react';
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

See complete implementations on the [Examples](examples.md) page, with live demos at [saifulkhan.github.io/meta-storyboard-examples](https://saifulkhan.github.io/meta-storyboard-examples/).

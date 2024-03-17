# Feature-Action Design Patterns for Storytelling Visualizations with Time Series Data

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

<!-- You can start editing the page by modifying `pages/index.js`. The page auto-updates as you edit the file. -->

### Tests

```sh
yarn test
```

> Note: Unit tests have not been extensively implemented yet. We still need to add the unit tests.

## Code and API Documentation

### Project Structure

```
TODO
```

### Feature Detection

Pure functions `feature-search.ts` ... `FeatureSearch.ts` is  a wrapper class...

Detection & feature creation:

```ts
TODO
```

- <http://localhost:3000/storyboards/examples/test-features>
- <http://localhost:3000/storyboards/examples/test-gaussian-nts>
- <http://localhost:3000/storyboards/examples/test-gaussian-cts>
- <http://localhost:3000/storyboards/examples/test-gaussian-combined>

### Drawing Actions

`Action` is an abstract class which defines the blue print of an action. All the atomic actions, e.g., circle is implemented in `Circle` class, node is implemented in `Dot` class inherits this abstract class. A group of actions is defined in `ActionGroup` class. While we can create action objects just by creating instances ob the classes, we have `ActionFactory` which implements a factory design pattern to streamline and abstract away action creation directly from feature action table.

Action objects:

```ts
const circle = new Circle()
            .setProps(CircleProps)
            .setCanvas(SVGGElement)
            .setCoordinate([Coordinate, Coordinate])
            .show();
```

Animate action show and hide:

```ts
await circle.show(delay, duration);
await circle.hide(delay, duration);
```

We implemented movement for `TextBox` to a specified coordinate:

```ts
const textBox = new TextBox()
            .setProps(...)
            .setCanvas(...)
            .setCoordinate(...)
            .show();

await textBox.move(Coordinate, delay, duration);
```

We implemented and tested various actions in `src/pages/storyboards/examples/test-actions.tsx` page and can be seen in action <http://localhost:3000/storyboards/examples/test-actions>

Please see the contents of `src/components/storyboards/actions` for details or implementing various different actions.

### Plots

Various plots implemented ...

For example, to create line plot:

```ts
const plot = new LinePlot()
                .setData(TimeseriesData)
                .setName(name or key)
                .setPlotProps(PlotProps)
                .setCanvas(SVGGElement)
                .draw()

```

See the example line plot `src/pages/storyboards/examples/test-line-plot.tsx` in action <http://localhost:3000/storyboards/examples/test-line-plot>.

In order to animate line plot, set the list of actions and call animate.

```ts
plot.setActions()
    .animate(<feature action data>)
```

### Feature Action Table

- <http://localhost:3000/storyboards/examples/test-properties-table>
- <http://localhost:3000/storyboards/examples/test-action-table>
- <http://localhost:3000/storyboards/examples/test-feature-action-table>
- <http://localhost:3000/storyboards/examples/test-feature-action-table-1>
- <http://localhost:3000/storyboards/examples/test-feature-action-table>

### Build Story

Page -> builder ->

Create workflow of a story:

```ts
const workflow = new ...Workflow()
                    .selector(id)
                    .create(key);
```

## References

Please cite our paper as follows:

```
@article{khan2024
    title={Feature-Action Design Patterns for Storytelling Visualizations with Time Series Data}, 
    author={S. Khan and S. Jones and B. Bach and J. Cha and M. Chen and J. Meikle and J. C Roberts and J. Thiyagalingam and J. Wood and P. D. Ritsos},
    journal={arXiv preprint arXiv:2402.03116},
    year={2024},
}
```

- The initial Observable prototypes can be found in [observablehq](https://observablehq.com/d/0a6e9c35a809660e).
- Second version of prototype ported from Observable to React.js can be found in [GitHub](https://github.com/saifulkhan/storytelling-vis-v.0.1). This prototype contains six stories, and only two stories are ported to this new software.
- Used [React.js](https://react.dev), [Next.js](https://github.com/vercel/next.js), [MUI](https://mui.com) libraries for the UI development.

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

## Feature Detection

Pure functions `feature-search.ts` ... `FeatureSearch.ts` is  a wrapper class...

Detection & feature creation:

```ts

```

- <http://localhost:3000/storyboards/examples/test-features>
- <http://localhost:3000/storyboards/examples/test-gaussian-combined>

## Action

Action objects:

```ts
feature = new Action()
                .properties({...})
                .draw(svg)
                .coordinate(x, y, x0, y0)
```

Animate feature

```ts
await feature.show(delay, duration);
await feature.hide(delay, duration);
```

- <http://localhost:3000/storyboards/examples/test-actions>

## Plots

```ts
const plot = new PlotName()
                .data(data)
                .properties({})
                .svg(svg)

// static
plot.draw();

// animation 
plot.animate(<feature action data>)
```

- <http://localhost:3000/storyboards/examples/test-line-plot>

## Feature Action Table

- <http://localhost:3000/storyboards/examples/test-properties-table>
- <http://localhost:3000/storyboards/examples/test-action-table>
- <http://localhost:3000/storyboards/examples/test-feature-action-table>
- <http://localhost:3000/storyboards/examples/test-feature-action-table-1>
- <http://localhost:3000/storyboards/examples/test-feature-action-table>

## Story Builder

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

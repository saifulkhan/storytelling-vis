# Feature Search & Gaussian API

## Feature detection

The `Search` class implements various feature detection algorithms. The following is an example API for peak detection. Similarly, additional feature detection APIs have also been implemented.

```ts
Search.searchPeaks(<time series>, <properties, e.g., window>)
```

## Gaussian

The `Gaussian` class implements various Gaussian algorithms. The following is an API for the Gaussian mixture model to compute combined Gaussians from numerical time series (peaks) and categorical time series.

```ts
Gaussian.gmm(<time series>, <categorial events>)
```

See the [COVID-19 story with Gaussian segmentation](https://saifulkhan.github.io/meta-storyboard-examples/example/story-covid19-gaussian/) for a live demonstration.

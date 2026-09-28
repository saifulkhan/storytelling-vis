# Story Creation Workflow

The sequence diagram below demonstrates a story creation process and the important classes and methods involved. A story page (e.g., the COVID-19 story) loads the data and feature-action tables, delegates feature detection and action creation to `FeatureActionFactory`, and finally hands the resulting timeline actions to a plot for animation.

```mermaid
sequenceDiagram
    participant SP as StoryPage<br/>(e.g., Covid19StoryPage)
    participant FAF as FeatureActionFactory
    participant FF as FeatureFactory
    participant S as Search
    participant AF as ActionFactory
    participant G as Gaussian
    participant P as Plot<br/>(e.g., LinePlot)

    Note over SP: load time series data,<br/>categorical events,<br/>feature-action tables

    SP->>+FAF: create()
    FAF->>+FF: searchNumericalFeature() / searchCategoricalFeature()
    FF->>+S: detect features
    S-->>-FF: detected features
    FF-->>-FAF: features

    FAF->>+AF: create()
    AF-->>-FAF: action
    FAF->>+AF: group()
    AF-->>-FAF: grouped action

    FAF->>+G: gmm()
    G->>+S: detect features, segment
    S-->>-G: segmented indexes
    G-->>-FAF: segmented indexes

    FAF->>FAF: additional processing
    FAF-->>-SP: timeline actions (e.g., dates, actions)

    Note over SP,G: the gaussian pipeline can be integrated into any story

    SP->>+P: animate()
    P->>P: draw()
    P-->>-SP: togglePlayPause()
```

*Sequence diagram demonstrating a story creation process and important classes and methods involved.*

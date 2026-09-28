# Customization & Debugging

## Register custom features and actions

```ts
import { ActionFactory, FeatureFactory } from 'meta-storyboard';

// a custom action usable as { "action": "MY_MARKER" } in tables
ActionFactory.register('MY_MARKER', (props) => new MyMarker().setProps(props), /* zOrder */ 5);

// a custom feature detector usable as { "feature": "CHANGEPOINT" } in tables
FeatureFactory.register('CHANGEPOINT', (data, props, rank) => detectChangepoints(data, rank));
```

## Debug logging

The library is silent by default (warnings and errors only). Enable debug output or route logs into your own logger:

```ts
import { setDebug, setLogger } from 'meta-storyboard';

setDebug(true); // verbose diagnostics
setLogger({ warn: myLogger.warn, error: myLogger.error });
```

## Reduced motion

Animated transitions automatically respect the user's `prefers-reduced-motion` setting; animation timing is configurable per plot (e.g., `animationDelay`, `animationDurationMsPerPixel` in `LinePlot`).

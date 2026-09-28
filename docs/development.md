# Development

## Project structure

```
src
├── components
│   ├── actions               # VIS action components, e.g., Circle, Dot, etc.
│   ├── animation             # animation controllers
│   └── plots                 # plots, e.g., LinePlot, etc.
├── factory                   # factories for creating features/actions
├── feature                   # feature classes, e.g., Peak, Max, etc.
├── processing                # search, gaussian, and utility functions
├── react                     # optional react entry point (hooks)
├── schema                    # feature-action table validation
└── types                     # TypeScript types
```

## Build

To build the library:

```bash
yarn install
yarn build:lib
```

Other useful scripts:

```bash
yarn type-check  # TypeScript type checking
yarn test        # run jest tests
yarn format      # prettier
```

## Release

To publish to npm:

```bash
npm login
npm publish
```

## Documentation

This documentation site is built with [MkDocs](https://www.mkdocs.org/) and [Material for MkDocs](https://squidfunk.github.io/mkdocs-material/). To preview locally:

```bash
pip install -r docs/requirements.txt
mkdocs serve
```

The site is deployed to [saifulkhan.github.io/meta-storyboard](https://saifulkhan.github.io/meta-storyboard/) by the `docs.yml` GitHub Actions workflow on every push to `main`.

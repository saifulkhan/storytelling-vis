# Mira Pro - React Admin & Dashboard Template

This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `pages/index.js`. The page auto-updates as you edit the file.

[API routes](https://nextjs.org/docs/api-routes/introduction) can be accessed on [http://localhost:3000/api/hello](http://localhost:3000/api/hello). This endpoint can be edited in `pages/api/hello.js`.

The `pages/api` directory is mapped to `/api/*`. Files in this directory are treated as [API routes](https://nextjs.org/docs/api-routes/introduction) instead of React pages.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.

## Tests

### Run Unit Tests

```sh
yarn test
```

### Test & Debug

Test and debug visualizations & components

- <http://localhost:3000/storyboards/_tests_/test-features>
- <http://localhost:3000/storyboards/_tests_/test-actions>
- <http://localhost:3000/storyboards/_tests_/test-line-chart>
- <http://localhost:3000/storyboards/_tests_/test-properties-table>
- <http://localhost:3000/storyboards/_tests_/test-action-table>
- <http://localhost:3000/storyboards/_tests_/test-feature-action-table>

Pages

- <http://localhost:3000/storyboards/_tests_/test-feature-action-table>

## Documentation

### Workflow

Create workflow of a story:

```ts
const workflow = new ...Workflow()
                    .selector(id)
                    .create(key);
```

### Feature detection

Detection & feature creation:

```ts

```

### Plotting

```ts
const plot = new ...Plot()
                    .data(data)
                    .properties({})
                    .svg(svg)
                    .draw(); // static plot

plot.animate(<feature, action>) // animation 
```

### Feature draw

Feature objects:

```ts
feature = new ...Feature()
                .properties({...})
                .draw(svg)
                .coordinate(x, y, x0, y0)
```

Animate feature

```ts
await feature.show(delay, duration);
await feature.hide(delay, duration);
```

## References

- For the Observable prototypes developed during the initial phases of RAMPVIS project, [see](https://observablehq.com/d/0a6e9c35a809660e>).
- Bootstrapped with [Next.js](https://github.com/vercel/next.js)
- Using [React MUI dashboard style](https://mui.com)

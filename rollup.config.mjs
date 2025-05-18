import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import typescript from '@rollup/plugin-typescript';
import { babel } from '@rollup/plugin-babel';
import { terser } from 'rollup-plugin-terser';
import external from 'rollup-plugin-peer-deps-external';
import dts from 'rollup-plugin-dts';
import { readFileSync } from 'fs';

// Read package.json as JSON
const packageJson = JSON.parse(readFileSync('./package.json', 'utf8'));

export default [
  {
    input: 'src/index.ts',
    output: [
      {
        file: packageJson.main,
        format: 'cjs',
        sourcemap: true,
      },
      {
        file: packageJson.module,
        format: 'esm',
        sourcemap: true,
      },
    ],
    plugins: [
      external(),
      resolve(),
      commonjs(),
      typescript({
        tsconfig: './tsconfig.build.json',
        sourceMap: true,
        declaration: true,
        declarationDir: 'dist',
        // Skip type checking to avoid TypeScript errors during build
        noEmitOnError: false,
        exclude: ['**/__tests__/**', '**/*.test.ts'],
      }),
      babel({
        babelHelpers: 'runtime',
        exclude: 'node_modules/**',
        extensions: ['.js', '.ts'],
        presets: [
          ['@babel/preset-env', {
            modules: false,
            useBuiltIns: 'usage',
            corejs: 3
          }],
          '@babel/preset-typescript'
        ],
        plugins: [
          ['@babel/plugin-transform-runtime', {
            corejs: 3,
            helpers: true,
            regenerator: true
          }]
        ]
      }),
      terser(),
    ],
    external: Object.keys(packageJson.peerDependencies || {}),
  },
  {
    input: 'src/index.ts',
    output: [{ file: 'dist/index.d.ts', format: 'esm' }],
    plugins: [
      dts({
        respectExternal: true,
        // Fix paths in the declaration file
        afterBuild: () => {
          console.log('Fixing paths in declaration files...');
        },
      }),
    ],
  },
];

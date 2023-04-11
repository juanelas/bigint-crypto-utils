'use strict'

import inject from '@rollup/plugin-inject'
import { nodeResolve as resolve } from '@rollup/plugin-node-resolve'
import replace from '@rollup/plugin-replace'
import terser from '@rollup/plugin-terser'
import typescriptPlugin from '@rollup/plugin-typescript'
import commonjs from '@rollup/plugin-commonjs'
import json from '@rollup/plugin-json'

import { dirname, join } from 'path'
import { existsSync, readFileSync } from 'fs'

// import { browser, name as _name, exports } from '../package.json' assert { type: 'json' }
import { compile } from './rollup-plugin-dts.js'

import * as url from 'url'
const __dirname = url.fileURLToPath(new URL('.', import.meta.url))

const rootDir = join(__dirname, '..')
const pkgJson = JSON.parse(readFileSync(join(rootDir, 'package.json')))
// const dstDir = join(rootDir, directories.dist)
const srcDir = join(rootDir, 'src', 'ts')

function camelise (str) {
  return str.replace(/-([a-z])/g,
    function (m, w) {
      return w.toUpperCase()
    })
}

const regex = /^(?:(?<scope>@.*?)\/)?(?<name>.*)/ // We are going to take only the package name part if there is a scope, e.g. @my-org/package-name
const { name } = pkgJson.name.match(regex).groups
const pkgCamelisedName = camelise(name)

const input = join(srcDir, 'index.ts')
if (existsSync(input) !== true) throw new Error('The entry point should be index.ts')

const tsBundleOptions = {
  tsconfig: join(rootDir, 'tsconfig.json'),
  outDir: undefined, // ignore outDir in tsconfig.json
  include: ['src/ts/**/*', 'build/typings/is-browser.d.ts'],
  exclude: ['src/**/*.spec.ts']
}

const sourcemapOutputOptions = {
  sourcemap: 'inline',
  sourcemapExcludeSources: true
}

function compileDts () {
  return {
    name: 'compile-dts',
    closeBundle () {
      compile()
    }
  }
}

export default [
  { // Browser ESM bundle
    input,
    output: [
      {
        file: join(rootDir, pkgJson.browser),
        ...sourcemapOutputOptions,
        format: 'es'
      }
    ],
    plugins: [
      replace({
        IS_BROWSER: true,
        _MODULE_TYPE: "'ESM'",
        preventAssignment: true
      }),
      typescriptPlugin(tsBundleOptions),
      resolve({
        browser: true,
        exportConditions: ['browser', 'default'],
        mainFields: ['browser', 'module', 'main']
      }),
      commonjs({ extensions: ['.js', '.cjs', '.ts', '.jsx', '.cjsx', '.tsx'] }), // the ".ts" extension is required
      json()
    ]
  },
  { // Browser bundles
    input,
    output: [
      {
        file: join(rootDir, pkgJson.exports['./esm-browser-bundle-nomin']),
        format: 'es'
      },
      {
        file: join(rootDir, pkgJson.exports['./esm-browser-bundle']),
        format: 'es',
        plugins: [terser()]
      },
      {
        file: join(rootDir, pkgJson.exports['./iife-browser-bundle']),
        format: 'iife',
        name: pkgCamelisedName,
        plugins: [terser()]
      },
      {
        file: join(rootDir, pkgJson.exports['./umd-browser-bundle']),
        format: 'umd',
        name: pkgCamelisedName,
        plugins: [terser()]
      }
    ],
    plugins: [
      replace({
        IS_BROWSER: true,
        _MODULE_TYPE: "'BUNDLE'",
        preventAssignment: true
      }),
      typescriptPlugin({
        ...tsBundleOptions,
        sourceMap: false
      }),
      resolve({
        browser: true,
        exportConditions: ['browser', 'default'],
        mainFields: ['browser', 'module', 'main']
      }),
      commonjs({ extensions: ['.js', '.cjs', '.ts', '.jsx', '.cjsx', '.tsx'] }), // the ".ts" extension is required
      json()
    ]
  },
  { // Node CJS
    input,
    output: [
      {
        file: join(rootDir, pkgJson.exports['.'].node.require.default),
        ...sourcemapOutputOptions,
        format: 'cjs',
        exports: 'auto',
        plugins: [
          terser()
        ]
      }
    ],
    plugins: [
      replace({
        'await import(': 'require(',
        delimiters: ['', ''],
        preventAssignment: true
      }),
      replace({
        IS_BROWSER: false,
        _MODULE_TYPE: "'CJS'",
        preventAssignment: true
      }),
      inject({
        crypto: ['crypto', 'webcrypto']
      }),
      typescriptPlugin(tsBundleOptions),
      resolve({
        browser: false,
        exportConditions: ['require', 'node', 'module']
      }),
      commonjs({ extensions: ['.js', '.cjs', '.ts', '.jsx', '.cjsx', '.tsx'] }), // the ".ts" extension is required
      json()
    ]
  },
  { // Node ESM and type declarations
    input,
    output: [
      {
        file: join(rootDir, pkgJson.exports['.'].node.import.default),
        ...sourcemapOutputOptions,
        format: 'es',
        plugins: [
          terser()
        ]
      }
    ],
    plugins: [
      replace({
        IS_BROWSER: false,
        _MODULE_TYPE: "'ESM'",
        __filename: `'${pkgJson.exports['.'].node.import.default}'`,
        __dirname: `'${dirname(pkgJson.exports['.'].node.import.default)}'`,
        preventAssignment: true
      }),
      inject({
        crypto: ['crypto', 'webcrypto']
      }),
      typescriptPlugin(tsBundleOptions),
      resolve({
        browser: false,
        exportConditions: ['node', 'import']
      }),
      compileDts(),
      commonjs({ extensions: ['.js', '.cjs', '.ts', '.jsx', '.cjsx', '.tsx'] }), // the ".ts" extension is required
      json()
    ]
  }
]

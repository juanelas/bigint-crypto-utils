'use strict'

const fs = require('fs')
const jsdoc2md = require('jsdoc-to-markdown')
const path = require('path')
const pkgJson = require('../package.json')

const rootDir = path.join(__dirname, '..')

const template = path.join(rootDir, pkgJson.directories.src, 'doc', 'readme-template.md')
const input = path.join(rootDir, pkgJson.directories.lib, 'index.node.js')

const options = {
  source: fs.readFileSync(input, { encoding: 'UTF-8' }), // we need to use this instead of files in order to avoid issues with esnext features
  template: fs.readFileSync(template, { encoding: 'UTF-8' }),
  'heading-depth': 3, // The initial heading depth. For example, with a value of 2 the top-level markdown headings look like "## The heading"
  'global-index-format': 'none' // none, grouped, table, dl.
}

const readmeContents = jsdoc2md.renderSync(options)

const readmeFile = path.join(rootDir, 'README.md')

fs.writeFileSync(readmeFile, readmeContents)

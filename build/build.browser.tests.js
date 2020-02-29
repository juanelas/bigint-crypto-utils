'use strict';

const rollup = require('rollup');
const replace = require('@rollup/plugin-replace');
const resolve = require('rollup-plugin-node-resolve');
const commonjs = require('rollup-plugin-commonjs');
const multiEntry = require('rollup-plugin-multi-entry');

const fs = require('fs');
const path = require('path');
const pkgJson = require('../package.json');
const pkg_name = pkgJson.name;
const mocha_version = pkgJson.devDependencies.mocha.replace(/[\^~*><=]/g, '');
const chai_version = pkgJson.devDependencies.chai.replace(/[\^~*><=]/g, '');

const rootDir = path.join(__dirname, '..');


// Let's first create the appropriate html file loading mocha, chai and a bundle of the tests
const templatePath = path.join(rootDir, 'src', 'browser-test-template.html');
const dstDir = path.join(rootDir, 'test', 'browser');
const dstFileName = path.join(dstDir, 'index.html');

const template = fs.readFileSync(templatePath, 'utf-8');
const testsJs = `
<script type="module">
    import * as ${camelise(pkg_name)} from '${path.relative(templatePath, pkgJson.browser)}'
    window.${camelise(pkg_name)} = ${camelise(pkg_name)};
    import './tests.js';
    mocha.run();
</script>
`;

fs.writeFileSync(dstFileName,
    template.replace(/{{TESTS}}/g, testsJs).replace(/{{PKG_NAME}}/g, pkgJson.name).replace(/{{MOCHA_VERSION}}/g, mocha_version).replace(/{{CHAI_VERSION}}/g, chai_version)
);

/*
Now we create a bundle of all the tests called test.js
require/import of the module and chai are removed since they will be loaded from the html file
*/
const distFile = path.relative(path.join(rootDir, 'test'), pkgJson.main);
const requireModuleLine = `const ${camelise(pkgJson.name)} = require('${path.join(path.dirname(distFile), path.basename(distFile, '.js'))}');`;

const buildOptions = [
    { // Browser
        input: {
            input: path.join(rootDir, 'test', '*.js'),
            external: ['chai'],
            plugins: [
                multiEntry({ exports: false }),
                replace({
                    'const chai = require(\'chai\');': '',
                    [requireModuleLine]: '',
                    'delimiters': ['', ''],
                    'process.browser': true
                }),
                resolve({
                    browser: true,
                }),
                commonjs()
            ],
        },
        output: {
            file: path.join(rootDir, 'test', 'browser', 'tests.js'),
            format: 'esm'
        }
    }
];

for (const options of buildOptions) {
    build(options);
}



/* --- HELPLER FUNCTIONS --- */

async function build(options) {
    // create a bundle
    const bundle = await rollup.rollup(options.input);

    // generate code
    await bundle.generate(options.output);

    // or write the bundle to disk
    await bundle.write(options.output);
}

function camelise(str) {
    return str.replace(/-([a-z])/g,
        function (m, w) {
            return w.toUpperCase();
        });
}
const fs = require('fs');
const ts = require('typescript');
const path = require('path');
const pkgJson = require('../package.json');

const rootDir = path.join(__dirname, '..');
const jsFile = path.join(rootDir, 'src', 'main.js');
const dtsFile = path.join(rootDir, 'types', `${pkgJson.name}.d.ts`);


const compilerOptions = {
    'declaration': true,
    'noEmit': false,
    'emitDeclarationOnly': true,
    'allowJs': true
};

(function compile(jsFile, dtsFile, options) { // Create a Program with an in-memory emit
    const host = ts.createCompilerHost(options);
    // host.writeFile = (fileName, contents) => createdFiles[fileName] = contents;
    host.writeFile = (fileName, contents) => {
        fs.writeFileSync(dtsFile, contents);
    };

    // Prepare and emit the d.ts files
    const program = ts.createProgram([jsFile], options, host);
    program.emit();

    // Loop through all the input files
    // fileNames.forEach(file => {
    //     console.log("### JavaScript\n");
    //     console.log(host.readFile(file));
    // });
})(jsFile, dtsFile, compilerOptions);

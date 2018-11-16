const pug = require('pug');

// Compile the source code
const compiledFunction = pug.compileFile('pug_files/layout.pug');
console.log(compiledFunction());
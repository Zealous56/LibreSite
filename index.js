const pug = require('pug');
const fs = require('fs');

// Compile the source code
const compiledFunction = pug.compileFile('pug_files/home.pug');
fs.writeFile('index.html', compiledFunction(), (err) => {
    if(err) {
        console.log(err);
    } else {
        console.log('Compilation successful!');
    }
});
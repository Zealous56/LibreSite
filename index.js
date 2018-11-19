const pug = require('pug')
const fs = require('fs')

const pageList = ['blog', 'contact', 'home', 'info']

for(let i = 0; i < pageList.length; i++) {
    var page =  pageList[i];
    var compiledFunction = pug.compileFile('pug_files/' + page + '.pug')

    fs.writeFile(page + '.html', compiledFunction(), (err) => {
        if(err) console.log(err)
        else console.log('Compilation of ' + pageList[i] + ' successful!')
    })
}
const pug = require('pug')
const fs = require('fs')

const pugFilesPath = 'pug_files/'
const contentPath = 'content/'
const pugFilesIgnore = ['layout.pug', 'mixins.pug', 'template.pug']

/* Get all files from pug files directory */
var pageList = fs.readdirSync(pugFilesPath)

/* Remove ignored pug files from pageList */
for(var i = 0; i < pugFilesIgnore.length; i++) {
    var spliceMe = pageList.indexOf(pugFilesIgnore[i])
    pageList.splice(spliceMe, 1)
}

/* Remove .pug extension from pageList elements */
for(var i = 0; i < pageList.length; i++) {
    pageList[i] = pageList[i].split('.pug', 1)[0]
}

/* Iterate through pageList array */
for(let i = 0; i < pageList.length; i++) {
    let page = pageList[i];
    let path = contentPath + page

    /* Read all files in directory into an array */
    var files = fs.readdirSync(path)

    /* Create arrays to store objects containing file contents */
    var leftSidebar = []
    var container = []
    var rightSidebar = []

    /* Iterate through all files in path */
    files.forEach( (file) => {

        /* Read file */
        var rawText = fs.readFileSync(path + '/' + file).toString()

        /* Parse location and date for file (separated by underscore) */
        var fileName = file.split('_')
        var location = fileName[0]
        var date = fileName[1].replace('.txt', '')

        /* Parse header from text file (header is first line) */
        var header = rawText.split('\n', 1)[0]

        /* Parse content from text file (content is everything else) */
        var content = rawText.replace(header + '\n\n', '')

        /* Define function for pushing data */
        function pushContent(location) {
            location.push(
                {
                    date: date,
                    header: header,
                    content: content
                }
            )
        }

        /* Push data into corresponding array */
        switch(location) {
        case 'sidebar-left':
            pushContent(leftSidebar)
        case 'container':
            pushContent(container)
        case 'sidebar-right':
            pushContent(rightSidebar)
        }

        console.log('Successfully parsed file ' + path + '/' + file)
    })
    
    /* Compile each page to a file  */
    var compiledFunction = pug.compileFile('pug_files/' + page + '.pug', { pretty: true })
    fs.writeFileSync(page + '.html', compiledFunction())
    
    console.log('Compilation of ' + page + ' successful!')
}
const pug = require('pug')
const fs = require('fs')

const contentPath = 'content'
const pageList = ['blog', 'contact', 'index', 'info']

/* Iterate through pageList array */
for(let i = 0; i < pageList.length; i++) {
    let page = pageList[i];
    let path = contentPath + '/' + page

    fs.readdir(path, (err, files) => {
        if(err) {
            console.log('Could not read directory ' + path)
        }

        /* Create arrays to store objects containing file contents */
        var leftSidebar = []
        var container = []
        var rightSidebar = []

        /* Iterate through all files in path */
        files.forEach( (file) => {

            /* Read file */
            var rawText = fs.readFileSync(path + '/' + file).toString()

            if(err) {
                console.log('Could not parse file ' + file)
                return;
            }

            /* Parse location and date for file (separated by underscore) */
            var fileName = file.split('_')
            var location = fileName[0]
            var date = fileName[1].replace('.txt', '')

            /* Parse header from text file (header is first line) */
            var header = rawText.split('\n', 1)[0]

            /* Parse content from text file (content is everything else) */
            var content = rawText.replace(header + '\n\n', '')

            /* Push data into corresponding array */
            switch(location) {
            case 'sidebar-left':
                leftSidebar.push(
                    {
                        date: date,
                        header: header,
                        content: content
                    }
                )
            case 'container':
                container.push(
                    {
                        date: date,
                        header: header,
                        content: content
                    }
                )
            case 'sidebar-right':
                rightSidebar.push(
                    {
                        date: date,
                        header: header,
                        content: content
                    }
                )
            }
            console.log('Successfully parsed file ' + path + '/' + file)
        })
    })
    
    /* Compile each page  */
    var compiledFunction = pug.compileFile('pug_files/' + page + '.pug', { pretty: true })

    /* Write compiled page to a file */
    fs.writeFile(page + '.html', compiledFunction(), (err) => {
        if(err) {
            console.log(err)
            return;
        }
        console.log('Compilation of ' + page + ' successful!')
    })
}
const pug = require('pug');
const fs = require('fs');

const pugFilesPath = 'pug_files/';
const contentPath = 'content/';
const pugFilesIgnore = ['mixins.pug', 'template.pug'];

/* Website settings */
const settings = {
    
    /* Meta tags */
    title: 'Site title',
    description: 'Site Description',
    author: 'Author name',
    keywords: 'site, keywords',
    language: 'en-US',

    /* Website text */
    dropdown: 'Dropdown',
    footer: 'Footer',
    jumpText: 'Back to top of page',

    /* Page mapping lists */
    /* Left topnavbar links */
    leftList: [
        {
            text: 'Home',
            ref: 'index.html'
        },
        {
            text: 'Blog',
            ref: 'blog.html'
        },
        {
            text: 'Contact',
            ref: 'contact.html'
        }
    ],

    /* Right topnavbar links */
    rightList: [
        {
            text: 'Site Info',
            ref: 'info.html'
        }
    ]
};

/* Get all files from pug files directory */
var pageList = fs.readdirSync(pugFilesPath);

/* Remove ignored pug files from pageList */
for(var i = 0; i < pugFilesIgnore.length; i++) {
    var spliceMe = pageList.indexOf(pugFilesIgnore[i]);
    pageList.splice(spliceMe, 1);
}

/* Remove .pug extension from pageList elements */
for(var i = 0; i < pageList.length; i++) {
    pageList[i] = pageList[i].split('.pug', 1)[0];
}

/* Iterate through pageList array */
for(let i = 0; i < pageList.length; i++) {
    let page = pageList[i];
    let path = contentPath + page;

    /* Read all files in directory into an array */
    var files = fs.readdirSync(path);

    /* Create arrays to store objects containing file contents */
    var sidebarTitle;
    var container = [];

    /* Iterate through all files in path */
    files.forEach( (file) => {

        /* Read file */
        var rawText = fs.readFileSync(path + '/' + file).toString();

        /* Parse date for file */
        var date = file.replace('.txt', '');

        /* Check if text file specifies sidebar header */
        if(date == 'sidebar-title') {
            sidebarTitle = rawText;
        } else {
            /* Parse header from text file (header is first line) */
            var header = rawText.split('\n', 1)[0];

            /* Parse content from text file (content is everything else) */
            var content = rawText.replace(header + '\n\n', '');

            /* Define function for pushing data */
            function pushContent(container) {
                container.push(
                    {
                        date: date,
                        header: header,
                        content: content
                    }
                );
            }

            /* Push data into container */
            pushContent(container);
        }

        console.log('Successfully parsed file ' + path + '/' + file);
    })

    /* Write sorting function */
    function compare(a, b) {
        return b.date.localeCompare(a.date);
    }

    /* Sort data in arrays */
    container.sort(compare);
    
    /* Compile each page to a file  */
    var compiledFunction = pug.compileFile('pug_files/' + page + '.pug', { pretty: true });
    fs.writeFileSync(page + '.html', compiledFunction({ container, sidebarTitle, settings }));
    
    console.log('Compilation of ' + page + ' successful!');
}
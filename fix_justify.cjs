const fs = require('fs');

function replaceJustify(filePath) {
    let content = fs.readFileSync(filePath, 'utf8');
    content = content.replace(/text-justify/g, 'text-left');
    fs.writeFileSync(filePath, content);
}

replaceJustify('pages/ContentPages.tsx');
replaceJustify('pages/AdminPages.tsx');

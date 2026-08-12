const fs = require('fs');
const file = 'pages/ContentPages.tsx';
let content = fs.readFileSync(file, 'utf8');

const targetLine = "{['All', 'Health', 'Social Impact', 'Nation Building', 'Education'].map(cat => (";

if (content.includes(targetLine)) {
    content = content.replace(targetLine, "{['All', ...Array.from(new Set(posts.map(post => post.category).filter(Boolean)))].map(cat => (");
    fs.writeFileSync(file, content);
    console.log("Patched categories");
} else {
    console.log("Could not find target line");
}

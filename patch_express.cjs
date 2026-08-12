const fs = require('fs');
let content = fs.readFileSync('server.ts', 'utf8');
content = content.replace(/app\.get\('\*all', \(req, res\) => {/g, 'app.use((req, res) => {');
fs.writeFileSync('server.ts', content);

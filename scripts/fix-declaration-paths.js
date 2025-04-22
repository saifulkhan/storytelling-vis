const fs = require('fs');
const path = require('path');

// Path to the declaration file
const declarationFilePath = path.resolve(__dirname, '../dist/index.d.ts');

// Read the declaration file
let content = fs.readFileSync(declarationFilePath, 'utf8');

// Replace all occurrences of 'src/' in import statements
content = content.replace(/from ['"]src\//g, "from './");

// Write the modified content back to the file
fs.writeFileSync(declarationFilePath, content, 'utf8');

console.log('✅ Fixed import paths in declaration files');

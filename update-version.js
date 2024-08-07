const fs = require('fs');
const packageJson = require('./package.json');

const versionParts = packageJson.version.split('.');
versionParts[2] = (parseInt(versionParts[2]) + 1).toString();
packageJson.version = versionParts.join('.');

fs.writeFileSync('./package.json', JSON.stringify(packageJson, null, 2));

console.log(`Updated version to ${packageJson.version}`);

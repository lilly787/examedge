const fs = require('fs');
const path = require('path');

function findFile(dir, filename) {
  let results = [];
  try {
    const list = fs.readdirSync(dir);
    list.forEach(file => {
      file = path.join(dir, file);
      const stat = fs.statSync(file);
      if (stat && stat.isDirectory()) { 
        if (!file.includes('node_modules') && !file.includes('.git')) {
          results = results.concat(findFile(file, filename));
        }
      } else {
        if (file.toLowerCase().includes(filename.toLowerCase())) {
          results.push(file);
        }
      }
    });
  } catch (err) {}
  return results;
}

const found = findFile(__dirname, 'chemisty');
console.log('Found:', found);

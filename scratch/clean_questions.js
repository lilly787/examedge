const fs = require('fs');
const path = require('path');

const q = require(path.join(__dirname, '..', 'questions.js'));
const genPattern = /additional .* question.*generated/i;

let removed = 0;
const clean = q.filter(item => {
  const isGenerated = genPattern.test(item.question) || (item.question && item.question.includes('(Generated)'));
  const isPlaceholder = item.options && item.options.A === 'Option A' && item.options.B === 'Option B' && item.options.C === 'Option C' && item.options.D === 'Option D';
  const isEmptyOpts = item.options && item.options.A === '' && item.options.B === '' && item.options.C === '' && item.options.D === '';
  const words = (item.question || '').trim().split(/\s+/);
  const isShort = words.length < 10 && (!item.explanation || item.explanation.trim() === '' || /^The correct answer is option [A-D]\.?$/i.test(item.explanation.trim()));
  if (isGenerated || isPlaceholder || isEmptyOpts || isShort) {
    removed++;
    return false;
  }
  return true;
});

console.log('Total original:', q.length);
console.log('Removed:', removed);
console.log('Remaining:', clean.length);

const subjects = {};
clean.forEach(item => {
  subjects[item.subject] = (subjects[item.subject] || 0) + 1;
});
console.log('\nPer subject:');
Object.entries(subjects).sort((a, b) => b[1] - a[1]).forEach(([s, c]) => console.log('  ' + s + ': ' + c));

// Write cleaned file
const output = `// PrepFast Question Bank - ${clean.length} verified questions\r\n\r\nconst EXAMEDGE_QUESTIONS = ${JSON.stringify(clean, null, 2)};\r\n\r\nif (typeof module !== 'undefined' && module.exports) {\r\n  module.exports = EXAMEDGE_QUESTIONS;\r\n}\r\n`;

fs.writeFileSync(path.join(__dirname, '..', 'questions.js'), output, 'utf8');
console.log('\nCleaned questions.js written successfully!');

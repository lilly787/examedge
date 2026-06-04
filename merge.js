const fs = require('fs');
const extra = JSON.parse(fs.readFileSync('extra_questions.json', 'utf-8'));
const existing = JSON.parse(fs.readFileSync('questions.js', 'utf-8').replace(/const EXAMEDGE_QUESTIONS = |;\s*if.*/, ''));
const merged = existing.concat(extra);
fs.writeFileSync('questions.js', // ExamEdge Question Bank —  questions total

const EXAMEDGE_QUESTIONS = ;

if (typeof module !== 'undefined' && module.exports) {
  module.exports = EXAMEDGE_QUESTIONS;
}
);
console.log('Total:', merged.length);

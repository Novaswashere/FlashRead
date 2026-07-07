const fs = require('fs');
const path = require('path');

const planFile = process.argv[2];
const taskNum = process.argv[3];
const outFile = process.argv[4] || path.join(__dirname, '..', '.superpowers', 'sdd', `task-${taskNum}-brief.md`);

if (!planFile || !taskNum) {
  console.error("Usage: node task-brief.js PLAN_FILE TASK_NUMBER [OUTFILE]");
  process.exit(1);
}

const content = fs.readFileSync(planFile, 'utf8');
const lines = content.split(/\r?\n/);

let infence = false;
let intask = false;
const outLines = [];

for (const line of lines) {
  if (line.startsWith('```')) {
    infence = !infence;
  }
  if (!infence) {
    const taskHeaderMatch = line.match(/^#+[ \t]+Task[ \t]+([0-9]+)/i);
    if (taskHeaderMatch) {
      intask = (taskHeaderMatch[1] === taskNum);
    }
  }
  if (intask) {
    outLines.push(line);
  }
}

if (outLines.length === 0) {
  console.error(`Task ${taskNum} not found in ${planFile}`);
  process.exit(1);
}

fs.mkdirSync(path.dirname(outFile), { recursive: true });
fs.writeFileSync(outFile, outLines.join('\n'), 'utf8');
console.log(`wrote ${outFile}: ${outLines.length} lines`);

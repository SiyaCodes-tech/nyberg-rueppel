const fs = require('fs');
const path = require('path');

const directory = path.join(__dirname, 'frontend', 'src');

const replacements = {
  'bg-background': 'bg-gray-950',
  'text-textMain': 'text-gray-100',
  'bg-surface': 'bg-gray-900',
  'border-border': 'border-gray-700',
  'text-primary': 'text-green-400',
  'text-textMuted': 'text-gray-400',
  'text-error': 'text-red-500',
  'text-success': 'text-green-500',
  'bg-error/10': 'bg-red-500/10',
  'bg-success/10': 'bg-green-500/10',
  'border-error/30': 'border-red-500/30',
  'border-success/30': 'border-green-500/30',
};

function walkAndReplace(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      walkAndReplace(fullPath);
    } else if (fullPath.endsWith('.jsx')) {
      let content = fs.readFileSync(fullPath, 'utf8');
      let changed = false;
      for (const [oldClass, newClass] of Object.entries(replacements)) {
        if (content.includes(oldClass)) {
          content = content.replaceAll(oldClass, newClass);
          changed = true;
        }
      }
      if (changed) {
        fs.writeFileSync(fullPath, content, 'utf8');
        console.log(`Updated ${fullPath}`);
      }
    }
  }
}

walkAndReplace(directory);

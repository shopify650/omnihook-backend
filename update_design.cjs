const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, 'src');

const replacements = {
  'bg-surface2': 'bg-canvas-soft',
  'bg-surface': 'bg-canvas',
  'border-border': 'border-mute',
  'border-accent': 'border-primary',
  'bg-accent': 'bg-primary',
  'text-accent': 'text-primary',
  'text-muted': 'text-body-mid',
  'text-secondary': 'text-body',
  'text-white': 'text-on-primary', // Most text-white was on buttons or dark backgrounds
  'rounded-card': 'rounded-md',
  'rounded-input': 'rounded-sm',
  'rounded-badge': 'rounded-pill',
  'bg-[#2A2A2A]': 'bg-canvas-soft',
  'bg-[#1A1A1A]': 'bg-canvas',
  'bg-[#333]': 'bg-mute',
  'border-[#333]': 'border-mute',
  'text-[#888]': 'text-body-mid',
  'hover:bg-surface2': 'hover:bg-canvas-soft',
  'hover:border-accent': 'hover:border-primary',
  'hover:text-white': 'hover:text-ink',
  // We'll also change text colors since we moved from dark to light mode
  // The default text color is ink. But in dark mode it was likely text-white everywhere.
  // We'll replace text-white with text-ink for text that isn't on a primary button.
  // Actually, we can just let globals.css handle default color, and remove text-white where it's not needed,
  // but it's safer to just replace `text-white` with `text-ink` and then fix buttons.
};

function walkSync(currentDirPath, callback) {
    fs.readdirSync(currentDirPath).forEach(function (name) {
        var filePath = path.join(currentDirPath, name);
        var stat = fs.statSync(filePath);
        if (stat.isFile()) {
            callback(filePath, stat);
        } else if (stat.isDirectory()) {
            walkSync(filePath, callback);
        }
    });
}

walkSync(srcDir, function(filePath) {
  if (filePath.endsWith('.tsx') || filePath.endsWith('.ts')) {
    let content = fs.readFileSync(filePath, 'utf8');
    let original = content;
    
    // Custom logic for text-white -> text-on-primary inside primary buttons
    // For general text-white that were just for dark mode text, replace with text-ink
    content = content.replace(/text-white/g, 'text-ink');
    content = content.replace(/bg-primary(.*?)text-ink/g, 'bg-primary$1text-on-primary');
    
    // Apply standard replacements
    for (const [key, value] of Object.entries(replacements)) {
      if (key !== 'text-white') {
        content = content.split(key).join(value);
      }
    }
    
    // Replace hardcoded #000 or dark backgrounds that might exist
    content = content.replace(/bg-black/g, 'bg-ink');
    content = content.replace(/text-black/g, 'text-ink');
    
    if (content !== original) {
      fs.writeFileSync(filePath, content, 'utf8');
      console.log(`Updated ${filePath}`);
    }
  }
});

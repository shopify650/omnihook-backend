const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, 'src');

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

    // 1. Primary Buttons Enhancement
    content = content.replace(/bg-primary text-on-primary rounded-md text-sm font-medium hover:bg-primary\/90 transition-colors/g, 
      'bg-primary text-on-primary rounded-md text-sm font-semibold hover:bg-[#e64700] transition-all shadow-sm px-4 py-2');

    // 2. ZapCard specific enhancement
    if (filePath.includes('ZapCard.tsx')) {
        content = content.replace(/bg-canvas border border-mute rounded-md p-3 space-y-2 hover:border-secondary transition-colors/g,
            'bg-canvas-soft border border-mute rounded-md p-4 space-y-3 hover:border-primary transition-all shadow-sm');
        content = content.replace(/bg-canvas-soft border border-mute rounded-sm text-xs text-body hover:text-ink hover:border-primary transition-colors/g,
            'bg-canvas border border-mute rounded-md text-xs font-medium text-ink hover:bg-canvas-soft hover:border-ink-soft transition-all');
        content = content.replace(/hover:text-error hover:border-error transition-colors/g,
            'hover:text-error hover:border-error hover:bg-[#fff0f0] transition-all');
    }

    // 3. Typography enhancements
    content = content.replace(/text-lg font-bold/g, 'text-xl font-display font-medium');
    content = content.replace(/text-base font-semibold/g, 'text-lg font-display font-medium');

    // 4. Inputs and Textareas
    content = content.replace(/className="w-full bg-canvas-soft border border-mute rounded-md px-3 py-2 text-sm text-ink/g,
        'className="w-full bg-canvas border border-mute rounded-md px-3 py-2 text-sm text-ink focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none transition-all shadow-sm');
    content = content.replace(/bg-canvas border border-mute rounded-md px-3 py-2 text-sm text-ink mb-4/g,
        'bg-canvas border border-mute rounded-md px-3 py-2 text-sm text-ink mb-4 focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none transition-all shadow-sm');

    // 5. General button upgrades (tertiary)
    content = content.replace(/rounded-sm text-body hover:text-ink hover:bg-canvas-soft/g,
        'rounded-md text-ink hover:bg-canvas-soft border border-transparent hover:border-mute transition-all');

    // 6. Navigation Bars / Headers
    content = content.replace(/border-b border-mute/g, 'border-b border-mute bg-canvas-soft');

    if (content !== original) {
      fs.writeFileSync(filePath, content, 'utf8');
      console.log(`Enhanced ${filePath}`);
    }
  }
});

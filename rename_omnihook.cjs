const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, 'src');
const componentsDir = path.join(srcDir, 'components');

const fileRenames = {
  'ZapCard.tsx': 'HookCard.tsx',
  'CreateZapScreen.tsx': 'CreateHookScreen.tsx',
  'EditZapScreen.tsx': 'EditHookScreen.tsx'
};

const fileReplacements = [
  { file: path.join(__dirname, 'framer.json'), from: /FramerZaps — Zapier Automation/g, to: 'OmniHook — Universal Webhooks' },
  { file: path.join(__dirname, 'package.json'), from: /"framerzaps"/g, to: '"omnihook"' },
  { file: path.join(__dirname, 'src', 'App.tsx'), from: /Zap/g, to: 'Hook' },
  { file: path.join(__dirname, 'src', 'App.tsx'), from: /FramerZaps/g, to: 'OmniHook' },
  { file: path.join(__dirname, 'src', 'services', 'storageService.ts'), from: /framerzaps/g, to: 'omnihook' },
  { file: path.join(__dirname, 'src', 'services', 'storageService.ts'), from: /FramerZaps/g, to: 'OmniHook' },
  { file: path.join(__dirname, 'src', 'hooks', 'useWebhookTest.ts'), from: /FramerZaps/g, to: 'OmniHook' },
  { file: path.join(__dirname, 'src', 'components', 'HomeScreen.tsx'), from: /ZapCard/g, to: 'HookCard' },
  { file: path.join(__dirname, 'src', 'components', 'HomeScreen.tsx'), from: /FramerZaps/g, to: 'OmniHook' },
  { file: path.join(__dirname, 'src', 'components', 'HomeScreen.tsx'), from: /Zap/g, to: 'Hook' },
  { file: path.join(__dirname, 'src', 'components', 'HomeScreen.tsx'), from: /ZapTrigger/g, to: 'HookTrigger' },
  { file: path.join(__dirname, 'src', 'components', 'HomeScreen.tsx'), from: /ZapTriggerCode/g, to: 'HookTriggerCode' },
  { file: path.join(__dirname, 'src', 'components', 'HelpScreen.tsx'), from: /FramerZaps/g, to: 'OmniHook' },
  { file: path.join(__dirname, 'src', 'components', 'HelpScreen.tsx'), from: /ZapTrigger/g, to: 'HookTrigger' },
  { file: path.join(__dirname, 'src', 'components', 'PayloadBuilder.tsx'), from: /Zap/g, to: 'Hook' },
];

async function run() {
  // Rename component files
  for (const [oldName, newName] of Object.entries(fileRenames)) {
    const oldPath = path.join(componentsDir, oldName);
    const newPath = path.join(componentsDir, newName);
    if (fs.existsSync(oldPath)) {
      fs.renameSync(oldPath, newPath);
      console.log(`Renamed ${oldName} to ${newName}`);
    }
  }

  // Rename ZapTrigger.tsx
  const oldTriggerPath = path.join(__dirname, 'component', 'ZapTrigger.tsx');
  const newTriggerPath = path.join(__dirname, 'component', 'HookTrigger.tsx');
  if (fs.existsSync(oldTriggerPath)) {
    fs.renameSync(oldTriggerPath, newTriggerPath);
    console.log(`Renamed ZapTrigger.tsx to HookTrigger.tsx`);
  }

  // Perform replacements
  for (const rep of fileReplacements) {
    if (fs.existsSync(rep.file)) {
      let content = fs.readFileSync(rep.file, 'utf-8');
      content = content.replace(rep.from, rep.to);
      fs.writeFileSync(rep.file, content);
      console.log(`Replaced in ${path.basename(rep.file)}`);
    }
  }
  
  // Replace references inside the renamed files themselves
  const updatedComponentFiles = ['HookCard.tsx', 'CreateHookScreen.tsx', 'EditHookScreen.tsx'];
  for (const file of updatedComponentFiles) {
    const filePath = path.join(componentsDir, file);
    if (fs.existsSync(filePath)) {
      let content = fs.readFileSync(filePath, 'utf-8');
      content = content.replace(/Zap/g, 'Hook');
      content = content.replace(/FramerZaps/g, 'OmniHook');
      fs.writeFileSync(filePath, content);
      console.log(`Replaced contents in ${file}`);
    }
  }

  // Replace inside HookTrigger.tsx
  if (fs.existsSync(newTriggerPath)) {
    let content = fs.readFileSync(newTriggerPath, 'utf-8');
    content = content.replace(/ZapTrigger/g, 'HookTrigger');
    fs.writeFileSync(newTriggerPath, content);
    console.log(`Replaced contents in HookTrigger.tsx`);
  }

  console.log("Renaming complete!");
}

run();

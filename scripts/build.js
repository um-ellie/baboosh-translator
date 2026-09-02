#!/usr/bin/env node

const fs = require('node:fs');
const path = require('node:path');
const { execFileSync } = require('node:child_process');

const root = path.resolve(__dirname, '..');
const distRoot = path.join(root, 'dist');
const requestedTarget = process.argv[2] || 'all';
const shouldZip = process.argv.includes('--zip');
const targets = requestedTarget === 'all' ? ['chrome', 'firefox'] : [requestedTarget];

if (!targets.every(target => ['chrome', 'firefox'].includes(target))) {
  throw new Error('Usage: node scripts/build.js [chrome|firefox|all] [--zip]');
}

function copyDirectory(source, destination) {
  fs.mkdirSync(destination, { recursive: true });
  for (const entry of fs.readdirSync(source, { withFileTypes: true })) {
    const from = path.join(source, entry.name);
    const to = path.join(destination, entry.name);
    if (entry.isDirectory()) copyDirectory(from, to);
    else fs.copyFileSync(from, to);
  }
}

for (const target of targets) {
  const output = path.join(distRoot, target);
  fs.rmSync(output, { recursive: true, force: true });
  copyDirectory(path.join(root, 'src'), path.join(output, 'src'));
  if (fs.existsSync(path.join(root, '_locales'))) {
    copyDirectory(path.join(root, '_locales'), path.join(output, '_locales'));
  }
  fs.copyFileSync(path.join(root, 'manifests', `manifest.${target}.json`), path.join(output, 'manifest.json'));

  if (shouldZip) {
    const archive = path.join(distRoot, `baboosh-translate-${target}.zip`);
    fs.rmSync(archive, { force: true });
    execFileSync('zip', ['-qr', archive, '.'], { cwd: output, stdio: 'inherit' });
  }
  console.log(`Built ${target}: ${path.relative(root, output)}`);
}

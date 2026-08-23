const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const root = path.resolve(__dirname, '..');

test('each browser manifest is valid and refers to existing assets', () => {
  for (const target of ['chrome', 'firefox']) {
    const manifest = JSON.parse(fs.readFileSync(path.join(root, 'manifests', `manifest.${target}.json`), 'utf8'));
    assert.equal(manifest.manifest_version, 3);
    assert.equal(manifest.version, '2.0.1');
    assert.ok(manifest.background);
    for (const icon of Object.values(manifest.icons)) {
      assert.ok(fs.existsSync(path.join(root, icon)), `${target}: missing ${icon}`);
    }
  }
});

test('build script contains no external runtime dependencies', () => {
  const packageJson = JSON.parse(fs.readFileSync(path.join(root, 'package.json'), 'utf8'));
  assert.deepEqual(packageJson.dependencies, undefined);
  assert.match(packageJson.scripts.build, /scripts\/build\.js/);
});

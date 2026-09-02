const test = require('node:test');
const assert = require('node:assert');

// Mock chrome before requiring the module
global.chrome = {
  runtime: {
    onMessage: { addListener: () => {} },
    onInstalled: { addListener: () => {} }
  },
  contextMenus: {
    create: () => {},
    onClicked: { addListener: () => {} }
  }
};

const { splitTextForTts } = require('../src/background/background.js');

test('splitTextForTts - normal words', (t) => {
  const result = splitTextForTts('Hello world this is a test');
  assert.deepStrictEqual(result, ['Hello world this is a test']);
});

test('splitTextForTts - splits when exceeding maxLength', (t) => {
  const word = 'A'.repeat(100);
  const text = `${word} ${word}`;
  const result = splitTextForTts(text);
  assert.strictEqual(result.length, 2);
  assert.strictEqual(result[0], word);
  assert.strictEqual(result[1], word);
});

test('splitTextForTts - handles words longer than maxLength', (t) => {
  const longWord = 'B'.repeat(200);
  const result = splitTextForTts(`Start ${longWord} End`);
  
  assert.strictEqual(result.length, 4);
  assert.strictEqual(result[0], 'Start');
  assert.strictEqual(result[1], 'B'.repeat(180));
  assert.strictEqual(result[2], 'B'.repeat(20));
  assert.strictEqual(result[3], 'End');
});

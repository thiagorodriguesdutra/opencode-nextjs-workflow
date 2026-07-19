#!/usr/bin/env node
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const TEMPLATE_DIR = path.join(__dirname, '..', 'template');
const TARGET_DIR = process.cwd();

function copyRecursive(src, dest) {
  const stat = fs.statSync(src);
  if (stat.isDirectory()) {
    if (!fs.existsSync(dest)) fs.mkdirSync(dest, { recursive: true });
    for (const item of fs.readdirSync(src)) {
      copyRecursive(path.join(src, item), path.join(dest, item));
    }
  } else {
    if (fs.existsSync(dest)) {
      console.log(`- pulado (ja existe): ${path.relative(TARGET_DIR, dest)}`);
      return;
    }
    fs.copyFileSync(src, dest);
    console.log(`criado: ${path.relative(TARGET_DIR, dest)}`);
  }
}

console.log('Copiando workflow OpenCode para este projeto...\n');
copyRecursive(TEMPLATE_DIR, TARGET_DIR);
console.log('\nPronto.');

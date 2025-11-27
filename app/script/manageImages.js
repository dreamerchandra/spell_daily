#!/usr/bin/env node
/* eslint-disable no-undef */
import fs from 'fs';
import path from 'path';
import crypto from 'crypto';

// --- Parse CLI args ---
const args = Object.fromEntries(
  process.argv.slice(2).map(arg => {
    const [key, value] = arg.replace(/^--/, '').split('=');
    return [key, value];
  })
);

const sourceDir = args.source;
const targetDir = args.target;
const jsonPath = args.json;

if (!sourceDir || !targetDir || !jsonPath) {
  console.error(
    'Usage: node manageImages.js --source=src --target=dist --json=data.json'
  );
  process.exit(1);
}

// --- Utilities ---
function getAllFiles(dir) {
  let results = [];
  for (const file of fs.readdirSync(dir)) {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    if (stat.isDirectory()) results = results.concat(getAllFiles(filePath));
    else results.push(filePath);
  }
  return results;
}

function ensureDir(dir) {
  fs.mkdirSync(dir, { recursive: true });
}

function hashFile(filePath) {
  const content = fs.readFileSync(filePath);
  return crypto.createHash('md5').update(content).digest('hex');
}

// --- Build structure for all top-level dirs ---
function buildStructure(srcRoot, targetRoot) {
  const structure = {};
  const topDirs = fs
    .readdirSync(srcRoot)
    .filter(d => fs.statSync(path.join(srcRoot, d)).isDirectory());

  for (const group of topDirs) {
    const groupPath = path.join(srcRoot, group);
    const allFiles = getAllFiles(groupPath).filter(
      f => !f.includes('.DS_Store')
    );
    const dirMap = new Map();

    allFiles.forEach(filePath => {
      const relativePath = path.relative(srcRoot, filePath); // e.g. by_emotion/happy/1.png
      const parts = relativePath.split(path.sep);
      const subDir = parts.slice(1, -1).join('/') || ''; // e.g. happy

      const hash = hashFile(filePath);
      const newFileName = `${hash}${path.extname(filePath)}`;
      const newRelPath = path.join(group, subDir, newFileName);
      const targetPath = path.join(targetRoot, newRelPath);

      ensureDir(path.dirname(targetPath));
      fs.copyFileSync(filePath, targetPath);

      if (!dirMap.has(subDir)) {
        dirMap.set(subDir, []);
      }

      dirMap.get(subDir).push({
        fileName: newFileName,
        path: newRelPath.replace(/\\/g, '/'),
        originalPath: relativePath.replace(/\\/g, '/'),
      });
    });

    structure[group] = Array.from(dirMap.entries()).map(([dirName, files]) => ({
      dir_name: dirName || group,
      files,
    }));
  }

  return structure;
}

// --- Run ---
const structure = buildStructure(sourceDir, targetDir);
ensureDir(path.dirname(jsonPath));
fs.writeFileSync(jsonPath, JSON.stringify(structure, null, 2));

console.log(`✅ Processed all groups from ${sourceDir}`);
console.log(`📦 JSON written to ${jsonPath}`);

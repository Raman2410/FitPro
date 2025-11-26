import { readFileSync, writeFileSync } from 'fs';
import { globSync } from 'glob';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Find all TypeScript files in the api directory
const files = globSync('api/**/*.ts', { cwd: __dirname });

console.log(`Found ${files.length} TypeScript files to process`);

files.forEach(file => {
  const filePath = join(__dirname, file);
  let content = readFileSync(filePath, 'utf-8');
  let modified = false;

  // Replace relative imports without .js extension
  // Match: from './something' or from '../something'
  const newContent = content.replace(
    /from\s+['"](\.\.[\/\\][^'"]+|\.\/[^'"]+)['"]/g,
    (match, importPath) => {
      // Skip if already has .js extension
      if (importPath.endsWith('.js')) {
        return match;
      }
      modified = true;
      return `from '${importPath}.js'`;
    }
  );

  if (modified) {
    writeFileSync(filePath, newContent, 'utf-8');
    console.log(`✓ Updated: ${file}`);
  }
});

console.log('Done!');

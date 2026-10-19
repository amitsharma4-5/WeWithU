import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Path to svg-pathdata tsconfig.json
const svgPathdataConfigPath = path.join(__dirname, '../node_modules/svg-pathdata/tsconfig.json');

try {
  if (fs.existsSync(svgPathdataConfigPath)) {
    let configContent = fs.readFileSync(svgPathdataConfigPath, 'utf8');
    
    // Parse the JSON
    const config = JSON.parse(configContent);
    
    // Add ignoreDeprecations if it's not already there
    if (config.compilerOptions && !config.compilerOptions.ignoreDeprecations) {
      config.compilerOptions.ignoreDeprecations = '6.0';
      
      // Write the updated config back
      fs.writeFileSync(svgPathdataConfigPath, JSON.stringify(config, null, 2));
      console.log('✓ Fixed TypeScript deprecation in svg-pathdata');
    }
  }
} catch (error) {
  // Silently fail - this is just a convenience fix, not critical
  console.log('Could not auto-fix TypeScript deprecation');
}

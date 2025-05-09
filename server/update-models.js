const fs = require('fs');
const path = require('path');

// Get all model files
const modelsDir = path.join(__dirname, 'models');
const files = fs.readdirSync(modelsDir);

// Skip index.js and User.js (already updated)
const modelFiles = files.filter(file => 
  file.endsWith('.js') && 
  file !== 'index.js' && 
  file !== 'User.js'
);

// Update each model file
modelFiles.forEach(file => {
  const filePath = path.join(modelsDir, file);
  let content = fs.readFileSync(filePath, 'utf8');
  
  // Replace the import statement
  content = content.replace(
    /const sequelize = require\(['"]\.\.\/config\/database['"]\);/g,
    'const { sequelize } = require("../config/database");'
  );
  
  // Write the updated content back to the file
  fs.writeFileSync(filePath, content);
  console.log(`Updated ${file}`);
});

console.log('All model files have been updated.');

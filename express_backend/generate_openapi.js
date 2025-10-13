const fs = require('fs');
const path = require('path');
const swaggerSpec = require('./swagger');

const outputDir = path.join(__dirname, 'interfaces');
const outputPath = path.join(outputDir, 'openapi.json');

if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

// Persist current swagger spec; dynamic server URL will be provided at runtime via /openapi.json
fs.writeFileSync(outputPath, JSON.stringify(swaggerSpec, null, 2));

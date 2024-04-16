const fs = require('fs');

const targetDir = process.argv[2];

if (!targetDir) {
  console.log('Please provide a directory path.');
  process.exit(1);
}

function write_config(filePath) {
  let config = {
    fm_config_api: process.env.REACT_APP_FM_CONFIG_API,
    tos: process.env.REACT_APP_TOS,
  };

  fs.writeFileSync(
    filePath + '/config.json',
    JSON.stringify(config, null, 2),
    'utf8'
  );
}

try {
  write_config(targetDir);
  console.log('Environment variables replaced successfully.');
} catch (error) {
  console.error(
    'An error occurred while writing config.json from environment variables:',
    error
  );
  process.exit(1);
}

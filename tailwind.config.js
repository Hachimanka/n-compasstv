const ntvPreset = require('@ntv360/component-pantry/tailwind-preset.js');

module.exports = {
  presets: [ntvPreset],
  content: [
    './src/**/*.{html,ts}',
    './node_modules/@ntv360/component-pantry/**/*.{js,mjs}'
  ]
};

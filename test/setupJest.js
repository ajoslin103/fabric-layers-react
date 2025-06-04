// Import the fabric mock from our mocks directory
const { fabric } = require('../__mocks__/fabric.js');

// Additional test setup can go here

// Make sure fabric is globally available
global.fabric = fabric;

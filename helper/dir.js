/**
 * Helper function to get the absolute path
 * take a array of next directories as arguments
 * return the abs dir + the arrays
 */
const path = require('path');
function dir(a) {
  return path.join(__dirname, '../', ...a);
}

module.exports = dir;

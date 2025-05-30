module.exports = {
  env: {
    jest: true,
    browser: true,
    node: true
  },
  extends: [
    'eslint:recommended'
  ],
  rules: {
    // Allow jest globals
    'no-undef': 'off',
    // Allow unused variables in test files
    'no-unused-vars': 'off',
    // Allow block statements in arrow functions for readability
    'arrow-body-style': 'off'
  }
};

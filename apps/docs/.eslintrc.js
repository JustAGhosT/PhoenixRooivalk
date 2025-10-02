module.exports = {
  extends: ["eslint:recommended"],
  env: {
    browser: true,
    node: true,
    es6: true,
  },
  rules: {
    // Allow Docusaurus imports
    "import/no-unresolved": "off",
    // Allow React imports
    "import/default": "off",
    // Allow unused variables that start with underscore
    "no-unused-vars": [
      "error",
      {
        argsIgnorePattern: "^_",
        varsIgnorePattern: "^_",
      },
    ],
  },
};

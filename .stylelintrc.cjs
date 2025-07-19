module.exports = {
  extends: [
    "stylelint-config-recess-order",
    "stylelint-config-recommended-scss"
  ],
  plugins: ["stylelint-scss"],
  rules: {
    "selector-pseudo-element-colon-notation": "double",
    "scss/selector-no-union-class-name": true,
    "no-descending-specificity": null,
    "scss/no-global-function-names": null
  },
  ignoreFiles: ["**/node_modules/**"]
};

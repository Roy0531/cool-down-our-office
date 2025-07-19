module.exports = {
  semi: true,
  tabWidth: 2,
  trailingComma: "none",
  plugins: [require.resolve("prettier-plugin-astro")],
  overrides: [
    {
      files: "*.astro",
      options: {
        parser: "astro"
      }
    },
    {
      files: "*.json",
      options: {
        parser: "json"
      }
    }
  ],
  bracketSameLine: true,
  htmlWhitespaceSensitivity: "strict"
};

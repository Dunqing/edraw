module.exports = {
  parser: "@typescript-eslint/parser",
  extends: [
    "plugin:import/typescript",
    "plugin:@typescript-eslint/recommended",
    "plugin:prettier/recommended",
  ],
  plugins: ["import", "@typescript-eslint"],
  rules: {
    "prettier/prettier": [
      "error",
      {
        endOfLine: "auto",
      },
    ],
    "import/first": ["error"],
    "import/no-duplicates": ["error", { considerQueryString: true }],
    "import/newline-after-import": ["error", { count: 1 }],
    "import/no-useless-path-segments": ["error", { noUselessIndex: true }],
    "import/order": [
      "warn",
      {
        groups: [
          "index",
          "sibling",
          "parent",
          "internal",
          "external",
          "builtin",
          "object",
          "type",
        ],
      },
    ],
    "@typescript-eslint/consistent-type-imports": ["error"],
    "@typescript-eslint/no-non-null-assertion": "off",
    "@typescript-eslint/no-explicit-any": "off",
    "no-console": "error",
    "@typescript-eslint/no-non-null-asserted-optional-chain": "off",
  },
};

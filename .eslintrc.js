module.exports = {
  parser: "@typescript-eslint/parser",
  parserOptions: {
    tsconfigRootDir: __dirname,
    project: [`./tsconfig.json`],
    ecmaVersion: 12,
    sourceType: "module"
  },
  root: true,
  extends: [
    "eslint:recommended",
    "prettier",
    "plugin:@typescript-eslint/recommended"
  ],
  plugins: ["@typescript-eslint"],
  env: {
    es2021: true,
    node: true
  },
  ignorePatterns: ["build", "node_modules", "scripts", "__tests__"],
  rules: {
    "no-case-declarations": "warn",
    "no-unused-vars": "off",
    "no-constant-condition": "warn"
  }
}
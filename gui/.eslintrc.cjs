/* eslint-env node */
module.exports = {
    env: {
        "es2021": true,
        "node": true,
        "es6": true
    },
    parserOptions: {
        ecmaVersion: "latest",
        project: "tsconfig.json",
    },
    parser: "@typescript-eslint/parser",
    settings: {
        "import/resolver": {
            "node": {
                "extensions": [
                    ".js",
                    ".jsx",
                    ".ts",
                    ".tsx"
                ]
            }
        }
    },
    extends: [
        "prettier",
        "eslint:recommended",
        "plugin:@typescript-eslint/recommended-type-checked",
    ],
    plugins: [
        "prettier",
        "@typescript-eslint"
    ],
    root: true,
};

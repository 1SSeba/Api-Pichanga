import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';

export default tseslint.config(
eslint.configs.recommended,
...tseslint.configs.recommended,
{
    languageOptions: {
    ecmaVersion: 2022,
    sourceType: 'module',
    parser: tseslint.parser,
    parserOptions: {
        project: './tsconfig.json',
    },
    },
    env: {
    node: true,
    es2022: true,
    },
    rules: {
    // TypeScript specific rules
    '@typescript-eslint/explicit-function-return-type': 'warn',
    '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
    '@typescript-eslint/no-explicit-any': 'warn',
    '@typescript-eslint/no-unsafe-assignment': 'warn',
    '@typescript-eslint/no-floating-promises': 'error',
    '@typescript-eslint/await-thenable': 'error',
    
    // Best practices
    'no-console': ['warn', { allow: ['warn', 'error', 'info'] }],
    'eqeqeq': ['error', 'always'],
    'no-return-await': 'error',
    'no-throw-literal': 'error',
    'prefer-const': 'error',
    'no-var': 'error',
    'object-shorthand': 'error',
    'prefer-template': 'warn',
    'prefer-spread': 'warn',
    
    // Style
    'indent': ['error', 2],
    'quotes': ['error', 'single', { avoidEscape: true }],
    'semi': ['error', 'always'],
    'comma-dangle': ['error', 'always-multiline'],
    'max-len': ['warn', { code: 100, ignoreStrings: true, ignoreTemplateLiterals: true }],
    },
    ignores: [
    'node_modules/**',
    'dist/**',
    'build/**',
    'coverage/**',
    ],
},
{
    files: ['**/*.test.ts', '**/*.spec.ts'],
    rules: {
    '@typescript-eslint/no-explicit-any': 'off',
    'max-len': 'off',
    },
}
);


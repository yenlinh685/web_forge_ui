import { defineConfig, globalIgnores } from 'eslint/config'
import nextVitals from 'eslint-config-next/core-web-vitals'
import nextTs from 'eslint-config-next/typescript'
import prettier from 'eslint-plugin-prettier'
import simpleImportSort from 'eslint-plugin-simple-import-sort'

const eslintConfig = defineConfig([
    ...nextVitals,
    ...nextTs,
    globalIgnores(['.next/**', 'out/**', 'build/**', 'next-env.d.ts']),
    {
        plugins: {
            'simple-import-sort': simpleImportSort,
            prettier,
        },
        rules: {
            'react-hooks/set-state-in-effect': 'off',
            'simple-import-sort/imports': [
                'warn',
                {
                    groups: [['^react', '^next', '^\\w'], ['^']],
                },
            ],

            'simple-import-sort/exports': 'warn',
            'no-fallthrough': 'warn',
            '@typescript-eslint/no-empty-object-type': 'off',
            '@typescript-eslint/no-explicit-any': 'off',
            '@typescript-eslint/no-unused-vars': 'warn',
            '@typescript-eslint/no-unused-vars': [
                'warn',
                {
                    argsIgnorePattern: '^_$',
                    varsIgnorePattern: '^_$',
                    caughtErrorsIgnorePattern: '^_$',
                },
            ],
            'prettier/prettier': [
                'warn',
                {
                    tabWidth: 4,
                    printWidth: 120,
                    semi: false,
                    singleQuote: true,
                    arrowParens: 'always',
                    trailingComma: 'all',
                    endOfLine: 'auto',
                    plugins: ['prettier-plugin-tailwindcss'],
                },
            ],
        },
    },
])

export default eslintConfig

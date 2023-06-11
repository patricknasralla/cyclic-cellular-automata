module.exports = {
  env:     { browser: true, es2020: true },
  extends: [
    'eslint:recommended',
    'plugin:import/recommended',
    'plugin:import/typescript',
    'plugin:@typescript-eslint/recommended',
    'plugin:react-hooks/recommended',
    'plugin:vitest-globals/recommended',
  ],
  parser:        '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType:  'module',
  },
  plugins: [
    'react-refresh',
    'simple-import-sort',
    'import',
  ],
  rules: {
    'react-refresh/only-export-components':           'warn',
    '@typescript-eslint/type-annotation-spacing':     'error',
    '@typescript-eslint/consistent-type-definitions': ['error', 'interface'],
    'array-bracket-spacing':                          'off',
    'array-element-newline':                          [
      'warn',
      'consistent',
    ],
    'arrow-spacing': 'warn',
    'brace-style':   'error',
    'comma-dangle':  [
      'warn',
      {
        arrays:    'always-multiline',
        objects:   'always-multiline',
        imports:   'always-multiline',
        exports:   'always-multiline',
        functions: 'ignore',
      },
    ],
    'comma-spacing': [
      'warn',
      {
        after:  true,
        before: false,
      },
    ],
    complexity: [
      'warn',
      15,
    ],
    curly:                       'error',
    'eol-last':                  'warn',
    'import/named':              'off', // change to 'error' once ready for the lint --fix
    'import/no-unresolved':      'off',
    indent:                      'off',
    '@typescript-eslint/indent': [
      'warn',
      2,
      {
        SwitchCase: 1,
      },
    ],
    'key-spacing': [
      'warn',
      {
        afterColon:  true,
        align:       'value',
        beforeColon: false,
        mode:        'strict',
      },
    ],
    'keyword-spacing': [
      'warn',
      {
        after:  true,
        before: true,
      },
    ],
    'max-depth': [
      'error',
      2,
    ],
    'max-len': [
      'warn',
      {
        code:                   120,
        ignoreComments:         true,
        ignoreTemplateLiterals: true,
        ignorePattern:          '^import.+|^export.+',
        ignoreTrailingComments: true,
        ignoreUrls:             true,
        ignoreStrings:          true,
        tabWidth:               2,
      },
    ],
    'no-alert':   'error',
    'no-console': [
      'error',
      {
        allow: [
          'info',
          'warn',
          'error',
        ],
      },
    ],
    'no-multiple-empty-lines': [
      'warn',
      {
        max: 2,
      },
    ],
    'no-param-reassign':                 'error',
    'no-sparse-arrays':                  'error',
    'no-trailing-spaces':                'warn',
    'no-unreachable':                    'error',
    'no-unused-vars':                    'off',
    'no-whitespace-before-property':     'warn',
    '@typescript-eslint/no-unused-vars': [
      'error',
      {
        ignoreRestSiblings: true,
      },
    ],
    'object-curly-spacing': [
      'warn',
      'always',
    ],
    'padded-blocks': [
      'warn',
      {
        classes:  'always',
        switches: 'always',
      },
    ],
    'prefer-const': [
      'error',
      {
        destructuring: 'any',
      },
    ],
    'quote-props': [
      'warn',
      'as-needed',
    ],
    quotes: [
      'warn',
      'single',
      'avoid-escape',
    ],
    'react/display-name':      'off',
    'react/no-danger':         'off',
    semi:                      'off',
    '@typescript-eslint/semi': [
      'warn',
      'always',
    ],
    'semi-spacing': [
      'warn',
      {
        after:  true,
        before: false,
      },
    ],
    'sort-keys': [
      'off',
      'asc',
    ],
    'space-before-blocks': [
      'warn',
      'always',
    ],
    'space-before-function-paren': [
      'warn',
      {
        anonymous: 'always',
        named:     'never',
      },
    ],
    'space-in-parens': [
      'warn',
      'never',
    ],
    'space-infix-ops': 1,
    'space-unary-ops': [
      'warn',
      {
        nonwords: false,
        words:    true,
      },
    ],
    'spaced-comment': [
      'warn',
      'always',
    ],
    strict:                                      'warn',
    'import/no-named-as-default':                'off',
    'import/order':                              'off',
    'react-hooks/rules-of-hooks':                'error',
    'react-hooks/exhaustive-deps':               'warn',
    'react/prop-types':                          'off',
    'react/no-unused-prop-types':                'off',
    'simple-import-sort/imports':                'warn',
    'simple-import-sort/exports':                'warn',
    '@typescript-eslint/no-use-before-define':   'off',
    '@typescript-eslint/member-delimiter-style': [
      'warn',
      {
        multiline: {
          delimiter: 'none',
        },
        singleline: {
          delimiter:   'comma',
          requireLast: false,
        },
      },
    ],
    '@typescript-eslint/ban-ts-ignore':            'off',
    '@typescript-eslint/ban-ts-comment':           'off',
    '@typescript-eslint/ban-types':                'off',
    '@typescript-eslint/prefer-enum-initializers': 'error',
    '@typescript-eslint/no-non-null-assertion':    'off',
  },
}

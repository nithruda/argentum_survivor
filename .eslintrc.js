module.exports = {
	env: {
		browser: true,
		es2021: true,
	},
	extends: [
		'eslint:recommended',
		'plugin:@typescript-eslint/recommended',
		'eslint-config-prettier',
	],
	overrides: [
		{
			env: {
				node: true,
			},
			files: ['.eslintrc.{js,cjs}'],
			parserOptions: {
				sourceType: 'script',
			},
		},
	],
	parser: '@typescript-eslint/parser',
	parserOptions: {
		ecmaVersion: 'latest',
		sourceType: 'module',
	},
	plugins: ['@typescript-eslint', 'eslint-plugin-prettier'],
	rules: {
		'prettier/prettier': [
			'warn',
			{
				printWidth: 90,
				tabWidth: 2,
				useTabs: true,
				semi: false,
				arrowParens: 'avoid',
				bracketSpacing: true,
				bracketSameLine: false,
				singleQuote: true,
				trailingComma: 'es5',
				endOfLine: 'lf',
				htmlWhitespaceSensitivity: 'css',
				jsxSingleQuote: true,
				quoteProps: 'as-needed',
				requirePragma: false,
				insertPragma: false,
				proseWrap: 'always',
			},
		],
	},
}

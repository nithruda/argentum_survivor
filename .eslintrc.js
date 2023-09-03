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
		'no-console': [
			'warn',
			{
				allow: ['warn', 'error', 'info'],
			},
		],
		quotes: [2, 'simple', 'avoid-escape'],
		indent: [
			0,
			'tab',
			{
				SwitchCase: 1,
			},
		],
		'no-unused-vars': [
			'warn',
			{
				vars: 'all',
				args: 'after-used',
				ignoreRestSiblings: false,
			},
		],
		'prefer-const': [
			1,
			{
				destructuring: 'all',
			},
		],
		'no-mixed-spaces-and-tabs': 0,
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

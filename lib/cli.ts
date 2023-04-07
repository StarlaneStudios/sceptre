#!/usr/bin/env node

import { writeFileSync } from 'fs';
import { program } from 'commander';
import { Indent, generateRoutes } from './generator.js';

program
	.name('sceptre')
	.description('A CLI tool for compiling React Router page structures into generated imports')
	.argument('<pattern>', 'The page glob pattern')
	.argument('<output>', 'The output file to generate')
	.option('--base <path>', 'The base path to use for the glob pattern')
	.option('--indent <mode>', `Either 'none', 'tab' or an amount of spaces`)
	.action(handleGeneration)
	.showHelpAfterError()
	.parse();

interface Options {
	base?: string;
	indent?: string;
}

function handleGeneration(pattern: string, output: string, options: Options) {
	if (options.indent !== undefined && options.indent != 'none' && options.indent != 'tab' && isNaN(Number.parseInt(options.indent))) {
		throw new Error('Invalid indent mode: ' + options.indent);
	}

	const index = generateRoutes({
		basePath: options.base ?? process.cwd(),
		indent: options.indent as Indent,
		pattern: pattern,
	});

	try {
		writeFileSync(output, index);
	} catch(err) {
		throw new Error('Failed to generate routing index', { cause: err })
	}
}
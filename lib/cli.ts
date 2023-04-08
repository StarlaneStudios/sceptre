#!/usr/bin/env node

import 'colors';

import { readFileSync, writeFileSync } from 'fs';
import { program } from 'commander';
import { Indent, SceptreOptions, generateRoutes } from './generator.js';
import { fileURLToPath } from 'node:url';

const pkgPath = fileURLToPath(new URL('../package.json', import.meta.url));
const pkgInfo = JSON.parse(readFileSync(pkgPath, 'utf-8'));

program
	.name('sceptre')
	.version(pkgInfo.version)
	.description('A CLI tool for compiling React Router page structures into generated imports')
	.argument('<pattern>', 'The page glob pattern')
	.argument('<output>', 'The output file to generate')
	.option('--indent <mode>', `Either 'none', 'tab' or an amount of spaces`)
	.option('--base <path>', `The base path containing all pages`)
	.action(handleGeneration)
	.showHelpAfterError()
	.parse();

interface Options {
	indent?: string;
	base?: string;
}

function handleGeneration(pattern: string, output: string, { indent, base }: Options) {
	const startTime = Date.now();
	const config: SceptreOptions = {
		pattern: pattern
	};

	console.log(`${'➜'.blue}  Running Sceptre version ${pkgInfo.version}`);
	console.log(`${'➜'.blue}  Generating routing index ${output.bold}...`);

	if (indent !== undefined) {
		if (indent != 'none' && indent != 'tab' && isNaN(Number.parseInt(indent))) {
			throw new Error('Invalid indent mode: ' + indent);
		}

		config.indent = indent as Indent;

		console.log(`${'➜'.blue}  Configured indent: ${indent.cyan}`);
	}

	if (base !== undefined) {
		config.base = base;

		console.log(`${'➜'.blue}  Configured base path: ${base.cyan}`);
	}

	const index = generateRoutes(config, output);

	try {
		writeFileSync(output, index);

		const duration = (Date.now() - startTime).toString() + 'ms';

		console.log(`${'➜'.green}  Routing index generated successfully (${duration.bold})`);
	} catch(err: any) {
		console.log(`${'✖'.red}  Failed to generate routing index: ${err.message}`);

		throw new Error('Failed to generate routing index', { cause: err });
	}
}
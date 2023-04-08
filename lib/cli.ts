#!/usr/bin/env node

import { program } from 'commander';
import { readFileSync, writeFileSync } from 'fs';
import { Indent, SceptreOptions, generateRoutes } from './generator.js';
import { fileURLToPath } from 'node:url';
import chalk from 'chalk';

const INFO = chalk.blue('➜ ');
const SUCCESS = chalk.green('➜ ');
const ERROR = chalk.red('✖ ');

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
	.option('--force-js', `Force the generated imports to use .js extensions`)
	.action(handleGeneration)
	.showHelpAfterError()
	.parse();

interface Options {
	indent?: string;
	base?: string;
	forceJs?: boolean;
}

function handleGeneration(pattern: string, output: string, { indent, base, forceJs }: Options) {
	const startTime = Date.now();
	const config: SceptreOptions = {
		pattern: pattern
	};

	console.log(`${INFO} Running Sceptre version ${pkgInfo.version}`);
	console.log(`${INFO} Generating routing index ${chalk.bold(output)}...`);

	if (indent !== undefined) {
		if (indent != 'none' && indent != 'tab' && isNaN(Number.parseInt(indent))) {
			throw new Error('Invalid indent mode: ' + indent);
		}

		config.indent = indent as Indent;

		console.log(`${INFO} Configured indent: ${chalk.cyan(indent)}`);
	}

	if (base !== undefined) {
		config.base = base;

		console.log(`${INFO} Configured base path: ${chalk.cyan(base)}`);
	}

	if (forceJs !== undefined) {
		config.forceJs = forceJs;

		console.log(`${INFO} Configured forced .js extensions`);
	}

	const index = generateRoutes(config, output);

	try {
		writeFileSync(output, index);

		const duration = (Date.now() - startTime).toString() + 'ms';

		console.log(`${SUCCESS} Routing index generated successfully (${chalk.bold(duration)})`);
	} catch(err: any) {
		console.log(`${ERROR} Failed to generate routing index: ${err.message}`);

		throw new Error('Failed to generate routing index', { cause: err });
	}
}
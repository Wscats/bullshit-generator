import * as vscode from 'vscode';
import { generateBullShit } from './util';

/** Activate the Bullshit Generator extension. */
export function activate(context: vscode.ExtensionContext) {
	context.subscriptions.push(
		vscode.commands.registerCommand('bullshit.generate-bullshit', generateBullShit),
	);
}

export function deactivate() { }
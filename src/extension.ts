import * as vscode from 'vscode';
import { generateBullShift } from './util';

export function activate(context: vscode.ExtensionContext) {
	context.subscriptions.push(vscode.commands.registerCommand("bullshift.generate", generateBullShift));
}

export function deactivate() { }
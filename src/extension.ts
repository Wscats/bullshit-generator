import * as vscode from 'vscode';
import { generateBullShift } from './util';

export function activate(context: vscode.ExtensionContext) {
	context.subscriptions.push(vscode.commands.registerCommand("bullshift.generate-bullshift", generateBullShift));
	// context.subscriptions.push(vscode.commands.registerCommand("bullshift.fuck-javascript", fuckJavascript));
}

export function deactivate() { }
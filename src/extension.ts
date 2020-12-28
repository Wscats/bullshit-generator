import * as vscode from 'vscode';
import { generateBullShit } from './util';

export function activate(context: vscode.ExtensionContext) {
	context.subscriptions.push(vscode.commands.registerCommand("bullshit.generate-bullshit", generateBullShit));
	// context.subscriptions.push(vscode.commands.registerCommand("bullshit.fuck-javascript", fuckJavascript));
}

export function deactivate() { }
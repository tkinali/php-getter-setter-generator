import * as vscode from 'vscode';
import { Application } from './application';

export function activate(context: vscode.ExtensionContext) {

    const app = new Application(context);
    const getterCommand = vscode.commands.registerCommand('phpgsg.generateGetters', () => {
        app.run(true, false);
    });
    context.subscriptions.push(getterCommand);

    const setterCommand = vscode.commands.registerCommand('phpgsg.generateSetters', () => {
        app.run(false, true);
    });
    context.subscriptions.push(setterCommand);

    const getterSetterCommand = vscode.commands.registerCommand('phpgsg.generateGettersAndSetters', () => {
        app.run(true, true);
    });
    context.subscriptions.push(getterSetterCommand);
}

export function deactivate() {}

import * as vscode from 'vscode';
import { Application } from './application';

export function activate(context: vscode.ExtensionContext) {

    const constructorCommand = vscode.commands.registerCommand('phpgsg.generateConstructor', () => {
        const app = new Application(context);
        app.generateConstructor();
    });
    context.subscriptions.push(constructorCommand);

    const getterCommand = vscode.commands.registerCommand('phpgsg.generateGetters', () => {
        const app = new Application(context);
        app.run(true, false);
    });
    context.subscriptions.push(getterCommand);

    const setterCommand = vscode.commands.registerCommand('phpgsg.generateSetters', () => {
        const app = new Application(context);
        app.run(false, true);
    });
    context.subscriptions.push(setterCommand);

    const getterSetterCommand = vscode.commands.registerCommand('phpgsg.generateGettersAndSetters', () => {
        const app = new Application(context);
        app.run(true, true);
    });
    context.subscriptions.push(getterSetterCommand);
}

export function deactivate() {}

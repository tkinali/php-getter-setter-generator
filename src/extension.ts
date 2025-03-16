import * as vscode from 'vscode';
import { Application } from './application';

export function activate(context: vscode.ExtensionContext) {

    const constructorCommand = vscode.commands.registerCommand('phpgsg.generateConstructor', async () => {
        const app = new Application(context);
        await app.generateConstructor();
    });
    context.subscriptions.push(constructorCommand);

    const getterCommand = vscode.commands.registerCommand('phpgsg.generateGetters', async () => {
        const app = new Application(context);
        await app.run(true, false);
    });
    context.subscriptions.push(getterCommand);

    const setterCommand = vscode.commands.registerCommand('phpgsg.generateSetters', async () => {
        const app = new Application(context);
        await app.run(false, true);
    });
    context.subscriptions.push(setterCommand);

    const getterSetterCommand = vscode.commands.registerCommand('phpgsg.generateGettersAndSetters', async () => {
        const app = new Application(context);
        await app.run(true, true);
    });
    context.subscriptions.push(getterSetterCommand);
}

export function deactivate() {}

import * as assert from 'assert';
import * as vscode from 'vscode';
import * as path from 'path';
import * as fs from 'fs';

interface tQuickPickItem extends vscode.QuickPickItem {
    className?: string,
    name?: string,
    variable?: string,
    getterExists?: boolean,
    setterExists?: boolean,
    constructorArgumentExists?: boolean
}

async function waitForFileChange(): Promise<string> {
    return new Promise<string>((resolve) => {
        const disposable = vscode.workspace.onDidChangeTextDocument(event => {
            if (event.document === vscode.window.activeTextEditor?.document) {
                const finalFileContents = vscode.window.activeTextEditor.document.getText();
                disposable.dispose();
                resolve(finalFileContents);
            }
        });
    });
}

async function loadLanguageFile(): Promise<any> {
    return new Promise<string>((resolve) => {
        let messages: any;
        let l10nPath: string = path.join(__dirname, '..', '..', 'l10n');

        try {
            const language = vscode.env.language;
            const l10nFile = language === 'en'
                ? 'bundle.l10n.json'
                : `bundle.l10n.${language}.json`;

            messages = require(path.join(l10nPath, l10nFile));
            resolve(messages);
        } catch (error) {
            messages = require(path.join(l10nPath, 'bundle.l10n.json'));
            resolve(messages);
        }
        resolve(messages);
    });
}

const config = vscode.workspace.getConfiguration('phpgsg.getterSetterGenerator');
//const dirname = path.join(__dirname, '..', '..', 'src', 'test');
process.env.TEST_MODE = "true";

suite('Getter & Setter Testleri', () => {
    test('Standard Class All Getter & Setter', async function() {
        const filePath = path.join(__dirname, 'examples', 'class.php');
        const document = await vscode.workspace.openTextDocument(filePath);
        await vscode.window.showTextDocument(document);

        await vscode.commands.executeCommand('phpgsg.generateGettersAndSetters');
        const finalFileContents = await waitForFileChange();
        const expectedContents = fs.readFileSync(path.join(__dirname, 'examples', 'class_all_result.php'), 'utf-8');

        await vscode.commands.executeCommand('workbench.action.closeActiveEditor');
        assert.equal(finalFileContents, expectedContents);
    });

    test('Standard Class Partial Property Getters & Setters', async function() {
        const filePath = path.join(__dirname, 'examples', 'class.php');
        const document = await vscode.workspace.openTextDocument(filePath);
        const testQuickPickItems: tQuickPickItem[] = [];
        await vscode.window.showTextDocument(document);

        ['firstname', 'lastname'].forEach(item => {
            testQuickPickItems.push({
                label: `$${item}`,
                description: ``,
                picked: true,
                kind: vscode.QuickPickItemKind.Default,
                className: 'Scientist',
                variable: item,
                name: item.charAt(0).toUpperCase() + item.slice(1),
                getterExists: false,
                setterExists: false,
                constructorArgumentExists: false
            });
        });

        process.env.QUICKPICK_ITEMS = JSON.stringify(testQuickPickItems);

        await vscode.commands.executeCommand('phpgsg.generateGettersAndSetters');
        const finalFileContents = await waitForFileChange();
        const expectedContents = fs.readFileSync(path.join(__dirname, 'examples', 'class_partial_result.php'), 'utf-8');

        delete process.env.QUICKPICK_ITEMS;
        await vscode.commands.executeCommand('workbench.action.closeActiveEditor');

        assert.equal(finalFileContents, expectedContents);
    });

    test('Standard Class All Getter', async function() {
        const filePath = path.join(__dirname, 'examples', 'class.php');
        const document = await vscode.workspace.openTextDocument(filePath);
        await vscode.window.showTextDocument(document);

        await vscode.commands.executeCommand('phpgsg.generateGetters');
        const finalFileContents = await waitForFileChange();
        const expectedContents = fs.readFileSync(path.join(__dirname, 'examples', 'class_getter_all_result.php'), 'utf-8');

        await vscode.commands.executeCommand('workbench.action.closeActiveEditor');
        assert.equal(finalFileContents, expectedContents);
    });

    test('Standard Class Partial Property Getters', async function() {
        const filePath = path.join(__dirname, 'examples', 'class.php');
        const document = await vscode.workspace.openTextDocument(filePath);
        const testQuickPickItems: tQuickPickItem[] = [];
        await vscode.window.showTextDocument(document);

        ['firstname', 'lastname'].forEach(item => {
            testQuickPickItems.push({
                label: `$${item}`,
                description: ``,
                picked: true,
                kind: vscode.QuickPickItemKind.Default,
                className: 'Scientist',
                variable: item,
                name: item.charAt(0).toUpperCase() + item.slice(1),
                getterExists: false,
                setterExists: false,
                constructorArgumentExists: false
            });
        });

        process.env.QUICKPICK_ITEMS = JSON.stringify(testQuickPickItems);

        await vscode.commands.executeCommand('phpgsg.generateGetters');
        const finalFileContents = await waitForFileChange();
        const expectedContents = fs.readFileSync(path.join(__dirname, 'examples', 'class_getter_partial_result.php'), 'utf-8');

        delete process.env.QUICKPICK_ITEMS;
        await vscode.commands.executeCommand('workbench.action.closeActiveEditor');

        assert.equal(finalFileContents, expectedContents);
    });

    test('Standard Class All Setter', async function() {
        const filePath = path.join(__dirname, 'examples', 'class.php');
        const document = await vscode.workspace.openTextDocument(filePath);
        await vscode.window.showTextDocument(document);

        await vscode.commands.executeCommand('phpgsg.generateSetters');
        const finalFileContents = await waitForFileChange();
        const expectedContents = fs.readFileSync(path.join(__dirname, 'examples', 'class_setter_all_result.php'), 'utf-8');

        await vscode.commands.executeCommand('workbench.action.closeActiveEditor');
        assert.equal(finalFileContents, expectedContents);
    });

    test('Standard Class Partial Property Setters', async function() {
        const filePath = path.join(__dirname, 'examples', 'class.php');
        const document = await vscode.workspace.openTextDocument(filePath);
        const testQuickPickItems: tQuickPickItem[] = [];
        await vscode.window.showTextDocument(document);

        ['firstname', 'lastname'].forEach(item => {
            testQuickPickItems.push({
                label: `$${item}`,
                description: ``,
                picked: true,
                kind: vscode.QuickPickItemKind.Default,
                className: 'Scientist',
                variable: item,
                name: item.charAt(0).toUpperCase() + item.slice(1),
                getterExists: false,
                setterExists: false,
                constructorArgumentExists: false
            });
        });

        process.env.QUICKPICK_ITEMS = JSON.stringify(testQuickPickItems);

        await vscode.commands.executeCommand('phpgsg.generateSetters');
        const finalFileContents = await waitForFileChange();
        const expectedContents = fs.readFileSync(path.join(__dirname, 'examples', 'class_setter_partial_result.php'), 'utf-8');

        delete process.env.QUICKPICK_ITEMS;
        await vscode.commands.executeCommand('workbench.action.closeActiveEditor');

        assert.equal(finalFileContents, expectedContents);
    });

    test('Annotation Class All Getters & Setters', async function() {
        const filePath = path.join(__dirname, 'examples', 'annotation_class.php');
        const document = await vscode.workspace.openTextDocument(filePath);
        await vscode.window.showTextDocument(document);

        await vscode.commands.executeCommand('phpgsg.generateGettersAndSetters');
        const finalFileContents = await waitForFileChange();
        const expectedContents = fs.readFileSync(path.join(__dirname, 'examples', 'annotation_class_all_result.php'), 'utf-8');

        await vscode.commands.executeCommand('workbench.action.closeActiveEditor');
        assert.equal(finalFileContents, expectedContents);
    });

    test('Annotation Class Partial Property Getters & Setters', async function() {
        const filePath = path.join(__dirname, 'examples', 'annotation_class.php');
        const document = await vscode.workspace.openTextDocument(filePath);
        const testQuickPickItems: tQuickPickItem[] = [];
        await vscode.window.showTextDocument(document);

        ['firstname', 'lastname'].forEach(item => {
            testQuickPickItems.push({
                label: `$${item}`,
                description: ``,
                picked: true,
                kind: vscode.QuickPickItemKind.Default,
                className: 'Scientist',
                variable: item,
                name: item.charAt(0).toUpperCase() + item.slice(1),
                getterExists: false,
                setterExists: false,
                constructorArgumentExists: false
            });
        });

        process.env.QUICKPICK_ITEMS = JSON.stringify(testQuickPickItems);

        await vscode.commands.executeCommand('phpgsg.generateGettersAndSetters');
        const finalFileContents = await waitForFileChange();
        const expectedContents = fs.readFileSync(path.join(__dirname, 'examples', 'annotation_class_partial_result.php'), 'utf-8');

        delete process.env.QUICKPICK_ITEMS;
        await vscode.commands.executeCommand('workbench.action.closeActiveEditor');

        assert.equal(finalFileContents, expectedContents);
    });

    test('Annotation Class All Getters', async function() {
        const filePath = path.join(__dirname, 'examples', 'annotation_class.php');
        const document = await vscode.workspace.openTextDocument(filePath);
        await vscode.window.showTextDocument(document);

        await vscode.commands.executeCommand('phpgsg.generateGetters');
        const finalFileContents = await waitForFileChange();
        const expectedContents = fs.readFileSync(path.join(__dirname, 'examples', 'annotation_class_getter_all_result.php'), 'utf-8');

        await vscode.commands.executeCommand('workbench.action.closeActiveEditor');
        assert.equal(finalFileContents, expectedContents);
    });

    test('Annotation Class Partial Property Getters', async function() {
        const filePath = path.join(__dirname, 'examples', 'annotation_class.php');
        const document = await vscode.workspace.openTextDocument(filePath);
        const testQuickPickItems: tQuickPickItem[] = [];
        await vscode.window.showTextDocument(document);

        ['firstname', 'lastname'].forEach(item => {
            testQuickPickItems.push({
                label: `$${item}`,
                description: ``,
                picked: true,
                kind: vscode.QuickPickItemKind.Default,
                className: 'Scientist',
                variable: item,
                name: item.charAt(0).toUpperCase() + item.slice(1),
                getterExists: false,
                setterExists: false,
                constructorArgumentExists: false
            });
        });

        process.env.QUICKPICK_ITEMS = JSON.stringify(testQuickPickItems);

        await vscode.commands.executeCommand('phpgsg.generateGetters');
        const finalFileContents = await waitForFileChange();
        const expectedContents = fs.readFileSync(path.join(__dirname, 'examples', 'annotation_class_getter_partial_result.php'), 'utf-8');

        delete process.env.QUICKPICK_ITEMS;
        await vscode.commands.executeCommand('workbench.action.closeActiveEditor');

        assert.equal(finalFileContents, expectedContents);
    });

    test('Annotation Class All Setters', async function() {
        const filePath = path.join(__dirname, 'examples', 'annotation_class.php');
        const document = await vscode.workspace.openTextDocument(filePath);
        await vscode.window.showTextDocument(document);

        await vscode.commands.executeCommand('phpgsg.generateSetters');
        const finalFileContents = await waitForFileChange();
        const expectedContents = fs.readFileSync(path.join(__dirname, 'examples', 'annotation_class_setter_all_result.php'), 'utf-8');

        await vscode.commands.executeCommand('workbench.action.closeActiveEditor');
        assert.equal(finalFileContents, expectedContents);
    });

    test('Annotation Class Partial Property Setters', async function() {
        const filePath = path.join(__dirname, 'examples', 'annotation_class.php');
        const document = await vscode.workspace.openTextDocument(filePath);
        const testQuickPickItems: tQuickPickItem[] = [];
        await vscode.window.showTextDocument(document);

        ['firstname', 'lastname'].forEach(item => {
            testQuickPickItems.push({
                label: `$${item}`,
                description: ``,
                picked: true,
                kind: vscode.QuickPickItemKind.Default,
                className: 'Scientist',
                variable: item,
                name: item.charAt(0).toUpperCase() + item.slice(1),
                getterExists: false,
                setterExists: false,
                constructorArgumentExists: false
            });
        });

        process.env.QUICKPICK_ITEMS = JSON.stringify(testQuickPickItems);

        await vscode.commands.executeCommand('phpgsg.generateSetters');
        const finalFileContents = await waitForFileChange();
        const expectedContents = fs.readFileSync(path.join(__dirname, 'examples', 'annotation_class_setter_partial_result.php'), 'utf-8');

        delete process.env.QUICKPICK_ITEMS;
        await vscode.commands.executeCommand('workbench.action.closeActiveEditor');

        assert.equal(finalFileContents, expectedContents);
    });

    test('Attribute Class All Getters & Setters', async function() {
        const filePath = path.join(__dirname, 'examples', 'attribute_class.php');
        const document = await vscode.workspace.openTextDocument(filePath);
        await vscode.window.showTextDocument(document);

        await vscode.commands.executeCommand('phpgsg.generateGettersAndSetters');
        const finalFileContents = await waitForFileChange();
        const expectedContents = fs.readFileSync(path.join(__dirname, 'examples', 'attribute_class_all_result.php'), 'utf-8');

        await vscode.commands.executeCommand('workbench.action.closeActiveEditor');
        assert.equal(finalFileContents, expectedContents);
    });

    test('Attribute Class Partial Property Getters & Setters', async function() {
        const filePath = path.join(__dirname, 'examples', 'attribute_class.php');
        const document = await vscode.workspace.openTextDocument(filePath);
        const testQuickPickItems: tQuickPickItem[] = [];
        await vscode.window.showTextDocument(document);

        ['description', 'status', 'engineer'].forEach(item => {
            testQuickPickItems.push({
                label: `$${item}`,
                description: ``,
                picked: true,
                kind: vscode.QuickPickItemKind.Default,
                className: 'Bug',
                variable: item,
                name: item.charAt(0).toUpperCase() + item.slice(1),
                getterExists: false,
                setterExists: false,
                constructorArgumentExists: false
            });
        });

        process.env.QUICKPICK_ITEMS = JSON.stringify(testQuickPickItems);

        await vscode.commands.executeCommand('phpgsg.generateGettersAndSetters');
        const finalFileContents = await waitForFileChange();
        const expectedContents = fs.readFileSync(path.join(__dirname, 'examples', 'attribute_class_partial_result.php'), 'utf-8');

        delete process.env.QUICKPICK_ITEMS;
        await vscode.commands.executeCommand('workbench.action.closeActiveEditor');

        assert.equal(finalFileContents, expectedContents);
    });

    test('Attribute Class All Getters', async function() {
        const filePath = path.join(__dirname, 'examples', 'attribute_class.php');
        const document = await vscode.workspace.openTextDocument(filePath);
        await vscode.window.showTextDocument(document);

        await vscode.commands.executeCommand('phpgsg.generateGetters');
        const finalFileContents = await waitForFileChange();
        const expectedContents = fs.readFileSync(path.join(__dirname, 'examples', 'attribute_class_getter_all_result.php'), 'utf-8');

        await vscode.commands.executeCommand('workbench.action.closeActiveEditor');
        assert.equal(finalFileContents, expectedContents);
    });

    test('Attribute Class Partial Property Getters', async function() {
        const filePath = path.join(__dirname, 'examples', 'attribute_class.php');
        const document = await vscode.workspace.openTextDocument(filePath);
        const testQuickPickItems: tQuickPickItem[] = [];
        await vscode.window.showTextDocument(document);

        ['description', 'status', 'engineer'].forEach(item => {
            testQuickPickItems.push({
                label: `$${item}`,
                description: ``,
                picked: true,
                kind: vscode.QuickPickItemKind.Default,
                className: 'Bug',
                variable: item,
                name: item.charAt(0).toUpperCase() + item.slice(1),
                getterExists: false,
                setterExists: false,
                constructorArgumentExists: false
            });
        });

        process.env.QUICKPICK_ITEMS = JSON.stringify(testQuickPickItems);

        await vscode.commands.executeCommand('phpgsg.generateGetters');
        const finalFileContents = await waitForFileChange();
        const expectedContents = fs.readFileSync(path.join(__dirname, 'examples', 'attribute_class_getter_partial_result.php'), 'utf-8');

        delete process.env.QUICKPICK_ITEMS;
        await vscode.commands.executeCommand('workbench.action.closeActiveEditor');

        assert.equal(finalFileContents, expectedContents);
    });

    test('Attribute Class All Setters', async function() {
        const filePath = path.join(__dirname, 'examples', 'attribute_class.php');
        const document = await vscode.workspace.openTextDocument(filePath);
        await vscode.window.showTextDocument(document);

        await vscode.commands.executeCommand('phpgsg.generateSetters');
        const finalFileContents = await waitForFileChange();
        const expectedContents = fs.readFileSync(path.join(__dirname, 'examples', 'attribute_class_setter_all_result.php'), 'utf-8');

        await vscode.commands.executeCommand('workbench.action.closeActiveEditor');
        assert.equal(finalFileContents, expectedContents);
    });

    test('Attribute Class Partial Property Setters', async function() {
        const filePath = path.join(__dirname, 'examples', 'attribute_class.php');
        const document = await vscode.workspace.openTextDocument(filePath);
        const testQuickPickItems: tQuickPickItem[] = [];
        await vscode.window.showTextDocument(document);

        ['description', 'status', 'engineer'].forEach(item => {
            testQuickPickItems.push({
                label: `$${item}`,
                description: ``,
                picked: true,
                kind: vscode.QuickPickItemKind.Default,
                className: 'Bug',
                variable: item,
                name: item.charAt(0).toUpperCase() + item.slice(1),
                getterExists: false,
                setterExists: false,
                constructorArgumentExists: false
            });
        });

        process.env.QUICKPICK_ITEMS = JSON.stringify(testQuickPickItems);

        await vscode.commands.executeCommand('phpgsg.generateSetters');
        const finalFileContents = await waitForFileChange();
        const expectedContents = fs.readFileSync(path.join(__dirname, 'examples', 'attribute_class_setter_partial_result.php'), 'utf-8');

        delete process.env.QUICKPICK_ITEMS;
        await vscode.commands.executeCommand('workbench.action.closeActiveEditor');

        assert.equal(finalFileContents, expectedContents);
    });

    test('Multiple Class All Getter & Setter', async function() {
        const filePath = path.join(__dirname, 'examples', 'multiple_class.php');
        const document = await vscode.workspace.openTextDocument(filePath);
        await vscode.window.showTextDocument(document);

        await vscode.commands.executeCommand('phpgsg.generateGettersAndSetters');
        const finalFileContents = await waitForFileChange();
        const expectedContents = fs.readFileSync(path.join(__dirname, 'examples', 'multiple_class_all_result.php'), 'utf-8');

        await vscode.commands.executeCommand('workbench.action.closeActiveEditor');
        assert.equal(finalFileContents, expectedContents);
    });

    test('Multiple Class Partial Property Getters & Setters', async function() {
        const filePath = path.join(__dirname, 'examples', 'multiple_class.php');
        const document = await vscode.workspace.openTextDocument(filePath);
        const testQuickPickItems: tQuickPickItem[] = [];
        await vscode.window.showTextDocument(document);

        ['firstname', 'lastname', 'theories'].forEach(item => {
            testQuickPickItems.push({
                label: `$${item}`,
                description: ``,
                picked: true,
                kind: vscode.QuickPickItemKind.Default,
                className: 'Scientist',
                variable: item,
                name: item.charAt(0).toUpperCase() + item.slice(1),
                getterExists: false,
                setterExists: false,
                constructorArgumentExists: false
            });
        });

        ['description', 'created', 'status'].forEach(item => {
            testQuickPickItems.push({
                label: `$${item}`,
                description: ``,
                picked: true,
                kind: vscode.QuickPickItemKind.Default,
                className: 'Bug',
                variable: item,
                name: item.charAt(0).toUpperCase() + item.slice(1),
                getterExists: false,
                setterExists: false,
                constructorArgumentExists: false
            });
        });

        ['firstname', 'lastname'].forEach(item => {
            testQuickPickItems.push({
                label: `$${item}`,
                description: ``,
                picked: true,
                kind: vscode.QuickPickItemKind.Default,
                className: 'Scientist2',
                variable: item,
                name: item.charAt(0).toUpperCase() + item.slice(1),
                getterExists: false,
                setterExists: false,
                constructorArgumentExists: false
            });
        });

        process.env.QUICKPICK_ITEMS = JSON.stringify(testQuickPickItems);

        await vscode.commands.executeCommand('phpgsg.generateGettersAndSetters');
        const finalFileContents = await waitForFileChange();
        const expectedContents = fs.readFileSync(path.join(__dirname, 'examples', 'multiple_class_partial_result.php'), 'utf-8');

        delete process.env.QUICKPICK_ITEMS;
        await vscode.commands.executeCommand('workbench.action.closeActiveEditor');

        assert.equal(finalFileContents, expectedContents);
    });

    test('Multiple Class All Getters', async function() {
        const filePath = path.join(__dirname, 'examples', 'multiple_class.php');
        const document = await vscode.workspace.openTextDocument(filePath);
        await vscode.window.showTextDocument(document);

        await vscode.commands.executeCommand('phpgsg.generateGetters');
        const finalFileContents = await waitForFileChange();
        const expectedContents = fs.readFileSync(path.join(__dirname, 'examples', 'multiple_class_getter_all_result.php'), 'utf-8');

        await vscode.commands.executeCommand('workbench.action.closeActiveEditor');
        assert.equal(finalFileContents, expectedContents);
    });

    test('Multiple Class Partial Property Getters', async function() {
        const filePath = path.join(__dirname, 'examples', 'multiple_class.php');
        const document = await vscode.workspace.openTextDocument(filePath);
        const testQuickPickItems: tQuickPickItem[] = [];
        await vscode.window.showTextDocument(document);

        ['firstname', 'lastname', 'theories'].forEach(item => {
            testQuickPickItems.push({
                label: `$${item}`,
                description: ``,
                picked: true,
                kind: vscode.QuickPickItemKind.Default,
                className: 'Scientist',
                variable: item,
                name: item.charAt(0).toUpperCase() + item.slice(1),
                getterExists: false,
                setterExists: false,
                constructorArgumentExists: false
            });
        });

        ['description', 'created', 'status'].forEach(item => {
            testQuickPickItems.push({
                label: `$${item}`,
                description: ``,
                picked: true,
                kind: vscode.QuickPickItemKind.Default,
                className: 'Bug',
                variable: item,
                name: item.charAt(0).toUpperCase() + item.slice(1),
                getterExists: false,
                setterExists: false,
                constructorArgumentExists: false
            });
        });

        ['firstname', 'lastname'].forEach(item => {
            testQuickPickItems.push({
                label: `$${item}`,
                description: ``,
                picked: true,
                kind: vscode.QuickPickItemKind.Default,
                className: 'Scientist2',
                variable: item,
                name: item.charAt(0).toUpperCase() + item.slice(1),
                getterExists: false,
                setterExists: false,
                constructorArgumentExists: false
            });
        });

        process.env.QUICKPICK_ITEMS = JSON.stringify(testQuickPickItems);

        await vscode.commands.executeCommand('phpgsg.generateGetters');
        const finalFileContents = await waitForFileChange();
        const expectedContents = fs.readFileSync(path.join(__dirname, 'examples', 'multiple_class_getter_partial_result.php'), 'utf-8');

        delete process.env.QUICKPICK_ITEMS;
        await vscode.commands.executeCommand('workbench.action.closeActiveEditor');

        assert.equal(finalFileContents, expectedContents);
    });

    test('Multiple Class All Setters', async function() {
        const filePath = path.join(__dirname, 'examples', 'multiple_class.php');
        const document = await vscode.workspace.openTextDocument(filePath);
        await vscode.window.showTextDocument(document);

        await vscode.commands.executeCommand('phpgsg.generateSetters');
        const finalFileContents = await waitForFileChange();
        const expectedContents = fs.readFileSync(path.join(__dirname, 'examples', 'multiple_class_setter_all_result.php'), 'utf-8');

        await vscode.commands.executeCommand('workbench.action.closeActiveEditor');
        assert.equal(finalFileContents, expectedContents);
    });

    test('Multiple Class Partial Property Setters', async function() {
        const filePath = path.join(__dirname, 'examples', 'multiple_class.php');
        const document = await vscode.workspace.openTextDocument(filePath);
        const testQuickPickItems: tQuickPickItem[] = [];
        await vscode.window.showTextDocument(document);

        ['firstname', 'lastname', 'theories'].forEach(item => {
            testQuickPickItems.push({
                label: `$${item}`,
                description: ``,
                picked: true,
                kind: vscode.QuickPickItemKind.Default,
                className: 'Scientist',
                variable: item,
                name: item.charAt(0).toUpperCase() + item.slice(1),
                getterExists: false,
                setterExists: false,
                constructorArgumentExists: false
            });
        });

        ['description', 'created', 'status'].forEach(item => {
            testQuickPickItems.push({
                label: `$${item}`,
                description: ``,
                picked: true,
                kind: vscode.QuickPickItemKind.Default,
                className: 'Bug',
                variable: item,
                name: item.charAt(0).toUpperCase() + item.slice(1),
                getterExists: false,
                setterExists: false,
                constructorArgumentExists: false
            });
        });

        ['firstname', 'lastname'].forEach(item => {
            testQuickPickItems.push({
                label: `$${item}`,
                description: ``,
                picked: true,
                kind: vscode.QuickPickItemKind.Default,
                className: 'Scientist2',
                variable: item,
                name: item.charAt(0).toUpperCase() + item.slice(1),
                getterExists: false,
                setterExists: false,
                constructorArgumentExists: false
            });
        });

        process.env.QUICKPICK_ITEMS = JSON.stringify(testQuickPickItems);

        await vscode.commands.executeCommand('phpgsg.generateSetters');
        const finalFileContents = await waitForFileChange();
        const expectedContents = fs.readFileSync(path.join(__dirname, 'examples', 'multiple_class_setter_partial_result.php'), 'utf-8');

        delete process.env.QUICKPICK_ITEMS;
        await vscode.commands.executeCommand('workbench.action.closeActiveEditor');

        assert.equal(finalFileContents, expectedContents);
    });

    test('Sort Method Getters First', async function() {
        const messages = await loadLanguageFile();
        const filePath = path.join(__dirname, 'examples', 'class.php');
        const document = await vscode.workspace.openTextDocument(filePath);
        await vscode.window.showTextDocument(document);
        await config.update('sortMethods', messages["phpgsg.config.enum.getters_first"], vscode.ConfigurationTarget.Global);

        await vscode.commands.executeCommand('phpgsg.generateGettersAndSetters');
        const finalFileContents = await waitForFileChange();
        const expectedContents = fs.readFileSync(path.join(__dirname, 'examples', 'class_sort_method_getter_result.php'), 'utf-8');

        await config.update('sortMethods', undefined, vscode.ConfigurationTarget.Global);
        await vscode.commands.executeCommand('workbench.action.closeActiveEditor');
        assert.equal(finalFileContents, expectedContents);
    });

    test('Sort Method Setters First', async function() {
        const messages = await loadLanguageFile();
        const filePath = path.join(__dirname, 'examples', 'class.php');
        const document = await vscode.workspace.openTextDocument(filePath);
        await vscode.window.showTextDocument(document);
        await config.update('sortMethods', messages["phpgsg.config.enum.setters_first"], vscode.ConfigurationTarget.Global);

        await vscode.commands.executeCommand('phpgsg.generateGettersAndSetters');
        const finalFileContents = await waitForFileChange();
        const expectedContents = fs.readFileSync(path.join(__dirname, 'examples', 'class_sort_method_setter_result.php'), 'utf-8');

        await config.update('sortMethods', undefined, vscode.ConfigurationTarget.Global);
        await vscode.commands.executeCommand('workbench.action.closeActiveEditor');
        assert.equal(finalFileContents, expectedContents);
    });

    test('Indent Size 2 Spaces', async function() {
        const filePath = path.join(__dirname, 'examples', 'attribute_class.php');
        const document = await vscode.workspace.openTextDocument(filePath);
        await vscode.window.showTextDocument(document);
        await config.update('indentSize', 2, vscode.ConfigurationTarget.Global);

        await vscode.commands.executeCommand('phpgsg.generateGettersAndSetters');
        const finalFileContents = await waitForFileChange();
        const expectedContents = fs.readFileSync(path.join(__dirname, 'examples', 'attribute_class_indent_size_result.php'), 'utf-8');

        await config.update('indentSize', undefined, vscode.ConfigurationTarget.Global);
        await vscode.commands.executeCommand('workbench.action.closeActiveEditor');
        assert.equal(finalFileContents, expectedContents);
    });

    test('Indent with Tabs', async function() {
        const filePath = path.join(__dirname, 'examples', 'attribute_class.php');
        const document = await vscode.workspace.openTextDocument(filePath);
        await vscode.window.showTextDocument(document);
        await config.update('indentWithTab', true, vscode.ConfigurationTarget.Global);

        await vscode.commands.executeCommand('phpgsg.generateGettersAndSetters');
        const finalFileContents = await waitForFileChange();
        const expectedContents = fs.readFileSync(path.join(__dirname, 'examples', 'attribute_class_indent_with_tab_result.php'), 'utf-8');

        await config.update('indentWithTab', undefined, vscode.ConfigurationTarget.Global);
        await vscode.commands.executeCommand('workbench.action.closeActiveEditor');
        assert.equal(finalFileContents, expectedContents);
    });

    test('Method Order Ascending', async function() {
        const messages = await loadLanguageFile();
        const filePath = path.join(__dirname, 'examples', 'annotation_class_all_result.php');
        const document = await vscode.workspace.openTextDocument(filePath);
        await vscode.window.showTextDocument(document);
        await config.update('orderBy', messages["phpgsg.config.enum.ascending"], vscode.ConfigurationTarget.Global);

        await vscode.commands.executeCommand('phpgsg.generateGettersAndSetters');
        const finalFileContents = await waitForFileChange();
        const expectedContents = fs.readFileSync(path.join(__dirname, 'examples', 'method_order_ascending_result.php'), 'utf-8');

        await config.update('orderBy', undefined, vscode.ConfigurationTarget.Global);
        await vscode.commands.executeCommand('workbench.action.closeActiveEditor');
        assert.equal(finalFileContents, expectedContents);
    });

    test('Method Order Descending', async function() {
        const messages = await loadLanguageFile();
        const filePath = path.join(__dirname, 'examples', 'attribute_class_all_result.php');
        const document = await vscode.workspace.openTextDocument(filePath);
        await vscode.window.showTextDocument(document);
        await config.update('orderBy', messages["phpgsg.config.enum.ascending"], vscode.ConfigurationTarget.Global);

        await vscode.commands.executeCommand('phpgsg.generateGettersAndSetters');
        const finalFileContents = await waitForFileChange();
        const expectedContents = fs.readFileSync(path.join(__dirname, 'examples', 'method_order_descending_result.php'), 'utf-8');

        await config.update('orderBy', undefined, vscode.ConfigurationTarget.Global);
        await vscode.commands.executeCommand('workbench.action.closeActiveEditor');
        assert.equal(finalFileContents, expectedContents);
    });

    test('Method Order Ascending Getters First', async function() {
        const messages = await loadLanguageFile();
        const filePath = path.join(__dirname, 'examples', 'annotation_class_all_result.php');
        const document = await vscode.workspace.openTextDocument(filePath);
        await vscode.window.showTextDocument(document);
        await config.update('orderBy', messages["phpgsg.config.enum.ascending"], vscode.ConfigurationTarget.Global);
        await config.update('sortMethods', messages["phpgsg.config.enum.getters_first"], vscode.ConfigurationTarget.Global);

        await vscode.commands.executeCommand('phpgsg.generateGettersAndSetters');
        const finalFileContents = await waitForFileChange();
        const expectedContents = fs.readFileSync(path.join(__dirname, 'examples', 'method_order_ascending_getters_result.php'), 'utf-8');

        await config.update('orderBy', undefined, vscode.ConfigurationTarget.Global);
        await config.update('sortMethods', undefined, vscode.ConfigurationTarget.Global);
        await vscode.commands.executeCommand('workbench.action.closeActiveEditor');
        assert.equal(finalFileContents, expectedContents);
    });

    test('Method Order Descending Getters First', async function() {
        const messages = await loadLanguageFile();
        const filePath = path.join(__dirname, 'examples', 'attribute_class_all_result.php');
        const document = await vscode.workspace.openTextDocument(filePath);
        await vscode.window.showTextDocument(document);
        await config.update('orderBy', messages["phpgsg.config.enum.ascending"], vscode.ConfigurationTarget.Global);
        await config.update('sortMethods', messages["phpgsg.config.enum.getters_first"], vscode.ConfigurationTarget.Global);

        await vscode.commands.executeCommand('phpgsg.generateGettersAndSetters');
        const finalFileContents = await waitForFileChange();
        const expectedContents = fs.readFileSync(path.join(__dirname, 'examples', 'method_order_descending_getters_result.php'), 'utf-8');

        await config.update('orderBy', undefined, vscode.ConfigurationTarget.Global);
        await config.update('sortMethods', undefined, vscode.ConfigurationTarget.Global);
        await vscode.commands.executeCommand('workbench.action.closeActiveEditor');
        assert.equal(finalFileContents, expectedContents);
    });

    test('Method Order Ascending Setters First', async function() {
        const messages = await loadLanguageFile();
        const filePath = path.join(__dirname, 'examples', 'annotation_class_all_result.php');
        const document = await vscode.workspace.openTextDocument(filePath);
        await vscode.window.showTextDocument(document);
        await config.update('orderBy', messages["phpgsg.config.enum.ascending"], vscode.ConfigurationTarget.Global);
        await config.update('sortMethods', messages["phpgsg.config.enum.setters_first"], vscode.ConfigurationTarget.Global);

        await vscode.commands.executeCommand('phpgsg.generateGettersAndSetters');
        const finalFileContents = await waitForFileChange();
        const expectedContents = fs.readFileSync(path.join(__dirname, 'examples', 'method_order_ascending_setters_result.php'), 'utf-8');

        await config.update('orderBy', undefined, vscode.ConfigurationTarget.Global);
        await config.update('sortMethods', undefined, vscode.ConfigurationTarget.Global);
        await vscode.commands.executeCommand('workbench.action.closeActiveEditor');
        assert.equal(finalFileContents, expectedContents);
    });

    test('Method Order Descending Setters First', async function() {
        const messages = await loadLanguageFile();
        const filePath = path.join(__dirname, 'examples', 'attribute_class_all_result.php');
        const document = await vscode.workspace.openTextDocument(filePath);
        await vscode.window.showTextDocument(document);
        await config.update('orderBy', messages["phpgsg.config.enum.ascending"], vscode.ConfigurationTarget.Global);
        await config.update('sortMethods', messages["phpgsg.config.enum.setters_first"], vscode.ConfigurationTarget.Global);

        await vscode.commands.executeCommand('phpgsg.generateGettersAndSetters');
        const finalFileContents = await waitForFileChange();
        const expectedContents = fs.readFileSync(path.join(__dirname, 'examples', 'method_order_descending_setters_result.php'), 'utf-8');

        await config.update('orderBy', undefined, vscode.ConfigurationTarget.Global);
        await config.update('sortMethods', undefined, vscode.ConfigurationTarget.Global);
        await vscode.commands.executeCommand('workbench.action.closeActiveEditor');
        assert.equal(finalFileContents, expectedContents);
    });

    test('Preserve Methods', async function() {
        const filePath = path.join(__dirname, 'examples', 'preserve_methods.php');
        const document = await vscode.workspace.openTextDocument(filePath);
        await vscode.window.showTextDocument(document);

        await vscode.commands.executeCommand('phpgsg.generateGettersAndSetters');
        const finalFileContents = await waitForFileChange();
        const expectedContents = fs.readFileSync(path.join(__dirname, 'examples', 'preserve_methods_result.php'), 'utf-8');

        await vscode.commands.executeCommand('workbench.action.closeActiveEditor');
        assert.equal(finalFileContents, expectedContents);
    });

    test('Multiple Class Preserve Methods', async function() {
        const filePath = path.join(__dirname, 'examples', 'preserve_methods_multiple.php');
        const document = await vscode.workspace.openTextDocument(filePath);
        await vscode.window.showTextDocument(document);

        await vscode.commands.executeCommand('phpgsg.generateGettersAndSetters');
        const finalFileContents = await waitForFileChange();
        const expectedContents = fs.readFileSync(path.join(__dirname, 'examples', 'preserve_methods_multiple_result.php'), 'utf-8');

        await vscode.commands.executeCommand('workbench.action.closeActiveEditor');
        assert.equal(finalFileContents, expectedContents);
    });
});

suite('Class Constructor Testleri', () => {
    test('Normal Class Constructor', async function() {
        const filePath = path.join(__dirname, 'examples', 'class_constructor.php');
        const document = await vscode.workspace.openTextDocument(filePath);
        await vscode.window.showTextDocument(document);

        await vscode.commands.executeCommand('phpgsg.generateConstructor');
        const finalFileContents = await waitForFileChange();
        const expectedContents = fs.readFileSync(path.join(__dirname, 'examples', 'class_constructor_result.php'), 'utf-8');

        await vscode.commands.executeCommand('workbench.action.closeActiveEditor');
        assert.equal(finalFileContents, expectedContents);
    });

    test('Typehinted Class Constructor', async function() {
        const filePath = path.join(__dirname, 'examples', 'typehinted_class_constructor.php');
        const document = await vscode.workspace.openTextDocument(filePath);
        await vscode.window.showTextDocument(document);

        await vscode.commands.executeCommand('phpgsg.generateConstructor');
        const finalFileContents = await waitForFileChange();
        const expectedContents = fs.readFileSync(path.join(__dirname, 'examples', 'typehinted_class_constructor_result.php'), 'utf-8');

        await vscode.commands.executeCommand('workbench.action.closeActiveEditor');
        assert.equal(finalFileContents, expectedContents);
    });

    test('Normal Class Constructor Preserve Old Properties', async function() {
        const filePath = path.join(__dirname, 'examples', 'class_constructor_preserve.php');
        const document = await vscode.workspace.openTextDocument(filePath);
        const testQuickPickItems: tQuickPickItem[] = [];
        await vscode.window.showTextDocument(document);

        ['name', 'createdAt'].forEach(item => {
            testQuickPickItems.push({
                label: `$${item}`,
                description: ``,
                picked: true,
                kind: vscode.QuickPickItemKind.Default,
                className: 'User',
                variable: item,
                name: item.charAt(0).toUpperCase() + item.slice(1),
                getterExists: false,
                setterExists: false,
                constructorArgumentExists: false
            });
        });

        process.env.QUICKPICK_ITEMS = JSON.stringify(testQuickPickItems);

        await vscode.commands.executeCommand('phpgsg.generateConstructor');
        const finalFileContents = await waitForFileChange();
        const expectedContents = fs.readFileSync(path.join(__dirname, 'examples', 'class_constructor_preserve_result.php'), 'utf-8');

        delete process.env.QUICKPICK_ITEMS;
        await vscode.commands.executeCommand('workbench.action.closeActiveEditor');
        assert.equal(finalFileContents, expectedContents);
    });

    test('Typehinted Class Constructor Preserve Old Properties', async function() {
        const filePath = path.join(__dirname, 'examples', 'typehinted_class_constructor_preserve.php');
        const document = await vscode.workspace.openTextDocument(filePath);
        const testQuickPickItems: tQuickPickItem[] = [];
        await vscode.window.showTextDocument(document);

        ['name', 'createdAt'].forEach(item => {
            testQuickPickItems.push({
                label: `$${item}`,
                description: ``,
                picked: true,
                kind: vscode.QuickPickItemKind.Default,
                className: 'User',
                variable: item,
                name: item.charAt(0).toUpperCase() + item.slice(1),
                getterExists: false,
                setterExists: false,
                constructorArgumentExists: false
            });
        });

        process.env.QUICKPICK_ITEMS = JSON.stringify(testQuickPickItems);

        await vscode.commands.executeCommand('phpgsg.generateConstructor');
        const finalFileContents = await waitForFileChange();
        const expectedContents = fs.readFileSync(path.join(__dirname, 'examples', 'typehinted_class_constructor_preserve_result.php'), 'utf-8');

        delete process.env.QUICKPICK_ITEMS;
        await vscode.commands.executeCommand('workbench.action.closeActiveEditor');
        assert.equal(finalFileContents, expectedContents);
    });

    test('Normal Class Constructor Overwrite Old Properties', async function() {
        const filePath = path.join(__dirname, 'examples', 'class_constructor_preserve.php');
        const document = await vscode.workspace.openTextDocument(filePath);
        await vscode.window.showTextDocument(document);

        await vscode.commands.executeCommand('phpgsg.generateConstructor');
        const finalFileContents = await waitForFileChange();
        const expectedContents = fs.readFileSync(path.join(__dirname, 'examples', 'class_constructor_force_result.php'), 'utf-8');

        await vscode.commands.executeCommand('workbench.action.closeActiveEditor');
        assert.equal(finalFileContents, expectedContents);
    });

    test('Typehinted Class Constructor Overwrite Old Properties', async function() {
        const filePath = path.join(__dirname, 'examples', 'typehinted_class_constructor_preserve.php');
        const document = await vscode.workspace.openTextDocument(filePath);
        await vscode.window.showTextDocument(document);

        await vscode.commands.executeCommand('phpgsg.generateConstructor');
        const finalFileContents = await waitForFileChange();
        const expectedContents = fs.readFileSync(path.join(__dirname, 'examples', 'typehinted_class_constructor_force_result.php'), 'utf-8');

        await vscode.commands.executeCommand('workbench.action.closeActiveEditor');
        assert.equal(finalFileContents, expectedContents);
    });
});
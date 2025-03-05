import * as vscode from 'vscode';
import * as path from 'path';
import { Engine } from "php-parser";
import PHPUnparser from './phpUnparser';

interface tQuickPickItem extends vscode.QuickPickItem {
    className?: string,
    name?: string,
    variable?: string,
    getterExists?: boolean,
    setterExists?: boolean
}

export class Application {
    private l10nPath: string
    private document: any;
    private messages: any;
    private config: vscode.WorkspaceConfiguration;

    private classes: any;
    private ast: any;

    constructor(context: vscode.ExtensionContext)
    {
        this.l10nPath = path.join(context.extensionPath, 'l10n');
        this.document = vscode.window.activeTextEditor?.document;
        this.config = vscode.workspace.getConfiguration('phpgsg.getterSetterGenerator');

        try {
            const language = vscode.env.language;
            const l10nFile = language === 'en'
                ? 'bundle.l10n.json'
                : `bundle.l10n.${language}.json`;

            this.messages = require(path.join(this.l10nPath, l10nFile));
        } catch (error) {
            this.messages = require(path.join(this.l10nPath, 'bundle.l10n.json'));
        }

        this.classes = new Map<string, any>();
    }

    private classData(): void
    {
        const text = this.document.getText();

        const parser = new Engine({
            parser: {
                extractDoc: true,
                suppressErrors: false,
                locations: false
            },
            ast: {
                withPositions: true,
                withSource: false,
            },
        });

        this.ast = parser.parseCode(text, '');
        const namespace: any = this.ast.children.find((node: any) => node.kind === 'namespace');
        this.ast = namespace ?? this.ast;

        const getterTemplate = 'class x { public function get{{name}}(): {{nullable}}{{type}} { return $this->{{variable}}; }}';
        const setterTemplate = 'class x { public function set{{name}}({{nullable}}{{type}}${{variable}}): self { $this->{{variable}} = ${{variable}};' + (this.config.get('fluentInterface', true) ? ' return $this;' : '') + '}}';

        const classNodes = this.ast.children.filter((node: any) => node.kind === 'class');

        classNodes.forEach((classNode: any) => {
            let classProperties = new Map<string, any>();
            let generatedGetters = new Map<string, any>();
            let generatedSetters = new Map<string, any>();

            const properties = classNode.body.filter((node: any) => node.kind === 'propertystatement');
            properties.forEach((prop: any) => {
                const property = prop.properties[0];

                if('private' == prop.visibility) {
                    classProperties.set(property.name.name, property);
                    const funcName = property.name.name.charAt(0).toUpperCase() + property.name.name.slice(1);

                    const replacements = {
                        'name': funcName,
                        'variable': property.name.name,
                        'type': property.type ? property.type.name : "",
                        'nullable': property.nullable ? '?' : '',
                    };

                    const propertyGetterTemplate: string = this.replaceTemplate(getterTemplate, replacements);
                    const getterMethod: any = parser.parseEval(propertyGetterTemplate);
                    const propertySetterTemplate: string = this.replaceTemplate(setterTemplate, replacements);
                    const setterMethod: any = parser.parseEval(propertySetterTemplate);

                    generatedGetters.set('get' + funcName, getterMethod.children[0].body[0]);
                    generatedSetters.set('set' + funcName, setterMethod.children[0].body[0]);
                }
            });

            let classMethods = new Map<string, any>();

            const methods = classNode.body.filter((node: any) => node.kind === 'method');
            methods.forEach((method: any) => {
                classMethods.set(method.name.name, method);

                let methodProperty = method.name.name.replace(/^(g|s)et/, '');
                methodProperty = methodProperty.charAt(0).toLowerCase() + methodProperty.slice(1)

                if(classProperties.has(methodProperty)) {
                    const index = classNode.body.findIndex((m: any) => m.kind === "method" && m.name.name === method.name.name);
                    classNode.body.splice(index, 1);
                }
            });

            this.classes.set(classNode.name.name, new Map([
                ['properties', classProperties],
                ['methods', classMethods],
                ['generatedGetters', generatedGetters],
                ['generatedSetters', generatedSetters],
            ]));

        });
    }

    private replaceTemplate(template: string, replacements: Record<string, string>): string
    {
        let result = template;

        result = result.replace(/{{type}}/g, replacements["type"] ?? "");

        if (!replacements["type"]) {
            result = result.replace(/\s*:\s*self/, "");
            result = result.replace(/\s*:\s*/, "");
        }

        Object.keys(replacements).forEach(key => {
            result = result.replace(new RegExp(`{{${key}}}`, "g"), replacements[key]);
        });

        return result;
    }

    private prepareMethods(selectedVars: any, getter: boolean = true, setter: boolean = false): any
    {
        let ret = new Map<string, any>();
        const getterSet = new Set();
        const setterSet = new Set();

        for (let [className, classContent] of this.classes) {
            let methods = new Map<string, any>();

            classContent.get('properties').forEach((prop: any) => {
                const isSelected = selectedVars.some((selected: any) => selected.variable === prop.name.name);
                //const isSelected = selectedVars.some((selected: any) => selected.variable.variable === prop.name.name );
                const propName = prop.name.name.charAt(0).toUpperCase() + prop.name.name.slice(1);
                const getterKey = 'get' + propName;
                const setterKey = 'set' + propName;

                if(getter) {
                    getterSet.add(getterKey);

                    if (classContent.get('methods').has(getterKey)) {
                        const existingMethod = classContent.get('methods').get(getterKey);
                        methods.set(getterKey, existingMethod);
                    } else if(isSelected) {
                        methods.set(getterKey, classContent.get('generatedGetters').get('get' + propName));
                    }
                }

                if(setter) {
                    setterSet.add(setterKey);

                    if (classContent.get('methods').has(setterKey)) {
                        const existingMethod = classContent.get('methods').get(setterKey);
                        methods.set(setterKey, existingMethod);
                    } else if(isSelected) {
                        methods.set(setterKey, classContent.get('generatedSetters').get('set' + propName));
                    }
                }
            });

            ret.set(className, methods);
        }

        return ret;
    }

    private prepareProperties(getter: boolean = true, setter: boolean = false): tQuickPickItem[]
    {
        let quickPickItems: tQuickPickItem[] = [];

        for (let [className, classContent] of this.classes) {
            quickPickItems.push({label: 'class ' + className, kind: vscode.QuickPickItemKind.Separator});

            const properties = classContent.get('properties');

            for(let [property, node] of properties) {
                const propName = node.name.name.charAt(0).toUpperCase() + node.name.name.slice(1);
                const getterExists = classContent.get('methods').has('get' + propName);
                const setterExists = classContent.get('methods').has('set' + propName);

                quickPickItems.push({
                    label: `$${property}`,
                    description: `${node.type?.name ?? ''}${node.nullable ? ' | null' : ''}`,
                    picked: getter && setter ? (!getterExists && !setterExists) : (getter ? !getterExists : (setter ? !setterExists : false)),
                    kind: vscode.QuickPickItemKind.Default,
                    className: className,
                    variable: property,
                    name: propName,
                    getterExists: getterExists,
                    setterExists: setterExists
                });
            }
        }

        return quickPickItems;
    }

    private generateMethods(generateGetters: boolean, generateSetters: boolean, properties: any, selectedVars: any, className:string, classContent: any, classNode: any, methods: any)
    {
        properties.forEach((prop: any) => {
            const isSelected = selectedVars.some((selected: any) => selected.variable === prop.name.name);
            //const isSelected = selectedVars.some((selected: any) => selected.variable.variable === prop.name.name );
            const propName = prop.name.name.charAt(0).toUpperCase() + prop.name.name.slice(1);
            const getterKey = 'get' + propName;
            const setterKey = 'set' + propName;

            if(generateGetters) {
                if (classContent.get('methods').has(getterKey)) {
                    classNode.body.push(classContent.get('methods').get(getterKey));
                } else if(methods.get(className).has(getterKey) && isSelected) {
                    classNode.body.push(methods.get(className).get(getterKey));
                }
            }

            if(generateSetters) {
                if (classContent.get('methods').has(setterKey)) {
                    classNode.body.push(classContent.get('methods').get(setterKey));
                } else if(methods.get(className).has(setterKey) && isSelected) {
                    classNode.body.push(methods.get(className).get(setterKey));
                }
            }
        });
    }

    public async run(generateGetters: boolean = true, generateSetters: boolean = false): Promise<void>
    {
        this.classData();

        if (!this.classes.size) {
            vscode.window.showErrorMessage(this.messages['phpgsg.errors.no_class_found']);
            return;
        }

        const quickPickItems = this.prepareProperties(generateGetters, generateSetters);
        const autoGenerate = this.config.get<boolean>('autoGenerate', false);

        const selectedVars = autoGenerate ? quickPickItems.filter((item: any) => item.kind === 0).map(prop => { return prop; }) : await vscode.window.showQuickPick(quickPickItems,
            {
                placeHolder: this.messages['phpgsg.quickPick.placeholder'],
                canPickMany: true
            }
        ) ?? [];

        if(!selectedVars?.length) {
            return;
        }

        let methods = this.prepareMethods(selectedVars, generateGetters, generateSetters);

        for (let [className, classContent] of this.classes) {
            const classNode = this.ast.children.find((node: any) => node.kind === 'class' && node.name.name === className);
            let properties = classContent.get('properties');

            if(this.messages['phpgsg.config.enum.ascending'] === this.config.get('orderBy')) {
                properties = new Map([...properties].sort((a, b) => a[0].toLowerCase().localeCompare(b[0].toLowerCase())));
            } else if(this.messages['phpgsg.config.enum.descending'] === this.config.get('orderBy')) {
                properties = new Map([...properties].sort((a, b) => b[0].toLowerCase().localeCompare(a[0].toLowerCase())));
            }

            if(this.messages['phpgsg.config.enum.getters_first'] === this.config.get('sortMethods')) {
                this.generateMethods(true, false, properties, selectedVars, className, classContent, classNode, methods);
                this.generateMethods(false, true, properties, selectedVars, className, classContent, classNode, methods);
            } else if(this.messages['phpgsg.config.enum.setters_first'] === this.config.get('sortMethods')) {
                this.generateMethods(false, true, properties, selectedVars, className, classContent, classNode, methods);
                this.generateMethods(true, false, properties, selectedVars, className, classContent, classNode, methods);
            } else {
                this.generateMethods(true, true, properties, selectedVars, className, classContent, classNode, methods);
            }
        };

        const edit = new vscode.WorkspaceEdit();
        const unparser = new PHPUnparser({
            indentSize: this.config.get('indentSize', 4),
            indentWithTab: this.config.get('indentWithTab', false)
        });
        const fullRange = new vscode.Range(
            this.document.positionAt(0),
            this.document.positionAt(this.document.getText().length)
        );
        edit.replace(this.document.uri, fullRange, '<?php\n' + unparser.ast2php(this.ast));

        vscode.workspace.applyEdit(edit).then(success => {
            if (success) {
                vscode.window.showInformationMessage(this.messages['phpgsg.message.success']);
            } else {
                vscode.window.showErrorMessage(this.messages['phpgsg.message.error']);
            }
        });
    }
}
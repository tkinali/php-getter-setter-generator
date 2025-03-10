import * as vscode from 'vscode';
import * as path from 'path';
import { Engine } from "php-parser";
import PHPUnparser from './phpUnparser';

interface tQuickPickItem extends vscode.QuickPickItem {
    className?: string,
    name?: string,
    variable?: string,
    getterExists?: boolean,
    setterExists?: boolean,
    constructorArgumentExists?: boolean
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
                withPositions: false,
                withSource: false,
            },
        });

        this.ast = parser.parseCode(text, '');
        const namespace: any = this.ast.children.find((node: any) => node.kind === 'namespace');
        this.ast = namespace ?? this.ast;

        const constructorTemplate = 'class x { public function __construct() {}}';
        const getterTemplate = 'class x { public function get{{name}}(): {{nullable}}{{type}} { return $this->{{variable}}; }}';
        const setterTemplate = 'class x { public function set{{name}}({{nullable}}{{type}}${{variable}}): self { $this->{{variable}} = ${{variable}};' + (this.config.get('fluentInterface', true) ? ' return $this;' : '') + '}}';

        const classNodes = this.ast.children.filter((node: any) => node.kind === 'class');

        classNodes.forEach((classNode: any) => {
            const classProperties = new Map<string, any>();
            const generatedGetters = new Map<string, any>();
            const generatedSetters = new Map<string, any>();

            const properties = classNode.body.filter((node: any) => node.kind === 'propertystatement');
            properties.forEach((prop: any) => {
                const property = prop.properties[0];
                property.visibility = prop.visibility;

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
            });

            let classMethods = new Map<string, any>();

            let constructorIndex = classNode.body.findIndex((m: any) => m.kind === "method" && m.name.name === '__construct');
            const firstMethodIndex = classNode.body.findIndex((m: any) => m.kind === "method");
            let constructorMethod: any;
            if(-1 === constructorIndex) {
                constructorMethod = parser.parseEval(constructorTemplate);
                constructorMethod = constructorMethod.children[0].body[0];

                if(-1 === firstMethodIndex) {
                    classNode.body.push(constructorMethod);
                    constructorIndex = classNode.body.size;
                } else {
                    classNode.body.splice(firstMethodIndex, 0, constructorMethod);
                    constructorIndex = firstMethodIndex;
                }
            } else {
                constructorMethod = classNode.body[constructorIndex];
            }

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
                ['constructorMethod', constructorMethod],
                ['constructorIndex', constructorIndex],
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

    private prepareProperties(getter: boolean = true, setter: boolean = false, constructor: boolean = false): tQuickPickItem[]
    {
        let quickPickItems: tQuickPickItem[] = [];

        for (let [className, classContent] of this.classes) {
            quickPickItems.push({label: 'class ' + className, kind: vscode.QuickPickItemKind.Separator});

            const properties = classContent.get('properties');

            for(let [property, node] of properties) {
                if(constructor ? true : 'private' == node.visibility) {
                    const propName = node.name.name.charAt(0).toUpperCase() + node.name.name.slice(1);
                    const getterExists = classContent.get('methods').has('get' + propName);
                    const setterExists = classContent.get('methods').has('set' + propName);
                    const constructorArgumentExists = classContent.get('constructorMethod').arguments.filter((item: any) => item.name.name === node.name.name).length > 0;

                    const descriptions = [node.visibility];
                    if(node.type?.name) {
                        descriptions.push(node.type?.name);
                    }
                    if(node.nullable) {
                        descriptions.push('null');
                    }

                    quickPickItems.push({
                        label: `$${property}`,
                        description: `${descriptions.join(' | ')}`,
                        picked: constructor ? !constructorArgumentExists : (getter && setter ? (!getterExists && !setterExists) : (getter ? !getterExists : (setter ? !setterExists : false))),
                        kind: vscode.QuickPickItemKind.Default,
                        className: className,
                        variable: property,
                        name: propName,
                        getterExists: getterExists,
                        setterExists: setterExists,
                        constructorArgumentExists: constructorArgumentExists
                    });
                }
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

        if (this.classes.size === 0) {
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
        edit.replace(this.document.uri, fullRange, '<?php\n\n' + unparser.ast2php(this.ast));

        vscode.workspace.applyEdit(edit).then(success => {
            if (success) {
                vscode.window.showInformationMessage(this.messages['phpgsg.message.success']);
            } else {
                vscode.window.showErrorMessage(this.messages['phpgsg.message.error']);
            }
        });
    }

    public async generateConstructor()
    {
        this.classData();

        if (this.classes.size === 0) {
            vscode.window.showErrorMessage(this.messages['phpgsg.errors.no_class_found']);
            return;
        }

        const quickPickItems = this.prepareProperties(false, false, true);
        const selectedVars = await vscode.window.showQuickPick(quickPickItems,
            {
                placeHolder: this.messages['phpgsg.quickPick.constructor_placeholder'],
                canPickMany: true
            }
        );

        if(!selectedVars?.length) {
            return;
        }

        for (let [className, classContent] of this.classes) {
            const classNode = this.ast.children.find((node: any) => node.kind === 'class' && node.name.name === className);
            const parameterNode = classContent.get('parameterNode');
            let properties = classContent.get('properties');
            let constructorMethod = classContent.get('constructorMethod');

            const constructorMethodArguments = new Map<string, any>();
            const constructorBody = new Map<string, any>();
            constructorMethod.arguments.forEach((node: any) => {
                constructorMethodArguments.set(node.name.name, node);
            });
            constructorMethod.arguments.splice(0, constructorMethod.arguments.length);

            const children = constructorMethod.body.children;
            let index = children.length -1;
            while (index >= 0) {
                let node = children[index];
                if(node?.expression?.left?.what?.kind === 'variable' && node?.expression?.left?.what?.name === 'this' && properties.has(node.expression.left.offset.name)) {
                    constructorBody.set(node.expression.left.offset.name, node);
                    children.splice(index, 1);
                }
                index -= 1;
            }

            properties.forEach((prop: any) => {
                const isSelected = selectedVars.some((selected: any) => selected.variable === prop.name.name);

                if(constructorMethodArguments.has(prop.name.name)) {
                    if(isSelected) {
                        const parameterNode = {
                            kind: 'parameter',
                            attrGroups: [],
                            byref: false,
                            flags: 0,
                            name: prop.name,
                            nullable: prop.nullable,
                            readonly: prop.readonly,
                            type: prop.type,
                            value: prop.value,
                            variadic: false,
                        };

                        constructorMethod.arguments.push(parameterNode);
                    } else {
                        constructorMethod.arguments.push(constructorMethodArguments.get(prop.name.name));
                    }
                } else if(isSelected) {
                    const parameterNode = {
                        kind: 'parameter',
                        attrGroups: [],
                        byref: false,
                        flags: 0,
                        name: prop.name,
                        nullable: prop.nullable,
                        readonly: prop.readonly,
                        type: prop.type,
                        value: prop.value,
                        variadic: false,
                    };

                    constructorMethod.arguments.push(parameterNode);
                }
            });

            let reversedProperties = new Map(constructorMethod.arguments.reverse().map((obj: any) => [obj.name.name, obj]));

            reversedProperties.forEach((prop: any) => {
                const expressionstatement = {
                    kind: 'expressionstatement',
                    expression: {
                        kind: 'assign',
                        left: {
                            kind: 'propertylookup',
                            offset: {
                                kind: 'identifier',
                                name: prop.name.name
                            },
                            what: {
                                kind: 'variable',
                                curly: false,
                                name: 'this'
                            }
                        },
                        operator: '=',
                        right: {
                            kind: 'variable',
                            curly: false,
                            name: prop.name.name
                        }
                    }
                };

                constructorMethod.body.children.unshift(expressionstatement);
            });

            constructorMethod.arguments.reverse();
        }

        const edit = new vscode.WorkspaceEdit();
        const unparser = new PHPUnparser({
            indentSize: this.config.get('indentSize', 4),
            indentWithTab: this.config.get('indentWithTab', false)
        });
        const fullRange = new vscode.Range(
            this.document.positionAt(0),
            this.document.positionAt(this.document.getText().length)
        );
        edit.replace(this.document.uri, fullRange, '<?php\n\n' + unparser.ast2php(this.ast));

        vscode.workspace.applyEdit(edit).then(success => {
            if (success) {
                vscode.window.showInformationMessage(this.messages['phpgsg.message.constructor_success']);
            } else {
                vscode.window.showErrorMessage(this.messages['phpgsg.message.constructor_error']);
            }
        });
    }
}
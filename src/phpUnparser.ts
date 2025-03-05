export default class PHPUnparser {
    private options: any;

    constructor(options: any = {
        indentSize: 4,
        indentWithTab: false
    }) {

        this.options = options;
    }

    public ast2php(ast: any) {
        let code = this.generatePHPCode(ast);

        return code.trim();
    }

    generatePHPCode(node: any, indentLevel: number = 0): string {
        const indent = this.options.indentWithTab ? "\t".repeat(indentLevel) : " ".repeat(indentLevel * this.options.indentSize);

        if (Array.isArray(node)) {
            return node
                .map((child) =>
                    this.generatePHPCode(child, indentLevel)
                )
                .join("");
        }

        switch (node.kind) {
            case "program":
                return `${node.children.map((item: any) => this.generatePHPCode(item, indentLevel)).join(`\n`) || ''}`;

            case "noop":
                return `${node.leadingComments?.map((item: any) => this.generatePHPCode(item, indentLevel)).join(`\n`)}`;

            case "commentblock":
                const commentBlock = node.value;
                return commentBlock;
            case "commentline":
                return node.value;

            case "echo":
                let echoLeadingComments = this.leadingComments(node, indentLevel);
                echoLeadingComments = (echoLeadingComments && `\n${indent}${echoLeadingComments.trim()}\n${indent}`) || `\n${indent}`;

                return `${echoLeadingComments}echo ${node.expressions.map((item: any) => this.generatePHPCode(item, indentLevel).trim())};`;

            case "bin":
                const binContent = `${this.generatePHPCode(node.left, indentLevel).trim()} ${node.nullable ? '?' : ''}${node.type} ${this.generatePHPCode(node.right, indentLevel).trim()}`;
                return `${node.parenthesizedExpression ? `(${binContent})` : ` ${binContent}`}`;

            case "variable":
                return `$${node.name}`;

            case "string":
                return `${node.parenthesizedExpression ? `(${node.raw})` : `${node.raw}`}`;

            case "call":
                return `${this.generatePHPCode(node.what, indentLevel)}(${node.arguments.map((item: any) => this.generatePHPCode(item, indentLevel).trim()).join(", ")})`;

            case "propertylookup":
                return `${this.generatePHPCode(node.what, indentLevel)}->${this.generatePHPCode(node.offset, indentLevel)}`;

            case "identifier":
                return `${node.name}`;

            case "expressionstatement":
                const expressionStatementLeadingComments = this.leadingComments(node, indentLevel);
                return `${expressionStatementLeadingComments ? expressionStatementLeadingComments.trim() + '\n' + indent : ''}${this.generatePHPCode(node.expression, indentLevel)};`;

            case "namespace":
                let namespaceLeadingComments = this.leadingComments(node, indentLevel);
                let namespaceTrailingComments = this.trailingComments(node, indentLevel);

                namespaceLeadingComments = (namespaceLeadingComments && `\n${namespaceLeadingComments}`) || '\n';
                namespaceTrailingComments = (namespaceTrailingComments && `\n${namespaceTrailingComments}`) || '\n';

                const namespaceBody = node.children.map((item: any) => this.generatePHPCode(item, node.withBrackets ? indentLevel + 1 : indentLevel)).join(`\n`);
                return `${namespaceLeadingComments}namespace ${node.name}${node.withBrackets ? ` {\n${namespaceBody}\n}` : `;\n\n${namespaceBody}`}\n${namespaceTrailingComments}`;

            case "interface":
                let interfaceLeadingComments = this.leadingComments(node, indentLevel);
                interfaceLeadingComments = (interfaceLeadingComments && `\n${interfaceLeadingComments}`) || '\n';

                const interfaceBody = node.body ? node.body.map((item: any) => this.generatePHPCode(item, indentLevel + 1)).join("\n") : '';

                return `${interfaceLeadingComments}${this.isAbstract(node)}${this.isFinal(node)}interface ${node.name.name}${(node.extends && ` extends ${node.extends.map((item: any) => this.generatePHPCode(item, indentLevel)).join(', ')}`) || ''}${(interfaceBody && `\n{\n${interfaceBody}\n}`) || ''}`;

            case "block":
                return `${indent}${node.children.map((item: any) => this.generatePHPCode(item, indentLevel)).join(`\n${indent}`)}`;

            case "name":
                return `${node.name}`;

            case "parameter":
                let type: string | null = '';
                if (node.type) {
                    switch (node.type.kind) {
                        case "uniontype":
                            type = node.type.types.map((item: any) => this.generatePHPCode(item, indentLevel)).join('|');
                            break;
                        case "typereference":
                            type = `${node.nullable ? '?' : ''}${node.type.raw}`;
                            break;
                        case "name":
                            type = `${node.nullable ? '?' : ''}${node.type.name}`;
                            break;
                    }
                }
                return `${type}${node.byref ? '&' : ''} $${node.name.name}`.trim();

            case "typereference":
                return `${node.name}`;

            case "trait":
                let traitLeadingComments = this.leadingComments(node, indentLevel);
                traitLeadingComments = (traitLeadingComments && `\n${indent}${traitLeadingComments}${indent}`) || `\n${indent}`;
                const traitBody = node.body ? node.body.map((item: any) => this.generatePHPCode(item, indentLevel + 1)).join("\n") : '';

                return `${traitLeadingComments}${this.isAbstract(node)}${this.isFinal(node)}trait ${node.name.name}${(node.extends && ` extends ${node.extends.map((item: any) => this.generatePHPCode(item, indentLevel)).join(', ')}`) || ''}${(traitBody && `\n{\n${traitBody}\n}`) || ''}`;

            case "encapsed":
                return `${node.parenthesizedExpression ? `("${node.value.map((item: any) => this.generatePHPCode(item, indentLevel)).join(' ')}")` : ` ${node.raw}`}`;

            case "encapsedpart":
                return `${this.generatePHPCode(node.expression, indentLevel)}`;

            case "assign":
                return `${this.generatePHPCode(node.left, indentLevel).trim()} ${node.operator} ${this.generatePHPCode(node.right, indentLevel).trim()}`;

            case "array":
                const arrayItems = node.items.map((item: any) => this.generatePHPCode(item, indentLevel + 1)).join(`,\n${indent}`);
                return `${node.shortForm ? `[${arrayItems.trim() ? `\n${indent}${arrayItems}\n` : ''}]` : `array(${arrayItems.trim() ? `\n${arrayItems}\n` : ''})`}`;

            case "entry":
                return `${node.key ? `${this.generatePHPCode(node.key, indentLevel)} => ` : ''}${this.generatePHPCode(node.value, indentLevel)}`;

            case "global":
                return `global ${node.items.map((item: any) => this.generatePHPCode(item, indentLevel)).join(', ')};`;

            case "foreach":
                const foreachBody = node.body ? this.generatePHPCode(node.body, indentLevel + 1) : '';
                return `foreach(${this.generatePHPCode(node.source, indentLevel)} as ${node.key ? `${this.generatePHPCode(node.key, indentLevel)} => ` : ''}${this.generatePHPCode(node.value, indentLevel)})${node.shortForm ? `:\n${indent}${foreachBody}\n${indent}endforeach;` : `\n${indent}{\n${foreachBody}\n${indent}}`}`;

            case "for":
                const forBody = node.body ? this.generatePHPCode(node.body, indentLevel + 1) : '';
                return `for(${this.generatePHPCode(node.init, indentLevel).trim()}; ${this.generatePHPCode(node.test, indentLevel).trim()}; ${this.generatePHPCode(node.increment, indentLevel).trim()})${node.shortForm ? `:\n${indent}${forBody}\n${indent}endfor;` : `\n${indent}{\n${forBody}\n${indent}}`}`;

            case "post":
                return `$${this.generatePHPCode(node.what, indentLevel)}${node.type.repeat(2)}`;

            case "number":
                return node.value;

            case "yield":
                return `yield ${node.key ? `${this.generatePHPCode(node.key, indentLevel)} => ` : ''}${this.generatePHPCode(node.value, indentLevel)}`;

            case "yieldfrom":
                return `yield from ${this.generatePHPCode(node.value, indentLevel)}`;

            case "nowdoc":
                return node.raw;

            case "function":
                let functionLeadingComments = this.leadingComments(node, indentLevel);
                functionLeadingComments = (functionLeadingComments && `\n${indent}${functionLeadingComments}${indent}`) || `${indent}`;

                let functionAttrGroups = this.attrGroups(node, indentLevel);
                functionAttrGroups = (functionAttrGroups && `\n${indent}${functionAttrGroups}`) || ``;

                const functionBody = node.body ? this.generatePHPCode(node.body, indentLevel + 1) : '';
                return `${functionAttrGroups}${functionLeadingComments}${this.isAbstract(node)}${this.isFinal(node)}${(node.visibility && `${node.visibility} `) || ''}${this.isStatic(node)}function ${node.name.name}(${node.arguments.map((item: any) => this.generatePHPCode(item, indentLevel)).join(', ') || ''})${node.type ? `: ${node.nullable ? '?' : ''}${this.generatePHPCode(node.type, indentLevel)}` : ''}${functionBody ? `\n${indent}{\n${functionBody}\n${indent}}` : ';'}`;

            case "method":
                let methodLeadingComments = this.leadingComments(node, indentLevel);
                methodLeadingComments = (methodLeadingComments && `\n${indent}${methodLeadingComments}${indent}`) || `\n${indent}`;

                let methodAttrGroups = this.attrGroups(node, indentLevel);
                methodAttrGroups = (methodAttrGroups && `\n${indent}${methodAttrGroups}`) || ``;

                const methodBody = node.body ? this.generatePHPCode(node.body, indentLevel + 1) : '';

                return `${methodAttrGroups.trimEnd()}${methodLeadingComments}${this.isAbstract(node)}${this.isFinal(node)}${(node.visibility && `${node.visibility} `) || ''}${this.isStatic(node)}function ${node.name.name}(${node.arguments.map((item: any) => this.generatePHPCode(item, indentLevel)).join(', ') || ''})${node.type ? `: ${node.nullable ? '?' : ''}${this.generatePHPCode(node.type, indentLevel)}` : ''}${methodBody ? `\n${indent}{\n${methodBody}\n${indent}}` : ';'}`;

            case "class":
                let classLeadingComments = this.leadingComments(node, indentLevel);
                classLeadingComments = (classLeadingComments && `${indent}${classLeadingComments}`) || `${indent}`;

                let classAttrGroups = this.attrGroups(node, indentLevel);
                classAttrGroups = (classAttrGroups && `${classAttrGroups}`) || `${indent}`;

                const classBody = node.body ? this.generatePHPCode(this.block(node.body), indentLevel + 1) : '';

                return `\n${classAttrGroups}${classLeadingComments}${this.isAbstract(node)}${this.isFinal(node)}class ${node.name?.name || ''}${(node.extends && ` extends ${Array.isArray(node.extends) ? node.extends.map((item: any) => this.generatePHPCode(item, indentLevel)).join(', ') : (node.extends ? this.generatePHPCode(node.extends, indentLevel) : '')}`) || ''}${(node.implements && ` implements ${node.implements.map((item: any) => this.generatePHPCode(item, indentLevel)).join(', ')}`) || ''}${(classBody && `\n{\n${classBody}\n}`) || ''}`;

            case "propertystatement":
                let propertyLeadingComments = this.leadingComments(node, indentLevel);
                propertyLeadingComments = (propertyLeadingComments && `\n${indent}${propertyLeadingComments}${indent}`) || ``;

                let propertyAttrGroups = this.attrGroups(node.properties[0], indentLevel);
                propertyAttrGroups = propertyAttrGroups ? propertyAttrGroups.replace(/\n/g, `\n${indent}`) : '';
                propertyAttrGroups = (propertyAttrGroups && `\n${indent}${propertyAttrGroups}`) || ``;

                const properties = node.properties ? this.generatePHPCode(this.block(node.properties), indentLevel).trim() : '';

                return `${propertyAttrGroups}${propertyLeadingComments}${node.visibility} ${this.isStatic(node)}${properties}`;

            case "property":

                return `${this.isReadOnly(node)}${node.nullable ? '?' : ''}${null != node.type ? this.generatePHPCode(node.type, indentLevel).trim() : ''} $${this.generatePHPCode(node.name, indentLevel).trim()}${node.value ? ` = ${this.generatePHPCode(node.value, indentLevel).trim()}` : ''};`;

            case "traituse":
                const traits = node.traits.map((item: any) => this.generatePHPCode(item, indentLevel)).join(`, `);
                return `use ${traits};`;

            case "return":
                return `return ${this.generatePHPCode(node.expr, indentLevel).trim()};`;

            case "new":
                return `new ${this.generatePHPCode(node.what, indentLevel)}${node.arguments.length ? `(${node.arguments.map((item: any) => this.generatePHPCode(item, indentLevel)).join(', ')})` : ''}`;

            case "closure":
                const closureBody = node.body ? this.generatePHPCode(node.body, indentLevel + 1) : '';
                return `function(${node.arguments.map((item: any) => this.generatePHPCode(item, indentLevel)).join(', ')})${node.uses.length ? ` use(${node.uses.map((item: any) => this.generatePHPCode(item, indentLevel)).join(', ')})` : ''}${node.type ? `: ${node.nullable ? '?' : ''}${this.generatePHPCode(node.type, indentLevel)}` : ''}\n${indent}{\n${closureBody}\n${indent}}`;

            case "try":

                let tryLeadingComments = this.leadingComments(node, indentLevel);
                tryLeadingComments = (tryLeadingComments && `${indent}${tryLeadingComments}`) || `${indent}`;
                const tryBody = node.body ? this.generatePHPCode(node.body, indentLevel + 1) : '';
                const tryCatches = node.catches.map((item: any) => this.generatePHPCode(item, indentLevel + 1)).join(`\n${indent}`);
                const tryAlways = node.always ? this.generatePHPCode(node.always, indentLevel) : '';
                return `${tryLeadingComments}try {\n${indent}${tryBody}\n${indent}} ${tryCatches}${tryAlways ? ` finally {\n${indent}${tryAlways}\n${indent}}` : ''}`;

            case "catch":
                const catchBody = node.body ? this.generatePHPCode(node.body, indentLevel) : '';
                return `catch (${this.generatePHPCode(node.what, indentLevel)} ${this.generatePHPCode(node.variable, indentLevel)}) {\n${catchBody}\n}`;

            case "offsetlookup":
                return `${this.generatePHPCode(node.what, indentLevel)}[${node.offset ? this.generatePHPCode(node.offset, indentLevel) : ''}]`;

            case "nullkeyword":
                return node.raw;

            case "if":
                let ifLeadingComments = this.leadingComments(node, indentLevel);
                ifLeadingComments = (ifLeadingComments && `\n${indent}${ifLeadingComments}${indent}`) || ``;

                const ifBody = 'block' == node.body.kind ? node.body : this.block(node.body);
                let ifAlternate = node.alternate && ('block' == node.alternate.kind) ? node.alternate : (node.alternate ? this.block(node.alternate) : null);
                let ia: string = '';

                if(node.alternate && ifAlternate.children[0].kind != 'block' && ifAlternate.children[0].kind != 'if') {
                    ia = ` {\n${this.generatePHPCode(ifAlternate, indentLevel + 1)}\n${indent}}`;
                } else {
                    ia = node.alternate ? this.generatePHPCode(ifAlternate, indentLevel).trim() : '';
                }

                return `${ifLeadingComments}if(${this.generatePHPCode(node.test, indentLevel).trim()})${node.shortForm ? `:\n${this.generatePHPCode(ifBody, indentLevel + 1)}\n` : ` {\n${this.generatePHPCode(ifBody, indentLevel + 1)}\n${indent}}`}${node.alternate ? ` else${ia}` : ''}`;

            case "staticlookup":
                return `${this.generatePHPCode(node.what, indentLevel)}::${this.generatePHPCode(node.offset, indentLevel)}`;

            case "selfreference":
                return node.raw;

            case "usegroup":
                return `use ${this.generatePHPCode(node.items, indentLevel)}`;

            case "useitem":
                return `${node.name}${node.alias ? ` as ${this.generatePHPCode(node.alias, indentLevel)}` : '' };`;

            case "boolean":
                return node.raw;

            case "unary":
                return `!${this.generatePHPCode(node.what, indentLevel)}`;

            case "attrgroup":
                return `#[${node.attrs.map((item: any) => this.generatePHPCode(item, indentLevel)).join(', ')}]`;

            case "attribute":
                return `${node.name}${node.args.length ? `(${node.args.map((item: any) => this.generatePHPCode(item, indentLevel).replace(/\n/gm, '').replaceAll(indent, '')).join(', ')})` : ''}`;

            case "namedargument":
                return `${node.name}: ${this.generatePHPCode(node.value, indentLevel)}`;

            default:
                console.log(node);
                console.warn(`Unhandled node kind: ${node.kind}`);
                return ``;
        }
    }

    private leadingComments(node: any, indentLevel: number): string {
        return `${node.leadingComments ? node.leadingComments?.map((item: any) => this.generatePHPCode(item, indentLevel).trimEnd()).join("\n") + "\n" : ''}`;
    }

    private attrGroups(node: any, indentLevel: number): string  {
        return `${node.attrGroups ? node.attrGroups?.map((item: any) => this.generatePHPCode(item, indentLevel).trimEnd()).join("\n") + "\n" : ''}`;
    }

    private trailingComments(node: any, indentLevel: number): string {
        return `${node.trailingComments ? node.trailingComments?.map((item: any) => this.generatePHPCode(item, indentLevel).trimEnd()).join("\n") + "\n" : ''}`;
    }

    private block(node: any): any {
        return {
            kind: 'block',
            children: Array.isArray(node) ? node : [node]
        };
    }

    private isAbstract(node: any): string {
        return `${(node.isAbstract && 'abstract ') || ''}`;
    }

    private isFinal(node: any): string {
        return `${(node.isFinal && 'final ') || ''}`;
    }

    private isReadOnly(node: any): string {
        return `${(node.readonly && 'readonly ') || ''}`;
    }

    private isStatic(node: any): string {
        return `${(node.isStatic && 'static ') || ''}`;
    }
}
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
        code = code.replace(/\{\n\ +(\n\ +)/gm, '{$1');
        code = code.replace(/\n\n/gm, '\n');

        return code.trim();
    }

    generatePHPCode(node: any, indentLevel: number = 0): string {
        const indent = this.options.indentWithTab ? "\t".repeat(indentLevel) : " ".repeat(indentLevel * this.options.indentSize);
        let leadingComments: any, trailingComments: any, attrGroups: any;

        if (Array.isArray(node)) {
            return node
                .map((child) =>
                    this.generatePHPCode(child, indentLevel)
                )
                .join("");
        }

        //console.log(node, indentLevel);

        switch (node.kind) {
            case "program":
                return `${node.children.map((item: any) => this.generatePHPCode(item, indentLevel)).join(`\n`) || ''}`;

            case "noop":
                //console.log(node);
                return `${node.leadingComments?.map((item: any) => this.generatePHPCode(item, indentLevel)).join(`\n`)}`;

            case "commentblock":
                //console.log(node);
                //const commentBlock = node.value.replace(/^\s+/gm, " ".repeat((indentLevel * this.options.indentSize) + 1));
                const commentBlock = node.value;
                return commentBlock;
            case "commentline":
                //console.log(node);
                return node.value.trim();

            case "echo":
                //console.log(node);
                leadingComments = this.leadingComments(node, indentLevel, indent);

                return `${leadingComments}echo ${node.expressions.map((item: any) => this.generatePHPCode(item, indentLevel).trim()).join(', ')};`;

            case "bin":
                //console.log(node);
                const binContent = `${this.generatePHPCode(node.left, indentLevel).trim()} ${node.nullable ? '?' : ''}${node.type} ${this.generatePHPCode(node.right, indentLevel).trim()}`;
                return `${node.parenthesizedExpression ? `(${binContent})` : ` ${binContent}`}`;

            case "variable":
                //console.log(node);
                return `$${node.name}`;

            case "string":
                //console.log(node);
                return `${node.parenthesizedExpression ? `(${node.raw})` : `${node.raw}`}`;

            case "call":
                //console.log(node);
                return `${this.generatePHPCode(node.what, indentLevel)}(${node.arguments.map((item: any) => this.generatePHPCode(item, indentLevel).trim()).join(", ")})`;

            case "propertylookup":
                //console.log(node);
                return `${this.generatePHPCode(node.what, indentLevel)}->${this.generatePHPCode(node.offset, indentLevel)}`;

            case "identifier":
                //console.log(node);
                return `${node.name}`;

            case "expressionstatement":
                //console.log(node);
                leadingComments = this.leadingComments(node, indentLevel, indent);
                return `${leadingComments}${this.generatePHPCode(node.expression, indentLevel)};`;

            case "namespace":
                //console.log(node);
                leadingComments = this.leadingComments(node, indentLevel, indent);
                trailingComments = this.trailingComments(node, indentLevel, indent);

                const namespaceBody = node.children.map((item: any) => this.generatePHPCode(item, node.withBrackets ? indentLevel + 1 : indentLevel)).join(`\n`);
                return `\n${leadingComments}namespace ${node.name}${node.withBrackets ? ` {\n${namespaceBody}\n}` : `;\n\n${namespaceBody}`}\n${trailingComments}`;

            case "interface":
                //console.log(node);
                leadingComments = this.leadingComments(node, indentLevel, indent);

                const interfaceBody = node.body ? this.generatePHPCode(this.block(node.body), indentLevel + 1) : '';

                return `${leadingComments}${this.isAbstract(node)}${this.isFinal(node)}interface ${node.name.name}${(node.extends && ` extends ${node.extends.map((item: any) => this.generatePHPCode(item, indentLevel)).join(', ')}`) || ''}${(interfaceBody && `\n{\n${interfaceBody}\n}`) || ''}`;

            case "block":
                //console.log(node.children);
                return `${indent}${node.children.map((item: any) => this.generatePHPCode(item, indentLevel)).join(`\n${indent}`)}`;

            case "name":
                //console.log(node);
                return `${node.name}`;

            case "parameter":
                //console.log(node);
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
                //console.log(node);
                return `${node.name}`;

            case "trait":
                //console.log(node);
                leadingComments = this.leadingComments(node, indentLevel, indent);
                const traitBody = node.body ? this.generatePHPCode(this.block(node.body), indentLevel + 1) : '';

                return `${leadingComments}${this.isAbstract(node)}${this.isFinal(node)}trait ${node.name.name}${(node.extends && ` extends ${node.extends.map((item: any) => this.generatePHPCode(item, indentLevel)).join(', ')}`) || ''}${(traitBody && `\n{\n${traitBody}\n}`) || ''}`;

            case "encapsed":
                //console.log(node);
                return `${node.parenthesizedExpression ? `("${node.value.map((item: any) => this.generatePHPCode(item, indentLevel)).join(' ')}")` : ` ${node.raw}`}`;

            case "encapsedpart":
                //console.log(node);
                return `${this.generatePHPCode(node.expression, indentLevel)}`;

            case "assign":
                //console.log(node);
                return `${this.generatePHPCode(node.left, indentLevel).trim()} ${node.operator} ${this.generatePHPCode(node.right, indentLevel).trim()}`;

            case "array":
                //console.log(node);
                const arrayItems = node.items.map((item: any) => (this.options.indentWithTab ? "\t" : " ".repeat((indentLevel+1) * this.options.indentSize)) + this.generatePHPCode(item, indentLevel + 1)).join(`,\n`);

                return `${node.shortForm ? `[${arrayItems.trim() ? `\n${arrayItems}\n${indent}` : ''}]` : `array(${arrayItems.trim() ? `\n${arrayItems}\n${indent}` : ''})`}`;

            case "entry":
                //console.log(node);
                return `${node.key ? `${this.generatePHPCode(node.key, indentLevel)} => ` : ''}${this.generatePHPCode(node.value, indentLevel)}`;

            case "global":
                //console.log(node);
                return `global ${node.items.map((item: any) => this.generatePHPCode(item, indentLevel)).join(', ')};`;

            case "foreach":
                //console.log(node);
                const foreachBody = node.body ? this.generatePHPCode(node.body, indentLevel + 1) : '';
                return `foreach(${this.generatePHPCode(node.source, indentLevel)} as ${node.key ? `${this.generatePHPCode(node.key, indentLevel)} => ` : ''}${this.generatePHPCode(node.value, indentLevel)})${node.shortForm ? `:\n${indent}${foreachBody}\n${indent}endforeach;` : `\n${indent}{\n${foreachBody}\n${indent}}`}\n`;

            case "for":
                //console.log(node);
                const forBody = node.body ? this.generatePHPCode(node.body, indentLevel + 1) : '';
                return `for(${this.generatePHPCode(node.init, indentLevel).trim()}; ${this.generatePHPCode(node.test, indentLevel).trim()}; ${this.generatePHPCode(node.increment, indentLevel).trim()})${node.shortForm ? `:\n${indent}${forBody}\n${indent}endfor;` : `\n${indent}{\n${forBody}\n${indent}}`}`;

            case "post":
                //console.log(node);
                return `${this.generatePHPCode(node.what, indentLevel)}${node.type.repeat(2)}`;

            case "number":
                leadingComments = this.leadingComments(node, indentLevel);
                return `${leadingComments ? `${leadingComments.trim()} ` : ''}${node.value}`;

            case "yield":
                //console.log(node);
                return `yield ${node.key ? `${this.generatePHPCode(node.key, indentLevel)} => ` : ''}${this.generatePHPCode(node.value, indentLevel)}`;

            case "yieldfrom":
                //console.log(node);
                return `yield from ${this.generatePHPCode(node.value, indentLevel)}`;

            case "nowdoc":
                //console.log(node);
                return node.raw;

            case "function":
                //console.log(node);
                leadingComments = this.leadingComments(node, indentLevel, indent);
                attrGroups = this.attrGroups(node, indentLevel, indent);

                const functionBody = node.body ? this.generatePHPCode(node.body, indentLevel + 1) : '';
                return `\n${indent}${attrGroups}${leadingComments}${this.isAbstract(node)}${this.isFinal(node)}${(node.visibility && `${node.visibility} `) || ''}${this.isStatic(node)}function ${node.name.name}(${node.arguments.map((item: any) => this.generatePHPCode(item, indentLevel)).join(', ') || ''})${node.type ? `: ${node.nullable ? '?' : ''}${this.generatePHPCode(node.type, indentLevel)}` : ''}${functionBody ? `\n${indent}{\n${functionBody}\n${indent}}` : ';'}\n`;

            case "method":
                //console.log(node);
                leadingComments = this.leadingComments(node, indentLevel, indent);
                attrGroups = this.attrGroups(node, indentLevel, indent);
                const methodBody = node.body ? this.generatePHPCode(node.body, indentLevel + 1) : '';

                return `\n${indent}${attrGroups}${leadingComments}${this.isAbstract(node)}${this.isFinal(node)}${(node.visibility && `${node.visibility} `) || ''}${this.isStatic(node)}function ${node.name.name}(${node.arguments.map((item: any) => this.generatePHPCode(item, indentLevel)).join(', ') || ''})${node.type ? `: ${node.nullable ? '?' : ''}${this.generatePHPCode(node.type, indentLevel)}` : ''}${methodBody ? `\n${indent}{\n${methodBody}\n${indent}}` : ';'}`;

            case "class":
                //console.log(node);
                leadingComments = this.leadingComments(node, indentLevel, indent);
                attrGroups = this.attrGroups(node, indentLevel, indent);
                const classBody = node.body ? this.generatePHPCode(this.block(node.body), indentLevel + 1) : '';

                return `${node.isAnonymous ? '' : '\n'}${attrGroups}${leadingComments}${this.isAbstract(node)}${this.isFinal(node)}class ${node.name?.name || ''}${(node.extends && ` extends ${Array.isArray(node.extends) ? node.extends.map((item: any) => this.generatePHPCode(item, indentLevel)).join(', ') : (node.extends ? this.generatePHPCode(node.extends, indentLevel) : '')}`) || ''}${(node.implements && ` implements ${node.implements.map((item: any) => this.generatePHPCode(item, indentLevel)).join(', ')}`) || ''}${(classBody && `\n{\n${classBody}\n}`) || ''}`;

            case "propertystatement":
                //console.log(node);
                leadingComments = this.leadingComments(node, indentLevel, indent);
                attrGroups = this.attrGroups(node.properties[0], indentLevel, indent);

                const properties = node.properties ? this.generatePHPCode(this.block(node.properties), indentLevel).trim() : '';

                return `${attrGroups}${leadingComments}${node.visibility} ${this.isStatic(node)}${properties}`;

            case "property":
                //console.log(node);

                return `${this.isReadOnly(node)}${node.nullable ? '?' : ''}${null != node.type ? this.generatePHPCode(node.type, indentLevel).trim() : ''} $${this.generatePHPCode(node.name, indentLevel).trim()}${node.value ? ` = ${this.generatePHPCode(node.value, indentLevel).trim()}` : ''};`;

            case "traituse":
                //console.log(node);
                const traits = node.traits.map((item: any) => this.generatePHPCode(item, indentLevel)).join(`, `);
                return `use ${traits};`;

            case "return":
                //console.log(node);
                return `return ${this.generatePHPCode(node.expr, indentLevel).trim()};`;

            case "new":
                //console.log(node);
                return `new ${this.generatePHPCode(node.what, indentLevel)}${node.arguments.length ? `(${node.arguments.map((item: any) => this.generatePHPCode(item, indentLevel)).join(', ')})` : ''}`;

            case "closure":
                //console.log(node);
                leadingComments = this.leadingComments(node, indentLevel, indent);
                const closureBody = node.body ? this.generatePHPCode(node.body, indentLevel + 1) : '';
                return `${leadingComments}function(${node.arguments.map((item: any) => this.generatePHPCode(item, indentLevel)).join(', ')})${node.uses.length ? ` use(${node.uses.map((item: any) => this.generatePHPCode(item, indentLevel)).join(', ')})` : ''}${node.type ? `: ${node.nullable ? '?' : ''}${this.generatePHPCode(node.type, indentLevel)}` : ''}\n${indent}{\n${closureBody}\n${indent}}\n`;

            case "try":
                //console.log(node);

                leadingComments = this.leadingComments(node, indentLevel, indent);
                const tryBody = node.body ? this.generatePHPCode(node.body, indentLevel+1) : '';
                const tryCatches = node.catches.map((item: any) => this.generatePHPCode(item, indentLevel)).join(`\n${indent}`);
                //const tryCatches = node.catches ? this.generatePHPCode(this.block(node.catches), indentLevel + 1).trim() : '';
                const tryAlways = node.always ? this.generatePHPCode(node.always, indentLevel+1) : '';

                return `${leadingComments}try {\n${tryBody}\n${indent}} ${tryCatches}${tryAlways ? ` finally {\n${tryAlways}\n${indent}}` : ''}`;

            case "catch":
                //console.log(node);
                const catchBody = node.body ? this.generatePHPCode(node.body, indentLevel+1) : '';
                return `catch (${this.generatePHPCode(node.what, indentLevel)} ${this.generatePHPCode(node.variable, indentLevel)}) {\n${catchBody}\n${indent}}`;

            case "offsetlookup":
                //console.log(node);
                return `${this.generatePHPCode(node.what, indentLevel)}[${node.offset ? this.generatePHPCode(node.offset, indentLevel) : ''}]`;

            case "nullkeyword":
                return node.raw;

            case "if":
                //console.log(node);
                leadingComments = this.leadingComments(node, indentLevel, indent);

                const ifBody = 'block' == node.body.kind ? node.body : this.block(node.body);
                let ifAlternate = node.alternate && ('block' == node.alternate.kind) ? node.alternate : (node.alternate ? this.block(node.alternate) : null);
                let ia: string = '';

                if(node.alternate && ifAlternate.children[0].kind != 'block' && ifAlternate.children[0].kind != 'if') {
                    ia = ` {\n${this.generatePHPCode(ifAlternate, indentLevel + 1)}\n${indent}}`;
                } else {
                    ia = node.alternate ? this.generatePHPCode(ifAlternate, indentLevel).trim() : '';
                }

                return `${leadingComments}if(${this.generatePHPCode(node.test, indentLevel).trim()})${node.shortForm ? `:\n${this.generatePHPCode(ifBody, indentLevel + 1)}\n` : ` {\n${this.generatePHPCode(ifBody, indentLevel + 1)}\n${indent}}`}${node.alternate ? ` else${ia}` : ''}`;

            case "staticlookup":
                //console.log(node);
                return `${this.generatePHPCode(node.what, indentLevel)}::${this.generatePHPCode(node.offset, indentLevel)}`;

            case "selfreference":
                //console.log(node);
                return node.raw;

            case "usegroup":
                //console.log(node);
                return `use ${this.generatePHPCode(node.items, indentLevel)}`;

            case "useitem":
                //console.log(node.alias);
                return `${node.name}${node.alias ? ` as ${this.generatePHPCode(node.alias, indentLevel)}` : '' };`;

            case "boolean":
                //console.log(node);
                return node.raw;

            case "cast":
                //console.log(node);
                return `${node.raw} ${this.generatePHPCode(node.expr, indentLevel)}`;

            case "unary":
                //console.log(node);
                return `!${this.generatePHPCode(node.what, indentLevel)}`;

            case "attrgroup":
                //console.log(node);
                return `#[${node.attrs.map((item: any) => this.generatePHPCode(item, indentLevel)).join(', ')}]`;

            case "attribute":
                //console.log(node);
                return `${node.name}${node.args.length ? `(${node.args.map((item: any) => this.generatePHPCode(item, indentLevel).replace(/\n/gm, '').replaceAll(indent, '')).join(', ')})` : ''}`;

            case "namedargument":
                //console.log(node);
                return `${node.name}: ${this.generatePHPCode(node.value, indentLevel)}`;

            case "constantstatement":
                //console.log(node);
                return `const ${this.generatePHPCode(node.constants[0], indentLevel)}`;

            case "classconstant":
                //console.log(node);
                return `${node.visibility && `${node.visibility} `}const ${this.generatePHPCode(node.constants[0], indentLevel)}`;

            case "constant":
                //console.log(node);
                return `${this.generatePHPCode(node.name, indentLevel)} = ${this.generatePHPCode(node.value, indentLevel).trim()}`;

            case "throw":
                //console.log(node);
                return `throw ${this.generatePHPCode(node.what, indentLevel)};`;

            default:
                console.log(node);
                console.warn(`Unhandled node kind: ${node.kind}`);
                return ``;
        }
    }

    private leadingComments(node: any, indentLevel: number, indent: string = ''): string {
        let leadingComments = node.leadingComments?.map((item: any) => this.generatePHPCode(item, indentLevel)).join(`\n${indent}`) || [];

        return leadingComments.length > 0 ? `\n${indent}${leadingComments}\n${indent}`: '';
    }

    private attrGroups(node: any, indentLevel: number, indent: string = ''): string  {
        let attrGroups = node.attrGroups?.map((item: any) => this.generatePHPCode(item, indentLevel)).join(`\n${indent}`) || [];

        return attrGroups.length > 0 ? `\n${indent}${attrGroups}\n${indent}` : '';
    }

    private trailingComments(node: any, indentLevel: number, indent: string): string {
        let trailingComments = node.trailingComments?.map((item: any) => this.generatePHPCode(item, indentLevel)).join(`\n${indent}`) || [];

        return trailingComments.length > 0 ? `\n${indent}${trailingComments}\n${indent}` : '';;
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
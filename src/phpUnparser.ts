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
        code = code.replace(/^\ +$/gm, '');
        code = code.replace(/^\t(\n+)/gm, '$1');
        code = code.replace(/{\n\t?\n+/gm, '{\n');
        code = code.replace(/^\n\t?\n+/gm, '\n');
        code = code.replace(/^\n+\}/gm, '}');

        return code.trim();
    }

    generatePHPCode(node: any, indentLevel: number = 0): string {
        const indentChar = this.options.indentWithTab ? '\t' : " ".repeat(this.options.indentSize);
        const indent = indentChar.repeat(indentLevel);
        let leadingComments: any, trailingComments: any, attrGroups: any;

        if (Array.isArray(node)) {
            return node
                .map((child) =>
                    this.generatePHPCode(child, indentLevel)
                )
                .join("");
        }

        let $return: string = '';
        switch (node.kind) {
            case "array":
                const arrayItems = node.items.map((item: any) => this.generatePHPCode(item, indentLevel+1));

                $return = `${node.shortForm ? `[${arrayItems.join(', ')}]` : `array(${arrayItems.join(', ')})`}`;
                break;

            case "arrowfunc":
                $return = `fn(${node.arguments.map((item: any) => this.generatePHPCode(item, indentLevel)).join(', ')}) => ${this.generatePHPCode(node.body, indentLevel).trim()}`;
                break;

            case "assign":
                $return = `${this.generatePHPCode(node.left, indentLevel).trim()} ${node.operator} ${this.generatePHPCode(node.right, indentLevel).trim()}`;
                break;

            case "assignref":
                $return = `${this.generatePHPCode(node.left, indentLevel)} = &${this.generatePHPCode(node.right, indentLevel)}`;
                break;

            case "attrgroup":
                $return = `#[${node.attrs.map((item: any) => this.generatePHPCode(item, indentLevel)).join(', ')}]`;
                break;

            case "attribute":
                $return = `${node.name}${node.args.length ? `(${node.args.map((item: any) => this.generatePHPCode(item, indentLevel).replace(/\n/gm, '').replaceAll(indent, '')).join(', ')})` : ''}`;
                break;

            case "bin":
                const binContent = `${this.generatePHPCode(node.left, indentLevel).trim()} ${node.nullable ? '?' : ''}${node.type} ${this.generatePHPCode(node.right, indentLevel).trim()}`;
                $return = `${node.parenthesizedExpression ? `(${binContent})` : ` ${binContent}`}`;
                break;

            case "block":
                $return = `${indent}${node.children.map((item: any) => this.generatePHPCode(item, indentLevel)).join(`\n${indent}`)}`;
                break;

            case "boolean":
                $return = node.raw;
                break;

            case "break":
                $return = `break;`;
                break;

            // byref

            case "call":
                $return = `${this.generatePHPCode(node.what, indentLevel)}(${node.arguments.map((item: any) => this.generatePHPCode(item, indentLevel).trim()).join(", ")})`;
                break;

            case "case":
                const caseBody = this.generatePHPCode(node.body, indentLevel+1);
                $return = `${node.test ? `case ${this.generatePHPCode(node.test, indentLevel)}` : 'default'}:\n${caseBody}`;
                break;

            case "cast":
                $return = `${node.raw} ${this.generatePHPCode(node.expr, indentLevel)}`;
                break;

            case "catch":
                const catchBody = node.body ? this.generatePHPCode(node.body, indentLevel+1) : '';
                $return = `catch (${this.generatePHPCode(node.what, indentLevel)} ${this.generatePHPCode(node.variable, indentLevel)}) {\n${catchBody}\n${indent}}`;
                break;

            case "class":
                attrGroups = this.attrGroups(node, indentLevel, indent);
                const classBody = node.body ? this.generatePHPCode(this.block(node.body), indentLevel + 1) : '';

                $return = `\n${indent}${attrGroups}${this.isAbstract(node)}${this.isFinal(node)}class ${node.name?.name || ''}${(node.extends && ` extends ${Array.isArray(node.extends) ? node.extends.map((item: any) => this.generatePHPCode(item, indentLevel)).join(', ') : (node.extends ? this.generatePHPCode(node.extends, indentLevel) : '')}`) || ''}${(node.implements && ` implements ${node.implements.map((item: any) => this.generatePHPCode(item, indentLevel)).join(', ')}`) || ''}${(classBody && `\n{\n${classBody}\n}`) || ''}`;
                break;

            case "classconstant":
                $return = `${node.visibility && `${node.visibility} `}const ${this.generatePHPCode(node.constants[0], indentLevel)}`;
                break;

            case "clone":
                $return = `clone ${this.generatePHPCode(node.what, indentLevel)}`;
                break;

            case "closure":
                const closureBody = node.body ? this.generatePHPCode(node.body, indentLevel + 1) : '';
                $return = `function(${node.arguments.map((item: any) => this.generatePHPCode(item, indentLevel)).join(', ')})${node.uses.length ? ` use(${node.uses.map((item: any) => this.generatePHPCode(item, indentLevel)).join(', ')})` : ''}${node.type ? `: ${node.nullable ? '?' : ''}${this.generatePHPCode(node.type, indentLevel)}` : ''}\n${indent}{\n${closureBody}\n${indent}}\n`;
                break;

            case "commentblock":
                const commentBlock = node.value;
                $return = commentBlock;
                break;

            case "commentline":
                $return = node.value.trim();
                break;

            case "constant":
                $return = `${this.generatePHPCode(node.name, indentLevel)} = ${this.generatePHPCode(node.value, indentLevel).trim()}`;
                break;

            case "constantstatement":
                $return = `const ${this.generatePHPCode(node.constants[0], indentLevel)}`;
                break;

            case "continue":
                $return = `continue;`;
                break;

            // declaration

            case "declare":
                $return = `declare(${node.directives.map((item: any) => this.generatePHPCode(item, indentLevel)).join(', ')});`;
                break;

            case "declaredirective":
                $return = `${this.generatePHPCode(node.key, indentLevel)}=${this.generatePHPCode(node.value, indentLevel)}`;
                break;

            case "do":
                const doBody = node.body ? this.generatePHPCode(node.body, indentLevel + 1) : '';
                $return = `do {\n${doBody}\n${indent}} while (${this.generatePHPCode(node.test, indentLevel).trim()});`;
                break;

            case "echo":
                $return = `${node.shortForm ? '=' : 'echo'} ${node.expressions.map((item: any) => this.generatePHPCode(item, indentLevel).trim()).join(', ')};`;
                break;

            case "empty":
                $return = `empty(${this.generatePHPCode(node.expression, indentLevel)})`;
                break;

            case "encapsed":
                $return = `${node.parenthesizedExpression ? `("${node.value.map((item: any) => this.generatePHPCode(item, indentLevel)).join(' ')}")` : ` ${node.raw}`}`;
                break;

            case "encapsedpart":
                $return = `${this.generatePHPCode(node.expression, indentLevel)}`;
                break;

            case "entry":
                $return = `${node.unpack ? '...' : ''}${node.key ? `${this.generatePHPCode(node.key, indentLevel).trim()} => ` : ''}${this.generatePHPCode(node.value, indentLevel).trim()}`;
                break;

            case "enum":
                const enumBody = (node.body ? this.generatePHPCode(this.block(node.body), indentLevel + 1) : '');
                $return = `enum ${this.generatePHPCode(node.name, indentLevel)}${node.valueType ? `: ${this.generatePHPCode(node.valueType, indentLevel)}` : ''}${node.implements ? ` implements ${node.implements.map((item: any) => this.generatePHPCode(item, indentLevel)).join(', ')}` : ''} {\n${indent}${enumBody}\n${indent}}`;
                break;

            case "enumcase":
                $return = `case ${this.generatePHPCode(node.name, indentLevel)}${node.value ? ` = ${this.generatePHPCode(node.value, indentLevel)}` : ''};`;
                break;

            // error

            case "eval":
                $return = `eval(${this.generatePHPCode(node.source)})`;
                break;

            case "exit":
                $return = `${node.useDie ? 'die' : 'exit'}(${node.expression ? this.generatePHPCode(node.expression, indentLevel) : ''})`;
                break;

            // expression

            case "expressionstatement":
                $return = `${this.generatePHPCode(node.expression, indentLevel)};`;
                break;

            case "for":
                const forBody = node.body ? this.generatePHPCode(node.body, indentLevel + 1) : '';
                $return = `for(${this.generatePHPCode(node.init, indentLevel).trim()}; ${this.generatePHPCode(node.test, indentLevel).trim()}; ${this.generatePHPCode(node.increment, indentLevel).trim()})${node.shortForm ? `:\n${indent}${forBody}\n${indent}endfor;` : ` {\n${forBody}\n${indent}}`}`;
                break;

            case "foreach":
                const foreachBody = node.body ? this.generatePHPCode(node.body, indentLevel + 1) : '';
                $return = `foreach(${this.generatePHPCode(node.source, indentLevel)} as ${node.key ? `${this.generatePHPCode(node.key, indentLevel)} => ` : ''}${this.generatePHPCode(node.value, indentLevel)})${node.shortForm ? `:\n${indent}${foreachBody}\n${indent}endforeach;` : ` {\n${foreachBody}\n${indent}}`}\n`;
                break;

            case "function":
                attrGroups = this.attrGroups(node, indentLevel, indent);

                const functionBody = node.body ? this.generatePHPCode(node.body, indentLevel + 1) : '';
                $return = `\n${indent}${attrGroups}${this.isAbstract(node)}${this.isFinal(node)}${(node.visibility && `${node.visibility} `) || ''}${this.isStatic(node)}function ${node.name.name}(${node.arguments.map((item: any) => this.generatePHPCode(item, indentLevel)).join(', ') || ''})${node.type ? `: ${node.nullable ? '?' : ''}${this.generatePHPCode(node.type, indentLevel)}` : ''}${functionBody ? `\n${indent}{\n${functionBody}\n${indent}}` : ';'}\n`;
                break;

            case "global":
                $return = `global ${node.items.map((item: any) => this.generatePHPCode(item, indentLevel)).join(', ')};`;
                break;

            case "goto":
                $return = `goto ${this.generatePHPCode(node.label)};`;
                break;

            case "halt":
                $return = `\n${indent}__halt_compiler();${node.after}`;
                break;

            case "identifier":
                $return = `${node.name}`;
                break;

            case "if":
                const ifBody = 'block' === node.body.kind ? node.body : this.block(node.body);
                let ifAlternate = node.alternate && ('block' === node.alternate.kind) ? node.alternate : (node.alternate ? this.block(node.alternate) : null);
                let ia: string = '';

                if(node.alternate && ifAlternate.children[0].kind !== 'block' && ifAlternate.children[0].kind !== 'if') {
                    ia = ` {\n${this.generatePHPCode(ifAlternate, indentLevel + 1)}\n${indent}}`;
                } else {
                    ia = node.alternate ? this.generatePHPCode(ifAlternate, indentLevel).trim() : '';
                }

                $return = `if(${this.generatePHPCode(node.test, indentLevel).trim()})${node.shortForm ? `:\n${this.generatePHPCode(ifBody, indentLevel + 1)}\n` : ` {\n${this.generatePHPCode(ifBody, indentLevel + 1)}\n${indent}}`}${node.alternate ? ` else${ia}` : ''}`;
                break;

            case "include":
                $return = `${node.require ? 'require' : 'include'}${node.once ? '_once' : ''}${this.generatePHPCode(node.target, indentLevel)}`;
                break;

            case "inline":
                $return = `?>${node.raw}<?php`;
                break;

            case "interface":
                const interfaceBody = node.body ? this.generatePHPCode(this.block(node.body), indentLevel + 1) : '';

                $return = `\n${indent}${this.isAbstract(node)}${this.isFinal(node)}interface ${node.name.name}${(node.extends && ` extends ${node.extends.map((item: any) => this.generatePHPCode(item, indentLevel)).join(', ')}`) || ''}${(interfaceBody && `\n{\n${interfaceBody}\n}`) || ''}`;
                break;

            case "intersectiontype":
                $return = node.types.map((item: any) => this.generatePHPCode(item)).join('&');
                break;

            case "isset":
                $return = `isset(${node.variables.map((item: any) => this.generatePHPCode(item, indentLevel)).join(', ')})`;
                break;

            case "label":
                $return = `${this.generatePHPCode(node.name, indentLevel)}:`;
                break;

            case "list":
                $return = `list(${node.items.map((item: any) => this.generatePHPCode(item, indentLevel)).join(', ')})`;
                break;

            // literal

            // lookup

            case "magic":
                $return = node.raw;
                break;

            case "match":
                const matchArms = node.arms.map((item: any) => this.generatePHPCode(item, indentLevel)).join(`,\n${indent}${indentChar}`);
                $return = `match(${this.generatePHPCode(node.cond)}) {\n${indent}${indentChar}${matchArms}\n${indent}}`;
                break;

            case "matcharm":
                $return = `${this.generatePHPCode(node.conds[0], indentLevel)} => ${this.generatePHPCode(node.body, indentLevel)}`;
                break;

            case "method":
                attrGroups = this.attrGroups(node, indentLevel, indent);
                const methodBody = node.body ? this.generatePHPCode(node.body, indentLevel + 1) : '';

                $return = `\n${indent}${attrGroups}${this.isAbstract(node)}${this.isFinal(node)}${(node.visibility && `${node.visibility} `) || ''}${this.isStatic(node)}function ${node.name.name}(${node.arguments.map((item: any) => this.generatePHPCode(item, indentLevel)).join(', ') || ''})${node.type ? `: ${node.nullable ? '?' : ''}${this.generatePHPCode(node.type, indentLevel)}` : ''}${methodBody ? `\n${indent}{\n${methodBody}\n${indent}}` : ';'}`;
                break;

            case "name":
                $return = `${node.name}`;
                break;

            case "namedargument":
                $return = `${node.name}: ${this.generatePHPCode(node.value, indentLevel).trim()}`;
                break;

            case "namespace":
                const namespaceBody = node.children.map((item: any) => this.generatePHPCode(item, node.withBrackets ? indentLevel + 1 : indentLevel)).join(`\n`);
                $return = `namespace ${node.name}${node.withBrackets ? ` {\n${namespaceBody}\n}` : `;\n\n${namespaceBody}`}\n`;
                break;

            case "new":
                $return = `new ${this.generatePHPCode(node.what, indentLevel)}${node.arguments.length ? `(${node.arguments.map((item: any) => this.generatePHPCode(item, indentLevel)).join(', ')})` : ''}`;
                break;

            case "noop":
                $return = '';
                break;

            case "nowdoc":
                $return = node.raw;
                break;

            case "nullkeyword":
                $return = node.raw;
                break;

            case "nullsafepropertylookup":
                $return = `${this.generatePHPCode(node.what, indentLevel)}?->${this.generatePHPCode(node.offset, indentLevel)}`;
                break;

            case "number":
                $return = `${node.value}`;
                break;

            case "offsetlookup":
                $return = `${this.generatePHPCode(node.what, indentLevel)}[${node.offset ? this.generatePHPCode(node.offset, indentLevel) : ''}]`;
                break;

            case "parameter":
                let type: string | null = '';
                if (node.type) {
                    switch (node.type.kind) {
                        case "uniontype":
                            type = `${node.type.types.map((item: any) => this.generatePHPCode(item, indentLevel)).join('|')} `;
                            break;
                        case "typereference":
                            type = `${node.nullable ? '?' : ''}${node.type.raw} `;
                            break;
                        case "name":
                            type = `${node.nullable ? '?' : ''}${node.type.name} `;
                            break;
                        case "intersectiontype":
                            type = `${this.generatePHPCode(node.type, indentLevel)} `;
                            break;
                    }
                }
                $return = `${node.variadic ? '...' : ''}${type}${node.byref ? '&' : ''}$${node.name.name}`.trim();
                break;

            case "parentreference":
                $return = node.raw;
                break;

            case "post":
                $return = `${this.generatePHPCode(node.what, indentLevel)}${node.type.repeat(2)}`;
                break;

            case "pre":
                $return = `${node.type.repeat(2)}${this.generatePHPCode(node.what, indentLevel)}`;
                break;

            case "print":
                $return = `print${node.expression.kind === 'variable' ? ' ' : ''}${this.generatePHPCode(node.expression)}`;
                break;

            case "program":
                $return = `${node.children.map((item: any) => this.generatePHPCode(item, indentLevel)).join('\n') || ''}`;
                break;

            case "property":
                $return = `${this.isReadOnly(node)}${node.nullable ? '?' : ''}${null !== node.type ? this.generatePHPCode(node.type, indentLevel).trim() : ''} $${this.generatePHPCode(node.name, indentLevel).trim()}${node.value ? ` = ${this.generatePHPCode(node.value, indentLevel).trim()}` : ''};`;
                break;

            case "propertylookup":
                $return = `${this.generatePHPCode(node.what, indentLevel)}->${this.generatePHPCode(node.offset, indentLevel)}`;
                break;

            case "propertystatement":
                attrGroups = this.attrGroups(node.properties[0], indentLevel, indent);

                const properties = node.properties ? this.generatePHPCode(this.block(node.properties), indentLevel).trim() : '';

                $return = `${attrGroups}${node.visibility} ${this.isStatic(node)}${properties}`;
                break;

            case "retif":
                if(node.trueExpr) {
                    $return = `${this.generatePHPCode(node.test)} ? ${this.generatePHPCode(node.trueExpr)} : ${this.generatePHPCode(node.falseExpr)}`;
                } else {
                    $return = `${this.generatePHPCode(node.test)} ?: ${this.generatePHPCode(node.falseExpr)}`;
                }
                break;

            case "return":
                $return = `return ${this.generatePHPCode(node.expr, indentLevel).trim()};`;
                break;

            case "selfreference":
                $return = node.raw;
                break;

            case "silent":
                $return = `@${this.generatePHPCode(node.expr, indentLevel)}`;
                break;

            case "static":
                $return = `static ${node.variables.map((item: any) => this.generatePHPCode(item, indentLevel)).join(', ')};`;
                break;

            case "staticlookup":
                $return = `${this.generatePHPCode(node.what, indentLevel)}::${this.generatePHPCode(node.offset, indentLevel)}`;
                break;

            case "staticvariable":
                $return = `${this.generatePHPCode(node.variable)}${node.defaultValue ? `=${this.generatePHPCode(node.defaultValue, indentLevel)}` : ''}`;
                break;

            case "string":
                $return = `${node.parenthesizedExpression ? `(${node.raw})` : ` ${node.raw}`}`;
                break;

            case "switch":
                const switchBody = node.body ? this.generatePHPCode(node.body, indentLevel + 1) : '';
                $return = `\n${indent}switch(${this.generatePHPCode(node.test, indentLevel)})${node.shortForm ? `:\n${indent}${switchBody}\n${indent}endswitch;` : `\n${indent}{\n${switchBody}\n${indent}}`}`;
                break;

            case "throw":
                $return = `throw ${this.generatePHPCode(node.what, indentLevel)};`;
                break;

            case "trait":
                const traitBody = node.body ? this.generatePHPCode(this.block(node.body), indentLevel + 1) : '';

                $return = `${this.isAbstract(node)}${this.isFinal(node)}trait ${node.name.name}${(node.extends && ` extends ${node.extends.map((item: any) => this.generatePHPCode(item, indentLevel)).join(', ')}`) || ''}${(traitBody && `\n{\n${traitBody}\n}`) || ''}`;
                break;

            case "traitalias":
                $return = `${node.method} as${node.visibility ? ` ${node.visibility}` : ''}${node.as ? ` ${this.generatePHPCode(node.as, indentLevel)}` : ''}`;
                break;

            case "traitprecedence":
                $return = `${this.generatePHPCode(node.trait, indentLevel)}::${this.generatePHPCode(node.method, indentLevel)} insteadof ${this.generatePHPCode(node.instead, indentLevel)};`;
                break;

            case "traituse":
                const traits = node.traits.map((item: any) => this.generatePHPCode(item, indentLevel)).join(`, `);
                const adaptations = node.adaptations ? node.adaptations.map((item: any) => this.generatePHPCode(item, indentLevel)).join(`;\n${indent}${indentChar}`) : '';
                $return = `use ${traits}${node.adaptations ? ` {\n${indent}${indentChar}${adaptations}\n${indent}}` : ';'}`;
                break;

            case "try":
                const tryBody = node.body ? this.generatePHPCode(node.body, indentLevel+1) : '';
                const tryCatches = node.catches.map((item: any) => this.generatePHPCode(item, indentLevel)).join(`\n${indent}`);
                const tryAlways = node.always ? this.generatePHPCode(node.always, indentLevel+1) : '';

                $return = `try {\n${indent}${tryBody}\n${indent}} ${tryCatches}${tryAlways ? ` finally {\n${tryAlways}\n${indent}}` : ''}`;
                break;

            case "typereference":
                $return = `${node.name}`;
                break;

            case "unary":
                $return = `!${this.generatePHPCode(node.what, indentLevel)}`;
                break;

            case "uniontype":
                $return = `${node.types.map((item: any) => this.generatePHPCode(item, indentLevel)).join('|')}`;
                break;

            case "unset":
                $return = `unset(${node.variables.map((item: any) => this.generatePHPCode(item, indentLevel)).join(', ')});`;
                break;

            case "usegroup":
                $return = `use ${this.generatePHPCode(node.items, indentLevel)}`;
                break;

            case "useitem":
                $return = `${node.name}${node.alias ? ` as ${this.generatePHPCode(node.alias, indentLevel)}` : '' };`;
                break;

            case "variable":
                $return = `$${node.curly ? `{${this.generatePHPCode(node.name, indentLevel)}}` : node.name}`;
                break;

            case "variadic":
                $return = `...${this.generatePHPCode(node.what, indentLevel)}`;
                break;

            // variadicplaceholder

            case "while":
                const whileBody = node.body ? this.generatePHPCode(node.body, indentLevel + 1) : '';
                $return = `while (${this.generatePHPCode(node.test, indentLevel).trim()}) {\n${whileBody}\n${indent}}`;
                break;

            case "yield":
                $return = `yield ${node.key ? `${this.generatePHPCode(node.key, indentLevel)} => ` : ''}${this.generatePHPCode(node.value, indentLevel)}`;
                break;

            case "yieldfrom":
                $return = `yield from ${this.generatePHPCode(node.value, indentLevel)}`;
                break;

            default:
                console.log(node);
                console.warn(`Unhandled node kind: ${node.kind}`);
                $return = ``;
        }

        leadingComments = this.leadingComments(node, indentLevel, indent);
        trailingComments = this.trailingComments(node, indentLevel, indent);

        if("\n" === $return.charAt(0)) {
            leadingComments = leadingComments.trimEnd();
        }

        return `${leadingComments}${$return}${trailingComments}`;
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

        return trailingComments.length > 0 ? ` ${trailingComments}` : '';
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
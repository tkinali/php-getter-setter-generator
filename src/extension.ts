import * as vscode from 'vscode';
import * as path from 'path';

export function activate(context: vscode.ExtensionContext) {
    // Yerelleştirme dosyalarını yükle
    const l10nPath = path.join(context.extensionPath, 'l10n');
    let messages;

    try {
        const language = vscode.env.language;
        const l10nFile = language === 'en'
            ? 'bundle.l10n.json'
            : `bundle.l10n.${language}.json`;

        messages = require(path.join(l10nPath, l10nFile));
    } catch (error) {
        // Eğer dil dosyası bulunamazsa varsayılan İngilizce dosyayı kullan
        messages = require(path.join(l10nPath, 'bundle.l10n.json'));
    }

    let disposable = vscode.commands.registerCommand('phpgsg.generateGettersAndSetters', async () => {
        const editor = vscode.window.activeTextEditor;
        if (editor) {
            const document = editor.document;
            const text = document.getText();
            const classRegex = /class\s+(\w+).*\s*{([\s\S]*)}/g; // Tüm sınıf içeriğini al
            const privateVarRegex = /private\s+(\??[\w\\]+)\s*\$(\w+)\s*(?:=\s*[^;]+)?;/g;
            const methodRegex = /public\s+function\s+(get|set)(\w+)\s*\(/g;

            // Kullanıcı ayarlarını al
            const config = vscode.workspace.getConfiguration('phpgsg.getterSetterGenerator');
            const getterTemplate = config.get<string>('getterTemplate', 'public function get{{name}}(): {{nullable}}{{type}}\n    {\n        return $this->{{variable}};\n    }');
            const setterTemplate = config.get<string>('setterTemplate', 'public function set{{name}}({{nullable}}{{type}} ${{variable}}): self\n    {\n        $this->{{variable}} = ${{variable}};\n        return $this;\n    }');
            const sortByProperyOrder = config.get<boolean>('sortByPropertyOrder', false);
            const autoGenerate = config.get<boolean>('autoGenerate', true);

            let newText = text;
            let match;

            while ((match = classRegex.exec(text)) !== null) {
                const className = match[1];
                let classContent = match[2];

                // Mevcut getter ve setter'ları bul
                const existingMethods = new Set<string>();
                let methodMatch;

                while ((methodMatch = methodRegex.exec(classContent)) !== null) {
                    const methodPrefix = methodMatch[1]; // "get" veya "set"
                    const propertyName = methodMatch[2].toLowerCase(); // getter/setter sonrası gelen isim
                    existingMethods.add(methodPrefix + propertyName); // Tam fonksiyon adını ekle
                }

                let privateVars = [];
                let privateMatch;
                while ((privateMatch = privateVarRegex.exec(classContent)) !== null) {
                    const type = privateMatch[1].trim();
                    const name = privateMatch[2].trim();
                    const isNullable = type.startsWith('?');
                    const cleanType = isNullable ? type.slice(1) : type;
                    const getterExists = existingMethods.has('get' + name.toLowerCase());
                    const setterExists = existingMethods.has('set' + name.toLowerCase());

                    privateVars.push({
                        type: cleanType,
                        name,
                        isNullable,
                        getterExists,
                        setterExists,
                        isMethodExists: getterExists && setterExists // İkisi de varsa, seçili gelmemesi için
                    });
                }

                const selectedVars = autoGenerate ? privateVars.map(variable => ({ variable })) : await vscode.window.showQuickPick(
                    privateVars.map(variable => ({
                        label: `$${variable.name}`,
                        description: `${variable.type}${variable.isNullable ? ' | null' : ''}`,
                        picked: !variable.isMethodExists,
                        variable
                    })),
                    {
                        placeHolder: messages['phpgsg.quickPick.placeholder'],
                        canPickMany: true
                    }
                ) ?? false;

                if (!selectedVars) {
                    return; // Kullanıcı seçim yapmadan çıktı
                }

                // Mevcut getter ve setter metodlarını bul ve sakla
                const existingMethodsMap = new Map<string, string>();
                const methodRegexWithContent = /(\s*public function (get|set)(\w+)\([^)]*\)[^}]*})/g;
                let methodMatchWithContent;
                while ((methodMatchWithContent = methodRegexWithContent.exec(classContent)) !== null) {
                    const methodContent = methodMatchWithContent[1];
                    const methodType = methodMatchWithContent[2]; // get veya set
                    const propertyName = methodMatchWithContent[3].toLowerCase();
                    existingMethodsMap.set(methodType + propertyName, methodContent.trim());
                }

                // Sınıf içeriğinden eski metodları temizle
                if(sortByProperyOrder) {
                    classContent = classContent.replace(/\s*public function (get|set)\w+\([^)]*\)[^}]*}/g, '');
                }
                classContent = classContent.trim();

                // Tüm private değişkenler için getter ve setter metodlarını oluştur
                let methods = '';
                privateVars.forEach(variable => {
                    const variableNameLower = variable.name.toLowerCase();
                    const isSelected = selectedVars.some((selected: { variable: { name: string; }; }) => selected.variable.name === variable.name);

                    // Getter metodu için
                    const getterKey = 'get' + variableNameLower;
                    if (existingMethodsMap.has(getterKey)) {
                        // Varolan getter metodunu kullan
                        methods += sortByProperyOrder ? '\n    ' + existingMethodsMap.get(getterKey) + '\n' : '';
                    } else if (isSelected) {
                        // Yeni getter metodu oluştur
                        const getter = getterTemplate
                            .replace(/{{name}}/g, variable.name.charAt(0).toUpperCase() + variable.name.slice(1))
                            .replace(/{{variable}}/g, variable.name)
                            .replace(/{{type}}/g, variable.type)
                            .replace(/{{nullable}}/g, variable.isNullable ? '?' : '');
                        methods += '\n    ' + getter + '\n';
                    }

                    // Setter metodu için
                    const setterKey = 'set' + variableNameLower;
                    if (existingMethodsMap.has(setterKey)) {
                        // Varolan setter metodunu kullan
                        methods += sortByProperyOrder ? '\n    ' + existingMethodsMap.get(setterKey) + '\n' : '';
                    } else if (isSelected) {
                        // Yeni setter metodu oluştur
                        const setter = setterTemplate
                            .replace(/{{name}}/g, variable.name.charAt(0).toUpperCase() + variable.name.slice(1))
                            .replace(/{{variable}}/g, variable.name)
                            .replace(/{{type}}/g, variable.type)
                            .replace(/{{nullable}}/g, variable.isNullable ? '?' : '');
                        methods += '\n    ' + setter + '\n';
                    }
                });

                // Sınıf içeriğini güncelle
                classContent = "\n    " + classContent + '\n\n    ' + methods.trim() + '\n';

                newText = newText.replace(match[2], classContent);
            }

            const edit = new vscode.WorkspaceEdit();
            const fullRange = new vscode.Range(
                document.positionAt(0),
                document.positionAt(text.length)
            );
            edit.replace(document.uri, fullRange, newText);

            vscode.workspace.applyEdit(edit).then(success => {
                if (success) {
                    vscode.window.showInformationMessage(messages['phpgsg.message.success']);
                } else {
                    vscode.window.showErrorMessage(messages['phpgsg.message.error']);
                }
            });
        }
    });

    context.subscriptions.push(disposable);
}

export function deactivate() {}

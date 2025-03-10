🇺🇸 [English](./README.md) - 🇧🇬 [Български](./README_BG.md) - 🇨🇿 [Čeština](./README_CS.md) - 🇩🇪 [Deutsch](./README_DE.md) - 🇪🇸 [Español](./README_ES.md) - 🇫🇷 [Français](./README_FR.md) - 🇭🇺 [Magyar](./README_HU.md) - 🇮🇹 [Italiano](./README_IT.md) - 🇯🇵 [日本語](./README_JA.md) - 🇰🇷 [한국어](./README_KO.md) - 🇵🇱 [Polski](./README_PL.md) - 🇧🇷 [Português - Brasil](./README_PT-BR.md) - 🇷🇺 [Русский](./README_RU.md) - 🇹🇷 [Türkçe](./README_TR.md) - 🇨🇳 [简体中文](./README_ZH-CN.md)/[繁體中文](./README_ZH-TW.md)

# PHP Getter, Setter and Constructor Generator

This VS Code extension is designed to accelerate the workflow of PHP developers. It automatically generates getter and setter methods and constructors for the private properties of classes in the currently open PHP file. Unlike other similar extensions, this extension supports files containing multiple classes and allows you to select properties separately for each class.

## Features

- **One-Click Generation:** Generate getter and setter methods for your PHP class properties with a single click.

![One-Click Generation](images/one-click.gif "One-Click Generation")

- **Multi-Class Support:** If there are multiple classes in the file, you can generate getter and setter methods separately for each.

![Multi-Class Support](images/multi-class.gif "Multi-Class Support")

- **Customizable Selection:** Provides a user-friendly interface where you can select the private properties of each class separately.

![Customizable Selection](images/property-select.gif "Customizable Selection")

- **Method Insertion Order Selection:** Getter and setter methods can be inserted into the class in various orders: getters first, setters first, or alternating.

![Method Insertion Order Selection](images/flexible-sort.gif "Method Insertion Order Selection")

- **Constructor Generation:** Automatically generates constructors with type hinting and property assignment.

![Constructor Generation](images/constructor.gif "Constructor Generation")

- **Flexible Sorting:** Generated getter/setter methods can be sorted alphabetically (A-Z or Z-A) or according to the order in which the properties are defined.
- **Fluent Interface:** Fluent interface support for setter methods for method chaining.
- **Modern PHP Support:** Support for PHP 7+ type declarations.
- **Fast and Efficient:** Saves you time by speeding up your development process.

## Usage

1. Open your PHP file.
2. Right-click or open the Command Palette (Ctrl+Shift+P or Cmd+Shift+P).
3. Select "Generate Getters and Setters".
4. Getters and setters will be generated automatically.

## Settings

This extension provides the following settings:

- `phpgsg.getterSetterGenerator.autoGenerate`: Skips the quick selection window and automatically generates all available getter/setter methods.
- `phpgsg.getterSetterGenerator.fluentInterface`: Adds `return $this;` for fluent interface (method chaining) in setter methods.
- `phpgsg.getterSetterGenerator.indentSize`: Specifies the size of an indent (as a number of spaces).
- `phpgsg.getterSetterGenerator.indentWithTab`: Uses tab character as the indent character instead of spaces. (indentSize option is calculated as 1)
- `phpgsg.getterSetterGenerator.sortMethods`: You can prioritize getters or setters, or sort them mixed when arranging methods.
- `phpgsg.getterSetterGenerator.orderBy`: You can choose alphabetical sorting or the property order defined in the class when sorting methods.
- `phpgsg.getterSetterGenerator.contextMenu.constructor`: Shows or hides the "Generate Constructor" option in the context menu.
- `phpgsg.getterSetterGenerator.contextMenu.getter`: Shows or hides the "Generate Getters" option in the context menu.
- `phpgsg.getterSetterGenerator.contextMenu.setter`: Shows or hides the "Generate Setters" option in the context menu.
- `phpgsg.getterSetterGenerator.contextMenu.getterAndSetter`: Shows or hides the "Generate Getters and Setters" option in the context menu.

## Installation

1. Open VS Code.
2. Open Quick Open (Ctrl+P).
3. Type: `ext install tkinali.php-getter-setter-generator`

## License

This project is licensed under the MIT license.

## Issue Reporting

If you find a bug or have a suggestion, please report it via GitHub Issues.
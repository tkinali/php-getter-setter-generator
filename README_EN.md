[Türkçe](./README.md)

# PHP Getter and Setter Generator

A Visual Studio Code extension that automatically generates getter and setter methods for PHP classes.

## Features

- Generate getter and setter methods for your PHP class properties with a single click
- Customizable getter and setter templates
- Support for nullable types
- Fluent interface support in setter methods for method chaining
- Support for PHP 7+ type declarations

## Usage

1. Open your PHP file
2. Right-click and select "Generate Getters and Setters"
3. Getters and setters will be automatically generated

## Settings

This extension offers the following settings:

- `phpgsg.getterSetterGenerator.autoGenerate`: Automatically generates getters and setters when a class property is added
  - Default: `false`

- `phpgsg.getterSetterGenerator.getterTemplate`: Template for the getter method
  - Default:
    ```php
    public function get{{name}}(): {{nullable}}{{type}}
    {
        return $this->{{variable}};
    }
    ```

- `phpgsg.getterSetterGenerator.setterTemplate`: Template for the setter method
  - Default:
    ```php
    public function set{{name}}({{nullable}}{{type}} ${{variable}}): self
    {
        $this->{{variable}} = ${{variable}};
        return $this;
    }
    ```

- `phpgsg.getterSetterGenerator.sortByPropertyOrder`: Generates getters and setters in the order of properties
  - Default: `true`

## Template Variables

Variables you can use in templates:

- `{{name}}`: Property name (capitalized)
- `{{type}}`: Property type
- `{{nullable}}`: `?` for nullable types
- `{{variable}}`: Property variable name

## Requirements

- Visual Studio Code 1.74.0 or higher
- PHP files

## Installation

1. Open VS Code
2. Open Quick Open (Ctrl+P)
3. Type: `ext install php-getter-and-setter-generator`

## License

This project is licensed under the MIT License.

## Contributing

1. Fork this project
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'feat: Add some amazing feature'`)
4. Push your branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## Reporting Issues

If you find a bug or have a suggestion, please report it via GitHub Issues.
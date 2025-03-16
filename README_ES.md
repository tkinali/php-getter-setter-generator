🇺🇸 [English](./README.md) - 🇧🇬 [Български](./README_BG.md) - 🇨🇿 [Čeština](./README_CS.md) - 🇩🇪 [Deutsch](./README_DE.md) - 🇪🇸 [Español](./README_ES.md) - 🇫🇷 [Français](./README_FR.md) - 🇭🇺 [Magyar](./README_HU.md) - 🇮🇹 [Italiano](./README_IT.md) - 🇯🇵 [日本語](./README_JA.md) - 🇰🇷 [한국어](./README_KO.md) - 🇵🇱 [Polski](./README_PL.md) - 🇧🇷 [Português - Brasil](./README_PT-BR.md) - 🇷🇺 [Русский](./README_RU.md) - 🇹🇷 [Türkçe](./README_TR.md) - 🇨🇳 [简体中文](./README_ZH-CN.md)/[繁體中文](./README_ZH-TW.md)

# Generador de Getters y Setters de PHP

Esta extensión de VS Code está diseñada para acelerar el flujo de trabajo de los desarrolladores de PHP. Genera automáticamente métodos getter y setter y constructores para las propiedades `private` y `protected` de las clases en el archivo PHP actualmente abierto. A diferencia de otras extensiones similares, esta extensión admite archivos que contienen múltiples clases y le permite seleccionar propiedades por separado para cada clase.

## Características

- **Generación con un clic:** Genere métodos getter y setter para las propiedades de su clase PHP con un solo clic.

![Generación con un clic](images/one-click.gif "Generación con un clic")

- **Soporte para múltiples clases:** Si hay varias clases en el archivo, puede generar métodos getter y setter por separado para cada una.

![Soporte para múltiples clases](images/multi-class.gif "Soporte para múltiples clases")

- **Selección personalizable:** Proporciona una interfaz fácil de usar donde puede seleccionar las propiedades privadas de cada clase por separado.

![Selección personalizable](images/property-select.gif "Selección personalizable")

- **Selección de orden de inserción de métodos:** Los métodos getter y setter se pueden insertar en la clase en varios órdenes: primero getters, primero setters o alternando.

![Selección de orden de inserción de métodos](images/flexible-sort.gif "Selección de orden de inserción de métodos")

- **Generación de constructores:** Genera automáticamente constructores con sugerencias de tipo y asignación de propiedades.

![Generación de constructores](images/constructor.gif "Generación de constructores")

- **Ordenación flexible:** Los métodos getter/setter generados se pueden ordenar alfabéticamente (A-Z o Z-A) o según el orden en que se definen las propiedades.
- **Interfaz fluida:** Soporte de interfaz fluida para métodos setter para encadenamiento de métodos.
- **Soporte de PHP moderno:** Soporte para declaraciones de tipo PHP 7+.
- **Rápido y eficiente:** Le ahorra tiempo al acelerar su proceso de desarrollo.

## Uso

1. Abra su archivo PHP.
2. Haga clic derecho o abra la paleta de comandos (Ctrl+Shift+P o Cmd+Shift+P).
3. Seleccione "Generar Getters y Setters".
4. Los getters y setters se generarán automáticamente.

## Ajustes

Esta extensión proporciona los siguientes ajustes:

- `phpgsg.getterSetterGenerator.autoGenerate`: Omite la ventana de selección rápida y genera automáticamente todos los métodos getter/setter disponibles.
- `phpgsg.getterSetterGenerator.fluentInterface`: Agrega `return $this;` para la interfaz fluida (encadenamiento de métodos) en los métodos setter.
- `phpgsg.getterSetterGenerator.indentSize`: Especifica el tamaño de una sangría (como número de espacios).
- `phpgsg.getterSetterGenerator.indentWithTab`: Utiliza el carácter de tabulación como carácter de sangría en lugar de espacios. (la opción indentSize se calcula como 1)
- `phpgsg.getterSetterGenerator.sortMethods`: Puede priorizar getters o setters, o ordenarlos mezclados al organizar los métodos.
- `phpgsg.getterSetterGenerator.orderBy`: Puede elegir la ordenación alfabética o el orden de propiedad definido en la clase al ordenar los métodos.
- `phpgsg.getterSetterGenerator.contextMenu.constructor`: Muestra u oculta la opción "Generar Constructor" en el menú contextual.
- `phpgsg.getterSetterGenerator.contextMenu.getter`: Muestra u oculta la opción "Generar Getters" en el menú contextual.
- `phpgsg.getterSetterGenerator.contextMenu.setter`: Muestra u oculta la opción "Generar Setters" en el menú contextual.
- `phpgsg.getterSetterGenerator.contextMenu.getterAndSetter`: Muestra u oculta la opción "Generar Getters y Setters" en el menú contextual.

## Instalación

1. Abra VS Code.
2. Abra Apertura rápida (Ctrl+P).
3. Escriba: `ext install tkinali.php-getter-setter-generator`

## Licencia

Este proyecto está licenciado bajo la licencia MIT.

## Informe de problemas

Si encuentra un error o tiene una sugerencia, infórmelo a través de GitHub Issues.
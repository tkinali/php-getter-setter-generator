🇺🇸 [English](./README.md) - 🇧🇬 [Български](./README_BG.md) - 🇨🇿 [Čeština](./README_CS.md) - 🇩🇪 [Deutsch](./README_DE.md) - 🇪🇸 [Español](./README_ES.md) - 🇫🇷 [Français](./README_FR.md) - 🇭🇺 [Magyar](./README_HU.md) - 🇮🇹 [Italiano](./README_IT.md) - 🇯🇵 [日本語](./README_JA.md) - 🇰🇷 [한국어](./README_KO.md) - 🇵🇱 [Polski](./README_PL.md) - 🇧🇷 [Português - Brasil](./README_PT-BR.md) - 🇷🇺 [Русский](./README_RU.md) - 🇹🇷 [Türkçe](./README_TR.md) - 🇨🇳 [简体中文](./README_ZH-CN.md)/[繁體中文](./README_ZH-TW.md)

# PHP Генератор на Getters и Setters

Това разширение за VS Code е проектирано да ускори работния поток на PHP разработчиците. То автоматично генерира getter и setter методи и конструктори за `private` и `protected` свойства на класовете в текущо отворения PHP файл. За разлика от други подобни разширения, това разширение поддържа файлове, съдържащи множество класове, и ви позволява да избирате свойства отделно за всеки клас.

## Характеристики

- **Генериране с едно щракване:** Генерирайте методи getters и setters за свойствата на вашия PHP клас с едно щракване.

![Генериране с едно щракване](images/one-click.gif "Генериране с едно щракване")

- **Поддръжка на множество класове:** Ако във файла има множество класове, можете да генерирате методи getters и setters отделно за всеки.

![Поддръжка на множество класове](images/multi-class.gif "Поддръжка на множество класове")

- **Персонализиран избор:** Осигурява удобен за потребителя интерфейс, където можете да избирате частните свойства на всеки клас поотделно.

![Персонализиран избор](images/property-select.gif "Персонализиран избор")

- **Избор на ред за вмъкване на методи:** Методите getters и setters могат да бъдат вмъкнати в класа в различни редове: първо getters, първо setters или редуващи се.

![Избор на ред за вмъкване на методи](images/flexible-sort.gif "Избор на ред за вмъкване на методи")

- **Генериране на конструктор:** Автоматично генерира конструктори с подсказване на типове и присвояване на свойства.

![Генериране на конструктор](images/constructor.gif "Генериране на конструктор")

- **Гъвкаво сортиране:** Генерираните методи getters/setters могат да бъдат сортирани по азбучен ред (A-Z или Z-A) или според реда, в който са дефинирани свойствата.
- **Fluent интерфейс:** Поддръжка на fluent интерфейс за методи setters за верижно свързване на методи.
- **Поддръжка на модерен PHP:** Поддръжка за декларации на типове PHP 7+.
- **Бързо и ефективно:** Спестява ви време, като ускорява процеса ви на разработка.

## Употреба

1. Отворете вашия PHP файл.
2. Щракнете с десния бутон или отворете командната палитра (Ctrl+Shift+P или Cmd+Shift+P).
3. Изберете "Генериране на Getters и Setters".
4. Getters и setters ще бъдат генерирани автоматично.

## Настройки

Това разширение предоставя следните настройки:

- `phpgsg.getterSetterGenerator.autoGenerate`: Пропуска прозореца за бърз избор и автоматично генерира всички налични методи getter/setter.
- `phpgsg.getterSetterGenerator.fluentInterface`: Добавя `return $this;` за fluent интерфейс (верижно свързване на методи) в методи setters.
- `phpgsg.getterSetterGenerator.indentSize`: Задава размера на отстъп (като брой интервали).
- `phpgsg.getterSetterGenerator.indentWithTab`: Използва символ табулация като символ за отстъп вместо интервали. (опцията indentSize се изчислява като 1)
- `phpgsg.getterSetterGenerator.sortMethods`: Можете да дадете приоритет на getters или setters или да ги сортирате смесено при подреждане на методи.
- `phpgsg.getterSetterGenerator.orderBy`: Можете да изберете азбучно сортиране или реда на свойствата, дефиниран в класа, при сортиране на методи.
- `phpgsg.getterSetterGenerator.contextMenu.constructor`: Показва или скрива опцията "Генериране на Конструктор" в контекстното меню.
- `phpgsg.getterSetterGenerator.contextMenu.getter`: Показва или скрива опцията "Генериране на Гетери" в контекстното меню.
- `phpgsg.getterSetterGenerator.contextMenu.setter`: Показва или скрива опцията "Генериране на Сетери" в контекстното меню.
- `phpgsg.getterSetterGenerator.contextMenu.getterAndSetter`: Показва или скрива опцията "Генериране на Гетери и Сетери" в контекстното меню.

## Инсталация

1. Отворете VS Code.
2. Отворете бързо отваряне (Ctrl+P).
3. Напишете: `ext install tkinali.php-getter-setter-generator`

## Лиценз

Този проект е лицензиран под лиценза MIT.

## Съобщаване на проблеми

Ако откриете грешка или имате предложение, моля, съобщете го чрез GitHub Issues.
🇺🇸 [English](./README.md) - 🇧🇬 [Български](./README_BG.md) - 🇨🇿 [Čeština](./README_CS.md) - 🇩🇪 [Deutsch](./README_DE.md) - 🇪🇸 [Español](./README_ES.md) - 🇫🇷 [Français](./README_FR.md) - 🇭🇺 [Magyar](./README_HU.md) - 🇮🇹 [Italiano](./README_IT.md) - 🇯🇵 [日本語](./README_JA.md) - 🇰🇷 [한국어](./README_KO.md) - 🇵🇱 [Polski](./README_PL.md) - 🇧🇷 [Português - Brasil](./README_PT-BR.md) - 🇷🇺 [Русский](./README_RU.md) - 🇹🇷 [Türkçe](./README_TR.md) - 🇨🇳 [简体中文](./README_ZH-CN.md)/[繁體中文](./README_ZH-TW.md)

# PHP Getter 및 Setter 생성기

이 VS Code 확장 프로그램은 PHP 개발자의 워크플로를 가속화하도록 설계되었습니다. 현재 열려 있는 PHP 파일의 클래스 개인 속성에 대한 getter 및 setter 메서드와 생성자를 자동으로 생성합니다. 다른 유사한 확장 프로그램과 달리 이 확장 프로그램은 여러 클래스가 포함된 파일을 지원하며 각 클래스별로 속성을 개별적으로 선택할 수 있습니다.

## 기능

- **한 번의 클릭으로 생성:** 한 번의 클릭으로 PHP 클래스 속성에 대한 getter 및 setter 메서드를 생성합니다.

![한 번의 클릭으로 생성](images/one-click.gif "한 번의 클릭으로 생성")

- **다중 클래스 지원:** 파일에 여러 클래스가 있는 경우 각 클래스에 대해 개별적으로 getter 및 setter 메서드를 생성할 수 있습니다.

![다중 클래스 지원](images/multi-class.gif "다중 클래스 지원")

- **사용자 정의 가능한 선택:** 각 클래스의 개인 속성을 개별적으로 선택할 수 있는 사용자 친화적인 인터페이스를 제공합니다.

![사용자 정의 가능한 선택](images/property-select.gif "사용자 정의 가능한 선택")

- **메서드 삽입 순서 선택:** getter 및 setter 메서드를 클래스에 다양한 순서로 삽입할 수 있습니다: getter 먼저, setter 먼저 또는 번갈아 가며.

![메서드 삽입 순서 선택](images/flexible-sort.gif "메서드 삽입 순서 선택")

- **생성자 생성:** 유형 힌트 및 속성 할당으로 생성자를 자동으로 생성합니다.

![생성자 생성](images/constructor.gif "생성자 생성")

- **유연한 정렬:** 생성된 getter/setter 메서드를 알파벳순(A-Z 또는 Z-A) 또는 속성이 정의된 순서대로 정렬할 수 있습니다.
- **유창한 인터페이스:** 메서드 체이닝을 위한 setter 메서드의 유창한 인터페이스 지원.
- **최신 PHP 지원:** PHP 7+ 유형 선언 지원.
- **빠르고 효율적:** 개발 프로세스를 가속화하여 시간을 절약합니다.

## 사용법

1. PHP 파일을 엽니다.
2. 마우스 오른쪽 버튼을 클릭하거나 명령 팔레트(Ctrl+Shift+P 또는 Cmd+Shift+P)를 엽니다.
3. "Getter 및 Setter 생성"을 선택합니다.
4. getter 및 setter가 자동으로 생성됩니다.

## 설정

이 확장 프로그램은 다음과 같은 설정을 제공합니다.

- `phpgsg.getterSetterGenerator.autoGenerate`: 빠른 선택 창을 건너뛰고 사용 가능한 모든 getter/setter 메서드를 자동으로 생성합니다.
- `phpgsg.getterSetterGenerator.fluentInterface`: setter 메서드의 유창한 인터페이스(메서드 체이닝)에 대해 `return $this;`를 추가합니다.
- `phpgsg.getterSetterGenerator.indentSize`: 들여쓰기 크기(공백 수)를 지정합니다.
- `phpgsg.getterSetterGenerator.indentWithTab`: 공백 대신 탭 문자를 들여쓰기 문자로 사용합니다. (indentSize 옵션은 1로 계산됩니다.)
- `phpgsg.getterSetterGenerator.sortMethods`: 메서드를 정렬할 때 getter 또는 setter의 우선 순위를 지정하거나 혼합하여 정렬할 수 있습니다.
- `phpgsg.getterSetterGenerator.orderBy`: 메서드를 정렬할 때 알파벳순 정렬 또는 클래스에 정의된 속성 순서를 선택할 수 있습니다.
- `phpgsg.getterSetterGenerator.contextMenu.constructor`: 컨텍스트 메뉴에 "생성자 생성" 옵션을 표시하거나 숨깁니다.
- `phpgsg.getterSetterGenerator.contextMenu.getter`: 컨텍스트 메뉴에 "게터 생성" 옵션을 표시하거나 숨깁니다.
- `phpgsg.getterSetterGenerator.contextMenu.setter`: 컨텍스트 메뉴에 "세터 생성" 옵션을 표시하거나 숨깁니다.
- `phpgsg.getterSetterGenerator.contextMenu.getterAndSetter`: 컨텍스트 메뉴에 "게터 및 세터 생성" 옵션을 표시하거나 숨깁니다.

## 설치

1. VS Code를 엽니다.
2. 빠른 열기(Ctrl+P)를 엽니다.
3. 다음을 입력합니다: `ext install tkinali.php-getter-setter-generator`

## 라이선스

이 프로젝트는 MIT 라이선스에 따라 라이선스가 부여됩니다.

## 문제 보고

버그를 발견하거나 제안 사항이 있는 경우 GitHub Issues를 통해 보고하십시오.
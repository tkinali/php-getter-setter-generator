🇺🇸 [English](./README.md) - 🇧🇬 [Български](./README_BG.md) - 🇨🇿 [Čeština](./README_CS.md) - 🇩🇪 [Deutsch](./README_DE.md) - 🇪🇸 [Español](./README_ES.md) - 🇫🇷 [Français](./README_FR.md) - 🇭🇺 [Magyar](./README_HU.md) - 🇮🇹 [Italiano](./README_IT.md) - 🇯🇵 [日本語](./README_JA.md) - 🇰🇷 [한국어](./README_KO.md) - 🇵🇱 [Polski](./README_PL.md) - 🇧🇷 [Português - Brasil](./README_PT-BR.md) - 🇷🇺 [Русский](./README_RU.md) - 🇹🇷 [Türkçe](./README_TR.md) - 🇨🇳 [简体中文](./README_ZH-CN.md)/[繁體中文](./README_ZH-TW.md)

# PHP GetterとSetterジェネレーター

このVS Code拡張機能は、PHP開発者のワークフローを加速するように設計されています。現在開いているPHPファイルのクラスのプライベートプロパティに対して、getterとsetterメソッドを自動的に生成します。他の同様の拡張機能とは異なり、この拡張機能は複数のクラスを含むファイルをサポートし、各クラスごとにプロパティを個別に選択できます。

## 特徴

- **ワンクリック生成:** ワンクリックでPHPクラスのプロパティのgetterとsetterメソッドを生成します。

![ワンクリック生成](images/one-click.gif "ワンクリック生成")

- **複数クラスのサポート:** ファイルに複数のクラスがある場合、それぞれに対して個別にgetterとsetterメソッドを生成できます。

![複数クラスのサポート](images/multi-class.gif "複数クラスのサポート")

- **カスタマイズ可能な選択:** 各クラスのプライベートプロパティを個別に選択できるユーザーフレンドリーなインターフェースを提供します。

![カスタマイズ可能な選択](images/property-select.gif "カスタマイズ可能な選択")

- **メソッド挿入順序の選択:** getterとsetterメソッドは、クラスにさまざまな順序で挿入できます：最初にgetter、最初にsetter、または交互に。

![メソッド挿入順序の選択](images/flexible-sort.gif "メソッド挿入順序の選択")

- **柔軟なソート:** 生成されたgetter/setterメソッドは、アルファベット順（A-ZまたはZ-A）またはプロパティが定義されている順序でソートできます。
- **Fluentインターフェース:** メソッドチェーンのためのsetterメソッドのFluentインターフェースのサポート。
- **最新のPHPサポート:** PHP 7+型宣言のサポート。
- **高速で効率的:** 開発プロセスを高速化することで時間を節約できます。

## 使用方法

1. PHPファイルを開きます。
2. 右クリックするか、コマンドパレット（Ctrl+Shift+PまたはCmd+Shift+P）を開きます。
3. 「GetterとSetterを生成」を選択します。
4. getterとsetterが自動的に生成されます。

## 設定

この拡張機能は、次の設定を提供します。

- `phpgsg.getterSetterGenerator.autoGenerate`: クイック選択ウィンドウをスキップし、利用可能なすべてのgetter/setterメソッドを自動的に生成します。
- `phpgsg.getterSetterGenerator.fluentInterface`: setterメソッドのFluentインターフェース（メソッドチェーン）のために`return $this;`を追加します。
- `phpgsg.getterSetterGenerator.indentSize`: インデントのサイズ（スペースの数として）を指定します。
- `phpgsg.getterSetterGenerator.indentWithTab`: スペースの代わりにタブ文字をインデント文字として使用します。（indentSizeオプションは1として計算されます）
- `phpgsg.getterSetterGenerator.sortMethods`: メソッドを配置するときに、getterまたはsetterを優先するか、混合してソートできます。
- `phpgsg.getterSetterGenerator.orderBy`: メソッドをソートするときに、アルファベット順またはクラスで定義されたプロパティの順序を選択できます。

## インストール

1. VS Codeを開きます。
2. クイックオープン（Ctrl+P）を開きます。
3. 以下を入力します：`ext install tkinali.php-getter-setter-generator`

## ライセンス

このプロジェクトはMITライセンスの下でライセンスされています。

## 問題の報告

バグを見つけた場合、または提案がある場合は、GitHub Issuesを通じて報告してください。
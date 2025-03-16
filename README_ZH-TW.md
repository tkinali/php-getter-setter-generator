🇺🇸 [English](./README.md) - 🇧🇬 [Български](./README_BG.md) - 🇨🇿 [Čeština](./README_CS.md) - 🇩🇪 [Deutsch](./README_DE.md) - 🇪🇸 [Español](./README_ES.md) - 🇫🇷 [Français](./README_FR.md) - 🇭🇺 [Magyar](./README_HU.md) - 🇮🇹 [Italiano](./README_IT.md) - 🇯🇵 [日本語](./README_JA.md) - 🇰🇷 [한국어](./README_KO.md) - 🇵🇱 [Polski](./README_PL.md) - 🇧🇷 [Português - Brasil](./README_PT-BR.md) - 🇷🇺 [Русский](./README_RU.md) - 🇹🇷 [Türkçe](./README_TR.md) - 🇨🇳 [简体中文](./README_ZH-CN.md)/[繁體中文](./README_ZH-TW.md)

# PHP Getter 和 Setter 生成器

這個 VS Code 擴充功能旨在加速 PHP 開發人員的工作流程。它為目前開啟的 PHP 檔案中類別的 `private` 和 `protected` 屬性自動產生 getter 和 setter 方法以及建構函式。與其他類似的擴充功能不同，此擴充功能支援包含多個類別的檔案，並允許您為每個類別單獨選擇屬性。

## 特點

- **一鍵生成：** 一鍵為您的 PHP 類別屬性產生 getter 和 setter 方法。

![一鍵生成](images/one-click.gif "一鍵生成")

- **多類別支援：** 如果檔案包含多個類別，您可以為每個類別單獨產生 getter 和 setter 方法。

![多類別支援](images/multi-class.gif "多類別支援")

- **可自訂選擇：** 提供一個使用者友善的介面，您可以在其中單獨選擇每個類別的私有屬性。

![可自訂選擇](images/property-select.gif "可自訂選擇")

- **方法插入順序選擇：** getter 和 setter 方法可以以不同的順序插入到類別中：getter 優先，setter 優先或交替。

![方法插入順序選擇](images/flexible-sort.gif "方法插入順序選擇")

- **建構子產生:** 自動產生帶有類型提示和屬性指派的建構子。

![建構子產生](images/constructor.gif "建構子產生")

- **靈活排序：** 產生的 getter/setter 方法可以按字母順序（A-Z 或 Z-A）或按定義屬性的順序排序。
- **流暢的介面：** 為 setter 方法提供流暢的介面支援，以實現方法鏈。
- **現代 PHP 支援：** 支援 PHP 7+ 類型宣告。
- **快速高效：** 透過加速您的開發過程來節省您的時間。

## 用法

1. 開啟您的 PHP 檔案。
2. 右鍵點擊或開啟命令面板 (Ctrl+Shift+P 或 Cmd+Shift+P)。
3. 選擇“產生 Getter 和 Setter”。
4. getter 和 setter 將自動產生。

## 設定

此擴充功能提供以下設定：

- `phpgsg.getterSetterGenerator.autoGenerate`：跳過快速選擇視窗並自動產生所有可用的 getter/setter 方法。
- `phpgsg.getterSetterGenerator.fluentInterface`：在 setter 方法中新增 `return $this;` 以實現流暢的介面（方法鏈）。
- `phpgsg.getterSetterGenerator.indentSize`：指定縮排的大小（以空格數為單位）。
- `phpgsg.getterSetterGenerator.indentWithTab`：使用定位字元代替空格作為縮排字元。 （indentSize 選項計算為 1）
- `phpgsg.getterSetterGenerator.sortMethods`：在排列方法時，您可以優先考慮 getter 或 setter，或者將它們混合排序。
- `phpgsg.getterSetterGenerator.orderBy`：在對方法進行排序時，您可以選擇字母排序或類別中定義的屬性順序。
- `phpgsg.getterSetterGenerator.contextMenu.constructor`: 在上下文選單中顯示或隱藏「產生建構子」選項。
- `phpgsg.getterSetterGenerator.contextMenu.getter`: 在上下文選單中顯示或隱藏「產生 Getter」選項。
- `phpgsg.getterSetterGenerator.contextMenu.setter`: 在上下文選單中顯示或隱藏「產生 Setter」選項。
- `phpgsg.getterSetterGenerator.contextMenu.getterAndSetter`: 在上下文選單中顯示或隱藏「產生 Getter 和 Setter」選項.

## 安裝

1. 開啟 VS Code。
2. 開啟快速開啟 (Ctrl+P)。
3. 輸入：`ext install tkinali.php-getter-setter-generator`

## 許可證

該專案根據 MIT 許可證獲得許可。

## 問題報告

如果您發現錯誤或有建議，請透過 GitHub Issues 報告。
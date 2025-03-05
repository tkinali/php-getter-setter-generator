🇺🇸 [English](./README.md) - 🇧🇬 [Български](./README_BG.md) - 🇨🇿 [Čeština](./README_CS.md) - 🇩🇪 [Deutsch](./README_DE.md) - 🇪🇸 [Español](./README_ES.md) - 🇫🇷 [Français](./README_FR.md) - 🇭🇺 [Magyar](./README_HU.md) - 🇮🇹 [Italiano](./README_IT.md) - 🇯🇵 [日本語](./README_JA.md) - 🇰🇷 [한국어](./README_KO.md) - 🇵🇱 [Polski](./README_PL.md) - 🇧🇷 [Português - Brasil](./README_PT-BR.md) - 🇷🇺 [Русский](./README_RU.md) - 🇹🇷 [Türkçe](./README_TR.md) - 🇨🇳 [简体中文](./README_ZH-CN.md)/[繁體中文](./README_ZH-TW.md)

# Generátor Getterů a Setterů pro PHP

Toto rozšíření pro VS Code je navrženo tak, aby urychlilo pracovní postup vývojářů PHP. Automaticky generuje metody getterů a setterů pro soukromé vlastnosti tříd v aktuálně otevřeném souboru PHP. Na rozdíl od jiných podobných rozšíření toto rozšíření podporuje soubory obsahující více tříd a umožňuje vám vybrat vlastnosti samostatně pro každou třídu.

## Funkce

- **Generování jedním kliknutím:** Generujte metody getterů a setterů pro vlastnosti vaší třídy PHP jediným kliknutím.

![Generování jedním kliknutím](images/one-click.gif "Generování jedním kliknutím")

- **Podpora více tříd:** Pokud soubor obsahuje více tříd, můžete generovat metody getterů a setterů samostatně pro každou z nich.

![Podpora více tříd](images/multi-class.gif "Podpora více tříd")

- **Přizpůsobitelný výběr:** Poskytuje uživatelsky přívětivé rozhraní, kde můžete vybrat soukromé vlastnosti každé třídy samostatně.

![Přizpůsobitelný výběr](images/property-select.gif "Přizpůsobitelný výběr")

- **Výběr pořadí vkládání metod:** Metody getterů a setterů lze do třídy vkládat v různém pořadí: nejprve gettery, nejprve settery nebo střídavě.

![Výběr pořadí vkládání metod](images/flexible-sort.gif "Výběr pořadí vkládání metod")

- **Flexibilní řazení:** Generované metody getterů/setterů lze řadit abecedně (A-Z nebo Z-A) nebo podle pořadí, v jakém jsou definovány vlastnosti.
- **Fluent rozhraní:** Podpora fluent rozhraní pro metody setterů pro řetězení metod.
- **Podpora moderního PHP:** Podpora deklarací typů PHP 7+.
- **Rychlé a efektivní:** Šetří vám čas urychlením procesu vývoje.

## Použití

1. Otevřete soubor PHP.
2. Klikněte pravým tlačítkem nebo otevřete paletu příkazů (Ctrl+Shift+P nebo Cmd+Shift+P).
3. Vyberte "Generovat gettery a settery".
4. Gettery a settery budou vygenerovány automaticky.

## Nastavení

Toto rozšíření poskytuje následující nastavení:

- `phpgsg.getterSetterGenerator.autoGenerate`: Přeskočí okno rychlého výběru a automaticky vygeneruje všechny dostupné metody getter/setter.
- `phpgsg.getterSetterGenerator.fluentInterface`: Přidá `return $this;` pro fluent rozhraní (řetězení metod) v metodách setterů.
- `phpgsg.getterSetterGenerator.indentSize`: Určuje velikost odsazení (jako počet mezer).
- `phpgsg.getterSetterGenerator.indentWithTab`: Používá znak tabulátoru jako znak odsazení namísto mezer. (možnost indentSize se počítá jako 1)
- `phpgsg.getterSetterGenerator.sortMethods`: Při uspořádání metod můžete upřednostnit gettery nebo settery nebo je seřadit smíšeně.
- `phpgsg.getterSetterGenerator.orderBy`: Při řazení metod můžete zvolit abecední řazení nebo pořadí vlastností definované ve třídě.

## Instalace

1. Otevřete VS Code.
2. Otevřete rychlé otevření (Ctrl+P).
3. Zadejte: `ext install tkinali.php-getter-setter-generator`

## Licence

Tento projekt je licencován pod licencí MIT.

## Hlášení problémů

Pokud narazíte na chybu nebo máte návrh, nahlaste jej prosím prostřednictvím GitHub Issues.
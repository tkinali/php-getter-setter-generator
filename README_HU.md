🇺🇸 [English](./README.md) - 🇧🇬 [Български](./README_BG.md) - 🇨🇿 [Čeština](./README_CS.md) - 🇩🇪 [Deutsch](./README_DE.md) - 🇪🇸 [Español](./README_ES.md) - 🇫🇷 [Français](./README_FR.md) - 🇭🇺 [Magyar](./README_HU.md) - 🇮🇹 [Italiano](./README_IT.md) - 🇯🇵 [日本語](./README_JA.md) - 🇰🇷 [한국어](./README_KO.md) - 🇵🇱 [Polski](./README_PL.md) - 🇧🇷 [Português - Brasil](./README_PT-BR.md) - 🇷🇺 [Русский](./README_RU.md) - 🇹🇷 [Türkçe](./README_TR.md) - 🇨🇳 [简体中文](./README_ZH-CN.md)/[繁體中文](./README_ZH-TW.md)

# PHP Getter és Setter Generátor

Ez a VS Code kiterjesztés a PHP fejlesztők munkafolyamatának felgyorsítására lett tervezve. Automatikusan generál getter és setter metódusokat az osztályok privát tulajdonságaihoz a jelenleg megnyitott PHP fájlban. Más hasonló kiterjesztésektől eltérően ez a kiterjesztés támogatja a több osztályt tartalmazó fájlokat, és lehetővé teszi a tulajdonságok külön kiválasztását minden osztályhoz.

## Jellemzők

- **Egy kattintásos generálás:** Generáljon getter és setter metódusokat a PHP osztály tulajdonságaihoz egyetlen kattintással.

![Egy kattintásos generálás](images/one-click.gif "Egy kattintásos generálás")

- **Több osztály támogatása:** Ha a fájl több osztályt tartalmaz, külön-külön generálhat getter és setter metódusokat mindegyikhez.

![Több osztály támogatása](images/multi-class.gif "Több osztály támogatása")

- **Testreszabható kiválasztás:** Felhasználóbarát felületet biztosít, ahol külön-külön kiválaszthatja az egyes osztályok privát tulajdonságait.

![Testreszabható kiválasztás](images/property-select.gif "Testreszabható kiválasztás")

- **Metódus beszúrási sorrend kiválasztása:** A getter és setter metódusok különböző sorrendben szúrhatók be az osztályba: először getterek, először setterek vagy felváltva.

![Metódus beszúrási sorrend kiválasztása](images/flexible-sort.gif "Metódus beszúrási sorrend kiválasztása")

- **Rugalmas rendezés:** A generált getter/setter metódusok rendezhetők ábécé sorrendben (A-Z vagy Z-A) vagy a tulajdonságok definiálásának sorrendjében.
- **Fluent interfész:** Fluent interfész támogatása a setter metódusokhoz a metódusláncoláshoz.
- **Modern PHP támogatás:** PHP 7+ típusdeklarációk támogatása.
- **Gyors és hatékony:** Időt takarít meg a fejlesztési folyamat felgyorsításával.

## Használat

1. Nyissa meg a PHP fájlt.
2. Kattintson jobb gombbal vagy nyissa meg a Parancspalettát (Ctrl+Shift+P vagy Cmd+Shift+P).
3. Válassza a "Getterek és Setterek generálása" lehetőséget.
4. A getterek és setterek automatikusan generálódnak.

## Beállítások

Ez a kiterjesztés a következő beállításokat kínálja:

- `phpgsg.getterSetterGenerator.autoGenerate`: Kihagyja a gyors kiválasztási ablakot, és automatikusan generálja az összes elérhető getter/setter metódust.
- `phpgsg.getterSetterGenerator.fluentInterface`: Hozzáadja a `return $this;` kifejezést a fluent interfészhez (metódusláncolás) a setter metódusokban.
- `phpgsg.getterSetterGenerator.indentSize`: Meghatározza a behúzás méretét (szóközök számában).
- `phpgsg.getterSetterGenerator.indentWithTab`: A szóközök helyett tabulátor karaktert használ behúzási karakterként. (az indentSize opció 1-ként van kiszámítva)
- `phpgsg.getterSetterGenerator.sortMethods`: A metódusok rendezésekor prioritást adhat a gettereknek vagy settereknek, vagy vegyesen rendezheti őket.
- `phpgsg.getterSetterGenerator.orderBy`: A metódusok rendezésekor választhat ábécé sorrendet vagy az osztályban definiált tulajdonságsorrendet.

## Telepítés

1. Nyissa meg a VS Code-ot.
2. Nyissa meg a Gyors megnyitást (Ctrl+P).
3. Írja be: `ext install tkinali.php-getter-setter-generator`

## Licenc

Ez a projekt MIT licenc alatt van licencelve.

## Probléma jelentése

Ha hibát talál vagy javaslata van, kérjük, jelentse azt a GitHub Issues-on keresztül.
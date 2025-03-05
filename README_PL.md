🇺🇸 [English](./README.md) - 🇧🇬 [Български](./README_BG.md) - 🇨🇿 [Čeština](./README_CS.md) - 🇩🇪 [Deutsch](./README_DE.md) - 🇪🇸 [Español](./README_ES.md) - 🇫🇷 [Français](./README_FR.md) - 🇭🇺 [Magyar](./README_HU.md) - 🇮🇹 [Italiano](./README_IT.md) - 🇯🇵 [日本語](./README_JA.md) - 🇰🇷 [한국어](./README_KO.md) - 🇵🇱 [Polski](./README_PL.md) - 🇧🇷 [Português - Brasil](./README_PT-BR.md) - 🇷🇺 [Русский](./README_RU.md) - 🇹🇷 [Türkçe](./README_TR.md) - 🇨🇳 [简体中文](./README_ZH-CN.md)/[繁體中文](./README_ZH-TW.md)

# Generator Getterów i Setterów PHP

To rozszerzenie VS Code zostało zaprojektowane w celu przyspieszenia przepływu pracy programistów PHP. Automatycznie generuje metody getterów i setterów dla prywatnych właściwości klas w aktualnie otwartym pliku PHP. W przeciwieństwie do innych podobnych rozszerzeń, to rozszerzenie obsługuje pliki zawierające wiele klas i umożliwia oddzielne wybieranie właściwości dla każdej klasy.

## Funkcje

- **Generowanie jednym kliknięciem:** Generuj metody getterów i setterów dla właściwości twojej klasy PHP jednym kliknięciem.

![Generowanie jednym kliknięciem](images/one-click.gif "Generowanie jednym kliknięciem")

- **Obsługa wielu klas:** Jeśli plik zawiera wiele klas, możesz generować metody getterów i setterów oddzielnie dla każdej z nich.

![Obsługa wielu klas](images/multi-class.gif "Obsługa wielu klas")

- **Konfigurowalny wybór:** Zapewnia przyjazny dla użytkownika interfejs, w którym możesz oddzielnie wybierać prywatne właściwości każdej klasy.

![Konfigurowalny wybór](images/property-select.gif "Konfigurowalny wybór")

- **Wybór kolejności wstawiania metod:** Metody getterów i setterów można wstawiać do klasy w różnych kolejnościach: najpierw gettery, najpierw settery lub naprzemiennie.

![Wybór kolejności wstawiania metod](images/flexible-sort.gif "Wybór kolejności wstawiania metod")

- **Elastyczne sortowanie:** Wygenerowane metody getterów/setterów można sortować alfabetycznie (A-Z lub Z-A) lub według kolejności, w jakiej zdefiniowano właściwości.
- **Płynny interfejs:** Obsługa płynnego interfejsu dla metod setterów w celu łańcuchowania metod.
- **Obsługa nowoczesnego PHP:** Obsługa deklaracji typów PHP 7+.
- **Szybkie i wydajne:** Oszczędza czas, przyspieszając proces rozwoju.

## Użycie

1. Otwórz swój plik PHP.
2. Kliknij prawym przyciskiem myszy lub otwórz paletę poleceń (Ctrl+Shift+P lub Cmd+Shift+P).
3. Wybierz "Generuj Gettery i Settery".
4. Gettery i settery zostaną wygenerowane automatycznie.

## Ustawienia

To rozszerzenie oferuje następujące ustawienia:

- `phpgsg.getterSetterGenerator.autoGenerate`: Pomija okno szybkiego wyboru i automatycznie generuje wszystkie dostępne metody getterów/setterów.
- `phpgsg.getterSetterGenerator.fluentInterface`: Dodaje `return $this;` dla płynnego interfejsu (łańcuchowanie metod) w metodach setterów.
- `phpgsg.getterSetterGenerator.indentSize`: Określa rozmiar wcięcia (jako liczbę spacji).
- `phpgsg.getterSetterGenerator.indentWithTab`: Używa znaku tabulacji jako znaku wcięcia zamiast spacji. (opcja indentSize jest obliczana jako 1)
- `phpgsg.getterSetterGenerator.sortMethods`: Możesz nadać priorytet getterom lub setterom, lub sortować je mieszanie podczas układania metod.
- `phpgsg.getterSetterGenerator.orderBy`: Możesz wybrać sortowanie alfabetyczne lub kolejność właściwości zdefiniowaną w klasie podczas sortowania metod.

## Instalacja

1. Otwórz VS Code.
2. Otwórz Szybkie otwieranie (Ctrl+P).
3. Wpisz: `ext install tkinali.php-getter-setter-generator`

## Licencja

Ten projekt jest licencjonowany na licencji MIT.

## Zgłaszanie problemów

Jeśli znajdziesz błąd lub masz sugestię, zgłoś to za pośrednictwem GitHub Issues.
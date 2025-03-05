🇺🇸 [English](./README.md) - 🇧🇬 [Български](./README_BG.md) - 🇨🇿 [Čeština](./README_CS.md) - 🇩🇪 [Deutsch](./README_DE.md) - 🇪🇸 [Español](./README_ES.md) - 🇫🇷 [Français](./README_FR.md) - 🇭🇺 [Magyar](./README_HU.md) - 🇮🇹 [Italiano](./README_IT.md) - 🇯🇵 [日本語](./README_JA.md) - 🇰🇷 [한국어](./README_KO.md) - 🇵🇱 [Polski](./README_PL.md) - 🇧🇷 [Português - Brasil](./README_PT-BR.md) - 🇷🇺 [Русский](./README_RU.md) - 🇹🇷 [Türkçe](./README_TR.md) - 🇨🇳 [简体中文](./README_ZH-CN.md)/[繁體中文](./README_ZH-TW.md)

# Generatore di Getter e Setter PHP

Questa estensione VS Code è progettata per accelerare il flusso di lavoro degli sviluppatori PHP. Genera automaticamente metodi getter e setter per le proprietà private delle classi nel file PHP attualmente aperto. A differenza di altre estensioni simili, questa estensione supporta file contenenti più classi e consente di selezionare le proprietà separatamente per ciascuna classe.

## Caratteristiche

- **Generazione con un clic:** Genera metodi getter e setter per le proprietà della tua classe PHP con un solo clic.

![Generazione con un clic](images/one-click.gif "Generazione con un clic")

- **Supporto multi-classe:** Se il file contiene più classi, puoi generare metodi getter e setter separatamente per ciascuna.

![Supporto multi-classe](images/multi-class.gif "Supporto multi-classe")

- **Selezione personalizzabile:** Fornisce un'interfaccia intuitiva dove puoi selezionare le proprietà private di ciascuna classe separatamente.

![Selezione personalizzabile](images/property-select.gif "Selezione personalizzabile")

- **Selezione dell'ordine di inserimento dei metodi:** I metodi getter e setter possono essere inseriti nella classe in vari ordini: prima i getter, prima i setter o alternati.

![Selezione dell'ordine di inserimento dei metodi](images/flexible-sort.gif "Selezione dell'ordine di inserimento dei metodi")

- **Ordinamento flessibile:** I metodi getter/setter generati possono essere ordinati alfabeticamente (A-Z o Z-A) o in base all'ordine in cui sono definite le proprietà.
- **Interfaccia fluida:** Supporto dell'interfaccia fluida per i metodi setter per il concatenamento dei metodi.
- **Supporto PHP moderno:** Supporto per le dichiarazioni di tipo PHP 7+.
- **Veloce ed efficiente:** Ti fa risparmiare tempo accelerando il tuo processo di sviluppo.

## Utilizzo

1. Apri il tuo file PHP.
2. Fai clic con il pulsante destro del mouse o apri la tavolozza dei comandi (Ctrl+Shift+P o Cmd+Shift+P).
3. Seleziona "Genera Getter e Setter".
4. I getter e i setter verranno generati automaticamente.

## Impostazioni

Questa estensione fornisce le seguenti impostazioni:

- `phpgsg.getterSetterGenerator.autoGenerate`: Salta la finestra di selezione rapida e genera automaticamente tutti i metodi getter/setter disponibili.
- `phpgsg.getterSetterGenerator.fluentInterface`: Aggiunge `return $this;` per l'interfaccia fluida (concatenamento dei metodi) nei metodi setter.
- `phpgsg.getterSetterGenerator.indentSize`: Specifica la dimensione di un rientro (come numero di spazi).
- `phpgsg.getterSetterGenerator.indentWithTab`: Utilizza il carattere di tabulazione come carattere di rientro invece degli spazi. (l'opzione indentSize viene calcolata come 1)
- `phpgsg.getterSetterGenerator.sortMethods`: Puoi dare la priorità ai getter o ai setter, oppure ordinarli in modo misto quando organizzi i metodi.
- `phpgsg.getterSetterGenerator.orderBy`: Puoi scegliere l'ordinamento alfabetico o l'ordine delle proprietà definito nella classe quando ordini i metodi.

## Installazione

1. Apri VS Code.
2. Apri Apertura rapida (Ctrl+P).
3. Digita: `ext install tkinali.php-getter-setter-generator`

## Licenza

Questo progetto è concesso in licenza con licenza MIT.

## Segnalazione di problemi

Se trovi un bug o hai un suggerimento, segnalalo tramite GitHub Issues.
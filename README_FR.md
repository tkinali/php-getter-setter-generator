🇺🇸 [English](./README.md) - 🇧🇬 [Български](./README_BG.md) - 🇨🇿 [Čeština](./README_CS.md) - 🇩🇪 [Deutsch](./README_DE.md) - 🇪🇸 [Español](./README_ES.md) - 🇫🇷 [Français](./README_FR.md) - 🇭🇺 [Magyar](./README_HU.md) - 🇮🇹 [Italiano](./README_IT.md) - 🇯🇵 [日本語](./README_JA.md) - 🇰🇷 [한국어](./README_KO.md) - 🇵🇱 [Polski](./README_PL.md) - 🇧🇷 [Português - Brasil](./README_PT-BR.md) - 🇷🇺 [Русский](./README_RU.md) - 🇹🇷 [Türkçe](./README_TR.md) - 🇨🇳 [简体中文](./README_ZH-CN.md)/[繁體中文](./README_ZH-TW.md)

# Générateur de Getters et Setters PHP

Cette extension VS Code est conçue pour accélérer le flux de travail des développeurs PHP. Elle génère automatiquement des méthodes getter et setter et des constructeurs pour les propriétés privées des classes dans le fichier PHP actuellement ouvert. Contrairement à d'autres extensions similaires, cette extension prend en charge les fichiers contenant plusieurs classes et vous permet de sélectionner les propriétés séparément pour chaque classe.

## Fonctionnalités

- **Génération en un clic:** Générez des méthodes getter et setter pour les propriétés de votre classe PHP en un seul clic.

![Génération en un clic](images/one-click.gif "Génération en un clic")

- **Prise en charge de plusieurs classes:** Si le fichier contient plusieurs classes, vous pouvez générer des méthodes getter et setter séparément pour chacune.

![Prise en charge de plusieurs classes](images/multi-class.gif "Prise en charge de plusieurs classes")

- **Sélection personnalisable:** Fournit une interface conviviale où vous pouvez sélectionner les propriétés privées de chaque classe séparément.

![Sélection personnalisable](images/property-select.gif "Sélection personnalisable")

- **Sélection de l'ordre d'insertion des méthodes:** Les méthodes getter et setter peuvent être insérées dans la classe dans différents ordres : getters en premier, setters en premier ou en alternance.

![Sélection de l'ordre d'insertion des méthodes](images/flexible-sort.gif "Sélection de l'ordre d'insertion des méthodes")

- **Génération de constructeurs:** Génère automatiquement des constructeurs avec indication de type et attribution de propriétés.

![Génération de constructeurs](images/constructor.gif "Génération de constructeurs")

- **Tri flexible:** Les méthodes getter/setter générées peuvent être triées par ordre alphabétique (A-Z ou Z-A) ou selon l'ordre dans lequel les propriétés sont définies.
- **Interface fluide:** Prise en charge de l'interface fluide pour les méthodes setter pour le chaînage de méthodes.
- **Prise en charge de PHP moderne:** Prise en charge des déclarations de type PHP 7+.
- **Rapide et efficace:** Vous fait gagner du temps en accélérant votre processus de développement.

## Utilisation

1. Ouvrez votre fichier PHP.
2. Cliquez avec le bouton droit ou ouvrez la palette de commandes (Ctrl+Shift+P ou Cmd+Shift+P).
3. Sélectionnez "Générer les Getters et Setters".
4. Les getters et setters seront générés automatiquement.

## Paramètres

Cette extension fournit les paramètres suivants :

- `phpgsg.getterSetterGenerator.autoGenerate`: Ignore la fenêtre de sélection rapide et génère automatiquement toutes les méthodes getter/setter disponibles.
- `phpgsg.getterSetterGenerator.fluentInterface`: Ajoute `return $this;` pour l'interface fluide (chaînage de méthodes) dans les méthodes setter.
- `phpgsg.getterSetterGenerator.indentSize`: Spécifie la taille d'une indentation (en nombre d'espaces).
- `phpgsg.getterSetterGenerator.indentWithTab`: Utilise le caractère de tabulation comme caractère d'indentation au lieu des espaces. (l'option indentSize est calculée comme 1)
- `phpgsg.getterSetterGenerator.sortMethods`: Vous pouvez donner la priorité aux getters ou aux setters, ou les trier de manière mixte lors de l'organisation des méthodes.
- `phpgsg.getterSetterGenerator.orderBy`: Vous pouvez choisir le tri alphabétique ou l'ordre des propriétés défini dans la classe lors du tri des méthodes.
- `phpgsg.getterSetterGenerator.contextMenu.constructor`: Affiche ou masque l'option "Générer un Constructeur" dans le menu contextuel.
- `phpgsg.getterSetterGenerator.contextMenu.getter`: Affiche ou masque l'option "Générer des Getters" dans le menu contextuel.
- `phpgsg.getterSetterGenerator.contextMenu.setter`: Affiche ou masque l'option "Générer des Setters" dans le menu contextuel.
- `phpgsg.getterSetterGenerator.contextMenu.getterAndSetter`: Affiche ou masque l'option "Générer des Getters et des Setters" dans le menu contextuel.

## Installation

1. Ouvrez VS Code.
2. Ouvrez l'ouverture rapide (Ctrl+P).
3. Tapez : `ext install tkinali.php-getter-setter-generator`

## Licence

Ce projet est sous licence MIT.

## Signalement de problèmes

Si vous trouvez un bug ou avez une suggestion, veuillez le signaler via GitHub Issues.
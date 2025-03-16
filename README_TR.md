🇺🇸 [English](./README.md) - 🇧🇬 [Български](./README_BG.md) - 🇨🇿 [Čeština](./README_CS.md) - 🇩🇪 [Deutsch](./README_DE.md) - 🇪🇸 [Español](./README_ES.md) - 🇫🇷 [Français](./README_FR.md) - 🇭🇺 [Magyar](./README_HU.md) - 🇮🇹 [Italiano](./README_IT.md) - 🇯🇵 [日本語](./README_JA.md) - 🇰🇷 [한국어](./README_KO.md) - 🇵🇱 [Polski](./README_PL.md) - 🇧🇷 [Português - Brasil](./README_PT-BR.md) - 🇷🇺 [Русский](./README_RU.md) - 🇹🇷 [Türkçe](./README_TR.md) - 🇨🇳 [简体中文](./README_ZH-CN.md)/[繁體中文](./README_ZH-TW.md)

# PHP Getter ve Setter Generator

Bu VS Code eklentisi, PHP geliştiricilerinin iş akışını hızlandırmak için tasarlanmıştır. Açık olan PHP dosyasındaki sınıfların `private` ve `protected` özelliklerine otomatik olarak getter ve setter yöntemleri ile kurucular oluşturur. Diğer benzer uzantılardan farklı olarak, bu uzantı birden fazla sınıf içeren dosyaları destekler ve her sınıf için özellikleri ayrı ayrı seçmenize olanak tanır.

## Özellikler

- **Tek Tıkla Oluşturma:** PHP sınıf özellikleriniz için getter ve setter metodlarını tek tıkla oluşturma.

![Tek Tıkla Oluşturma](images/one-click.gif "Tek Tıkla Oluşturma")

- **Çoklu Sınıf Desteği:** Dosyada birden fazla sınıf varsa, her biri için ayrı ayrı getter ve setter metotları oluşturabilir.

![Çoklu Sınıf Desteği](images/multi-class.gif "Çoklu Sınıf Desteği")

- **Özelleştirilebilir Seçim:** Her sınıfın özel özelliklerini ayrı ayrı seçebileceğiniz kullanıcı dostu bir arayüz sunar.

![Özelleştirilebilir Seçim](images/property-select.gif "Özelleştirilebilir Seçim")

- **Metot Ekleme Şekli Seçimi:** Getter ve setter metotları, sınıfa getter'lar önce, setter'lar sonra, setter'lar önce, getter'lar sonra veya bir getter bir setter şeklinde eklenebilir.

![Metot Ekleme Şekli Seçimi](images/flexible-sort.gif "Metot Ekleme Şekli Seçimi")

- **Constructor Oluşturma:** Tür ipuçları ve özellik ataması ile otomatik olarak constructor oluşturur.

![Constructor Oluşturma](images/constructor.gif "Constructor Oluşturma")

- **Esnek Sıralama:** Oluşturulan getter/setter metotları, alfabetik (A-Z veya Z-A) veya özelliklerin tanımlanma sırasına göre sıralanabilir.
- **Akıcı Arayüz:** Method zincirlemesi için setter metodlarında fluent interface desteği.
- **Modern PHP Desteği:** PHP 7+ tip tanımlamaları desteği.
- **Hızlı ve Verimli:** Geliştirme sürecinizi hızlandırarak zamandan tasarruf etmenizi sağlar.

## Kullanım

1. PHP dosyanızı açın
2. Sağ tıklayın ya da Komut paletini açın (Ctrl+Shift+P veya Cmd+Shift+P).
3. "Getter ve Setter'ları Oluştur" seçeneğini seçin
4. Getter ve setter'lar otomatik olarak oluşturulacaktır

## Ayarlar

Bu eklenti aşağıdaki ayarları sunar:

- `phpgsg.getterSetterGenerator.autoGenerate`: Hızlı seçim penceresini atlar ve mevcut tüm getter/setter metotlarını otomatik olarak oluşturur.
- `phpgsg.getterSetterGenerator.fluentInterface`: Setter metotlarında akıcı arayüz (metot zincirleme) için `return $this;` ifadesini ekler.
- `phpgsg.getterSetterGenerator.indentSize`: Bir girintinin boyutunu (boşluk sayısı olarak) belirler.
- `phpgsg.getterSetterGenerator.indentWithTab`: Girinti karakteri olarak boşluk yerine sekme karakterini kullanır. (indentSize seçeneği 1 olarak hesaplanır)
- `phpgsg.getterSetterGenerator.sortMethods`: Metotları düzenlerken getter veya setter'lara önceklik verebilir ya da karışık sıralayabilirsiniz.
- `phpgsg.getterSetterGenerator.orderBy`: Metotları sıralarken alfabetik sıralama ya da sınıfta belirlenen özellik sıralamasını tercih edebilirsiniz.
- `phpgsg.getterSetterGenerator.contextMenu.constructor`: Sağ tık menüsünde "Constructor Oluştur" seçeneğini gösterir veya gizler.
- `phpgsg.getterSetterGenerator.contextMenu.getter`: Sağ tık menüsünde "Getter'ları Oluştur" seçeneğini gösterir veya gizler.
- `phpgsg.getterSetterGenerator.contextMenu.setter`: Sağ tık menüsünde "Setter'ları Oluştur" seçeneğini gösterir veya gizler.
- `phpgsg.getterSetterGenerator.contextMenu.getterAndSetter`: Sağ tık menüsünde "Getter'ları ve Setter'ları Oluştur" seçeneğini gösterir veya gizler.

## Kurulum

1. VS Code'u açın
2. Quick Open'ı açın (Ctrl+P)
3. Şunu yazın: `ext install tkinali.php-getter-setter-generator`

## Lisans

Bu proje MIT lisansı altında lisanslanmıştır.

## Sorun Bildirme

Bir hata bulduysanız veya öneriniz varsa, lütfen GitHub Issues üzerinden bildirin.

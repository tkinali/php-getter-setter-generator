[English](./README_EN.md)

# PHP Getter ve Setter Generator

PHP sınıfları için getter ve setter metodlarını otomatik olarak oluşturan bir Visual Studio Code eklentisi.

## Özellikler

- PHP sınıf özellikleriniz için getter ve setter metodlarını tek tıkla oluşturma
- Özelleştirilebilir getter ve setter şablonları
- Nullable tip desteği
- Method zincirlemesi için setter metodlarında fluent interface desteği
- PHP 7+ tip tanımlamaları desteği

## Kullanım

1. PHP dosyanızı açın
2. Sağ tıklayın ve "Getter ve Setter'ları Oluştur" seçeneğini seçin
3. Getter ve setter'lar otomatik olarak oluşturulacaktır

## Ayarlar

Bu eklenti aşağıdaki ayarları sunar:

- `phpgsg.getterSetterGenerator.autoGenerate`: Sınıf özelliği eklendiğinde getter ve setter'ları otomatik oluşturur
  - Varsayılan: `false`

- `phpgsg.getterSetterGenerator.getterTemplate`: Getter metodu için şablon
  - Varsayılan:
    ```php
    public function get{{name}}(): {{nullable}}{{type}}
    {
        return $this->{{variable}};
    }
    ```

- `phpgsg.getterSetterGenerator.setterTemplate`: Setter metodu için şablon
  - Varsayılan:
    ```php
    public function set{{name}}({{nullable}}{{type}} ${{variable}}): self
    {
        $this->{{variable}} = ${{variable}};
        return $this;
    }
    ```
- `phpgsg.getterSetterGenerator.sortByPropertyOrder`: Getter ve Setter'ları property sırasına göre oluşturur
  - Varsayılan: `true`

## Şablon Değişkenleri

Şablonlarda kullanabileceğiniz değişkenler:

- `{{name}}`: Özellik adı (ilk harf büyük)
- `{{type}}`: Özellik tipi
- `{{nullable}}`: Nullable tip için ? işareti
- `{{variable}}`: Özellik değişken adı

## Gereksinimler

- Visual Studio Code 1.74.0 veya üzeri
- PHP dosyaları

## Kurulum

1. VS Code'u açın
2. Quick Open'ı açın (Ctrl+P)
3. Şunu yazın: `ext install php-getter-and-setter-generator`

## Lisans

Bu proje MIT lisansı altında lisanslanmıştır.

## Katkıda Bulunma

1. Bu projeyi fork edin
2. Feature branch'inizi oluşturun (`git checkout -b feature/amazing-feature`)
3. Değişikliklerinizi commit edin (`git commit -m 'feat: Add some amazing feature'`)
4. Branch'inizi push edin (`git push origin feature/amazing-feature`)
5. Bir Pull Request oluşturun

## Sorun Bildirme

Bir hata bulduysanız veya öneriniz varsa, lütfen GitHub Issues üzerinden bildirin.

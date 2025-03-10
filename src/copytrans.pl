import os
import json

def kopyala_nls_dosyalari(kok_dizin):
    """
    Kök dizindeki package.nls dosyalarının içeriğini l10n/bundle.l10n dosyalarına kopyalar.

    Args:
        kok_dizin (str): Kök dizinin yolu.
    """
    l10n_dizin = os.path.join(kok_dizin, 'l10n')

    # package.nls ile başlayan dosyaları bul
    package_nls_dosyalari = [f for f in os.listdir(kok_dizin) if f.startswith('package.nls') and f.endswith('.json')]

    for package_nls_dosya in package_nls_dosyalari:
        # package.nls dosyasının içeriğini oku
        package_nls_yolu = os.path.join(kok_dizin, package_nls_dosya)
        with open(package_nls_yolu, 'r', encoding='utf-8') as f:
            package_nls_icerik = json.load(f)

        # bundle.l10n dosyasının adını oluştur
        bundle_l10n_dosya = package_nls_dosya.replace('package.nls', 'bundle.l10n')
        bundle_l10n_yolu = os.path.join(l10n_dizin, bundle_l10n_dosya)

        # bundle.l10n dosyasına içeriği yaz
        with open(bundle_l10n_yolu, 'w', encoding='utf-8') as f:
            json.dump(package_nls_icerik, f, ensure_ascii=False, indent=4)

        print(f"{package_nls_dosya} içeriği {bundle_l10n_dosya} dosyasına kopyalandı.")

# Kök dizinin yolunu belirtin
kok_dizin = '../'  # Mevcut dizin

# Fonksiyonu çağır
kopyala_nls_dosyalari(kok_dizin)
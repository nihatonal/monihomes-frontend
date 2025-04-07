export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen p-8 bg-gray-50 text-gray-800">
      <h1 className="text-3xl font-bold mb-4">Gizlilik Politikası</h1>

      <p className="mb-4">
        Bu sayfa, kullanıcılarımızın kişisel verilerinin gizliliğini koruma ilkesini benimseyen <strong>Monihomes</strong> platformunun gizlilik politikasını açıklamaktadır.
      </p>

      <h2 className="text-xl font-semibold mb-2">Toplanan Bilgiler</h2>
      <p className="mb-4">
        Sitemiz, kullanıcı deneyimini iyileştirmek ve hizmetlerimizi sunabilmek amacıyla sınırlı bilgiler toplayabilir. Bunlar:
      </p>
      <ul className="list-disc list-inside mb-4">
        <li>IP adresi</li>
        <li>Tarayıcı bilgisi</li>
        <li>Sayfa ziyaret verileri</li>
        <li>İsteğe bağlı olarak, rezervasyon sırasında girilen iletişim bilgileri</li>
      </ul>

      <h2 className="text-xl font-semibold mb-2">Bilgilerin Kullanımı</h2>
      <p className="mb-4">
        Toplanan bilgiler yalnızca şu amaçlarla kullanılır:
      </p>
      <ul className="list-disc list-inside mb-4">
        <li>Web sitemizi güvenli tutmak</li>
        <li>Kullanıcı deneyimini geliştirmek</li>
        <li>Rezervasyon süreçlerini yürütmek</li>
      </ul>

      <h2 className="text-xl font-semibold mb-2">Üçüncü Taraf Hizmetleri</h2>
      <p className="mb-4">
        Google hizmetleri (Firebase, Analytics vb.) gibi üçüncü taraf hizmet sağlayıcıları kullanılabilir. Bu hizmetler, yalnızca gerekli teknik verileri işler ve hiçbir kişisel veri üçüncü taraflarla paylaşılmaz.
      </p>

      <h2 className="text-xl font-semibold mb-2">Veri Güvenliği</h2>
      <p className="mb-4">
        Kullanıcı bilgilerinin güvenliği bizim için önemlidir. Tüm veriler, güncel güvenlik standartlarına uygun olarak korunur.
      </p>

      <h2 className="text-xl font-semibold mb-2">İletişim</h2>
      <p>
        Gizlilik politikamızla ilgili her türlü soru için bizimle <strong>info@monihomes.com</strong> adresinden iletişime geçebilirsiniz.
      </p>
    </div>
  );
}

import { barberSignaturePaths } from "./barber-signatures.js";

export const siteSettings = {
  brand: "Rendezvous",
  descriptor: "Barbershop",
  contactEmail: "hello@example.com",
  contactPhone: "+62 812-3456-7890",
};

export const homepage = {
  title: "A good cut. A better day.",
  introduction:
    "Ruang untuk berhenti sejenak. Potongan yang terasa seperti dirimu.",
  sectionOrder: [
    "top",
    "philosophy",
    "services",
    "branches",
    "barbers",
    "lookbook",
    "promo",
    "testimonials",
    "articles",
    "faq",
  ],
  philosophy: {
    introduction:
      "Setiap kunjungan dimulai dengan ngobrol: bentuk kepala, tekstur rambut, dan rutinitasmu.",
  },
};

export const services = [
  {
    id: "signature-cut",
    slug: "signature-cut",
    name: "Signature Cut",
    showcaseTitle: "Potong Rambut",
    showcaseCopy: "Konsultasi, potong, dan styling sesuai rambutmu.",
    showcaseImage: "haircut-action.webp",
    showcaseAlt: "Barber memotong rambut klien dengan sisir dan gunting.",
    showcaseWidth: 1800,
    showcaseHeight: 2250,
    description:
      "Dimulai dengan konsultasi singkat, lalu dipotong sesuai bentuk rambut dan gaya harianmu.",
    benefits: ["Konsultasi gaya", "Potong & styling"],
    price: 180000,
    durationMinutes: 40,
  },
  {
    id: "skin-fade",
    slug: "skin-fade",
    name: "Skin Fade",
    showcaseTitle: "Potong & Fade",
    showcaseCopy: "Gradasi presisi untuk sisi yang rapi dan tegas.",
    showcaseImage: "skin-fade-detail.webp",
    showcaseAlt: "Detail gradasi fade pada sisi dan belakang rambut klien.",
    showcaseWidth: 1800,
    showcaseHeight: 2700,
    description:
      "Potongan dengan gradasi halus dari sisi ke bagian atas untuk hasil rapi dan tegas.",
    benefits: ["Gradasi presisi", "Finishing rapi"],
    price: 220000,
    durationMinutes: 45,
  },
  {
    id: "hot-towel",
    slug: "hot-towel-shave",
    name: "Hot Towel Shave",
    showcaseTitle: "Cukur Wajah",
    showcaseCopy: "Cukur wajah dengan handuk hangat dan hasil yang rapi.",
    showcaseImage: "hot-towel-service.webp",
    showcaseAlt: "Barber merapikan janggut klien yang bersandar dengan handuk hangat di kepala.",
    showcaseWidth: 1800,
    showcaseHeight: 1202,
    description:
      "Cukur wajah dengan handuk hangat untuk membantu melembutkan rambut sebelum dirapikan.",
    benefits: ["Handuk hangat", "Cukur wajah"],
    price: 160000,
    durationMinutes: 35,
  },
  {
    id: "beard",
    slug: "beard-sculpt",
    name: "Beard Sculpt",
    showcaseTitle: "Rapikan Janggut",
    showcaseCopy: "Bentuk dan garis janggut yang lebih seimbang.",
    showcaseImage: "portrait-hero.webp",
    showcaseAlt: "Barber merapikan garis janggut klien dengan gunting.",
    showcaseWidth: 1800,
    showcaseHeight: 1200,
    description:
      "Rapikan panjang dan garis janggut agar bentuknya lebih jelas dan seimbang.",
    benefits: ["Bentuk janggut", "Rapikan garis"],
    price: 130000,
    durationMinutes: 30,
  },
  {
    id: "royal",
    slug: "royal-package",
    name: "Royal Package",
    showcaseTitle: "Rambut & Janggut",
    showcaseCopy: "Potong rambut dan perawatan janggut dalam satu kunjungan.",
    showcaseImage: "hair-and-beard-service.webp",
    showcaseAlt: "Barber menyisir rambut klien berjanggut saat perawatan di kursi barber.",
    showcaseWidth: 1800,
    showcaseHeight: 2700,
    description:
      "Paket potong rambut dan perawatan janggut untuk kunjungan yang lebih menyeluruh.",
    benefits: ["Potong rambut", "Perawatan janggut"],
    price: 350000,
    durationMinutes: 75,
  },
  {
    id: "junior",
    slug: "junior-cut",
    name: "Junior Cut",
    showcaseTitle: "Potong Anak",
    showcaseCopy: "Potong rambut anak dengan ritme yang nyaman.",
    showcaseImage: "junior-haircut.webp",
    showcaseAlt: "Barber memotong rambut anak yang duduk di kursi barber.",
    showcaseWidth: 1800,
    showcaseHeight: 2700,
    description:
      "Potong rambut untuk anak dengan pendekatan nyaman dan hasil yang mudah dirawat.",
    benefits: ["Pendekatan ramah anak", "Potong & styling"],
    price: 140000,
    durationMinutes: 30,
  },
];

const allServiceIds = services.map(({ id }) => id);

// Referensi interior stok untuk prototipe, bukan dokumentasi cabang Rendezvous.
const branchPhotoPool = [
  ["interior-leather-chairs.webp", "Deretan kursi barber kulit cokelat menghadap cermin."],
  ["interior-mirror-row.webp", "Deretan cermin dan kursi barber dalam ruang monokrom."],
  ["interior-single-chair.webp", "Kursi barber klasik di depan cermin melengkung."],
  ["interior-workstation.webp", "Kursi barber dan meja kerja di sisi cermin."],
  ["interior-warm-classic.webp", "Area kerja barbershop dengan cermin dan jam dinding."],
];

const branchPhotos = (offset) =>
  Array.from({ length: 5 }, (_, index) => {
    const [file, description] = branchPhotoPool[(offset + index) % branchPhotoPool.length];
    return { src: `/images/photography/${file}`, alt: description };
  });

export const branches = [
  ["senopati", "Senopati", "Jakarta"],
  ["menteng", "Menteng", "Jakarta"],
  ["dago", "Dago", "Bandung"],
  ["seminyak", "Seminyak", "Bali"],
  ["graha", "Graha Famili", "Surabaya"],
].map(([id, name, city], index) => ({
  id,
  slug: id === "graha" ? "graha-famili" : id,
  name,
  city,
  address: `Area ${name}, ${city}`,
  hours: "09.00–20.00 setiap hari",
  phone: "+62 812-3456-7890",
  serviceIds: [...allServiceIds],
  photos: branchPhotos(index * 3),
}));

const barberPhotos = {
  issa: { alt: "Potret Issa dengan rambut gelap bergelombang dan kemeja kerja gelap." },
  stas: { alt: "Potret Stas dengan rambut pendek, janggut tipis, dan apron gelap." },
  cesar: { alt: "Potret Cesar dengan rambut ikal, kacamata, dan janggut pendek." },
  hamo: { alt: "Potret Hamo dengan rambut bergelombang medium dan kemeja gelap." },
  adit: { alt: "Potret Adit dengan rambut pendek menyamping dan kaus gelap." },
  raka: { alt: "Potret Raka dengan kepala plontos, janggut penuh, dan kemeja gelap." },
};

export const barbers = [
  ["issa", "Issa", ["senopati", "menteng"], ["Scissor cut", "Textured crop"], "Suka potongan bertekstur yang tetap rapi tanpa banyak produk."],
  ["stas", "Stas", ["menteng"], ["Skin fade", "Beard sculpt"], "Gradasi halus dan garis janggut yang tegas."],
  ["cesar", "Cesar", ["dago"], ["Curly cut", "Long layers"], "Paham rambut ikal dan panjang, tahu kapan harus berhenti memotong."],
  ["hamo", "Hamo", ["seminyak"], ["Classic cut", "Hot towel shave"], "Potongan klasik dan cukur handuk hangat yang pelan dan teliti."],
  ["adit", "Adit", ["graha"], ["Crop", "Side part"], "Potongan pendek yang praktis untuk ritme kerja harian."],
  ["raka", "Raka", ["senopati"], ["Buzz cut", "Beard care"], "Rambut sangat pendek dan janggut penuh adalah keahliannya."],
].map(([id, name, branchIds, specialties, bio]) => ({
  id,
  slug: id,
  name,
  branchIds,
  serviceIds: [...allServiceIds],
  specialties,
  bio,
  image: `/images/barbers/${id}.png`,
  imageAlt: barberPhotos[id].alt,
  signaturePaths: barberSignaturePaths[id],
}));

export const lookbookItems = [
  ["modern-crop", "Modern Crop", "signature-cut", "look-short-crop.webp", "Potret rambut pendek bertekstur dengan sisi rapi."],
  ["classic-side-part", "Classic Side Part", "signature-cut", "hero-finished-cut.webp", "Profil potongan rambut dengan belahan samping tegas dan fade halus."],
  ["textured-quiff", "Textured Quiff", "signature-cut", "look-textured-quiff-closeup.webp", "Close-up rambut dengan bagian depan ditata tinggi dan sisi yang dipotong pendek."],
  ["clean-fade", "Clean Fade", "skin-fade", "skin-fade-detail.webp", "Tampak belakang potongan fade pendek dengan gradasi bersih."],
  ["slick-back", "Slick Back", "signature-cut", "look-slick-back.webp", "Profil rambut panjang sedang yang disisir rapi ke belakang."],
  ["natural-texture", "Natural Texture", "signature-cut", "look-natural-texture.webp", "Potret rambut ikal alami yang dibiarkan bervolume."],
].map(([id, title, serviceId, imageName, alt]) => ({
  id,
  title,
  serviceId,
  image: `/images/photography/${imageName}`,
  alt,
}));

export const promo = {
  eyebrow: "Booking",
  title: "Your chair is waiting.",
  description: "Pilih cabang, layanan, barber, dan waktu kunjungan yang kamu inginkan.",
};

export const testimonials = {
  published: false,
  items: [],
  notice: "Ulasan dari pelanggan kami akan segera hadir di sini.",
};

export const voucher = {
  title: "Give a good day.",
  description: "Hadiah kecil untuk waktu yang berkualitas.",
  amounts: [250000, 500000, 750000, 1000000],
  disclaimer: "Voucher berlaku di semua cabang Rendezvous.",
};

export const articles = [
  {
    id: "article-fit",
    slug: "menemukan-potongan-yang-pas",
    title: "Menemukan potongan yang pas",
    category: "Grooming",
    excerpt: "Ceritakan rutinitas dan hasil yang kamu inginkan sebelum potong rambut.",
    body: "Saat konsultasi, sampaikan kebiasaan styling, panjang yang nyaman dirawat, dan bagian yang ingin ditonjolkan. Informasi itu membantu barber menyesuaikan potongan dengan kebutuhanmu.",
    image: "/images/photography/barber-result-review.webp",
    imageAlt: "Barber menunjukkan hasil potongan kepada klien dengan cermin tangan.",
  },
  {
    id: "article-ritual",
    slug: "ritual-grooming-harian",
    title: "Perawatan rambut sehari-hari",
    category: "Perawatan",
    excerpt: "Kebiasaan sederhana membantu rambut tetap rapi di antara kunjungan.",
    body: "Gunakan produk secukupnya sesuai tekstur rambut dan kebutuhan styling. Jika ragu, tanyakan kepada barber produk yang cocok untuk rutinitasmu.",
    image: "/images/photography/grooming-mirror.webp",
    imageAlt: "Pria menyisir janggutnya di depan cermin sebagai bagian dari rutinitas grooming.",
  },
  {
    id: "article-texture",
    slug: "memahami-tekstur-rambut",
    title: "Kenali tekstur rambutmu",
    category: "Grooming",
    excerpt: "Tekstur rambut ikut menentukan bentuk potongan dan cara menatanya.",
    body: "Perhatikan bagaimana rambut jatuh saat kering dan berapa banyak waktu yang ingin kamu luangkan untuk styling. Sampaikan keduanya saat konsultasi agar rekomendasi potongan lebih sesuai.",
    image: "/images/photography/hair-texture-portrait.webp",
    imageAlt: "Potret pria dengan rambut ikal tebal dan tekstur alami.",
  },
];

export const faqs = [
  {
    question: "Apa yang perlu dipilih sebelum kunjungan?",
    answer: "Pilih cabang dan layanan, lalu tentukan barber serta waktu kunjungan.",
  },
  {
    question: "Bisa memilih barber?",
    answer: "Bisa. Pilih nama barber; jika tidak punya preferensi, pilih opsi Siapa saja.",
  },
  {
    question: "Bagaimana pembayarannya?",
    answer: "Pembayaran dilakukan di cabang setelah layanan selesai.",
  },
  {
    question: "Bisa mengubah jadwal?",
    answer: "Hubungi cabang tujuan untuk mengajukan perubahan jadwal sebelum waktu kunjungan.",
  },
  {
    question: "Apakah boleh walk-in?",
    answer: "Boleh jika barber tersedia. Reservasi lebih dulu membantu merencanakan kunjungan. Ketersediaan tetap perlu dipastikan ke cabang.",
  },
  {
    question: "Apakah melayani anak-anak?",
    answer: "Ya, lewat layanan Junior Cut yang dirancang nyaman untuk anak.",
  },
];

export const policies = [
  {
    id: "privacy",
    slug: "privasi",
    title: "Privasi",
    body: "Nama dan nomor teleponmu hanya kami pakai untuk mengonfirmasi dan mengingatkan jadwal booking.",
  },
  {
    id: "terms",
    slug: "ketentuan-layanan",
    title: "Ketentuan layanan",
    body: "Datang 5 menit sebelum jadwal. Kabari cabang bila kamu perlu mengganti atau membatalkan booking.",
  },
  {
    id: "hygiene",
    slug: "standar-higiene",
    title: "Standar higiene",
    body: "Alat disterilkan setelah setiap pelanggan, dan handuk serta jubah selalu diganti baru.",
  },
];

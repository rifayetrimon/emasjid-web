/**
 * Demo / fallback content shown when the CMS API returns empty or partial data.
 * Keeps every template visually complete on a fresh install.
 */

import { withBasePath } from "./withBasePath";

export const DEMO_BANNER_IMAGE = withBasePath("/demo-banner.svg");
const DEMO_PRODUCT_IMAGE = withBasePath("/demo-product.svg");

// Brand-neutral placeholder content shown only when the tenant has not
// touched the banner config at all. Any user input in the CMS overrides
// these values completely (see services/bannerService.ts).
export const DEMO_BANNER = {
  logo: "",
  background_image: DEMO_BANNER_IMAGE,
  background_images: [DEMO_BANNER_IMAGE],
  menu_items: [],
  title: {
    general: "",
    focus: { text: "", link: "" },
  },
  supporting_text: "",
  buttons: [],
  textColor: "",
  overlayColor: "",
  overlayOpacity: 0,
};

export const DEMO_FAQ = {
  title: "Soalan Lazim",
  background_image: "",
  items: [
    {
      question: "Bagaimana cara mendaftar sebagai ahli?",
      text: "Maklumat pendaftaran ahli",
      answer:
        "Sila lawat pejabat masjid pada waktu pejabat untuk mendapatkan borang pendaftaran. Bawa salinan kad pengenalan dan satu gambar berukuran passport.",
    },
    {
      question: "Bilakah waktu solat dilaksanakan?",
      text: "Jadual solat",
      answer:
        "Waktu solat mengikut jadual rasmi yang dikeluarkan oleh pihak berkuasa agama negeri. Jadual lengkap boleh dilihat di papan pengumuman masjid atau laman web rasmi.",
    },
    {
      question: "Adakah kelas pengajian dianjurkan?",
      text: "Kelas dan program",
      answer:
        "Ya, kami menganjurkan pelbagai kelas pengajian termasuk Al-Quran, Fiqh, dan Sirah. Daftar di kaunter pejabat untuk menyertai.",
    },
    {
      question: "Bagaimana untuk membuat sumbangan?",
      text: "Tabung dan derma",
      answer:
        "Sumbangan boleh dibuat secara tunai di kaunter pejabat atau melalui pemindahan bank. Maklumat akaun bank disediakan di kaunter.",
    },
  ],
};

export interface DemoShopItem {
  id: number;
  name: string;
  price: number;
  description?: string;
  image?: string;
  inStock: boolean;
}

/* ───── Donation institutions (mock) ───── */
export interface DemoInstitution {
  id: number;
  name: string;
  category: string;
  description?: string;
}

export const DEMO_INSTITUTIONS: DemoInstitution[] = [
  {
    id: 1,
    name: "Masjid Al-Hidayah",
    category: "Masjid",
    description: "Sumbangan untuk pembinaan dan penyelenggaraan masjid.",
  },
  {
    id: 2,
    name: "Tabung Anak Yatim",
    category: "Kebajikan",
    description: "Sokongan kewangan bulanan kepada anak yatim.",
  },
  {
    id: 3,
    name: "Pengajian Tahfiz",
    category: "Pendidikan",
    description: "Yuran dan keperluan pelajar program tahfiz.",
  },
  {
    id: 4,
    name: "Sumbangan Mualaf",
    category: "Kebajikan",
    description: "Sokongan dan bimbingan untuk saudara baharu.",
  },
  {
    id: 5,
    name: "Penyelenggaraan Surau",
    category: "Surau",
    description: "Kos elektrik, air dan kebersihan harian surau.",
  },
  {
    id: 6,
    name: "Tabung Iftar Ramadhan",
    category: "Program",
    description: "Program iftar bersama jemaah sepanjang Ramadhan.",
  },
];

export const DEMO_SHOP_ITEMS: DemoShopItem[] = [
  {
    id: 1,
    name: "Al-Quran Mushaf",
    price: 35.0,
    description: "Mushaf Al-Quran dengan terjemahan, cetakan kualiti tinggi.",
    image: DEMO_PRODUCT_IMAGE,
    inStock: true,
  },
  {
    id: 2,
    name: "Buku Doa Harian",
    price: 15.0,
    description: "Kompilasi doa-doa harian untuk seluruh keluarga.",
    image: DEMO_PRODUCT_IMAGE,
    inStock: true,
  },
  {
    id: 3,
    name: "Sejadah Premium",
    price: 45.0,
    description: "Sejadah berkualiti tinggi dengan motif tradisional.",
    image: DEMO_PRODUCT_IMAGE,
    inStock: true,
  },
  {
    id: 4,
    name: "Tasbih Kayu Gaharu",
    price: 25.0,
    description: "Tasbih dari kayu gaharu asli, tahan lama.",
    image: DEMO_PRODUCT_IMAGE,
    inStock: true,
  },
  {
    id: 5,
    name: "Pen Bermazu Masjid",
    price: 5.0,
    description: "Pen kualiti dengan logo masjid.",
    image: DEMO_PRODUCT_IMAGE,
    inStock: true,
  },
  {
    id: 6,
    name: "Buku Latihan Tahfiz",
    price: 12.0,
    description: "Buku latihan untuk pelajar tahfiz peringkat asas.",
    image: DEMO_PRODUCT_IMAGE,
    inStock: false,
  },
];

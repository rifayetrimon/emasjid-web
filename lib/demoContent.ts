/**
 * Demo / fallback content shown when the CMS API returns empty or partial data.
 * Keeps every template visually complete on a fresh install.
 */

import { withBasePath } from "./withBasePath";

export const DEMO_BANNER_IMAGE = withBasePath("/demo-banner.svg");
const DEMO_PRODUCT_IMAGE = withBasePath("/demo-product.svg");

export const DEMO_BANNER = {
  logo: "",
  background_image: DEMO_BANNER_IMAGE,
  background_images: [DEMO_BANNER_IMAGE],
  menu_items: [],
  title: {
    general: "Selamat Datang ke",
    focus: { text: "eMasjid", link: "" },
  },
  supporting_text:
    "Platform pengurusan masjid moden. Akses maklumat dan perkhidmatan dengan mudah.",
  buttons: [],
  textColor: "",
  overlayColor: "",
  overlayOpacity: 0,
};

export interface DemoNewsItem {
  contentId: number;
  title: string;
  message: string;
  image: string | null;
  date: string;
  altImg1: string;
  file1: string | null;
  time?: string;
  highlightPost?: string;
}

export const DEMO_NEWS: DemoNewsItem[] = [
  {
    contentId: 90001,
    title: "Pengumuman Solat Jumaat",
    message:
      "Solat Jumaat akan diadakan pada pukul 1.15 petang. Khutbah disampaikan oleh Imam masjid. Sila hadir awal untuk mendapat tempat.",
    image: DEMO_BANNER_IMAGE,
    file1: DEMO_BANNER_IMAGE,
    date: "2025-04-01",
    time: "13:15",
    altImg1: "Pengumuman",
    highlightPost: "yes",
  },
  {
    contentId: 90002,
    title: "Kelas Pengajian Mingguan Bermula",
    message:
      "Kelas pengajian Al-Quran dan Fiqh akan bermula minggu depan. Daftar di pejabat masjid untuk maklumat lanjut.",
    image: DEMO_BANNER_IMAGE,
    file1: DEMO_BANNER_IMAGE,
    date: "2025-04-03",
    altImg1: "Kelas Pengajian",
    highlightPost: "yes",
  },
  {
    contentId: 90003,
    title: "Aktiviti Gotong-Royong",
    message:
      "Aktiviti gotong-royong masjid akan diadakan pada hari Sabtu ini. Semua jemaah dijemput hadir.",
    image: DEMO_BANNER_IMAGE,
    file1: DEMO_BANNER_IMAGE,
    date: "2025-04-05",
    altImg1: "Gotong Royong",
    highlightPost: "yes",
  },
  {
    contentId: 90004,
    title: "Tabung Pembinaan Masjid",
    message:
      "Sumbangan ikhlas dialu-alukan untuk pembinaan tambahan ruang solat. Maklumat lanjut di kaunter masjid.",
    image: DEMO_BANNER_IMAGE,
    file1: DEMO_BANNER_IMAGE,
    date: "2025-04-07",
    altImg1: "Tabung",
    highlightPost: "yes",
  },
  {
    contentId: 90005,
    title: "Program Iftar Bersama",
    message:
      "Iftar bersama akan diadakan setiap hari sepanjang bulan Ramadhan. Semua dijemput hadir bersama keluarga.",
    image: DEMO_BANNER_IMAGE,
    file1: DEMO_BANNER_IMAGE,
    date: "2025-04-10",
    altImg1: "Iftar",
    highlightPost: "no",
  },
  {
    contentId: 90006,
    title: "Penjadualan Semula Kelas Tahfiz",
    message:
      "Kelas tahfiz akan dijadualkan semula bermula minggu depan. Sila rujuk jadual baharu di papan pengumuman.",
    image: DEMO_BANNER_IMAGE,
    file1: DEMO_BANNER_IMAGE,
    date: "2025-04-12",
    altImg1: "Tahfiz",
    highlightPost: "no",
  },
];

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

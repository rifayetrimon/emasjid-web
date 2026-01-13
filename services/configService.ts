// services/configService.ts
import getConfig from "@/lib/getConfig";
import myAxios from "@/lib/myAxios";
import { CMSData } from "@/types/cms";

interface BannerFeatureItem {
  contentTitle: string;
  contentID: number;
  contentMsg: string | null;
  content: Array<{
    urllink: string;
    file: string;
  }>;
}

interface NavMenuItem {
  menuTitle: string;
  menuLink: string;
  [key: string]: unknown;
}

// ⭐ This function handles both external URLs and local paths
// For external URLs: return as-is
// For local paths: ensure they start with "/"
function getImageUrl(
  path: string | undefined | null,
  fallback: string
): string {
  // 1. If path is missing or empty, use fallback
  if (!path || path.trim() === "") {
    return fallback;
  }

  // 2. Fix malformed URLs like "https:/domain.com" → "https://domain.com"
  let cleanedPath = path.trim();
  if (cleanedPath.match(/^https?:\/[^/]/)) {
    cleanedPath = cleanedPath.replace(/^(https?:)\/([^/])/, "$1//$2");
  }

  // 3. If it's a full URL (external image), return as-is
  if (cleanedPath.includes("://")) {
    return cleanedPath;
  }

  // 4. For local paths, ensure they start with "/"
  return cleanedPath.startsWith("/") ? cleanedPath : `/${cleanedPath}`;
}

async function configService(): Promise<CMSData> {
  const config = getConfig();

  const SID = config.sid || "";

  const apiUrls = {
    config: `config?sid=${SID}`,
    navHeader: `nav-header?sid=${SID}`,
    banner: `banner?sid=${SID}`,
    footer: `footer?sid=${SID}`,
    faq: `faq?sid=${SID}`,
  };

  try {
    console.log("🔄 Fetching CMS configuration...");

    const [configRes, navRes, bannerRes, footerRes, faqRes] = await Promise.all(
      [
        myAxios.get(apiUrls.config),
        myAxios.get(apiUrls.navHeader),
        myAxios.get(apiUrls.banner),
        myAxios.get(apiUrls.footer),
        myAxios.get(apiUrls.faq),
      ]
    );

    console.log("✅ All API calls successful");

    const configData = configRes.data?.data || {};
    const navData = navRes.data?.data || {};
    const bannerData = bannerRes.data?.data || {};
    const footerData = footerRes.data?.data || {};
    const faqData = faqRes.data?.data || [];

    const allMenuItems = navData.dataset?.menu || [];
    const menuItems = allMenuItems;

    // --- Process Images with proper path extraction ---

    const bannerBgImage = getImageUrl(
      bannerData.head?.[0]?.content?.[0]?.file,
      "/images/banner/bg.png"
    );

    const bannerFocusLink =
      bannerData.head?.[0]?.content?.[0]?.urllink || "www.masjid.com";

    const mappedFeatures = (bannerData.middle || []).map(
      (item: BannerFeatureItem) => ({
        icon: "/icons/cloud.svg",
        title: item.contentTitle || "Missing Title",
        text:
          item.contentTitle === "Mesra Pengguna"
            ? "Akses lancar melalui telefon & tablet"
            : item.contentTitle === "Akses 24/7"
            ? "Boleh digunakan bila-bila masa"
            : item.contentTitle === "Kemaskini Automatik"
            ? "Pengawasan berterusan oleh MAIS"
            : "Missing Text",
      })
    );

    mappedFeatures.unshift({
      icon: "/icons/cloud.svg",
      title: "Selamat & Terjamin",
      text: "Data pengguna dilindungi dengan selamat",
    });

    const logoUrl = getImageUrl(configData.logoCMS, "/images/banner/icon.png");
    const faqBgUrl = getImageUrl(footerData.bgImage, "/images/soalan/bg.png");

    // ⚠️ TODO: These fields don't exist in banner API
    // Need to fetch from different API endpoints
    // For now, using fallback images
    const segmentImage = getImageUrl(
      bannerData.bottom?.[0]?.content?.[0]?.file,
      "/images/about/about.png"
    );

    const brandingImage = getImageUrl(
      bannerData.branding?.[0]?.content?.[0]?.file,
      "/images/image1.jpg"
    );

    const partnershipImage = getImageUrl(
      bannerData.partnership?.[0]?.content?.[0]?.file,
      "/images/partnership.jpg"
    );

    console.log("🖼️ Processed Images:");
    console.log("  - Segment:", segmentImage);
    console.log("  - Branding:", brandingImage);
    console.log("  - Partnership:", partnershipImage);

    const finalJson: CMSData = {
      base_settings: {
        primary_color: configData.primaryColor || "#78C841",
        secondary_color: configData.secondaryColor || "#154D71",
        text_color: configData.textColor || "#00FF00",
      },
      content: {
        banner: {
          logo: logoUrl,
          background_image: bannerBgImage,
          menu_items: menuItems.map((item: NavMenuItem) => ({
            label: item.menuTitle,
            link: item.menuLink,
          })),
          title: {
            general: "Selamat Datang ke Portal",
            focus: { text: "eMasjid", link: bannerFocusLink },
          },
          supporting_text:
            "Maklumat ini disediakan sebagai panduan kepada mana-mana orang yang ingin membuat permohonan menggunakan Sistem Pengurusan Smart Masjid MAIS",
          buttons: [],
        },
        segments: [
          {
            image: segmentImage,
            text: "MAKLUMAN : Berkuat kuasa mulai 1 SEPTEMBER 2024, permohonan baharu eMasjid MAIS akan dilaksanakan berdasarkan Peraturan-Peraturan berpandukan Majlis Agama Islam (Negeri Selangor) 2025.",
            button: { label: "Lihat Selanjutnya", link: "#" },
          },
        ],
        fetures: {
          title: configData.midBannerMainTitle || "Kelebihan e-Masjid",
          items: mappedFeatures,
        },
        faq: {
          title: configData.faqMainTitle || "Soalan Lazim",
          background_image: faqBgUrl,
          items: faqData.map(
            (item: {
              title: string;
              description: string;
              message: string;
            }) => ({
              question: item.title,
              text: item.description,
              answer: item.message,
            })
          ),
        },
        branding: [
          {
            image: brandingImage,
          },
        ],
        footer: {
          image: {
            image: logoUrl,
            link: "#",
          },
          footer_title:
            footerData.content?.[0]?.title ||
            "Majlis Agama Islam Selangor (MAIS)",
          text:
            footerData.content?.[0]?.details ||
            "Urus setia Jawatankuasa Bahagian Pengurusan Masjid",
          address:
            configData.address ||
            "Jabatan Agama Islam Selangor, Aras 7, Menara Selatan, Bangunan Sultan Idris Shah, 40000, Shah Alam, Selangor",
          phone: configData.phonenum || "019725478",
          email: configData.email || "support@mais.gov.my",
          social_links: [
            { platform: "/icons/fb.svg", link: "https://facebook.com/mais" },
            {
              platform: "/icons/instagram.svg",
              link: "https://instagram.com/mais",
            },
            { platform: "/icons/x.svg", link: "https://twitter.com/mais" },
          ],
          copyright:
            configData.copyright || "© 2025 MAIS. Hak Cipta Terpelihara.",
        },
        pernarship_image: {
          isset: "True",
          image: partnershipImage,
        },
      },
      features: mappedFeatures,
    };

    console.log("✅ CMS Config Transformed");
    console.log("🖼️ Debug URL Check:", finalJson.content.segments[0].image);

    return finalJson;
  } catch (error) {
    console.error("❌ Error in configService:", error);
    throw new Error(
      error instanceof Error
        ? error.message
        : "Failed to fetch configuration data"
    );
  }
}

export default configService;

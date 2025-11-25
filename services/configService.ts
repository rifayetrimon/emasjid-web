// services/configService.ts
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

async function configService(): Promise<CMSData> {
  const SID = 0;

  // Since baseURL is already in myAxios, just use the endpoint paths
  const apiUrls = {
    config: `getConfig?sid=${SID}`,
    navHeader: `getNavHeader?sid=${SID}`,
    banner: `getBanner?sid=${SID}`,
    footer: `getFooter?sid=${SID}`,
    faq: `getFAQ?sid=${SID}`,
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

    // Transform data
    const allMenuItems = navData.dataset?.menu || [];
    const menuItems = allMenuItems.slice(0, 5);
    const buttonItems = allMenuItems.slice(5);

    const bannerBgImage =
      bannerData.head?.[0]?.content?.[0]?.file || "/images/banner/bg.png";
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

    const finalJson: CMSData = {
      base_settings: {
        primary_color: configData.primaryColor || "#78C841",
        secondary_color: configData.secondaryColor || "#154D71",
        text_color: configData.textColor || "#00FF00",
      },
      content: {
        banner: {
          logo: configData.logoCMS || "/images/banner/icon.png",
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
          buttons: buttonItems.map((item: NavMenuItem) => ({
            label: item.menuTitle,
            link: item.menuLink,
          })),
        },
        segments: [
          {
            image: "/images/about/about.png",
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
          background_image: footerData.bgImage || "/images/soalan/bg.png",
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
        branding: [{ image: "/images/image1.jpg" }],
        footer: {
          image: {
            image: configData.logoCMS || "/images/banner/icon.png",
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
          image: "imges.jpg",
        },
      },
      features: mappedFeatures,
    };

    console.log("✅ CMS configuration transformed successfully");
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

import { getNavData } from "@/services/navService";
import NavbarClient from "./NavbarClient";

export default async function Navbar() {
  try {
    const { menuItems, logo, navConfig, socialLinks } = await getNavData();

    return (
      <NavbarClient
        menuItems={menuItems}
        logo={logo}
        navConfig={navConfig}
        socialLinks={socialLinks}
      />
    );
  } catch (error) {
    console.error("❌ Navbar component error:", error);
    return (
      <NavbarClient
        menuItems={[]}
        logo="/images/banner/icon.png"
        navConfig={{
          navbarBg: "",
          navbarItemfontSize: "",
          navbarItemColor: "",
          navbarItemHoverColor: "",
          navbarItemUnderLine: false,
          navbarItemUnderLineColor: "",
          navbarOpacity: 100,
          navbarDropdownBg: "",
        }}
        socialLinks={[]}
      />
    );
  }
}

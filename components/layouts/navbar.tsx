import { getNavData } from "@/services/navService";
import NavbarClient from "./NavbarClient";

export default async function Navbar() {
  const menuItems = await getNavData();

  return <NavbarClient menuItems={menuItems} />;
}

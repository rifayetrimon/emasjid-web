import { getCachedConfig } from "@/services/apiCache";
import ContactForm from "./ContactForm";

export default async function ContactUs() {
  let footerConfig;
  try {
    const configData = await getCachedConfig();
    footerConfig = configData?.footerConfig || {};
  } catch {
    footerConfig = {};
  }

  const email = footerConfig.email || "";
  const state = footerConfig.state || "";

  // Build address from config parts
  const addressParts = [
    footerConfig.address1,
    footerConfig.address2,
    footerConfig.city,
    footerConfig.state,
    footerConfig.postcode,
  ].filter(Boolean);
  const address = addressParts.join(", ");

  return (
    <section className="py-16 px-6 bg-gray-50">
      <div className="max-w-6xl mx-auto">
        <ContactForm email={email} address={address} state={state} />
      </div>
    </section>
  );
}

import Image from "@/components/ui/FallbackImage";
import type { NavSocialLink } from "@/types/cms";
import { SOCIAL_BRANDS } from "@/components/social/socialBrands";

/**
 * Renders the tenant's addon-plugin links (the same social/plugin links shown
 * in the header and footer) as brand-coloured buttons — matching the news
 * detail "Kongsi" share bar. Used inside content pages (static pages and the
 * news-detail page) so the plugin links appear there too, on every template.
 * Hidden when the tenant configured none.
 */
export default function PluginLinks({
  links,
  className = "",
}: {
  links: NavSocialLink[];
  className?: string;
}) {
  if (!links || links.length === 0) return null;
  return (
    <div className={`flex items-center gap-2.5 flex-wrap ${className}`}>
      {links.map((s, i) => {
        const brand = SOCIAL_BRANDS[(s.platform || "").toLowerCase()];
        return (
          <a
            key={i}
            href={s.link}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={s.platform}
            title={s.platform}
            className={`w-10 h-10 rounded-lg flex items-center justify-center shadow-sm hover:-translate-y-0.5 hover:shadow-md transition ${
              brand ? brand.bgClass : "bg-gray-700 text-white"
            }`}
            style={brand?.bgStyle}
          >
            {brand ? (
              <brand.Icon className="w-5 h-5" />
            ) : (
              // Unknown platform → fall back to the configured icon image.
              <Image
                src={s.icon}
                alt={s.platform}
                width={18}
                height={18}
                className="brightness-0 invert"
              />
            )}
          </a>
        );
      })}
    </div>
  );
}

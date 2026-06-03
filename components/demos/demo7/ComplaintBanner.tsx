import { AlertCircle } from "lucide-react";

interface Props {
  email?: string;
  phone?: string;
}

/**
 * Demo7-styled complaint banner. Soft amber pastel card with rounded
 * corners. Caller renders this only when theme.complaintEnabled is true.
 */
export default function Demo7ComplaintBanner({ email, phone }: Props) {
  if (!email && !phone) return null;
  return (
    <section className="px-6 py-10">
      <div className="max-w-5xl mx-auto rounded-[28px] bg-gradient-to-br from-amber-50 to-rose-50 border-2 border-white shadow-md p-6 md:p-8">
        <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
          <div className="flex-shrink-0 w-12 h-12 rounded-2xl bg-white shadow-sm flex items-center justify-center">
            <AlertCircle className="w-6 h-6 text-amber-600" />
          </div>
          <div className="flex-1 text-sm text-amber-900">
            <p className="font-bold uppercase tracking-[0.18em] text-[11px] text-amber-700 mb-1">
              Saluran Aduan
            </p>
            <p className="leading-relaxed">
              Hubungi kami melalui{" "}
              {email && (
                <a
                  href={`mailto:${email}`}
                  className="font-bold text-[var(--primary)] underline hover:no-underline"
                >
                  {email}
                </a>
              )}
              {email && phone ? " atau " : ""}
              {phone && (
                <a
                  href={`tel:${phone}`}
                  className="font-bold text-[var(--primary)] underline hover:no-underline"
                >
                  {phone}
                </a>
              )}
              {" "}untuk sebarang aduan.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

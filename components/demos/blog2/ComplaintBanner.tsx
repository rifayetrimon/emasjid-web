import { AlertCircle } from "lucide-react";

interface Props {
  email?: string;
  phone?: string;
}

export default function Blog2ComplaintBanner({ email, phone }: Props) {
  return (
    <section className="bg-amber-50 border-y border-amber-200 py-6 px-6">
      <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-start md:items-center gap-4">
        <AlertCircle className="w-6 h-6 text-amber-600 flex-shrink-0" />
        <div className="flex-1 text-sm text-amber-900">
          <p className="font-bold uppercase tracking-wider text-xs mb-1">
            Saluran Aduan
          </p>
          <p className="leading-relaxed">
            Hubungi kami melalui{" "}
            {email && (
              <a
                href={`mailto:${email}`}
                className="font-semibold underline hover:no-underline"
              >
                {email}
              </a>
            )}
            {email && phone ? " atau " : ""}
            {phone && (
              <a
                href={`tel:${phone}`}
                className="font-semibold underline hover:no-underline"
              >
                {phone}
              </a>
            )}
            {" "}untuk sebarang aduan.
          </p>
        </div>
      </div>
    </section>
  );
}

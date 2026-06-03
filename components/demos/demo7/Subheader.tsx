interface Props {
  /** Admin-driven subheader text (theme.subheader). */
  text: string;
}

/**
 * Demo7-styled subheader strip. Soft cream background, centered text.
 * Caller decides whether to render based on whether text is non-empty.
 */
export default function Demo7Subheader({ text }: Props) {
  return (
    <div className="bg-gradient-to-r from-rose-50 via-amber-50 to-sky-50 border-b border-gray-100">
      <div className="max-w-6xl mx-auto px-6 py-2 text-center text-xs text-gray-700 tracking-wide">
        {text}
      </div>
    </div>
  );
}

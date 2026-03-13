import { AlertCircle } from "lucide-react";

interface InlineErrorProps {
  componentName: string;
}

export default function InlineError({ componentName }: InlineErrorProps) {
  return (
    <div className="w-full flex items-center justify-center p-8 bg-gray-50 border border-gray-200 border-dashed">
      <div className="flex flex-col items-center text-center text-gray-500 max-w-sm">
        <AlertCircle className="w-8 h-8 text-red-400 mb-3" />
        <h3 className="text-lg font-medium text-gray-700 mb-1">
          Ralat Memuatkan Data
        </h3>
        <p className="text-sm">
          Tidak dapat memuatkan bahagian <strong>{componentName}</strong>. Sila
          cuba sebentar lagi.
        </p>
      </div>
    </div>
  );
}

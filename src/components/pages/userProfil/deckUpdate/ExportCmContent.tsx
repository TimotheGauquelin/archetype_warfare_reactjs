import { useCallback, useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { FaCheck, FaCopy } from "react-icons/fa";

interface ExportCmContentProps {
  lines: string[];
}

const ExportCmContent: React.FC<ExportCmContentProps> = ({ lines }) => {
  const { t } = useTranslation();
  const [copied, setCopied] = useState(false);
  const resetTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (resetTimerRef.current) clearTimeout(resetTimerRef.current);
    };
  }, []);

  const handleCopy = useCallback(async () => {
    const text = lines.join("\n");
    if (!text) return;

    try {
      await navigator.clipboard.writeText(text);
    } catch {
      return;
    }

    setCopied(true);
    if (resetTimerRef.current) clearTimeout(resetTimerRef.current);
    resetTimerRef.current = setTimeout(() => setCopied(false), 1600);
  }, [lines]);

  return (
    <div>
      <div className="flex flex-row justify-end items-center gap-2 mb-2 min-h-[1.75rem]">
        <span
          className={`text-sm font-medium text-green-700 transition-all duration-300 ${
            copied ? "opacity-100 translate-x-0" : "opacity-0 translate-x-2 pointer-events-none"
          }`}
          aria-live="polite"
        >
          {t("profile.copied")}
        </span>
        <button
          type="button"
          onClick={handleCopy}
          aria-label={copied ? t("profile.copied") : t("profile.copyToClipboard")}
          className={`p-1.5 rounded transition-all duration-300 ease-out ${
            copied
              ? "bg-green-100 text-green-700 scale-125"
              : "text-blue-800 hover:text-blue-900 hover:bg-blue-50 scale-100"
          }`}
        >
          {copied ? (
            <FaCheck className="w-4 h-4" aria-hidden />
          ) : (
            <FaCopy className="w-4 h-4" aria-hidden />
          )}
        </button>
      </div>
      <div className="space-y-2 bg-gray-100 p-2">
        <pre className="whitespace-pre-wrap text-sm">
          {lines.length ? lines.join("\n") : t("profile.noCardsInDeck")}
        </pre>
      </div>
    </div>
  );
};

export default ExportCmContent;

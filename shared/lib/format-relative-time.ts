import i18n from "@/shared/config/i18n/i18n";

export function formatRelativeTime(
  dateInput: string | number | Date,
  lang?: string,
): string {
  const date = new Date(dateInput);
  if (isNaN(date.getTime())) return "";

  const activeLang = lang || i18n.language || "uk";
  const now = new Date();
  const diffMs = Math.max(0, now.getTime() - date.getTime());
  const diffSec = Math.floor(diffMs / 1000);
  const diffMin = Math.floor(diffSec / 60);
  const diffHours = Math.floor(diffMin / 60);

  if (diffSec < 60) {
    return i18n.t("time.just_now", { lng: activeLang });
  }

  const rtf = new Intl.RelativeTimeFormat(activeLang, { numeric: "always" });

  if (diffMin < 60) {
    return rtf.format(-diffMin, "minute");
  }

  if (diffHours < 24) {
    return rtf.format(-diffHours, "hour");
  }

  if (diffHours < 48) {
    const timeStr = new Intl.DateTimeFormat(activeLang, {
      timeStyle: "short",
    }).format(date);
    const yesterdayWord = i18n.t("time.yesterday", { lng: activeLang });
    return `${yesterdayWord}, ${timeStr}`;
  }

  return new Intl.DateTimeFormat(activeLang, {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
}

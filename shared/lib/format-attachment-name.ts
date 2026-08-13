export function formatAttachmentName(name?: string, url?: string): string {
  let str = name || "";
  if (!str && url) {
    const rawFilename = url.split("?")[0].split("/").pop() || "";
    // Clean up timestamp prefixes like 1723500000_name.ext or uuid_name.ext
    str = rawFilename.replace(/^(\d+|[a-f0-9-]{36})[_-]/i, "");
  }

  if (!str) return "File attachment";

  // 1. Handle percent-encoded URI strings (e.g. %D0%A1%D1%82%D1%96...)
  try {
    if (str.includes("%")) {
      str = decodeURIComponent(str);
    }
  } catch {
    // fallback
  }

  // 2. Fix Latin1 / ISO-8859-1 double encoding for Cyrillic characters (e.g. Ð°Ð²Ð°)
  try {
    if (/[\u0080-\u00FF]/.test(str)) {
      str = decodeURIComponent(escape(str));
    }
  } catch {
    // fallback
  }

  return str;
}

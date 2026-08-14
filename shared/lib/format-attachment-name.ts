export function formatAttachmentName(name?: string, url?: string): string {
  let str = name || "";
  if (!str && url) {
    const rawFilename = url.split("?")[0].split("/").pop() || "";
    str = rawFilename.replace(/^(\d+|[a-f0-9-]{36})[_-]/i, "");
  }

  if (!str) return "File attachment";

  try {
    if (str.includes("%")) {
      str = decodeURIComponent(str);
    }
  } catch {
  }

  try {
    if (/[\u0080-\u00FF]/.test(str)) {
      str = decodeURIComponent(escape(str));
    }
  } catch {
  }

  return str;
}

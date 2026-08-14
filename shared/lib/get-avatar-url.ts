export function getAvatarUrl(avatarKeyOrUrl?: string | null): string | undefined {
  if (!avatarKeyOrUrl) return undefined;

  if (
    avatarKeyOrUrl.startsWith("https://") ||
    avatarKeyOrUrl.startsWith("http://")
  ) {
    return avatarKeyOrUrl;
  }

  const apiBase = process.env.NEXT_PUBLIC_API_URL || "";
  let origin = "";

  if (apiBase.startsWith("http://") || apiBase.startsWith("https://")) {
    try {
      origin = new URL(apiBase).origin;
    } catch {
      origin = apiBase.replace(/\/api\/?$/, "").replace(/\/+$/, "");
    }
  } else if (apiBase) {
    origin = apiBase.replace(/\/api\/?$/, "").replace(/\/+$/, "");
  } else if (typeof window !== "undefined") {
    origin = window.location.origin;
  }

  return `${origin}/storage?k=${encodeURIComponent(avatarKeyOrUrl)}`;
}

export const getMediaUrl = getAvatarUrl;

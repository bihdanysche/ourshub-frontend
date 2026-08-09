export interface ParsedUserAgent {
  browser: string;
  os: string;
  isMobile: boolean;
}

export function parseUserAgent(agent: string): ParsedUserAgent {
  if (!agent) {
    return { browser: "Unknown Browser", os: "Unknown OS", isMobile: false };
  }

  let browser = "Web Browser";
  let os = "Unknown OS";
  let isMobile = /mobile|android|iphone|ipad|ipod/i.test(agent);

  if (/windows nt 10/i.test(agent)) os = "Windows 10/11";
  else if (/windows/i.test(agent)) os = "Windows";
  else if (/macintosh|mac os x/i.test(agent)) os = "macOS";
  else if (/iphone/i.test(agent)) {
    os = "iOS";
    isMobile = true;
  } else if (/ipad/i.test(agent)) {
    os = "iPadOS";
    isMobile = true;
  } else if (/android/i.test(agent)) {
    os = "Android";
    isMobile = true;
  } else if (/linux/i.test(agent)) {
    os = "Linux";
  }

  if (/telegram/i.test(agent)) browser = "Telegram";
  else if (/edg\//i.test(agent)) browser = "Microsoft Edge";
  else if (/opr\/|opera/i.test(agent)) browser = "Opera";
  else if (/ya(ndex)?browser/i.test(agent)) browser = "Yandex";
  else if (/chrome|crios/i.test(agent)) browser = "Chrome";
  else if (/firefox|fxios/i.test(agent)) browser = "Firefox";
  else if (/safari/i.test(agent)) browser = "Safari";
  else if (/applewebkit/i.test(agent)) browser = "WebKit";

  return { browser, os, isMobile };
}

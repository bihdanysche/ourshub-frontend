export interface AudioTags {
  title?: string;
  artist?: string;
}

export async function parseAudioTags(url: string): Promise<AudioTags | null> {
  try {
    const res = await fetch(url, {
      headers: { Range: "bytes=0-131072" },
    });
    if (!res.ok && res.status !== 206) return null;

    const buffer = await res.arrayBuffer();
    const data = new DataView(buffer);

    if (
      data.getUint8(0) !== 0x49 ||
      data.getUint8(1) !== 0x44 ||
      data.getUint8(2) !== 0x33
    ) {
      return null;
    }

    const version = data.getUint8(3);
    const size =
      ((data.getUint8(6) & 0x7f) << 21) |
      ((data.getUint8(7) & 0x7f) << 14) |
      ((data.getUint8(8) & 0x7f) << 7) |
      (data.getUint8(9) & 0x7f);

    let offset = 10;
    const end = Math.min(buffer.byteLength, 10 + size);

    let title: string | undefined;
    let artist: string | undefined;

    while (offset + 10 < end) {
      const frameId = String.fromCharCode(
        data.getUint8(offset),
        data.getUint8(offset + 1),
        data.getUint8(offset + 2),
        data.getUint8(offset + 3),
      );

      let frameSize = 0;
      if (version === 4) {
        frameSize =
          ((data.getUint8(offset + 4) & 0x7f) << 21) |
          ((data.getUint8(offset + 5) & 0x7f) << 14) |
          ((data.getUint8(offset + 6) & 0x7f) << 7) |
          (data.getUint8(offset + 7) & 0x7f);
      } else {
        frameSize =
          (data.getUint8(offset + 4) << 24) |
          (data.getUint8(offset + 5) << 16) |
          (data.getUint8(offset + 6) << 8) |
          data.getUint8(offset + 7);
      }

      if (frameSize <= 0 || offset + 10 + frameSize > end) break;

      if (frameId === "TIT2" || frameId === "TPE1") {
        const encoding = data.getUint8(offset + 10);
        const frameContent = new Uint8Array(buffer, offset + 11, frameSize - 1);

        let text = "";
        if (encoding === 1 || encoding === 2) {
          text = new TextDecoder("utf-16").decode(frameContent);
        } else {
          text = new TextDecoder("utf-8").decode(frameContent);
        }

        text = text.replace(/\0/g, "").replace(/^\uFEFF/, "").trim();

        try {
          if (/[\u0080-\u00FF]/.test(text)) {
            text = decodeURIComponent(escape(text));
          }
        } catch {
        }

        if (frameId === "TIT2") title = text;
        if (frameId === "TPE1") artist = text;
      }

      offset += 10 + frameSize;
    }

    if (title || artist) {
      return { title, artist };
    }
  } catch {
  }

  return null;
}

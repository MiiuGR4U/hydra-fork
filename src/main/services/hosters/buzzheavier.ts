import { net } from "electron";

export class BuzzheavierApi {
  public static async getDownloadUrl(uri: string): Promise<string> {
    if (uri.includes("/download")) {
      return uri;
    }

    const response = await net.fetch(uri, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
      }
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch Buzzheavier page: ${response.statusText}`);
    }

    const html = await response.text();
    const match = /hx-get="([^"]+)"/.exec(html);
    if (!match || !match[1]) {
      throw new Error("Could not find download link on Buzzheavier page");
    }

    const downloadPath = match[1];
    const urlObj = new URL(uri);
    return `${urlObj.origin}${downloadPath}`;
  }
}

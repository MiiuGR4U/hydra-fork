import fetch from "node-fetch";

export class BuffdriveApi {
  public static async getDownloadUrl(uri: string): Promise<string> {
    try {
      const response = await fetch(uri, {
        headers: {
          "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
        }
      });

      if (!response.ok) throw new Error("Failed to fetch Buffdrive page");

      const html = await response.text();

      const match = /window\.location = '([^']+)';/.exec(html);
      if (!match?.[1]) {
        throw new Error("No download URL found on Buffdrive page");
      }
      const dlUrl = match[1];

      const cookies = response.headers.raw()["set-cookie"];
      const cookieHeader = cookies ? cookies.map(c => c.split(";")[0]).join("; ") : "";

      const dlResponse = await fetch(dlUrl, {
        headers: {
          "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
          "Cookie": cookieHeader
        },
        redirect: "manual"
      });

      const redirectUrl = dlResponse.headers.get("location");
      if (!redirectUrl) {
        throw new Error("Buffdrive pt URL did not redirect");
      }

      return redirectUrl;
    } catch (error) {
      throw new Error(`Failed to get Buffdrive download URL: ${(error as Error).message}`);
    }
  }
}

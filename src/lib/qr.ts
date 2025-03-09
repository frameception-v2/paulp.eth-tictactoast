import { PROJECT_TITLE } from "~/lib/constants";
import QRCode from "qrcode";

export async function generateGameQR(gameId: string): Promise<string> {
  try {
    const gameUrl = getGameDeepLink(gameId);
    return await QRCode.toDataURL(gameUrl, {
      errorCorrectionLevel: "H",
      margin: 2,
      width: 256,
    });
  } catch (err) {
    console.error("QR generation failed:", err);
    return "";
  }
}

export function getGameDeepLink(gameId: string): string {
  return `${window.location.origin}/play?gameId=${encodeURIComponent(gameId)}&utm_source=qr`;
}

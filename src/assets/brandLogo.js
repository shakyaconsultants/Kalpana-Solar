/**
 * Single source of truth for the Kalpana brand logo.
 * Bundled via Vite so PDF capture always resolves the asset (no broken /public paths).
 */

import logoUrl from "./kalpana-logo.png?url";

/** Increment when you replace src/assets/kalpana-logo.png */
export const LOGO_CACHE_VERSION = 2;

export const BRAND_LOGO_SRC = logoUrl;

/** Natural dimensions of kalpana-logo.png (for aspect-ratio / layout) */
export const BRAND_LOGO_WIDTH = 332;
export const BRAND_LOGO_HEIGHT = 270;
export const BRAND_LOGO_ASPECT = BRAND_LOGO_WIDTH / BRAND_LOGO_HEIGHT;

let logoDataUrlCache = null;
let logoDataUrlPromise = null;

function blobToDataUrl(blob) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}

/** Cached PNG data URL for jsPDF / html2canvas (always same-origin). */
export async function getBrandLogoDataUrl() {
  if (logoDataUrlCache) return logoDataUrlCache;
  if (!logoDataUrlPromise) {
    logoDataUrlPromise = fetch(logoUrl)
      .then((response) => {
        if (!response.ok) throw new Error(`Unable to load logo: ${logoUrl}`);
        return response.blob();
      })
      .then(blobToDataUrl)
      .then((dataUrl) => {
        logoDataUrlCache = dataUrl;
        return dataUrl;
      });
  }
  return logoDataUrlPromise;
}

/**
 * Single source of truth for the Kalpana brand logo.
 *
 * Place your logo at: public/kalpana-logo.png
 * After replacing the file, bump LOGO_CACHE_VERSION below (or hard-refresh the browser).
 */

/** Increment when you replace public/kalpana-logo.png */
export const LOGO_CACHE_VERSION = 1;

export const BRAND_LOGO_SRC = `/kalpana-logo.png?v=${LOGO_CACHE_VERSION}`;

/** Natural dimensions of kalpana-logo.png (for aspect-ratio / layout) */
export const BRAND_LOGO_WIDTH = 332;
export const BRAND_LOGO_HEIGHT = 270;
export const BRAND_LOGO_ASPECT = BRAND_LOGO_WIDTH / BRAND_LOGO_HEIGHT;

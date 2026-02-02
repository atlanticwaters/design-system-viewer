/**
 * UI-Side Token Loader
 *
 * Fetches token data from GitHub in the UI context (which has relaxed CSP)
 * and sends it to the plugin.
 */

// Base URL for token files (using raw GitHub content)
const TOKENS_BASE_URL = 'https://raw.githubusercontent.com/atlanticwaters/Tokens-Studio-Sandbox/main';

// Token file paths matching the actual repository structure
const TOKEN_FILE_PATHS = [
  // Core tokens (primitives)
  'core/colors',
  'core/neutrals',
  'core/border',
  'core/elevation',
  'core/font-family',
  'core/font-size',
  'core/font-weight',
  'core/interaction',
  'core/letter-spacing',
  'core/line-height',
  'core/position',
  'core/spacing',
  // Semantic tokens
  'semantic/light',
  'semantic/dark',
  // Component tokens
  'component/accordion',
  'component/accordionbody',
  'component/action',
  'component/alert',
  'component/badge',
  'component/beta-list-item-content',
  'component/beta-list-item-media',
  'component/bottom-actions',
  'component/button',
  'component/button-quantity',
  'component/callout',
  'component/cardheading',
  'component/checkbox',
  'component/chevron-xs',
  'component/content-card',
  'component/content-card-v2',
  'component/field-label',
  'component/icon-button',
  'component/image',
  'component/image-container',
  'component/indicator',
  'component/input',
  'component/input-adornment',
  'component/input-child',
  'component/list-item',
  'component/menu-item',
  'component/mini-product-card',
  'component/notification',
  'component/pill',
  'component/pillmedia',
  'component/plp-card',
  'component/popoverbeak',
  'component/pricing-action',
  'component/progress-bar',
  'component/progress-bar-track',
  'component/quantity-button',
  'component/quantity-picker',
  'component/radio-button',
  'component/rating-increment',
  'component/rating-meter',
  'component/rating-star-half',
  'component/switch',
  'component/tab',
  'component/tab-group',
  'component/text-input-field',
  'component/tile',
  'component/tilecontent',
  'component/tilemedia',
  'component/tooltip',
];

export interface TokenFileData {
  path: string;
  content: Record<string, unknown>;
}

/**
 * Fetch JSON from a URL
 */
async function fetchJson<T>(url: string): Promise<T> {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to fetch ${url}: ${response.status} ${response.statusText}`);
  }
  return response.json();
}

/**
 * Load all token files from remote GitHub
 */
export async function loadTokenFiles(): Promise<TokenFileData[]> {
  const tokenFiles: TokenFileData[] = [];

  // Load each token file
  for (const tokenPath of TOKEN_FILE_PATHS) {
    try {
      const url = `${TOKENS_BASE_URL}/${tokenPath}.json`;
      console.log(`[UI] Loading tokens from: ${url}`);
      const content = await fetchJson<Record<string, unknown>>(url);

      tokenFiles.push({
        path: tokenPath,
        content,
      });
    } catch (error) {
      console.warn(`[UI] Failed to load token file ${tokenPath}:`, error);
    }
  }

  console.log(`[UI] Loaded ${tokenFiles.length} token files`);
  return tokenFiles;
}

import { useState, useMemo, useCallback, useEffect } from 'react';
import { TokensStudioFile, ParsedTokens, ResolvedToken } from '../types/tokens';
import { parseTokensJson, parseMultipleTokenFiles } from '../utils/tokenParser';
import { resolveAllTokens } from '../utils/tokenResolver';
import { mapToParsedTokens } from '../utils/tokenMapper';
import { fetchAllJsonFiles, parseGitHubUrl } from '../utils/githubApi';

// Default repository to load tokens from (fallback if local files unavailable)
export const DEFAULT_TOKENS_REPO = 'https://github.com/atlanticwaters/Tokens-Studio-Sandbox';

// Immediate test fetch at module load
console.log('[useTokensStudio] Module loaded, BASE_URL:', import.meta.env.BASE_URL);
fetch(`${import.meta.env.BASE_URL}tokens/core/colors.json`)
  .then(res => {
    console.log('[useTokensStudio] Test fetch status:', res.status, res.ok ? 'OK' : 'FAILED');
    return res.text();
  })
  .then(text => console.log('[useTokensStudio] Test fetch result:', text.substring(0, 100) + '...'))
  .catch(err => console.error('[useTokensStudio] Test fetch error:', err));

// List of local token files to load from /public/tokens
// These files are served statically by Vite
const LOCAL_TOKEN_FILES = [
  // Core tokens
  'core/colors.json',
  'core/neutrals.json',
  'core/spacing.json',
  'core/border.json',
  'core/elevation.json',
  'core/font-family.json',
  'core/font-size.json',
  'core/font-weight.json',
  'core/letter-spacing.json',
  'core/line-height.json',
  'core/interaction.json',
  'core/position.json',
  // Semantic tokens
  'semantic/light.json',
  'semantic/dark.json',
  // Component tokens
  'component/accordion.json',
  'component/accordionbody.json',
  'component/action.json',
  'component/alert.json',
  'component/badge.json',
  'component/beta-list-item-content.json',
  'component/beta-list-item-media.json',
  'component/bottom-actions.json',
  'component/button.json',
  'component/button-quantity.json',
  'component/callout.json',
  'component/cardheading.json',
  'component/checkbox.json',
  'component/chevron-xs.json',
  'component/content-card.json',
  'component/content-card-v2.json',
  'component/field-label.json',
  'component/icon-button.json',
  'component/image.json',
  'component/image-container.json',
  'component/indicator.json',
  'component/input.json',
  'component/input-adornment.json',
  'component/input-child.json',
  'component/list-item.json',
  'component/menu-item.json',
  'component/mini-product-card.json',
  'component/notification.json',
  'component/pill.json',
  'component/pillmedia.json',
  'component/plp-card.json',
  'component/popoverbeak.json',
  'component/pricing-action.json',
  'component/progress-bar.json',
  'component/progress-bar-track.json',
  'component/quantity-button.json',
  'component/quantity-picker.json',
  'component/radio-button.json',
  'component/rating-increment.json',
  'component/rating-meter.json',
  'component/rating-star-half.json',
  'component/switch.json',
  'component/tab.json',
  'component/tab-group.json',
  'component/text-input-field.json',
  'component/tile.json',
  'component/tilecontent.json',
  'component/tilemedia.json',
  'component/tooltip.json',
];

// Get the base URL for the app (handles both dev and production)
const BASE_URL = import.meta.env.BASE_URL || '/';

/**
 * Load tokens from local files served from /public/tokens
 */
async function loadLocalTokenFiles(): Promise<{ path: string; content: string }[]> {
  const files: { path: string; content: string }[] = [];

  console.log('[loadLocalTokenFiles] Loading', LOCAL_TOKEN_FILES.length, 'token files');

  const results = await Promise.allSettled(
    LOCAL_TOKEN_FILES.map(async (filePath) => {
      const url = `${BASE_URL}tokens/${filePath}`;
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Failed to fetch ${url}: ${response.status}`);
      }
      const content = await response.text();
      return { path: filePath, content };
    })
  );

  for (const result of results) {
    if (result.status === 'fulfilled') {
      files.push(result.value);
    } else {
      console.warn('[loadLocalTokenFiles] Failed to load file:', result.reason);
    }
  }

  console.log('[loadLocalTokenFiles] Loaded', files.length, 'files successfully');
  return files;
}

export interface LoadedFile {
  path: string;
  content: string;
}

export interface UseTokensStudioOptions {
  autoLoad?: boolean;
  repoUrl?: string;
}

export interface UseTokensStudioReturn {
  // State
  rawJson: string | null;
  loadedFiles: LoadedFile[];
  parsedTokens: ParsedTokens | null;
  resolvedTokens: Map<string, ResolvedToken>;
  tokensFile: TokensStudioFile | null;
  isLoading: boolean;
  error: string | null;
  repoUrl: string;

  // Actions
  loadFromString: (json: string) => void;
  loadFromUrl: (url: string) => Promise<void>;
  loadFromFile: (file: File) => Promise<void>;
  loadFromMultipleFiles: (files: LoadedFile[]) => void;
  loadFromRepo: (repoUrl?: string) => Promise<void>;
  loadLocalTokens: () => Promise<void>;
  clear: () => void;
  setIsLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;

  // Theme
  isDarkMode: boolean;
  setIsDarkMode: (dark: boolean) => void;
}

export function useTokensStudio(options: UseTokensStudioOptions = {}): UseTokensStudioReturn {
  const { autoLoad = false, repoUrl: initialRepoUrl = DEFAULT_TOKENS_REPO } = options;

  const [rawJson, setRawJson] = useState<string | null>(null);
  const [loadedFiles, setLoadedFiles] = useState<LoadedFile[]>([]);
  const [repoUrl, setRepoUrl] = useState(initialRepoUrl);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasAutoLoaded, setHasAutoLoaded] = useState(false);

  // Load all JSON files from a GitHub repository
  const loadFromRepo = useCallback(async (url?: string) => {
    const targetUrl = url || repoUrl;
    const repoInfo = parseGitHubUrl(targetUrl);

    if (!repoInfo) {
      setError('Invalid GitHub repository URL');
      return;
    }

    setError(null);
    setIsLoading(true);
    setRawJson(null); // Clear single-file state

    try {
      const files = await fetchAllJsonFiles(repoInfo.owner, repoInfo.repo, '');

      if (files.length === 0) {
        setError('No JSON files found in this repository');
        return;
      }

      setLoadedFiles(files);
      setRepoUrl(targetUrl);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to load repository');
    } finally {
      setIsLoading(false);
    }
  }, [repoUrl]);

  // Load tokens from local files
  const loadLocalTokens = useCallback(async () => {
    console.log('[loadLocalTokens] Starting to load local tokens...');
    setError(null);
    setIsLoading(true);
    setRawJson(null);

    try {
      const files = await loadLocalTokenFiles();
      console.log('[loadLocalTokens] Received', files.length, 'files');

      if (files.length === 0) {
        console.error('[loadLocalTokens] No files loaded!');
        setError('No local token files found');
        return;
      }

      console.log('[loadLocalTokens] Setting loadedFiles state with', files.length, 'files');
      console.log('[loadLocalTokens] First file:', files[0]?.path);
      setLoadedFiles(files);
      setRepoUrl('local');
    } catch (e) {
      console.error('[loadLocalTokens] Error:', e);
      setError(e instanceof Error ? e.message : 'Failed to load local tokens');
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Auto-load from local files on mount if enabled
  useEffect(() => {
    if (autoLoad && !hasAutoLoaded && loadedFiles.length === 0 && !rawJson) {
      setHasAutoLoaded(true);
      // Load from local files by default
      loadLocalTokens();
    }
  }, [autoLoad, hasAutoLoaded, loadedFiles.length, rawJson, loadLocalTokens]);

  // Parse and resolve tokens
  const { parsedTokens, resolvedTokens, tokensFile } = useMemo(() => {
    console.log('[useMemo] Parsing tokens, loadedFiles:', loadedFiles.length, 'rawJson:', !!rawJson);

    // If we have multiple files, merge them
    if (loadedFiles.length > 0) {
      try {
        console.log('[useMemo] Parsing', loadedFiles.length, 'files');
        const tokens = parseMultipleTokenFiles(loadedFiles);
        console.log('[useMemo] Parsed tokens, categories:', Object.keys(tokens).length);
        console.log('[useMemo] Token categories:', Object.keys(tokens).slice(0, 10));
        const resolved = resolveAllTokens(tokens);
        console.log('[useMemo] Resolved tokens:', resolved.size);
        const parsed = mapToParsedTokens(tokens);
        console.log('[useMemo] Mapped tokens, core colors:', parsed.colors.core.length);
        return { parsedTokens: parsed, resolvedTokens: resolved, tokensFile: tokens };
      } catch (e) {
        console.error('[useMemo] Failed to parse multiple token files:', e);
        return {
          parsedTokens: null,
          resolvedTokens: new Map<string, ResolvedToken>(),
          tokensFile: null,
        };
      }
    }

    // Single file mode (rawJson)
    if (!rawJson) {
      console.log('[useMemo] No files or rawJson, returning null');
      return {
        parsedTokens: null,
        resolvedTokens: new Map<string, ResolvedToken>(),
        tokensFile: null,
      };
    }

    try {
      const tokens = parseTokensJson(rawJson);
      const resolved = resolveAllTokens(tokens);
      const parsed = mapToParsedTokens(tokens);
      return { parsedTokens: parsed, resolvedTokens: resolved, tokensFile: tokens };
    } catch (e) {
      console.error('Failed to parse tokens:', e);
      return {
        parsedTokens: null,
        resolvedTokens: new Map<string, ResolvedToken>(),
        tokensFile: null,
      };
    }
  }, [rawJson, loadedFiles]);

  const loadFromString = useCallback((json: string) => {
    setError(null);
    setIsLoading(true);
    setLoadedFiles([]); // Clear multi-file state
    try {
      // Validate JSON before setting
      JSON.parse(json);
      setRawJson(json);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Invalid JSON');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const loadFromUrl = useCallback(async (url: string) => {
    setError(null);
    setIsLoading(true);
    setLoadedFiles([]); // Clear multi-file state
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Failed to fetch: ${response.status} ${response.statusText}`);
      }
      const json = await response.text();
      setRawJson(json);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to load URL');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const loadFromFile = useCallback(async (file: File) => {
    setError(null);
    setIsLoading(true);
    setLoadedFiles([]); // Clear multi-file state
    try {
      const json = await file.text();
      // Validate JSON before setting
      JSON.parse(json);
      setRawJson(json);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to read file');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const loadFromMultipleFiles = useCallback((files: LoadedFile[]) => {
    setError(null);
    setRawJson(null); // Clear single-file state
    setLoadedFiles(files);
  }, []);

  const clear = useCallback(() => {
    setRawJson(null);
    setLoadedFiles([]);
    setError(null);
  }, []);

  return {
    rawJson,
    loadedFiles,
    parsedTokens,
    resolvedTokens,
    tokensFile,
    isLoading,
    error,
    repoUrl,
    loadFromString,
    loadFromUrl,
    loadFromFile,
    loadFromMultipleFiles,
    loadFromRepo,
    loadLocalTokens,
    clear,
    setIsLoading,
    setError,
    isDarkMode,
    setIsDarkMode,
  };
}

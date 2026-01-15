import { useState, useMemo, useCallback, useEffect } from 'react';
import { TokensStudioFile, ParsedTokens, ResolvedToken } from '../types/tokens';
import { parseTokensJson, parseMultipleTokenFiles } from '../utils/tokenParser';
import { resolveAllTokens } from '../utils/tokenResolver';
import { mapToParsedTokens } from '../utils/tokenMapper';
import { fetchAllJsonFiles, parseGitHubUrl } from '../utils/githubApi';

// Default repository to load tokens from
export const DEFAULT_TOKENS_REPO = 'https://github.com/atlanticwaters/Tokens-Studio-Sandbox';

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

  // Auto-load from repo on mount if enabled
  useEffect(() => {
    if (autoLoad && !hasAutoLoaded && loadedFiles.length === 0 && !rawJson) {
      setHasAutoLoaded(true);
      loadFromRepo();
    }
  }, [autoLoad, hasAutoLoaded, loadedFiles.length, rawJson, loadFromRepo]);

  // Parse and resolve tokens
  const { parsedTokens, resolvedTokens, tokensFile } = useMemo(() => {
    // If we have multiple files, merge them
    if (loadedFiles.length > 0) {
      try {
        const tokens = parseMultipleTokenFiles(loadedFiles);
        const resolved = resolveAllTokens(tokens);
        const parsed = mapToParsedTokens(tokens);
        return { parsedTokens: parsed, resolvedTokens: resolved, tokensFile: tokens };
      } catch (e) {
        console.error('Failed to parse multiple token files:', e);
        return {
          parsedTokens: null,
          resolvedTokens: new Map<string, ResolvedToken>(),
          tokensFile: null,
        };
      }
    }

    // Single file mode (rawJson)
    if (!rawJson) {
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
    clear,
    setIsLoading,
    setError,
    isDarkMode,
    setIsDarkMode,
  };
}

/**
 * useGitHubAuth Hook
 * Manages GitHub authentication state
 *
 * Note: Full OAuth flow requires a backend endpoint to exchange the
 * authorization code for an access token. For now, this supports
 * Personal Access Token (PAT) based authentication.
 */

import { useState, useCallback, useEffect } from 'react';
import {
  getAuthenticatedUser,
  verifyTokenPermissions,
  type GitHubAuth,
} from '../../tokens-studio/utils/githubApi';

const STORAGE_KEY = 'github_token';

export interface GitHubUser {
  login: string;
  avatar_url: string;
  name: string | null;
}

export interface GitHubAuthState {
  isAuthenticated: boolean;
  isLoading: boolean;
  user: GitHubUser | null;
  canWrite: boolean;
  error: string | null;
}

export interface UseGitHubAuthResult extends GitHubAuthState {
  login: (token: string) => Promise<boolean>;
  logout: () => void;
  getAuth: () => GitHubAuth | null;
}

export function useGitHubAuth(
  owner?: string,
  repo?: string
): UseGitHubAuthResult {
  const [state, setState] = useState<GitHubAuthState>({
    isAuthenticated: false,
    isLoading: true,
    user: null,
    canWrite: false,
    error: null,
  });

  // Load saved token on mount
  useEffect(() => {
    const savedToken = localStorage.getItem(STORAGE_KEY);
    if (savedToken) {
      validateToken(savedToken);
    } else {
      setState(prev => ({ ...prev, isLoading: false }));
    }
  }, []);

  const validateToken = useCallback(async (token: string) => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));

    try {
      // Get user info
      const user = await getAuthenticatedUser({ token });

      // Check permissions if owner/repo provided
      let canWrite = false;
      if (owner && repo) {
        const permissions = await verifyTokenPermissions(owner, repo, { token });
        canWrite = permissions.canWrite;
      }

      setState({
        isAuthenticated: true,
        isLoading: false,
        user,
        canWrite,
        error: null,
      });

      return true;
    } catch (err) {
      setState({
        isAuthenticated: false,
        isLoading: false,
        user: null,
        canWrite: false,
        error: err instanceof Error ? err.message : 'Authentication failed',
      });

      // Clear invalid token
      localStorage.removeItem(STORAGE_KEY);
      return false;
    }
  }, [owner, repo]);

  const login = useCallback(async (token: string): Promise<boolean> => {
    const isValid = await validateToken(token);
    if (isValid) {
      localStorage.setItem(STORAGE_KEY, token);
    }
    return isValid;
  }, [validateToken]);

  const logout = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
    setState({
      isAuthenticated: false,
      isLoading: false,
      user: null,
      canWrite: false,
      error: null,
    });
  }, []);

  const getAuth = useCallback((): GitHubAuth | null => {
    const token = localStorage.getItem(STORAGE_KEY);
    return token ? { token } : null;
  }, []);

  return {
    ...state,
    login,
    logout,
    getAuth,
  };
}

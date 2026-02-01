/**
 * AuthButton Component
 * GitHub authentication button with user menu
 */

import React, { useState, useRef, useEffect } from 'react';
import type { GitHubUser } from '../../hooks/useGitHubAuth';
import { FONT_OPEN_SANS } from '../../../tokens-studio/utils/fonts';

interface AuthButtonProps {
  isAuthenticated: boolean;
  isLoading: boolean;
  user: GitHubUser | null;
  canWrite: boolean;
  error: string | null;
  onLogin: (token: string) => Promise<boolean>;
  onLogout: () => void;
  isDarkMode?: boolean;
}

export function AuthButton({
  isAuthenticated,
  isLoading,
  user,
  canWrite,
  error,
  onLogin,
  onLogout,
  isDarkMode = false,
}: AuthButtonProps) {
  const [showMenu, setShowMenu] = useState(false);
  const [showTokenInput, setShowTokenInput] = useState(false);
  const [token, setToken] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close menu on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowMenu(false);
        setShowTokenInput(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token.trim()) {
      setLoginError('Token is required');
      return;
    }

    setIsSubmitting(true);
    setLoginError(null);

    const success = await onLogin(token);
    setIsSubmitting(false);

    if (success) {
      setToken('');
      setShowTokenInput(false);
      setShowMenu(false);
    } else {
      setLoginError('Invalid token or insufficient permissions');
    }
  };

  const buttonStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    padding: '6px 12px',
    borderRadius: 6,
    border: `1px solid ${isDarkMode ? '#4a4a4a' : '#d1d5db'}`,
    backgroundColor: isDarkMode ? '#252524' : '#ffffff',
    color: isDarkMode ? '#fbfaf9' : '#252524',
    fontSize: 13,
    fontFamily: FONT_OPEN_SANS,
    cursor: 'pointer',
    transition: 'all 0.2s ease',
  };

  if (isLoading) {
    return (
      <button style={{ ...buttonStyle, cursor: 'default' }} disabled>
        <LoadingSpinner size={16} />
        <span>Loading...</span>
      </button>
    );
  }

  if (isAuthenticated && user) {
    return (
      <div style={{ position: 'relative' }} ref={menuRef}>
        <button
          onClick={() => setShowMenu(!showMenu)}
          style={buttonStyle}
        >
          <img
            src={user.avatar_url}
            alt={user.login}
            style={{
              width: 20,
              height: 20,
              borderRadius: '50%',
            }}
          />
          <span>{user.login}</span>
          {canWrite ? (
            <span
              title="Can write to repository"
              style={{
                width: 8,
                height: 8,
                borderRadius: '50%',
                backgroundColor: '#22c55e',
              }}
            />
          ) : (
            <span
              title="Read-only access"
              style={{
                width: 8,
                height: 8,
                borderRadius: '50%',
                backgroundColor: '#f59e0b',
              }}
            />
          )}
        </button>

        {showMenu && (
          <div
            style={{
              position: 'absolute',
              top: '100%',
              right: 0,
              marginTop: 4,
              width: 200,
              backgroundColor: isDarkMode ? '#1a1a1a' : '#ffffff',
              borderRadius: 8,
              border: `1px solid ${isDarkMode ? '#3a3a3a' : '#e5e1de'}`,
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
              overflow: 'hidden',
              zIndex: 100,
            }}
          >
            <div
              style={{
                padding: '12px 16px',
                borderBottom: `1px solid ${isDarkMode ? '#3a3a3a' : '#e5e1de'}`,
              }}
            >
              <div
                style={{
                  fontSize: 14,
                  fontWeight: 600,
                  fontFamily: FONT_OPEN_SANS,
                  color: isDarkMode ? '#fbfaf9' : '#252524',
                }}
              >
                {user.name || user.login}
              </div>
              <div
                style={{
                  fontSize: 12,
                  fontFamily: FONT_OPEN_SANS,
                  color: isDarkMode ? '#9ca3af' : '#6b7280',
                  marginTop: 2,
                }}
              >
                @{user.login}
              </div>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6,
                  marginTop: 8,
                  fontSize: 11,
                  fontFamily: FONT_OPEN_SANS,
                  color: canWrite
                    ? (isDarkMode ? '#4ade80' : '#16a34a')
                    : (isDarkMode ? '#fbbf24' : '#d97706'),
                }}
              >
                <span
                  style={{
                    width: 6,
                    height: 6,
                    borderRadius: '50%',
                    backgroundColor: canWrite ? '#22c55e' : '#f59e0b',
                  }}
                />
                {canWrite ? 'Write access' : 'Read-only access'}
              </div>
            </div>

            <button
              onClick={() => {
                onLogout();
                setShowMenu(false);
              }}
              style={{
                width: '100%',
                padding: '12px 16px',
                background: 'none',
                border: 'none',
                textAlign: 'left',
                fontSize: 13,
                fontFamily: FONT_OPEN_SANS,
                color: isDarkMode ? '#ef4444' : '#dc2626',
                cursor: 'pointer',
              }}
            >
              Sign out
            </button>
          </div>
        )}
      </div>
    );
  }

  // Not authenticated
  return (
    <div style={{ position: 'relative' }} ref={menuRef}>
      <button
        onClick={() => setShowTokenInput(!showTokenInput)}
        style={buttonStyle}
      >
        <GitHubIcon size={16} />
        <span>Sign in</span>
      </button>

      {showTokenInput && (
        <div
          style={{
            position: 'absolute',
            top: '100%',
            right: 0,
            marginTop: 4,
            width: 300,
            backgroundColor: isDarkMode ? '#1a1a1a' : '#ffffff',
            borderRadius: 8,
            border: `1px solid ${isDarkMode ? '#3a3a3a' : '#e5e1de'}`,
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
            overflow: 'hidden',
            zIndex: 100,
          }}
        >
          <form onSubmit={handleLoginSubmit}>
            <div style={{ padding: 16 }}>
              <h3
                style={{
                  margin: '0 0 12px',
                  fontSize: 14,
                  fontWeight: 600,
                  fontFamily: FONT_OPEN_SANS,
                  color: isDarkMode ? '#fbfaf9' : '#252524',
                }}
              >
                Sign in with GitHub
              </h3>
              <p
                style={{
                  margin: '0 0 16px',
                  fontSize: 12,
                  fontFamily: FONT_OPEN_SANS,
                  color: isDarkMode ? '#9ca3af' : '#6b7280',
                  lineHeight: 1.5,
                }}
              >
                Enter a Personal Access Token with <code>repo</code> scope to commit changes.
              </p>

              <input
                type="password"
                value={token}
                onChange={e => setToken(e.target.value)}
                placeholder="ghp_xxxxxxxxxxxx"
                disabled={isSubmitting}
                style={{
                  width: '100%',
                  padding: '8px 12px',
                  fontSize: 13,
                  fontFamily: 'monospace',
                  borderRadius: 6,
                  border: `1px solid ${isDarkMode ? '#4a4a4a' : '#d1d5db'}`,
                  backgroundColor: isDarkMode ? '#252524' : '#ffffff',
                  color: isDarkMode ? '#fbfaf9' : '#252524',
                  outline: 'none',
                  boxSizing: 'border-box',
                }}
              />

              {(loginError || error) && (
                <div
                  style={{
                    marginTop: 12,
                    padding: '8px 12px',
                    borderRadius: 4,
                    backgroundColor: isDarkMode ? '#450a0a' : '#fef2f2',
                    color: isDarkMode ? '#fca5a5' : '#dc2626',
                    fontSize: 12,
                    fontFamily: FONT_OPEN_SANS,
                  }}
                >
                  {loginError || error}
                </div>
              )}

              <div
                style={{
                  display: 'flex',
                  justifyContent: 'flex-end',
                  gap: 8,
                  marginTop: 16,
                }}
              >
                <button
                  type="button"
                  onClick={() => {
                    setShowTokenInput(false);
                    setToken('');
                    setLoginError(null);
                  }}
                  disabled={isSubmitting}
                  style={{
                    padding: '6px 12px',
                    fontSize: 13,
                    fontFamily: FONT_OPEN_SANS,
                    borderRadius: 4,
                    backgroundColor: 'transparent',
                    color: isDarkMode ? '#fbfaf9' : '#252524',
                    border: `1px solid ${isDarkMode ? '#4a4a4a' : '#d1d5db'}`,
                    cursor: 'pointer',
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting || !token.trim()}
                  style={{
                    padding: '6px 12px',
                    fontSize: 13,
                    fontFamily: FONT_OPEN_SANS,
                    fontWeight: 500,
                    borderRadius: 4,
                    backgroundColor: '#f96302',
                    color: '#ffffff',
                    border: 'none',
                    cursor: (isSubmitting || !token.trim()) ? 'not-allowed' : 'pointer',
                    opacity: (isSubmitting || !token.trim()) ? 0.5 : 1,
                  }}
                >
                  {isSubmitting ? 'Signing in...' : 'Sign in'}
                </button>
              </div>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}

function GitHubIcon({ size = 24 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
    >
      <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
    </svg>
  );
}

function LoadingSpinner({ size = 16 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      style={{
        animation: 'spin 1s linear infinite',
      }}
    >
      <style>
        {`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}
      </style>
      <circle
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
        strokeDasharray="32"
        strokeDashoffset="8"
        opacity="0.25"
      />
      <circle
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
        strokeDasharray="32"
        strokeDashoffset="24"
      />
    </svg>
  );
}

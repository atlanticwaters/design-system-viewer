import React, { useState } from 'react';
import {
  GitHubItem,
  RepoInfo,
  parseGitHubUrl,
  fetchRepoContents,
  fetchFileContent,
  fetchAllJsonFiles,
  sortGitHubItems,
} from '../utils/githubApi';

interface RepoBrowserProps {
  onLoadTokens: (files: { path: string; content: string }[]) => void;
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
}

const DEFAULT_REPO_URL = 'https://github.com/atlanticwaters/Tokens-Studio-Sandbox';

export function RepoBrowser({
  onLoadTokens,
  isLoading,
  setIsLoading,
  setError,
}: RepoBrowserProps) {
  const [repoUrl, setRepoUrl] = useState(DEFAULT_REPO_URL);
  const [repoInfo, setRepoInfo] = useState<RepoInfo | null>(null);
  const [currentPath, setCurrentPath] = useState('');
  const [items, setItems] = useState<GitHubItem[]>([]);
  const [selectedFiles, setSelectedFiles] = useState<Map<string, boolean>>(new Map());
  const [isConnected, setIsConnected] = useState(false);

  // Connect to repository
  const connectToRepo = async () => {
    const info = parseGitHubUrl(repoUrl);
    if (!info) {
      setError('Invalid GitHub URL. Please enter a valid repository URL.');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const contents = await fetchRepoContents(info.owner, info.repo, '');
      setRepoInfo(info);
      setItems(sortGitHubItems(contents));
      setCurrentPath('');
      setIsConnected(true);
      setSelectedFiles(new Map());
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to connect to repository');
    } finally {
      setIsLoading(false);
    }
  };

  // Navigate to a directory
  const navigateTo = async (path: string) => {
    if (!repoInfo) return;

    setIsLoading(true);
    setError(null);

    try {
      const contents = await fetchRepoContents(repoInfo.owner, repoInfo.repo, path);
      setItems(sortGitHubItems(contents));
      setCurrentPath(path);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load directory');
    } finally {
      setIsLoading(false);
    }
  };

  // Go up one directory level
  const navigateUp = () => {
    const parts = currentPath.split('/');
    parts.pop();
    navigateTo(parts.join('/'));
  };

  // Toggle file selection
  const toggleFileSelection = (path: string) => {
    const newSelected = new Map(selectedFiles);
    if (newSelected.has(path)) {
      newSelected.delete(path);
    } else {
      newSelected.set(path, true);
    }
    setSelectedFiles(newSelected);
  };

  // Select all JSON files in current directory
  const selectAllJsonFiles = () => {
    const newSelected = new Map(selectedFiles);
    items
      .filter(item => item.type === 'file' && item.name.endsWith('.json'))
      .forEach(item => newSelected.set(item.path, true));
    setSelectedFiles(newSelected);
  };

  // Load all JSON files from entire repository
  const loadEntireRepo = async () => {
    if (!repoInfo) return;

    setIsLoading(true);
    setError(null);

    try {
      const files = await fetchAllJsonFiles(repoInfo.owner, repoInfo.repo, '');
      if (files.length === 0) {
        setError('No JSON files found in this repository');
        return;
      }
      onLoadTokens(files);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load repository');
    } finally {
      setIsLoading(false);
    }
  };

  // Load all JSON files from current directory (recursively)
  const loadCurrentDirectory = async () => {
    if (!repoInfo) return;

    setIsLoading(true);
    setError(null);

    try {
      const files = await fetchAllJsonFiles(repoInfo.owner, repoInfo.repo, currentPath);
      if (files.length === 0) {
        setError('No JSON files found in this directory');
        return;
      }
      onLoadTokens(files);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load directory');
    } finally {
      setIsLoading(false);
    }
  };

  // Load selected files
  const loadSelectedFiles = async () => {
    if (!repoInfo || selectedFiles.size === 0) return;

    setIsLoading(true);
    setError(null);

    try {
      const files: { path: string; content: string }[] = [];

      for (const [path] of selectedFiles) {
        const content = await fetchFileContent(repoInfo.owner, repoInfo.repo, path);
        files.push({ path, content });
      }

      onLoadTokens(files);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load files');
    } finally {
      setIsLoading(false);
    }
  };

  // Styles
  const containerStyle: React.CSSProperties = {
    backgroundColor: '#ffffff',
    borderRadius: 8,
    border: '1px solid #e5e1de',
    overflow: 'hidden',
  };

  const headerStyle: React.CSSProperties = {
    padding: 16,
    borderBottom: '1px solid #e5e1de',
    backgroundColor: '#f8f5f2',
  };

  const inputRowStyle: React.CSSProperties = {
    display: 'flex',
    gap: 8,
    marginBottom: 12,
  };

  const inputStyle: React.CSSProperties = {
    flex: 1,
    padding: '10px 14px',
    fontSize: 14,
    borderRadius: 6,
    border: '1px solid #bab7b4',
    fontFamily: 'inherit',
  };

  const buttonStyle: React.CSSProperties = {
    padding: '10px 16px',
    fontSize: 14,
    fontWeight: 600,
    borderRadius: 6,
    border: 'none',
    cursor: 'pointer',
    backgroundColor: '#f96302',
    color: '#ffffff',
    whiteSpace: 'nowrap',
  };

  const secondaryButtonStyle: React.CSSProperties = {
    ...buttonStyle,
    backgroundColor: '#252524',
  };

  const outlineButtonStyle: React.CSSProperties = {
    ...buttonStyle,
    backgroundColor: 'transparent',
    border: '1px solid #bab7b4',
    color: '#252524',
  };

  const disabledButtonStyle: React.CSSProperties = {
    ...buttonStyle,
    backgroundColor: '#bab7b4',
    cursor: 'not-allowed',
  };

  const breadcrumbStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: 4,
    fontSize: 13,
    color: '#585756',
    marginBottom: 12,
  };

  const breadcrumbLinkStyle: React.CSSProperties = {
    color: '#f96302',
    cursor: 'pointer',
    textDecoration: 'none',
  };

  const listStyle: React.CSSProperties = {
    maxHeight: 300,
    overflowY: 'auto',
  };

  const itemStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: 12,
    padding: '10px 16px',
    borderBottom: '1px solid #f0f0f0',
    cursor: 'pointer',
    transition: 'background-color 0.1s',
  };

  const itemHoverStyle: React.CSSProperties = {
    backgroundColor: '#f8f5f2',
  };

  const iconStyle: React.CSSProperties = {
    fontSize: 16,
    width: 20,
    textAlign: 'center',
  };

  const checkboxStyle: React.CSSProperties = {
    width: 18,
    height: 18,
    cursor: 'pointer',
  };

  const actionsStyle: React.CSSProperties = {
    padding: 16,
    borderTop: '1px solid #e5e1de',
    backgroundColor: '#f8f5f2',
    display: 'flex',
    gap: 8,
    flexWrap: 'wrap',
  };

  const statsStyle: React.CSSProperties = {
    fontSize: 12,
    color: '#787675',
    marginLeft: 'auto',
    display: 'flex',
    alignItems: 'center',
  };

  // Render breadcrumb navigation
  const renderBreadcrumbs = () => {
    if (!repoInfo) return null;

    const parts = currentPath ? currentPath.split('/') : [];

    return (
      <div style={breadcrumbStyle}>
        <span
          style={breadcrumbLinkStyle}
          onClick={() => navigateTo('')}
        >
          {repoInfo.repo}
        </span>
        {parts.map((part, index) => (
          <React.Fragment key={index}>
            <span>/</span>
            <span
              style={breadcrumbLinkStyle}
              onClick={() => navigateTo(parts.slice(0, index + 1).join('/'))}
            >
              {part}
            </span>
          </React.Fragment>
        ))}
      </div>
    );
  };

  // Count JSON files
  const jsonFileCount = items.filter(
    item => item.type === 'file' && item.name.endsWith('.json')
  ).length;

  const dirCount = items.filter(item => item.type === 'dir').length;

  return (
    <div style={containerStyle}>
      <div style={headerStyle}>
        <div style={inputRowStyle}>
          <input
            type="url"
            placeholder="Enter GitHub repository URL"
            value={repoUrl}
            onChange={(e) => setRepoUrl(e.target.value)}
            style={inputStyle}
            disabled={isLoading}
          />
          <button
            onClick={connectToRepo}
            disabled={isLoading || !repoUrl}
            style={isLoading || !repoUrl ? disabledButtonStyle : buttonStyle}
          >
            {isLoading ? 'Loading...' : isConnected ? 'Refresh' : 'Connect'}
          </button>
        </div>

        {isConnected && repoInfo && (
          <>
            {renderBreadcrumbs()}
            <div style={{ display: 'flex', gap: 8 }}>
              <button
                onClick={loadEntireRepo}
                disabled={isLoading}
                style={isLoading ? disabledButtonStyle : secondaryButtonStyle}
              >
                📦 Load Entire Repo
              </button>
              {currentPath && (
                <button
                  onClick={loadCurrentDirectory}
                  disabled={isLoading}
                  style={isLoading ? disabledButtonStyle : outlineButtonStyle}
                >
                  📁 Load This Directory
                </button>
              )}
              {jsonFileCount > 0 && (
                <button
                  onClick={selectAllJsonFiles}
                  style={outlineButtonStyle}
                >
                  ☑️ Select All JSON
                </button>
              )}
            </div>
          </>
        )}
      </div>

      {isConnected && (
        <>
          <div style={listStyle}>
            {currentPath && (
              <div
                style={itemStyle}
                onClick={navigateUp}
                onMouseEnter={(e) => Object.assign(e.currentTarget.style, itemHoverStyle)}
                onMouseLeave={(e) => Object.assign(e.currentTarget.style, { backgroundColor: 'transparent' })}
              >
                <span style={iconStyle}>⬆️</span>
                <span>..</span>
              </div>
            )}

            {items.map((item) => {
              const isJson = item.type === 'file' && item.name.endsWith('.json');
              const isSelected = selectedFiles.has(item.path);

              return (
                <div
                  key={item.path}
                  style={{
                    ...itemStyle,
                    backgroundColor: isSelected ? '#fef2e9' : 'transparent',
                  }}
                  onClick={() => {
                    if (item.type === 'dir') {
                      navigateTo(item.path);
                    } else if (isJson) {
                      toggleFileSelection(item.path);
                    }
                  }}
                  onMouseEnter={(e) => {
                    if (!isSelected) {
                      Object.assign(e.currentTarget.style, itemHoverStyle);
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isSelected) {
                      Object.assign(e.currentTarget.style, { backgroundColor: 'transparent' });
                    }
                  }}
                >
                  {isJson && (
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => toggleFileSelection(item.path)}
                      onClick={(e) => e.stopPropagation()}
                      style={checkboxStyle}
                    />
                  )}
                  <span style={iconStyle}>
                    {item.type === 'dir' ? '📁' : isJson ? '📄' : '📃'}
                  </span>
                  <span style={{ flex: 1 }}>{item.name}</span>
                  {item.type === 'dir' && (
                    <span style={{ color: '#bab7b4', fontSize: 12 }}>→</span>
                  )}
                </div>
              );
            })}
          </div>

          <div style={actionsStyle}>
            {selectedFiles.size > 0 && (
              <button
                onClick={loadSelectedFiles}
                disabled={isLoading}
                style={isLoading ? disabledButtonStyle : buttonStyle}
              >
                Load {selectedFiles.size} Selected File{selectedFiles.size > 1 ? 's' : ''}
              </button>
            )}
            {selectedFiles.size > 0 && (
              <button
                onClick={() => setSelectedFiles(new Map())}
                style={outlineButtonStyle}
              >
                Clear Selection
              </button>
            )}
            <div style={statsStyle}>
              {dirCount > 0 && `${dirCount} folder${dirCount > 1 ? 's' : ''}`}
              {dirCount > 0 && jsonFileCount > 0 && ' • '}
              {jsonFileCount > 0 && `${jsonFileCount} JSON file${jsonFileCount > 1 ? 's' : ''}`}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

import React, { useState, useRef, DragEvent } from 'react';
import { RepoBrowser } from './RepoBrowser';

interface TokenInputProps {
  onLoadString: (json: string) => void;
  onLoadFile: (file: File) => void;
  onLoadUrl: (url: string) => Promise<void>;
  onLoadMultipleFiles: (files: { path: string; content: string }[]) => void;
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
  error: string | null;
  setError: (error: string | null) => void;
}

const DEFAULT_URL = 'https://raw.githubusercontent.com/atlanticwaters/Tokens-Studio-Sandbox/main/tokens.json';

type InputMode = 'repo' | 'url' | 'file' | 'paste';

export function TokenInput({
  onLoadString,
  onLoadFile,
  onLoadUrl,
  onLoadMultipleFiles,
  isLoading,
  setIsLoading,
  error,
  setError,
}: TokenInputProps) {
  const [activeMode, setActiveMode] = useState<InputMode>('repo');
  const [pastedJson, setPastedJson] = useState('');
  const [urlInput, setUrlInput] = useState(DEFAULT_URL);
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onLoadFile(file);
    }
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = () => {
    setIsDragOver(false);
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file && file.name.endsWith('.json')) {
      onLoadFile(file);
    }
  };

  const containerStyle: React.CSSProperties = {
    maxWidth: 900,
    margin: '0 auto',
    padding: 32,
    fontFamily: "'Open Sans', -apple-system, BlinkMacSystemFont, sans-serif",
  };

  const titleStyle: React.CSSProperties = {
    fontSize: 28,
    fontWeight: 600,
    marginBottom: 8,
    color: '#252524',
  };

  const subtitleStyle: React.CSSProperties = {
    fontSize: 16,
    color: '#585756',
    marginBottom: 24,
  };

  const tabsStyle: React.CSSProperties = {
    display: 'flex',
    gap: 4,
    marginBottom: 24,
    borderBottom: '2px solid #e5e1de',
    paddingBottom: 0,
  };

  const getTabStyle = (mode: InputMode): React.CSSProperties => ({
    padding: '12px 20px',
    fontSize: 14,
    fontWeight: activeMode === mode ? 600 : 400,
    border: 'none',
    borderBottom: activeMode === mode ? '2px solid #f96302' : '2px solid transparent',
    marginBottom: -2,
    backgroundColor: 'transparent',
    color: activeMode === mode ? '#f96302' : '#585756',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
  });

  const sectionStyle: React.CSSProperties = {
    padding: 24,
    borderRadius: 12,
    backgroundColor: '#f8f5f2',
    border: '1px solid #e5e1de',
  };

  const sectionTitleStyle: React.CSSProperties = {
    fontSize: 18,
    fontWeight: 600,
    marginBottom: 8,
    color: '#252524',
  };

  const sectionDescStyle: React.CSSProperties = {
    fontSize: 14,
    color: '#787675',
    marginBottom: 16,
  };

  const dropZoneStyle: React.CSSProperties = {
    border: `2px dashed ${isDragOver ? '#f96302' : '#bab7b4'}`,
    borderRadius: 8,
    padding: 32,
    textAlign: 'center',
    cursor: 'pointer',
    backgroundColor: isDragOver ? '#fef2e9' : '#ffffff',
    transition: 'all 0.2s ease',
  };

  const inputStyle: React.CSSProperties = {
    width: '100%',
    padding: '12px 16px',
    fontSize: 14,
    borderRadius: 8,
    border: '1px solid #bab7b4',
    fontFamily: 'inherit',
    boxSizing: 'border-box',
  };

  const buttonStyle: React.CSSProperties = {
    padding: '12px 24px',
    fontSize: 14,
    fontWeight: 600,
    borderRadius: 8,
    border: 'none',
    cursor: 'pointer',
    backgroundColor: '#f96302',
    color: '#ffffff',
    transition: 'background-color 0.2s ease',
  };

  const buttonDisabledStyle: React.CSSProperties = {
    ...buttonStyle,
    backgroundColor: '#bab7b4',
    cursor: 'not-allowed',
  };

  const textareaStyle: React.CSSProperties = {
    ...inputStyle,
    minHeight: 150,
    resize: 'vertical',
    fontFamily: "'Menlo', 'Monaco', 'Courier New', monospace",
    fontSize: 12,
  };

  const errorStyle: React.CSSProperties = {
    marginBottom: 24,
    padding: 12,
    borderRadius: 8,
    backgroundColor: '#fdf1f0',
    border: '1px solid #f5a29b',
    color: '#c62e23',
    fontSize: 14,
  };

  return (
    <div style={containerStyle}>
      <h1 style={titleStyle}>Tokens Studio Viewer</h1>
      <p style={subtitleStyle}>
        Load design tokens from Tokens Studio - supports both single files and multi-file exports.
      </p>

      {error && <div style={errorStyle}>{error}</div>}

      {/* Mode Tabs */}
      <div style={tabsStyle}>
        <button style={getTabStyle('repo')} onClick={() => setActiveMode('repo')}>
          📦 GitHub Repository
        </button>
        <button style={getTabStyle('url')} onClick={() => setActiveMode('url')}>
          🔗 Single URL
        </button>
        <button style={getTabStyle('file')} onClick={() => setActiveMode('file')}>
          📁 Upload File
        </button>
        <button style={getTabStyle('paste')} onClick={() => setActiveMode('paste')}>
          📋 Paste JSON
        </button>
      </div>

      {/* GitHub Repository Browser */}
      {activeMode === 'repo' && (
        <div>
          <div style={{ marginBottom: 16 }}>
            <h3 style={sectionTitleStyle}>Browse GitHub Repository</h3>
            <p style={sectionDescStyle}>
              Connect to a GitHub repository to browse and load token files. Supports multi-file
              Tokens Studio exports with directories like <code>core/</code>, <code>semantic/</code>, etc.
            </p>
          </div>
          <RepoBrowser
            onLoadTokens={onLoadMultipleFiles}
            isLoading={isLoading}
            setIsLoading={setIsLoading}
            setError={setError}
          />
        </div>
      )}

      {/* Single URL */}
      {activeMode === 'url' && (
        <div style={sectionStyle}>
          <h3 style={sectionTitleStyle}>Load from URL</h3>
          <p style={sectionDescStyle}>
            Enter a direct URL to a single tokens.json file.
          </p>
          <div style={{ display: 'flex', gap: 12 }}>
            <input
              type="url"
              placeholder="Enter tokens.json URL"
              value={urlInput}
              onChange={(e) => setUrlInput(e.target.value)}
              style={{ ...inputStyle, flex: 1 }}
              disabled={isLoading}
            />
            <button
              onClick={() => onLoadUrl(urlInput)}
              disabled={isLoading || !urlInput}
              style={isLoading || !urlInput ? buttonDisabledStyle : buttonStyle}
            >
              {isLoading ? 'Loading...' : 'Load URL'}
            </button>
          </div>
        </div>
      )}

      {/* Upload file */}
      {activeMode === 'file' && (
        <div style={sectionStyle}>
          <h3 style={sectionTitleStyle}>Upload File</h3>
          <p style={sectionDescStyle}>
            Upload a tokens.json file from your computer.
          </p>
          <div
            style={dropZoneStyle}
            onClick={() => fileInputRef.current?.click()}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept=".json"
              onChange={handleFileChange}
              style={{ display: 'none' }}
            />
            <div style={{ fontSize: 32, marginBottom: 8 }}>📁</div>
            <div style={{ color: '#585756' }}>
              {isDragOver ? 'Drop your file here' : 'Click or drag & drop a tokens.json file'}
            </div>
          </div>
        </div>
      )}

      {/* Paste JSON */}
      {activeMode === 'paste' && (
        <div style={sectionStyle}>
          <h3 style={sectionTitleStyle}>Paste JSON</h3>
          <p style={sectionDescStyle}>
            Paste the contents of a tokens.json file directly.
          </p>
          <textarea
            placeholder='{"Color/Default": {...}, ...}'
            value={pastedJson}
            onChange={(e) => setPastedJson(e.target.value)}
            style={textareaStyle}
            disabled={isLoading}
          />
          <div style={{ marginTop: 12 }}>
            <button
              onClick={() => onLoadString(pastedJson)}
              disabled={isLoading || !pastedJson.trim()}
              style={isLoading || !pastedJson.trim() ? buttonDisabledStyle : buttonStyle}
            >
              Parse JSON
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

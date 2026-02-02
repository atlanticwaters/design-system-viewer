/**
 * usePendingChanges Hook
 * Tracks uncommitted token changes in session storage
 */

import { useState, useCallback, useEffect } from 'react';
import type { TokenChange, EditableToken, ModifiedFile } from '../types/editor';
import { groupChangesByFile, applyChangesToFile, serializeToJson } from '../utils/tokenSerializer';

const STORAGE_KEY = 'token-editor-pending-changes';

interface UsePendingChangesReturn {
  // All pending changes
  changes: TokenChange[];
  // Number of pending changes
  changeCount: number;
  // Whether there are any changes
  hasChanges: boolean;
  // Add a new change
  addChange: (change: Omit<TokenChange, 'timestamp'>) => void;
  // Remove a specific change
  removeChange: (path: string) => void;
  // Clear all changes
  clearChanges: () => void;
  // Get changes grouped by file
  getChangesByFile: () => Map<string, TokenChange[]>;
  // Get modified files with updated content
  getModifiedFiles: (originalFiles: Map<string, string>) => ModifiedFile[];
  // Check if a specific token has changes
  hasChangeForToken: (path: string) => boolean;
  // Get the pending change for a token
  getChangeForToken: (path: string) => TokenChange | undefined;
  // Undo the most recent change
  undoLastChange: () => void;
}

export function usePendingChanges(): UsePendingChangesReturn {
  const [changes, setChanges] = useState<TokenChange[]>(() => {
    // Load from session storage on mount
    try {
      const stored = sessionStorage.getItem(STORAGE_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch {
      // Ignore storage errors
    }
    return [];
  });

  // Persist to session storage on change
  useEffect(() => {
    try {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(changes));
    } catch {
      // Ignore storage errors
    }
  }, [changes]);

  const addChange = useCallback((change: Omit<TokenChange, 'timestamp'>) => {
    setChanges(prev => {
      // Check if there's already a change for this token
      const existingIndex = prev.findIndex(c => c.path === change.path);

      const newChange: TokenChange = {
        ...change,
        timestamp: Date.now(),
      };

      if (existingIndex >= 0) {
        // Replace existing change
        const updated = [...prev];

        // If we're updating an existing create, keep it as create
        if (prev[existingIndex].type === 'create' && change.type === 'update') {
          updated[existingIndex] = {
            ...newChange,
            type: 'create',
            before: prev[existingIndex].before,
          };
        }
        // If we're deleting a created token, just remove the create
        else if (prev[existingIndex].type === 'create' && change.type === 'delete') {
          updated.splice(existingIndex, 1);
          return updated;
        }
        // Otherwise use the new change
        else {
          updated[existingIndex] = {
            ...newChange,
            before: prev[existingIndex].before, // Preserve original before state
          };
        }

        return updated;
      }

      // Add new change
      return [...prev, newChange];
    });
  }, []);

  const removeChange = useCallback((path: string) => {
    setChanges(prev => prev.filter(c => c.path !== path));
  }, []);

  const clearChanges = useCallback(() => {
    setChanges([]);
    try {
      sessionStorage.removeItem(STORAGE_KEY);
    } catch {
      // Ignore storage errors
    }
  }, []);

  const getChangesByFile = useCallback(() => {
    return groupChangesByFile(changes);
  }, [changes]);

  const getModifiedFiles = useCallback((originalFiles: Map<string, string>): ModifiedFile[] => {
    const grouped = groupChangesByFile(changes);
    const modifiedFiles: ModifiedFile[] = [];

    for (const [filePath, fileChanges] of grouped) {
      const original = originalFiles.get(filePath) || '{}';
      const updated = applyChangesToFile(original, fileChanges);
      const content = serializeToJson(updated);

      modifiedFiles.push({
        path: filePath,
        changeCount: fileChanges.length,
        content,
      });
    }

    return modifiedFiles;
  }, [changes]);

  const hasChangeForToken = useCallback((path: string) => {
    return changes.some(c => c.path === path || c.newPath === path);
  }, [changes]);

  const getChangeForToken = useCallback((path: string) => {
    return changes.find(c => c.path === path || c.newPath === path);
  }, [changes]);

  const undoLastChange = useCallback(() => {
    setChanges(prev => {
      if (prev.length === 0) return prev;
      return prev.slice(0, -1);
    });
  }, []);

  return {
    changes,
    changeCount: changes.length,
    hasChanges: changes.length > 0,
    addChange,
    removeChange,
    clearChanges,
    getChangesByFile,
    getModifiedFiles,
    hasChangeForToken,
    getChangeForToken,
    undoLastChange,
  };
}

/**
 * Create a change object for updating a token
 */
export function createUpdateChange(
  before: EditableToken,
  after: EditableToken
): Omit<TokenChange, 'timestamp'> {
  const isRename = before.path !== after.path;

  return {
    type: isRename ? 'rename' : 'update',
    path: before.path,
    newPath: isRename ? after.path : undefined,
    before,
    after,
    filePath: after.filePath,
  };
}

/**
 * Create a change object for creating a new token
 */
export function createNewTokenChange(
  token: EditableToken
): Omit<TokenChange, 'timestamp'> {
  return {
    type: 'create',
    path: token.path,
    after: token,
    filePath: token.filePath,
  };
}

/**
 * Create a change object for deleting a token
 */
export function createDeleteChange(
  token: EditableToken
): Omit<TokenChange, 'timestamp'> {
  return {
    type: 'delete',
    path: token.path,
    before: token,
    filePath: token.filePath,
  };
}

/**
 * useTokenEditor Hook
 * Main editor state management for token editing
 */

import { useState, useCallback, useMemo } from 'react';
import type { EditableToken, EditorState, ValidationResult } from '../types/editor';
import { validateToken } from '../utils/tokenValidator';
import { usePendingChanges, createUpdateChange, createDeleteChange, createNewTokenChange } from './usePendingChanges';

interface UseTokenEditorProps {
  // All available tokens for reference resolution and validation
  allTokens: Map<string, EditableToken>;
}

interface UseTokenEditorReturn extends Omit<EditorState, 'pendingChanges'> {
  // Select a token for editing
  selectToken: (token: EditableToken) => void;
  // Clear the selection
  clearSelection: () => void;
  // Update the currently selected token
  updateToken: (updates: Partial<EditableToken>) => void;
  // Save changes to the selected token
  saveToken: () => void;
  // Discard changes to the selected token
  discardChanges: () => void;
  // Delete the selected token
  deleteToken: () => void;
  // Create a new token
  createToken: (token: EditableToken) => void;
  // Check if the current token has unsaved changes
  hasUnsavedChanges: boolean;
  // The original token before edits
  originalToken: EditableToken | null;
  // Pending changes hook
  pendingChanges: ReturnType<typeof usePendingChanges>;
  // Set error state
  setError: (error: string | null) => void;
}

export function useTokenEditor({ allTokens }: UseTokenEditorProps): UseTokenEditorReturn {
  // Currently selected token (with edits applied)
  const [selectedToken, setSelectedToken] = useState<EditableToken | null>(null);
  // Original token before edits
  const [originalToken, setOriginalToken] = useState<EditableToken | null>(null);
  // Whether the editor panel is open
  const [isEditing, setIsEditing] = useState(false);
  // Current validation result
  const [validation, setValidation] = useState<ValidationResult | null>(null);
  // Whether save is in progress
  const [isSaving, _setIsSaving] = useState(false);
  // Last error message
  const [error, setError] = useState<string | null>(null);

  // Pending changes tracking
  const pendingChanges = usePendingChanges();

  // Select a token for editing
  const selectToken = useCallback((token: EditableToken) => {
    // Check if there's a pending change for this token
    const pendingChange = pendingChanges.getChangeForToken(token.path);

    if (pendingChange?.after) {
      // Use the pending version
      setSelectedToken({ ...pendingChange.after });
      setOriginalToken({ ...token });
    } else {
      // Use the original
      setSelectedToken({ ...token });
      setOriginalToken({ ...token });
    }

    setIsEditing(true);
    setError(null);

    // Validate the token
    const result = validateToken(token, allTokens);
    setValidation(result);
  }, [allTokens, pendingChanges]);

  // Clear the selection
  const clearSelection = useCallback(() => {
    setSelectedToken(null);
    setOriginalToken(null);
    setIsEditing(false);
    setValidation(null);
    setError(null);
  }, []);

  // Update the currently selected token
  const updateToken = useCallback((updates: Partial<EditableToken>) => {
    if (!selectedToken) return;

    const updated: EditableToken = {
      ...selectedToken,
      ...updates,
    };

    setSelectedToken(updated);

    // Re-validate with updates
    const result = validateToken(updated, allTokens);
    setValidation(result);
  }, [selectedToken, allTokens]);

  // Save changes to the selected token
  const saveToken = useCallback(() => {
    if (!selectedToken || !originalToken) return;

    // Validate before saving
    const result = validateToken(selectedToken, allTokens);
    setValidation(result);

    if (!result.valid) {
      setError('Cannot save: token has validation errors');
      return;
    }

    // Create the change
    const change = createUpdateChange(originalToken, selectedToken);
    pendingChanges.addChange(change);

    // Update original to match saved state
    setOriginalToken({ ...selectedToken });
    setError(null);
  }, [selectedToken, originalToken, allTokens, pendingChanges]);

  // Discard changes to the selected token
  const discardChanges = useCallback(() => {
    if (!originalToken) return;

    setSelectedToken({ ...originalToken });
    setError(null);

    // Re-validate original
    const result = validateToken(originalToken, allTokens);
    setValidation(result);
  }, [originalToken, allTokens]);

  // Delete the selected token
  const deleteToken = useCallback(() => {
    if (!selectedToken) return;

    const change = createDeleteChange(selectedToken);
    pendingChanges.addChange(change);

    // Close the editor
    clearSelection();
  }, [selectedToken, pendingChanges, clearSelection]);

  // Create a new token
  const createToken = useCallback((token: EditableToken) => {
    // Validate the new token
    const result = validateToken(token, allTokens);

    if (!result.valid) {
      setError('Cannot create: token has validation errors');
      setValidation(result);
      return;
    }

    const change = createNewTokenChange(token);
    pendingChanges.addChange(change);

    // Select the new token for editing
    setSelectedToken({ ...token });
    setOriginalToken({ ...token });
    setIsEditing(true);
    setValidation(result);
    setError(null);
  }, [allTokens, pendingChanges]);

  // Check if there are unsaved changes
  const hasUnsavedChanges = useMemo(() => {
    if (!selectedToken || !originalToken) return false;
    return JSON.stringify(selectedToken) !== JSON.stringify(originalToken);
  }, [selectedToken, originalToken]);

  return {
    selectedToken,
    originalToken,
    isEditing,
    validation,
    isSaving,
    error,
    selectToken,
    clearSelection,
    updateToken,
    saveToken,
    discardChanges,
    deleteToken,
    createToken,
    hasUnsavedChanges,
    pendingChanges,
    setError,
  };
}

/**
 * Helper to create an empty token
 */
export function createEmptyToken(
  path: string,
  filePath: string,
  layer: 'core' | 'semantic' | 'component'
): EditableToken {
  return {
    path,
    $value: '',
    $type: 'color',
    filePath,
    layer,
  };
}

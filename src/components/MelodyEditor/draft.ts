import { isMelodyRoll, MelodyRoll } from '../../utils/midiUtils/melodyRoll';

// Unsaved edits are kept in the browser, so closing the tab, opening the
// player or logging in loses nothing. One draft per melody, "new" for a melody
// that was never saved. A draft is removed once it's saved.
export interface MelodyDraft {
  title: string;
  roll: MelodyRoll;
}

export const NEW_DRAFT_KEY = 'new';

const storageKey = (key: string) => `melodyEditorDraft:${key}`;

export const loadDraft = (key: string): MelodyDraft | null => {
  try {
    const value = JSON.parse(localStorage.getItem(storageKey(key)) || 'null');
    return value && typeof value.title === 'string' && isMelodyRoll(value.roll) ? value : null;
  } catch (error) {
    return null;
  }
};

export const saveDraft = (key: string, draft: MelodyDraft) => {
  try {
    localStorage.setItem(storageKey(key), JSON.stringify(draft));
  } catch (error) {
    // Private mode or a full storage: the editor still works, edits just aren't kept
  }
};

export const clearDraft = (key: string) => {
  try {
    localStorage.removeItem(storageKey(key));
  } catch (error) {}
};

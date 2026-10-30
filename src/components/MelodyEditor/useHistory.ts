import { useCallback, useState } from 'react';

const MAX_UNDO_STEPS = 200;

interface History<T> {
  past: T[];
  present: T;
  future: T[];
}

// A value with undo/redo. `reset` replaces it without an undo step (loading a melody).
export const useHistory = <T>(initial: T) => {
  const [history, setHistory] = useState<History<T>>({ past: [], present: initial, future: [] });

  const set = useCallback((update: T | ((value: T) => T)) => {
    setHistory((history) => {
      const { past, present } = history;
      const next = typeof update === 'function' ? (update as (value: T) => T)(present) : update;
      if (next === present) return history;
      return { past: [...past, present].slice(-MAX_UNDO_STEPS), present: next, future: [] };
    });
  }, []);

  const undo = useCallback(() => {
    setHistory(({ past, present, future }) =>
      past.length
        ? { past: past.slice(0, -1), present: past[past.length - 1], future: [present, ...future] }
        : { past, present, future }
    );
  }, []);

  const redo = useCallback(() => {
    setHistory(({ past, present, future }) =>
      future.length
        ? { past: [...past, present], present: future[0], future: future.slice(1) }
        : { past, present, future }
    );
  }, []);

  const reset = useCallback((value: T) => setHistory({ past: [], present: value, future: [] }), []);

  return {
    value: history.present,
    set,
    undo,
    redo,
    reset,
    canUndo: history.past.length > 0,
    canRedo: history.future.length > 0,
  };
};

import { useEffect } from 'react';

export const useSaveShortcut = (callback: () => void) => {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const isSKey = event.key.toLowerCase() === 's';

      const isModifierPressed = event.ctrlKey || event.metaKey;

      if (isSKey && isModifierPressed) {
        event.preventDefault();

        callback();
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [callback]);
};

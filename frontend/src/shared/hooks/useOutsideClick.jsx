import { useEffect } from 'react';

export function useOutsideClick(ref, handler, whenActive = true) {
  useEffect(() => {
    if (!whenActive) return;

    const listener = (event) => {
      if (!ref.current || ref.current.contains(event.target)) return;
      handler(event);
    };

    document.addEventListener('mousedown', listener);

    return () => {
      document.removeEventListener('mousedown', listener);
    };
  }, [ref, handler, whenActive]);
}

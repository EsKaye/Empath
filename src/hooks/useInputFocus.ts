import { useEffect, RefObject } from 'react';

export function useInputFocus(
  ref: RefObject<HTMLInputElement>,
  shouldFocus: boolean,
  dependencies: any[] = []
) {
  useEffect(() => {
    if (shouldFocus && ref.current) {
      ref.current.focus();
    }
  }, [...dependencies]);

  return {
    focus: () => ref.current?.focus(),
    blur: () => ref.current?.blur()
  };
} 
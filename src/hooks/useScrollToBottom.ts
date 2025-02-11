import { useCallback, useEffect, RefObject } from 'react';

export function useScrollToBottom(
  ref: RefObject<HTMLElement>,
  dependencies: any[] = []
) {
  const scrollToBottom = useCallback(() => {
    if (ref.current) {
      const element = ref.current;
      element.scrollTop = element.scrollHeight;
    }
  }, [ref]);

  useEffect(() => {
    scrollToBottom();
  }, [...dependencies, scrollToBottom]);

  return scrollToBottom;
} 
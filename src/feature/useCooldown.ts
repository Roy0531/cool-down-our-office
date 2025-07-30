import { useCallback, useRef, useState } from "react";

export const COOLDOWN_DURATION = {
  SMALL: 500,
  LARGE: 700
} as const;

// クールダウン機能を提供するカスタムフック
export const useCooldown = () => {
  const [isOnCooldown, setIsOnCooldown] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const startCooldown = useCallback((isLargeSwing: boolean) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    setIsOnCooldown(true);

    const cooldownTime = isLargeSwing
      ? COOLDOWN_DURATION.LARGE
      : COOLDOWN_DURATION.SMALL;

    timeoutRef.current = setTimeout(() => {
      setIsOnCooldown(false);
      timeoutRef.current = null;
    }, cooldownTime);
  }, []);

  const clearCooldown = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    setIsOnCooldown(false);
  }, []);

  return {
    isOnCooldown,
    startCooldown,
    clearCooldown
  };
};

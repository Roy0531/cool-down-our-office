import { useCallback, useEffect, useRef, useState } from "react";

export const GAUGE_CONFIG = {
  MAX_VALUE: 110,
  DECREMENT_RATE: 1,
  DECREMENT_INTERVAL: 80,
  INCREMENT: {
    SMALL: 15,
    LARGE: 30
  }
} as const;

// ゲージ値の管理とオートデクリメント機能を提供するカスタムフック
export const useGauge = () => {
  const [gaugeValue, setGaugeValue] = useState(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const incrementGauge = useCallback((isLargeSwing: boolean) => {
    const increment = isLargeSwing
      ? GAUGE_CONFIG.INCREMENT.LARGE
      : GAUGE_CONFIG.INCREMENT.SMALL;

    setGaugeValue((prevValue) =>
      Math.min(GAUGE_CONFIG.MAX_VALUE, prevValue + increment)
    );
  }, []);

  useEffect(() => {
    intervalRef.current = setInterval(() => {
      setGaugeValue((prevValue) => {
        if (prevValue <= 0) return 0;
        return Math.max(0, prevValue - GAUGE_CONFIG.DECREMENT_RATE);
      });
    }, GAUGE_CONFIG.DECREMENT_INTERVAL);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, []);

  return {
    gaugeValue,
    incrementGauge
  };
};

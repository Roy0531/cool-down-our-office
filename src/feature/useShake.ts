import { useSensorData } from "@/feature/useSensorData";
import { useEffect, useRef, useState } from "react";

export type ShakeState = "still" | "left" | "right";

interface UseShakeOptions {
  onLeftToRight?: () => void;
  onRightToLeft?: () => void;
  threshold?: number; // 振りを検出する閾値
}

export const useShake = (options: UseShakeOptions = {}) => {
  const { accelerometer } = useSensorData();
  const { onLeftToRight, onRightToLeft, threshold = 2.0 } = options;

  const [shakeState, setShakeState] = useState<ShakeState>("still");
  const previousStateRef = useRef<ShakeState>("still");

  useEffect(() => {
    // X軸の加速度を使って左右の振りを判定
    const { z } = accelerometer;

    let newState: ShakeState = "still";

    if (z > threshold) {
      newState = "right";
    } else if (z < -threshold) {
      newState = "left";
    } else {
      newState = "still";
    }

    // 状態が変化した場合のみ更新
    if (newState !== shakeState) {
      const previousState = previousStateRef.current;

      // 左→右の変化を検出
      if (previousState === "left" && newState === "right") {
        onLeftToRight?.();
      }

      // 右→左の変化を検出
      if (previousState === "right" && newState === "left") {
        onRightToLeft?.();
      }

      previousStateRef.current = shakeState;
      setShakeState(newState);
    }
  }, [accelerometer, shakeState, threshold, onLeftToRight, onRightToLeft]);

  return {
    shakeState,
    accelerometer
  };
};

import { InfoPanel } from "@/components/InfoPanel";
import { useCooldown } from "@/feature/useCooldown";
import { useGauge } from "@/feature/useGauge";
import { useScene } from "@/feature/useScene";
import { useSensorData } from "@/feature/useSensorData";
import { useEffect } from "react";
import styles from "./index.module.scss";

export const Scene = () => {
  const { accelerometer, connectionStatus } = useSensorData();
  const { gaugeValue, incrementGauge } = useGauge();
  const { isOnCooldown, startCooldown } = useCooldown();
  const { updateFanPosition, startFanning } = useScene();

  // 接続状態のデバッグログ
  useEffect(() => {
    console.log("Connection Status:", connectionStatus);
  }, [connectionStatus]);

  useEffect(() => {
    if (accelerometer) {
      updateFanPosition(accelerometer.x, accelerometer.y, accelerometer.z);
    }
  }, [accelerometer, updateFanPosition]);

  const handleFanClick = (isLargeSwing: boolean) => {
    if (isOnCooldown) return;

    startFanning(isLargeSwing);
    incrementGauge(isLargeSwing);
    startCooldown(isLargeSwing);
  };

  return (
    <div className={styles.wrapper}>
      <InfoPanel
        connectionStatus={connectionStatus}
        accelerometer={accelerometer}
        gaugeValue={gaugeValue}
        onFanClick={handleFanClick}
      />
      <canvas className="canvas"></canvas>
    </div>
  );
};

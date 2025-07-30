import styles from "../Scene/index.module.scss";

interface AccelerometerData {
  x: number;
  y: number;
  z: number;
}

interface InfoPanelProps {
  connectionStatus: string;
  accelerometer: AccelerometerData;
  gaugeValue: number;
  onFanClick: (isLargeSwing: boolean) => void;
}

export const InfoPanel = ({
  connectionStatus,
  accelerometer,
  gaugeValue,
  onFanClick
}: InfoPanelProps) => {
  return (
    <div className={styles.info}>
      <div>Status: {connectionStatus}</div>
      <div>X: {accelerometer.x.toFixed(4)}</div>
      <div>Y: {accelerometer.y.toFixed(4)}</div>
      <div>Z: {accelerometer.z.toFixed(4)}</div>
      <div
        className={styles.horizontalGauge}
        style={
          {
            "--gauge-width": `${gaugeValue}%`
          } as React.CSSProperties
        }
      />
      <div className={styles.buttons}>
        <button
          type="button"
          className={styles.buttonFan}
          onClick={() => onFanClick(true)}>
          大仰ぎ
        </button>
        <button
          type="button"
          className={styles.buttonFan}
          onClick={() => onFanClick(false)}>
          小仰ぎ
        </button>
      </div>
    </div>
  );
};

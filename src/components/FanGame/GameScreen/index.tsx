import { Fan } from "@/components/FanGame/Fan";
import { TemperatureBar } from "@/components/FanGame/TemperatureBar";
import { useShake } from "@/feature/useShake";
import "../styles/GameScreen.scss";

interface GameScreenProps {
  temperature: number;
  gameTime: number;
  onFanClick: () => void;
  isActive: boolean;
}

export function GameScreen({
  temperature,
  gameTime,
  onFanClick,
  isActive
}: GameScreenProps) {
  // 温度に基づいて画像の色味を調整
  const redIntensity = temperature / 100;
  const imageFilter = `hue-rotate(${-120 + redIntensity * 120}deg) saturate(${1 + redIntensity}) brightness(${1 + redIntensity * 0.3})`;

  const { shakeState } = useShake({
    onLeftToRight: onFanClick,
    onRightToLeft: onFanClick,
    threshold: 1.2 // 振りを検出する閾値
  });

  return (
    <div className="game-screen">
      {/* 上部の画像 */}
      <div className="game-screen__image-container">
        <div
          className="game-screen__image-wrapper"
          style={{ filter: imageFilter }}>
          <img
            src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop"
            alt="冷却対象"
            className="game-screen__image"
          />
          {/* 温度エフェクト */}
          <div
            className="game-screen__temperature-effect"
            style={{ opacity: redIntensity * 0.4 }}
          />
        </div>
      </div>

      {/* 左側の温度バー */}
      <div className="game-screen__temperature-bar">
        <TemperatureBar temperature={temperature} />
      </div>

      {/* 右上のタイマー */}
      <div className="game-screen__timer">
        <div className="game-screen__timer-label">時間</div>
        <div className="game-screen__timer-value">{gameTime.toFixed(1)}秒</div>
      </div>

      {/* 下部のうちわ */}
      <div className="game-screen__fan">
        <Fan
          onClick={onFanClick}
          isActive={isActive}
          data-shake-state={shakeState}
        />
      </div>

      {/* 温度表示 */}
      <div className="game-screen__temperature-display">
        <div className="game-screen__temperature-display-label">温度</div>
        <div className="game-screen__temperature-display-value">
          {Math.round(temperature)}%
        </div>
      </div>
    </div>
  );
}

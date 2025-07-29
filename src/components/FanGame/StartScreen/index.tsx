import { Smartphone } from "lucide-react";
import "../styles/StartScreen.scss";

interface StartScreenProps {
  onStart: () => void;
}

export function StartScreen({ onStart }: StartScreenProps) {
  return (
    <div className="start-screen">
      <div className="start-screen__content">
        <div className="start-screen__icon-container">
          <Smartphone className="start-screen__icon" />
          <h1 className="start-screen__title">ファン冷却ゲーム</h1>
          <p className="start-screen__description">うちわで画像を冷やそう！</p>
          <p className="start-screen__instruction">
            うちわをクリックして温度を下げてください
          </p>
        </div>

        <button onClick={onStart} className="start-screen__button">
          ゲーム開始
        </button>
      </div>
    </div>
  );
}

import { RotateCcw, Trophy } from "lucide-react";
import "../styles/ResultScreen.scss";

interface ResultScreenProps {
  finalTime: number;
  onRestart: () => void;
}

export function ResultScreen({ finalTime, onRestart }: ResultScreenProps) {
  const getPerformanceMessage = (time: number) => {
    if (time < 10)
      return {
        message: "素晴らしい！",
        emoji: "🔥",
        colorClass: "result-screen__performance--excellent"
      };
    if (time < 20)
      return {
        message: "とても良い！",
        emoji: "⭐",
        colorClass: "result-screen__performance--great"
      };
    if (time < 30)
      return {
        message: "良い結果！",
        emoji: "👍",
        colorClass: "result-screen__performance--good"
      };
    return {
      message: "頑張りました！",
      emoji: "💪",
      colorClass: "result-screen__performance--normal"
    };
  };

  const performance = getPerformanceMessage(finalTime);

  return (
    <div className="result-screen">
      <div className="result-screen__modal">
        <div className="result-screen__header">
          <Trophy className="result-screen__trophy" />
          <h2 className="result-screen__title">ゲーム完了！</h2>
          <div className="result-screen__emoji">{performance.emoji}</div>
          <p className={`result-screen__performance ${performance.colorClass}`}>
            {performance.message}
          </p>
        </div>

        <div className="result-screen__time-display">
          <div className="result-screen__time-display-label">クリア時間</div>
          <div className="result-screen__time-display-value">
            {finalTime.toFixed(1)}秒
          </div>
        </div>

        <button onClick={onRestart} className="result-screen__restart-button">
          <RotateCcw className="result-screen__restart-button-icon" />
          もう一度プレイ
        </button>
      </div>
    </div>
  );
}

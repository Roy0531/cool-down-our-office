import { useCallback, useEffect, useState } from "react";

import { GameScreen } from "@/components/FanGame/GameScreen";
import { ResultScreen } from "@/components/FanGame/ResultScreen";
import { StartScreen } from "@/components/FanGame/StartScreen";
import "./styles/App.scss";

type GameState = "start" | "playing" | "result";

export default function FanGame() {
  const [gameState, setGameState] = useState<GameState>("start");
  const [temperature, setTemperature] = useState(100); // 100% = 最高温度
  const [gameTime, setGameTime] = useState(0);
  const [finalTime, setFinalTime] = useState(0);

  // ゲーム開始
  const startGame = useCallback(() => {
    console.log("ゲーム開始");
    setGameState("playing");
    setTemperature(100);
    setGameTime(0);
  }, []);

  // ゲーム終了（温度が0になったとき）
  const endGame = useCallback(() => {
    setGameState("result");
    setFinalTime(gameTime);
  }, [gameTime]);

  // スタート画面に戻る
  const resetGame = useCallback(() => {
    setGameState("start");
    setTemperature(100);
    setGameTime(0);
    setFinalTime(0);
  }, []);

  // うちわクリック時の冷却
  const coolDown = useCallback(() => {
    if (gameState === "playing") {
      setTemperature((prev) => Math.max(0, prev - 8));
    }
  }, [gameState]);

  // ゲームタイマー
  useEffect(() => {
    if (gameState === "playing") {
      const timer = setInterval(() => {
        setGameTime((prev) => prev + 0.1);
        // 時間経過で少し温度上昇
        setTemperature((prev) => Math.min(100, prev + 0.3));
      }, 100);

      return () => clearInterval(timer);
    }
  }, [gameState]);

  // 温度が0になったらゲーム終了
  useEffect(() => {
    if (temperature <= 0 && gameState === "playing") {
      endGame();
    }
  }, [temperature, gameState, endGame]);

  return (
    <div className="app-container">
      {/* ゲーム画面は常に背景として描画 */}
      <GameScreen
        temperature={temperature}
        gameTime={gameTime}
        onFanClick={coolDown}
        isActive={gameState === "playing"}
      />

      {/* オーバーレイ画面 */}
      {gameState === "start" && <StartScreen onStart={startGame} />}

      {gameState === "result" && (
        <ResultScreen finalTime={finalTime} onRestart={resetGame} />
      )}
    </div>
  );
}

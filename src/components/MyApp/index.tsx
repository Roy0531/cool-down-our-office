import { useShake } from "@/feature/useShake";

export const MyApp = () => {
  const handleToRight = () => {
    console.log("左から右へ振られました");
  };
  const handleToLeft = () => {
    console.log("右から左へ振られました");
  };
  const { shakeState, accelerometer } = useShake({
    onLeftToRight: handleToRight,
    onRightToLeft: handleToLeft,
    threshold: 1.0 // 振りを検出する閾値
  });
  return (
    <div>
      <h1 className="title">いいとも！</h1>
      <p className="description">
        振ってみてください！
        <br />
        現在の振り状態: {shakeState}
        Accelerometer Data: x: {accelerometer.x}, y: {accelerometer.y}, z:{" "}
        {accelerometer.z}
      </p>
      <a href="/" className="linkBack">
        トップへ戻る
      </a>
    </div>
  );
};

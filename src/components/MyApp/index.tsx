import { useSensorData } from "@/feature/useSensorData";

export const MyApp = () => {
  const { accelerometer } = useSensorData();
  return (
    <div>
      <h1 className="title">いいとも！</h1>
      <p className="description">
        Accelerometer Data: x: {accelerometer.x}, y: {accelerometer.y}, z:{" "}
        {accelerometer.z}
      </p>
      <a href="/" className="linkBack">
        トップへ戻る
      </a>
    </div>
  );
};

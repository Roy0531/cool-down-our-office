import { useSensorData } from "@/feature/useSensorData";

export const MyApp = () => {
  const { accelerometer } = useSensorData();
  return (
    <div>
      <h1 className="title">いいとも！</h1>
      <a href="/" className="linkBack">
        トップへ戻る
      </a>
    </div>
  );
};

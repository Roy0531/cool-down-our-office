import "../styles/TemperatureBar.scss";

interface TemperatureBarProps {
  temperature: number; // 0-100
}

export function TemperatureBar({ temperature }: TemperatureBarProps) {
  return (
    <div className="temperature-bar">
      <div className="temperature-bar__thermometer">
        {/* 温度レベル表示 */}
        <div
          className="temperature-bar__level"
          style={{ height: `${100 - temperature}%` }}
        />

        {/* 温度目盛り */}
        <div className="temperature-bar__scales">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="temperature-bar__scale" />
          ))}
        </div>
      </div>

      {/* ラベル */}
      <div className="temperature-bar__label">温度</div>
    </div>
  );
}

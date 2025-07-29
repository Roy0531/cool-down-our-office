// hooks/useSensorData.js
import { useEffect, useRef, useState } from "react";

const WEBSOCKET_URL = "ws://localhost:8080";
// 他の情報の時はaddressやargsの中身が変わる
// 例)address: '/ZIGSIM/cKYb7clGdnBOLwJ4/accel',
const SENSOR_TYPE_ADDRESS = "accel";

const roundValue = (value: number) => {
  return Math.round(value * 100) / 100; // 小数点以下2桁まで丸める
};

export const useSensorData = () => {
  const [accelerometer, setAccelerometer] = useState({ x: 0, y: 0, z: 0 });

  const wsRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    const connectWebSocket = () => {
      wsRef.current = new WebSocket(WEBSOCKET_URL);

      wsRef.current.onopen = () => {
        setAccelerometer({ x: 0, y: 0, z: 0 });
        console.log("WebSocket connected");
      };

      wsRef.current.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          if (data.address.includes(SENSOR_TYPE_ADDRESS)) {
            setAccelerometer({
              x: roundValue(data.args[0]),
              y: roundValue(data.args[1]),
              z: roundValue(data.args[2])
            });
          }
        } catch (error) {
          console.error("Error parsing message:", error);
        }
      };
      wsRef.current.onclose = () => {
        setAccelerometer({ x: 0, y: 0, z: 0 });
        console.log("WebSocket disconnected");
        // 再接続を試行
        setTimeout(connectWebSocket, 3000);
      };

      wsRef.current.onerror = (error) => {
        console.error("WebSocket error:", error);
      };
    };

    connectWebSocket();

    return () => {
      if (wsRef.current) {
        wsRef.current.close();
      }
    };
  }, []);

  return {
    accelerometer
  };
};

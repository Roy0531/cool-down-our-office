import { useEffect, useRef, useState } from "react";

const WEBSOCKET_URL = "ws://localhost:8080";
// 他の情報の時はaddressやargsの中身が変わる
// 例)address: '/ZIGSIM/cKYb7clGdnBOLwJ4/accel',
const SENSOR_TYPE_ADDRESS = "accel";
export const useSensorData = () => {
  const [accelerometer, setAccelerometer] = useState({ x: 0, y: 0, z: 0 });
  const [connectionStatus, setConnectionStatus] = useState("disconnected");

  const wsRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const connectWebSocket = () => {
      wsRef.current = new WebSocket(WEBSOCKET_URL);

      wsRef.current.onopen = () => {
        setAccelerometer({ x: 0, y: 0, z: 0 });
        setConnectionStatus("connected");
        console.log("WebSocket connected");
      };

      wsRef.current.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);

          if (data.address && data.address.includes(SENSOR_TYPE_ADDRESS)) {
            setAccelerometer({
              x: Math.round(data.args[0] * 1000) / 1000,
              y: Math.round(data.args[1] * 1000) / 1000,
              z: Math.round(data.args[2] * 1000) / 1000
            });
          }
        } catch (error) {
          console.error("Error parsing message:", error);
        }
      };

      wsRef.current.onclose = () => {
        setAccelerometer({ x: 0, y: 0, z: 0 });
        setConnectionStatus("disconnected");
        console.log("WebSocket disconnected");
        // 再接続を試行
        setTimeout(connectWebSocket, 3000);
      };

      wsRef.current.onerror = (error) => {
        setConnectionStatus("error");
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
    accelerometer,
    connectionStatus
  };
};

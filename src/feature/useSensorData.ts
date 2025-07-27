// hooks/useSensorData.js
import { useEffect, useRef, useState } from "react";

export const useSensorData = () => {
  const [accelerometer, setAccelerometer] = useState({ x: 0, y: 0, z: 0 });

  const wsRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    const connectWebSocket = () => {
      wsRef.current = new WebSocket("ws://localhost:8080");

      wsRef.current.onopen = () => {
        setAccelerometer({ x: 0, y: 0, z: 0 });
        console.log("WebSocket connected");
      };

      wsRef.current.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          console.log("Received data:", data);
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

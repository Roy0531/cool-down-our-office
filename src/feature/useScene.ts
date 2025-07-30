import { useEffect, useRef } from "react";

interface SceneInstance {
  updateFanPosition: (x: number, y: number, z: number) => void;
  startFanning: (isLargeSwing: boolean) => void;
  dispose: () => void;
}

// 3Dシーンの管理を行うカスタムフック
export const useScene = () => {
  const sceneRef = useRef<SceneInstance | null>(null);

  useEffect(() => {
    import("@/feature/scene")
      .then((SceneModule) => {
        sceneRef.current = new SceneModule.default();
      })
      .catch(console.error);

    return () => {
      if (sceneRef.current) {
        sceneRef.current.dispose();
      }
    };
  }, []);

  const updateFanPosition = (x: number, y: number, z: number) => {
    if (sceneRef.current) {
      sceneRef.current.updateFanPosition(x, y, z);
    }
  };

  const startFanning = (isLargeSwing: boolean) => {
    if (sceneRef.current) {
      sceneRef.current.startFanning(isLargeSwing);
    }
  };

  return {
    updateFanPosition,
    startFanning
  };
};

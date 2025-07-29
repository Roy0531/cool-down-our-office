import { motion } from "motion/react";
import { useState, type HTMLAttributes } from "react";
import "../styles/Fan.scss";

interface FanProps {
  onClick: () => void;
  isActive: boolean;
}

export function Fan({
  onClick,
  isActive,
  ...rest
}: FanProps & HTMLAttributes<HTMLDivElement>) {
  const [isClicked, setIsClicked] = useState(false);

  const handleClick = () => {
    if (!isActive) return;

    setIsClicked(true);
    onClick();

    // アニメーションリセット
    setTimeout(() => setIsClicked(false), 200);
  };

  return (
    <motion.div
      className={`fan ${isActive ? "fan--active" : "fan--inactive"}`}
      whileHover={isActive ? { scale: 1.05 } : {}}
      whileTap={isActive ? { scale: 0.95 } : {}}
      onClick={handleClick}>
      <motion.div>
        {/* うちわの柄 */}
        <div className="fan__container" {...rest}>
          <div className="fan__handle"></div>

          {/* うちわの面 */}
          <div className="fan__face-container">
            <div className="fan__face">
              {/* うちわの模様 */}
              <div className="fan__pattern">
                <div className="fan__pattern-inner"></div>
                {/* 竹の線 */}
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="fan__bamboo-line" />
                ))}
              </div>

              {/* 風のエフェクト */}
              {isClicked && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: [0, 1, 0], scale: [0.8, 1.2, 1.4] }}
                  transition={{ duration: 0.4 }}
                  className="fan__wind-effect"
                />
              )}
            </div>
          </div>
        </div>
      </motion.div>

      {isActive && (
        <div className="fan__instruction">あおいで涼しくしよう！</div>
      )}
    </motion.div>
  );
}

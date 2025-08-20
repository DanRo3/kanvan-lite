import React from "react";

interface ProgressBarProps {
  progress: number;
}

const ProgressBar: React.FC<ProgressBarProps> = ({ progress }) => {
  const clampedProgress = Math.max(0, Math.min(100, progress));
  const progressColor =
    clampedProgress < 50
      ? "bg-red-500"
      : clampedProgress < 85
      ? "bg-yellow-500"
      : "bg-green-500";

  return (
    <div className="w-full bg-white/20 rounded-full h-2.5">
      <div
        className={`h-2.5 rounded-full ${progressColor}`}
        style={{ width: `${clampedProgress}%` }}
      ></div>
    </div>
  );
};

export default ProgressBar;

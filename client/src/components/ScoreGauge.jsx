import { useEffect, useState } from 'react';

function getScoreColor(score) {
  if (score >= 70) return '#10b981';
  if (score >= 40) return '#f59e0b';
  return '#ef4444';
}

export default function ScoreGauge({ score = 0, size = 140 }) {
  const [animatedOffset, setAnimatedOffset] = useState(283);

  const radius = 45;
  const circumference = 2 * Math.PI * radius;
  const pct = Math.min(Math.max(score, 0), 100);
  const targetOffset = circumference - (pct / 100) * circumference;
  const color = getScoreColor(score);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setAnimatedOffset(targetOffset);
    }, 100);
    return () => clearTimeout(timeout);
  }, [targetOffset]);

  return (
    <div className="score-gauge" style={{ width: size, height: size }}>
      <svg viewBox="0 0 100 100" style={{ width: size, height: size }}>
        <circle
          className="score-gauge-bg"
          cx="50"
          cy="50"
          r={radius}
        />
        <circle
          className="score-gauge-fill"
          cx="50"
          cy="50"
          r={radius}
          stroke={color}
          strokeDasharray={circumference}
          strokeDashoffset={animatedOffset}
        />
      </svg>
      <div className="score-gauge-text">
        <div className="score-gauge-value" style={{ color, fontSize: size > 120 ? '2rem' : '1.5rem' }}>
          {score}
        </div>
        <div className="score-gauge-label">Score</div>
      </div>
    </div>
  );
}

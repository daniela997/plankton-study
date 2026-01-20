import React from 'react';

const ProgressBar = ({ current, total }) => {
  const percentage = total > 0 ? ((current) / total) * 100 : 0;
  const currentDisplay = Math.min(current, total);

  return (
    <div className="progress-container">
      <div className="progress-text-compact">
        {currentDisplay}/{total} categories
      </div>
      <div className="progress-bar">
        <div
          className="progress-fill"
          style={{
            width: `${percentage}%`,
            transition: 'width 0.3s ease-in-out'
          }}
        />
      </div>
    </div>
  );
};

export default ProgressBar;

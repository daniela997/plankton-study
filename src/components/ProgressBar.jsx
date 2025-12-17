import React from 'react';

const ProgressBar = ({ current, total }) => {
  const percentage = total > 0 ? ((current) / total) * 100 : 0;
  const currentDisplay = Math.min(current + 1, total); // Show 1-based indexing

  return (
    <div className="progress-container">
      <div className="progress-header">
        <h3>Survey Progress</h3>
        <span className="progress-text">
          {currentDisplay} of {total} categories
        </span>
      </div>

      <div className="progress-bar">
        <div
          className="progress-fill"
          style={{
            width: `${percentage}%`,
            transition: 'width 0.3s ease-in-out'
          }}
        ></div>
      </div>

      <div className="progress-details">
        <span className="progress-percentage">
          {Math.round(percentage)}% complete
        </span>
        <span className="progress-remaining">
          {total - current} remaining
        </span>
      </div>

      {/* Visual indicator for completion */}
      {percentage >= 100 && (
        <div className="completion-indicator">
          🎉 All categories completed!
        </div>
      )}
    </div>
  );
};

export default ProgressBar;

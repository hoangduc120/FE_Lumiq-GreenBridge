// ../animations/loading-animation.js
import React from 'react';

const LoadingAnimation = () => {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: 60,
        height: 60,
        border: '4px solid #f3f3f3',
        borderTop: '4px solid #27B074',
        borderRadius: '50%',
        animation: 'spin 1s linear infinite',
      }}
    >
      <style>
        {`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}
      </style>
    </div>
  );
};

export default LoadingAnimation;
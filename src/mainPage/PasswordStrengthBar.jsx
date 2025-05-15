import React from 'react';
import zxcvbn from 'zxcvbn';

const PasswordStrengthBar = ({ password }) => {
  const testResult = zxcvbn(password);
  const num = (testResult.score * 100) / 4;

  const createPassLabel = () => {
    switch (testResult.score) {
      case 0:
        return 'Very Weak';
      case 1:
        return 'Weak';
      case 2:
        return 'Fair';
      case 3:
        return 'Good';
      case 4:
        return 'Strong';
      default:
        return '';
    }
  };

  const progressColor = () => {
    switch (testResult.score) {
      case 0:
        return 'bg-red-500';
      case 1:
        return 'bg-orange-500';
      case 2:
        return 'bg-yellow-500';
      case 3:
        return 'bg-blue-500';
      case 4:
        return 'bg-green-500';
      default:
        return '';
    }
  };

  return (
    <div className="w-full mt-2 hidden xl:block">
      <div className="text-sm text-gray-600 mb-1">{createPassLabel()}</div>
      <div className="w-full bg-gray-200 rounded h-2">
        <div
          className={`h-2 rounded ${progressColor()}`}
          style={{ width: `${num}%` }}
        ></div>
      </div>
    </div>
  );
};

export default PasswordStrengthBar;

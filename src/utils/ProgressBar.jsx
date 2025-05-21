import React from 'react';
import { matchPath, useLocation, useNavigate } from 'react-router-dom';
import { Steps } from 'antd';

const { Step } = Steps;

const StepProgressBar = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const steps = [
    { label: 'Menu', path: '/menu' },
    { label: 'Your Cart', path: '/me/cart' },
    { label: 'Confirm Order', path: '/me/confirm-order' },
    { label: 'Payment Progress', path: '/payment/vietqr/:orderId' },
  ];

  const currentStep = steps.findIndex((step) =>
    matchPath(step.path, location.pathname)
  );

  return (
    <div className="m-5 w-full hidden lg:block">
      <Steps
        current={currentStep}
        className="custom-steps"
        onChange={(step) => {
          if (step <= currentStep) {
            navigate(steps[step].path);
          }
        }}
      >
        {steps.map((step, index) => (
          <Step
            key={index}
            title={step.label}
            className={
              index < currentStep
                ? 'step-finish'
                : index === currentStep
                  ? 'step-process'
                  : 'step-wait'
            }
          />
        ))}
      </Steps>
    </div>
  );
};

export default StepProgressBar;

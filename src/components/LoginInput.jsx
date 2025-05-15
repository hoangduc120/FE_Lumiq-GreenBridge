import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { buttonClick, fadeInOut } from '../animations';
import { Field, ErrorMessage } from 'formik';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

const LoginInput = ({
  placeHolder,
  icon,
  name,
  type,
  errors,
  touched,
  tabIndex,
}) => {
  const [isFocus, setIsFocus] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const handleTogglePassword = () => {
    setShowPassword(!showPassword);
  };

  return (
    <motion.div {...fadeInOut} className={`flex flex-col w-full `}>
      <div
        className={`flex items-center gap-4 bg-lightOverlay backdrop-blur-md rounded-md px-4 py-2 ${
          isFocus ? 'shadow-md shadow-green-600' : 'shadow-none'
        }`}
      >
        {icon}
        <Field
          name={name}
          type={showPassword ? 'text' : type}
          placeholder={placeHolder}
          className={`w-full bg-transparent text-headingColor text-lg font-semibold outline-none ${
            errors && touched ? 'border-green-600' : ''
          }`}
          onFocus={() => setIsFocus(true)}
          onBlur={() => setIsFocus(false)}
          tabIndex={tabIndex}
        />
        {type === 'password' && (
          <motion.div
            {...buttonClick}
            className="absolute right-4 cursor-pointer"
            onClick={handleTogglePassword}
          >
            {showPassword ? (
              <FaEyeSlash className="text-xl text-textColor" />
            ) : (
              <FaEye className="text-xl text-textColor" />
            )}
          </motion.div>
        )}
      </div>
      <ErrorMessage
        name={name}
        component="div"
        className="text-green-600 text-sm mt-2"
      />
    </motion.div>
  );
};

export default LoginInput;

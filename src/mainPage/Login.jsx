import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { buttonClick } from "../animations";
import { useNavigate } from "react-router-dom";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { toast } from "react-toastify";
import { LoginInput } from "../components";
import PasswordChecklistComponent from "./PasswordCheckList";
import PasswordStrengthBar from "./PasswordStrengthBar";
import { LoginBg, Logo } from "../assets";
import { FaEnvelope, FaLock } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import {
  loginEmail,
  loginGoogle,
  register,
  sendForgotPasswordEmail,
} from "../api/authApi";

const AuthPage = () => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [showForgetPassword, setShowForgetPassword] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [isResetPassword, setIsResetPassword] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const user = localStorage.getItem("user");
    if (user) {
      navigate("/", { replace: true });
    }
  }, [navigate]);

  const initialValues = {
    email: "",
    password: "",
    confirm_password: "",
  };

  const validationSchema = Yup.object({
    email: Yup.string().email("Invalid email address").required("Required"),
    password: Yup.string()
      .min(6, "Must be at least 6 characters")
      .matches(/[A-Z]/, "Must contain at least one uppercase letter")
      .matches(/[a-z]/, "Must contain at least one lowercase letter")
      .matches(/[0-9]/, "Must contain at least one number")
      .required("Required"),
    confirm_password: isSignUp
      ? Yup.string()
          .oneOf([Yup.ref("password"), null], "Passwords must match")
          .required("Required")
      : Yup.string(),
  });

  const signUpWithEmailPassword = async (values, { resetForm }) => {
    setIsLoading(true);
    try {
      const { email, password, confirm_password } = values;
      const response = await register(email, password, confirm_password);

      if (response.status === 201) {
        toast.success("Account created successfully!");
        setIsSignUp(false);
        setShowForgetPassword(true);
        resetForm();
      } else {
        toast.error("Email already exists. Please try again!");
      }
    } catch (error) {
      const errorMessage =
        error.response?.data?.message ||
        "Registration failed. Please try again!";
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const signIn = async (values, { resetForm }) => {
    setIsLoading(true);
    try {
      const { email, password } = values;
      const response = await loginEmail(email, password);

      if (response.status === 200) {
        const { user, token, refreshToken } = response.data.data;
        console.log(user);
        localStorage.setItem("user", JSON.stringify(user));
        localStorage.setItem("token", JSON.stringify(token));
        toast.success("Login successful!");
        navigate("/", { replace: true });
      } else {
        toast.error("Invalid email or password. Please try again!");
      }
    } catch (error) {
      const errorMessage =
        error.response?.data?.message ||
        "Login failed. Please check your credentials!";
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const loginWithGoogle = async () => {
    setIsLoading(true);
    try {
      await loginGoogle();
      toast.success("Google login successful!");
      navigate("/", { replace: true });
    } catch (error) {
      console.error("Error logging in with Google:", error);
      toast.error("Google login failed. Please try again!");
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = async (values, { resetForm }) => {
    setIsLoading(true);
    try {
      const { email } = values;
      const res = await sendForgotPasswordEmail(email);
      toast.success("Reset email sent! Please check your inbox.");
      setIsResetPassword(false);
      resetForm();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to send reset email.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-screen h-screen relative overflow-hidden flex">
      <img
        src={LoginBg}
        className="w-full h-full object-cover absolute top-0 left-0"
        alt="Login Background"
      />
      <div className="flex flex-col items-center bg-white/20 w-[80%] md:w-[508px] h-full z-10 backdrop-blur-md p-2 px-4 py-12 gap-4 xl:gap-6">
        <div
          onClick={() => navigate("/")}
          className="cursor-pointer flex items-center justify-start gap-4 w-full mb-6"
        >
          <img src={Logo} className="w-60" alt="Logo" />
        </div>
        <p className="text-3xl font-semibold text-black">Welcome Back</p>
        <p className="text-xl text-black/80 -mt-6">
          {isSignUp ? "Sign Up" : "Sign In"} with following
        </p>
        {!isSignUp ? (
          <p className="text-black">
            Don’t have an account?{" "}
            <motion.button
              {...buttonClick}
              className="text-blue-300 underline cursor-pointer bg-transparent"
              onClick={() => {
                setIsSignUp(true);
                setShowForgetPassword(false);
              }}
            >
              <span className="text-[#3A5B22] font-bold">Create one</span>
            </motion.button>
          </p>
        ) : (
          <p className="text-black">
            Already have an account?{" "}
            <motion.button
              {...buttonClick}
              className="text-blue-300 underline cursor-pointer bg-transparent"
              onClick={() => {
                setIsSignUp(false);
                setShowForgetPassword(true);
              }}
            >
              <span className="text-[#3A5B22] font-bold">Sign-in here</span>
            </motion.button>
          </p>
        )}

        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={
            isResetPassword
              ? handleForgotPassword
              : isSignUp
              ? signUpWithEmailPassword
              : signIn
          }
        >
          {({ values, errors, touched }) => (
            <Form className="w-full flex flex-col items-center justify-center gap-4 px-4 md:px-12 pt-4 xl:gap-6">
              {isResetPassword && (
                <div className="flex items-center justify-start w-full">

                <button
                  type="button"
                  className="text-sm mt-2 rounded-md bg-transparent border border-green-600 px-4 py-2 hover:bg-green-600 hover:text-white transition-all duration-150 cursor-pointer"
                  onClick={() => setIsResetPassword(false)}
                  >
                  Back to Login
                </button>
                  </div>
              )}
              <LoginInput
                name="email"
                placeHolder="Email Here"
                icon={<FaEnvelope className="text-xl text-textColor" />}
                type="email"
                errors={errors.email}
                touched={touched.email}
              />

              {!isResetPassword && (
                <>
                  <LoginInput
                    name="password"
                    placeHolder="Password Here"
                    icon={<FaLock className="text-xl text-textColor" />}
                    type="password"
                    errors={errors.password}
                    touched={touched.password}
                  />
                </>
              )}

              {isSignUp && !isResetPassword && (
                <>
                  <LoginInput
                    name="confirm_password"
                    placeHolder="Confirm Password Here"
                    icon={<FaLock className="text-xl text-textColor" />}
                    type="password"
                    errors={errors.confirm_password}
                    touched={touched.confirm_password}
                  />
                  <PasswordStrengthBar password={values.password} />
                  <PasswordChecklistComponent password={values.password} />
                </>
              )}

              {!isSignUp && !isResetPassword && showForgetPassword && (
                <p className="text-black text-sm">
                  Forgot your password?{" "}
                  <motion.button
                    {...buttonClick}
                    type="button"
                    onClick={() => setIsResetPassword(true)}
                    className="text-blue-300 underline bg-transparent"
                  >
                    <span className="text-[#3A5B22] font-bold">Click here</span>
                  </motion.button>
                </p>
              )}

              {isResetPassword && (
                <p className="text-black text-sm text-center">
                  Enter your email and we’ll send you reset instructions.
                </p>
              )}

              {/* Submit Button */}
              <motion.button
                {...buttonClick}
                type="submit"
                className="w-full px-4 py-2 rounded-md bg-green-600 cursor-pointer text-white text-xl capitalize hover:bg-green-700 transition-all duration-150"
                disabled={isLoading}
              >
                {isLoading
                  ? "Loading..."
                  : isResetPassword
                  ? "Send Reset Email"
                  : isSignUp
                  ? "Sign Up"
                  : "Sign In"}
              </motion.button>
            </Form>
          )}
        </Formik>

        {!isSignUp && (
          <>
            <div className="flex items-center justify-between gap-16">
              <div className="w-24 h-[1px] rounded-md bg-black"></div>
              <p className="text-black">or</p>
              <div className="w-24 h-[1px] rounded-md bg-black"></div>
            </div>
            <motion.div
              {...buttonClick}
              className="flex items-center justify-center px-20 py-2 bg-white/30 backdrop-blur-md cursor-pointer rounded-3xl gap-4"
              onClick={loginWithGoogle}
              disabled={isLoading}
              tabIndex={6}
            >
              <FcGoogle className="text-3xl" />
              <p className="capitalize text-base text-black items-center">
                Sign in with Google
              </p>
            </motion.div>
          </>
        )}
      </div>
    </div>
  );
};

export default AuthPage;

import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import type { SubmitHandler } from "react-hook-form";
import { Link } from "react-router-dom";
import { useForgotPassword } from "../../hooks/Useforgotpassword";
import useNotification from "../../hooks/useNotification";
import { CheckCircleIcon } from "@heroicons/react/24/outline";

interface ForgotPasswordInput {
  email: string;
}

const ForgotPassword: React.FC = () => {
  const [emailSent, setEmailSent] = useState(false);
  const [submittedEmail, setSubmittedEmail] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordInput>();

  const { NotificationComponent, triggerNotification } = useNotification();
  const { forgotPassword, loading } = useForgotPassword();

  useEffect(() => {
    document.title = "Forgot Password - RIMI Training Portal";
    
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute(
        'content',
        'Reset your password for RIMI Agent Training Portal'
      );
    }
  }, []);

  const onSubmit: SubmitHandler<ForgotPasswordInput> = async (data) => {
    try {
      const response = await forgotPassword({ email: data.email.toLowerCase().trim() });
      
      setSubmittedEmail(data.email);
      setEmailSent(true);
      
      triggerNotification({
        type: "success",
        message: response.message,
        duration: 5000,
      });
    } catch (error: any) {
      triggerNotification({
        type: "error",
        message: error?.message || "Failed to send reset email. Please try again.",
        duration: 4000,
      });
    }
  };

  if (emailSent) {
    return (
      <div className="min-h-screen bg-white">
        <header className="bg-white border-b border-[#E9EEF1] flex items-center justify-between px-6 sm:px-14 py-4">
          <Link to="/" className="flex items-center">
            <img
              src="/rimilogo.png"
              alt="RIMI Logo"
              className="h-10 w-28 sm:h-12 sm:w-32"
            />
          </Link>
        </header>

        <div className="flex items-center justify-center px-4 min-h-[calc(100vh-64px)]">
          <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-md text-center">
            <div className="flex justify-center mb-6">
              <CheckCircleIcon className="h-16 w-16 text-green-500" />
            </div>

            <h2 className="text-2xl font-bold text-neutral-800 mb-4">
              Check Your Email
            </h2>

            <p className="text-neutral-600 mb-6">
              If an account exists for <strong>{submittedEmail}</strong>, you will receive
              password reset instructions at that email address.
            </p>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
              <p className="text-sm text-blue-800">
                <strong>Didn't receive the email?</strong>
              </p>
              <ul className="text-sm text-blue-700 mt-2 text-left list-disc list-inside">
                <li>Check your spam/junk folder</li>
                <li>Make sure you entered the correct email</li>
                <li>Wait a few minutes and try again</li>
              </ul>
            </div>

            <div className="space-y-3">
              <Link
                to="/"
                className="block w-full py-3 bg-primary text-white font-semibold rounded shadow hover:bg-indigo-700 transition-all"
              >
                Back to Login
              </Link>
              
              <button
                onClick={() => setEmailSent(false)}
                className="w-full py-3 border border-primary text-primary font-semibold rounded hover:bg-indigo-50 transition-all"
              >
                Try Different Email
              </button>
            </div>
          </div>
        </div>

        {NotificationComponent}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <header className="bg-white border-b border-[#E9EEF1] flex items-center justify-between px-6 sm:px-14 py-4">
        <Link to="/" className="flex items-center">
          <img
            src="/rimilogo.png"
            alt="RIMI Logo"
            className="h-10 w-28 sm:h-12 sm:w-32"
          />
        </Link>
        <Link
          to="/"
          className="text-primary font-semibold hover:text-indigo-700 transition-all"
        >
          Back to Login
        </Link>
      </header>

      <div className="flex items-center justify-center px-4 min-h-[calc(100vh-64px)]">
        <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-md">
          <h2 className="text-center text-2xl font-bold text-neutral-800 mb-4">
            Forgot Password?
          </h2>

          <p className="text-center text-neutral-600 mb-8">
            Enter your email address and we'll send you instructions to reset your
            password.
          </p>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-neutral-700 mb-2">
                Email Address
              </label>
              <input
                id="email"
                type="email"
                autoComplete="email"
                {...register("email", {
                  setValueAs: (value) => value.trim().toLowerCase(),
                  required: "Email is required",
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: "Invalid email address",
                  },
                })}
                placeholder="Enter your email"
                className="w-full px-4 py-3 border border-zinc-300 rounded focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              />
              {errors.email && (
                <p className="text-red-600 text-sm mt-1">
                  {errors.email.message}
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-primary text-white font-semibold rounded cursor-pointer transition-all shadow hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Sending..." : "Send Reset Link"}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-neutral-600">
              Remember your password?{" "}
              <Link
                to="/"
                className="text-primary font-semibold hover:text-indigo-700 hover:underline transition-all"
              >
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>

      {NotificationComponent}
    </div>
  );
};

export default ForgotPassword;
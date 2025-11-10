import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import type { SubmitHandler } from "react-hook-form";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useResetPassword, useVerifyResetToken } from "../../hooks/UseResetPasswordOpen";
import useNotification from "../../hooks/useNotification";
import { EyeIcon, EyeSlashIcon, CheckCircleIcon } from "@heroicons/react/24/outline";

interface ResetPasswordInput {
  password: string;
  confirmPassword: string;
}

const ResetPassword: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [tokenValid, setTokenValid] = useState<boolean | null>(null);
  const [resetSuccess, setResetSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<ResetPasswordInput>();

  const { NotificationComponent, triggerNotification } = useNotification();
  const { verifyToken, loading: verifyLoading } = useVerifyResetToken();
  const { resetPassword, loading: resetLoading } = useResetPassword();

  const password = watch("password");

  useEffect(() => {
    document.title = "Reset Password - RIMI Training Portal";
    
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute(
        'content',
        'Create a new password for your RIMI Agent Training account'
      );
    }
  }, []);

  // Verify token on component mount
  useEffect(() => {
    if (!token) {
      setTokenValid(false);
      triggerNotification({
        type: "error",
        message: "No reset token provided",
        duration: 4000,
      });
      return;
    }

    const checkToken = async () => {
      const result = await verifyToken(token);
      setTokenValid(result.valid);
      
      if (!result.valid) {
        triggerNotification({
          type: "error",
          message: result.message || "Invalid or expired reset token",
          duration: 5000,
        });
      }
    };

    checkToken();
  }, [token]);

  const onSubmit: SubmitHandler<ResetPasswordInput> = async (data) => {
    if (!token) {
      triggerNotification({
        type: "error",
        message: "No reset token provided",
        duration: 3000,
      });
      return;
    }

    if (data.password !== data.confirmPassword) {
      triggerNotification({
        type: "error",
        message: "Passwords do not match",
        duration: 3000,
      });
      return;
    }

    try {
      const response = await resetPassword({
        token,
        password: data.password,
        confirmPassword: data.confirmPassword,
      });

      setResetSuccess(true);
      
      triggerNotification({
        type: "success",
        message: response.message,
        duration: 5000,
      });

      // Redirect to login after 3 seconds
      setTimeout(() => {
        navigate("/");
      }, 3000);
    } catch (error: any) {
      triggerNotification({
        type: "error",
        message: error?.message || "Failed to reset password. Please try again.",
        duration: 4000,
      });
    }
  };

  // Show loading state while verifying token
  if (verifyLoading || tokenValid === null) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-neutral-600">Verifying reset link...</p>
        </div>
      </div>
    );
  }

  // Show success screen after password reset
  if (resetSuccess) {
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
              Password Reset Successful!
            </h2>

            <p className="text-neutral-600 mb-6">
              Your password has been successfully reset. You can now login with your new password.
            </p>

            <p className="text-sm text-neutral-500 mb-6">
              Redirecting to login page in a few seconds...
            </p>

            <Link
              to="/"
              className="block w-full py-3 bg-primary text-white font-semibold rounded shadow hover:bg-indigo-700 transition-all"
            >
              Go to Login Now
            </Link>
          </div>
        </div>

        {NotificationComponent}
      </div>
    );
  }

  // Show error screen for invalid/expired token
  if (!tokenValid) {
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
              <div className="h-16 w-16 bg-red-100 rounded-full flex items-center justify-center">
                <span className="text-3xl text-red-500">⚠️</span>
              </div>
            </div>

            <h2 className="text-2xl font-bold text-neutral-800 mb-4">
              Invalid or Expired Link
            </h2>

            <p className="text-neutral-600 mb-6">
              This password reset link is invalid or has expired. Reset links are only
              valid for 30 minutes.
            </p>

            <div className="space-y-3">
              <Link
                to="/forgot-password"
                className="block w-full py-3 bg-primary text-white font-semibold rounded shadow hover:bg-indigo-700 transition-all"
              >
                Request New Reset Link
              </Link>
              
              <Link
                to="/"
                className="block w-full py-3 border border-primary text-primary font-semibold rounded hover:bg-indigo-50 transition-all"
              >
                Back to Login
              </Link>
            </div>
          </div>
        </div>

        {NotificationComponent}
      </div>
    );
  }

  // Show reset password form
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
        <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-md">
          <h2 className="text-center text-2xl font-bold text-neutral-800 mb-4">
            Create New Password
          </h2>

          <p className="text-center text-neutral-600 mb-8">
            Enter your new password below. Make sure it's secure and memorable.
          </p>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* New Password */}
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-neutral-700 mb-2"
              >
                New Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="new-password"
                  {...register("password", {
                    setValueAs: (value) => value.trim(),
                    required: "Password is required",
                    minLength: {
                      value: 6,
                      message: "Password must be at least 6 characters",
                    },
                    validate: {
                      hasLetter: (value) =>
                        /[A-Za-z]/.test(value) ||
                        "Password must contain at least one letter",
                      hasNumber: (value) =>
                        /\d/.test(value) ||
                        "Password must contain at least one number",
                    },
                  })}
                  placeholder="Enter new password"
                  className="w-full px-4 py-3 border border-zinc-300 rounded focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-zinc-500"
                >
                  {showPassword ? (
                    <EyeIcon className="h-5 w-5 cursor-pointer" />
                  ) : (
                    <EyeSlashIcon className="h-5 w-5 cursor-pointer" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="text-red-600 text-sm mt-1">
                  {errors.password.message}
                </p>
              )}
            </div>

            {/* Confirm Password */}
            <div>
              <label
                htmlFor="confirmPassword"
                className="block text-sm font-medium text-neutral-700 mb-2"
              >
                Confirm New Password
              </label>
              <div className="relative">
                <input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  autoComplete="new-password"
                  {...register("confirmPassword", {
                    setValueAs: (value) => value.trim(),
                    required: "Please confirm your password",
                    validate: (value) =>
                      value === password || "Passwords do not match",
                  })}
                  placeholder="Confirm new password"
                  className="w-full px-4 py-3 border border-zinc-300 rounded focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword((prev) => !prev)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-zinc-500"
                >
                  {showConfirmPassword ? (
                    <EyeIcon className="h-5 w-5 cursor-pointer" />
                  ) : (
                    <EyeSlashIcon className="h-5 w-5 cursor-pointer" />
                  )}
                </button>
              </div>
              {errors.confirmPassword && (
                <p className="text-red-600 text-sm mt-1">
                  {errors.confirmPassword.message}
                </p>
              )}
            </div>

            {/* Password Requirements */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-sm font-medium text-blue-900 mb-2">
                Password Requirements:
              </p>
              <ul className="text-sm text-blue-800 space-y-1">
                <li className="flex items-center">
                  <span className="mr-2">
                    {password?.length >= 6 ? "✓" : "○"}
                  </span>
                  At least 6 characters
                </li>
                <li className="flex items-center">
                  <span className="mr-2">
                    {/[A-Za-z]/.test(password || "") ? "✓" : "○"}
                  </span>
                  Contains at least one letter
                </li>
                <li className="flex items-center">
                  <span className="mr-2">
                    {/\d/.test(password || "") ? "✓" : "○"}
                  </span>
                  Contains at least one number
                </li>
              </ul>
            </div>

            <button
              type="submit"
              disabled={resetLoading}
              className="w-full py-3 bg-primary text-white font-semibold rounded cursor-pointer transition-all shadow hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {resetLoading ? "Resetting Password..." : "Reset Password"}
            </button>
          </form>

          <div className="mt-6 text-center">
            <Link
              to="/"
              className="text-primary font-semibold hover:text-indigo-700 hover:underline transition-all"
            >
              Back to Login
            </Link>
          </div>
        </div>
      </div>

      {NotificationComponent}
    </div>
  );
};

export default ResetPassword;
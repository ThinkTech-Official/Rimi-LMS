import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import type { SubmitHandler } from "react-hook-form";
import { Link } from "react-router-dom";
import { useForgotPassword } from "../../hooks/Useforgotpassword";
import useNotification from "../../hooks/useNotification";
import { CheckCircleIcon } from "@heroicons/react/24/outline";
import { useTranslation } from "react-i18next";

interface ForgotPasswordInput {
  email: string;
}

const ForgotPassword: React.FC = () => {
  const [emailSent, setEmailSent] = useState(false);
  const [submittedEmail, setSubmittedEmail] = useState("");
  const { t } = useTranslation();

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
        "content",
        "Reset your password for RIMI Agent Training Portal"
      );
    }
  }, []);

  const onSubmit: SubmitHandler<ForgotPasswordInput> = async (data) => {
    try {
      const response = await forgotPassword({
        email: data.email.toLowerCase().trim(),
      });

      setSubmittedEmail(data.email);
      setEmailSent(true);

      // triggerNotification({
      //   type: "success",
      //   message: response.message,
      //   duration: 5000,
      // });
    } catch (error: any) {
      triggerNotification({
        type: "error",
        message:
          error?.message || t("Failed to send reset email. Please try again."),
        duration: 4000,
      });
    }
  };

  if (emailSent) {
    return (
      <div className="min-h-screen bg-white">
        <header className="bg-white border-b border-[#E9EEF1] flex items-center justify-between px-6 sm:px-14 py-2">
          <Link to="/" className="flex items-center">
            <img
              src="/rimilogo.png"
              alt="RIMI Logo"
              className="h-10 w-20 sm:h-12 sm:w-24"
            />
          </Link>
        </header>

        <div className="flex items-center justify-center px-4 min-h-[calc(100vh-64px)]">
          <div className="w-full max-w-md bg-white p-6 sm:p-8 border border-[#E9EEF1] shadow-lg text-center">
            <div className="flex justify-center mb-3 sm:mb-6">
              <CheckCircleIcon className="w-12 h-12 sm:h-16 sm:w-16 text-green-500" />
            </div>

            <h2 className="text-xl sm:text-2xl font-bold text-neutral-800 mb-2 sm:mb-4">
              {t("Check Your Email")}
            </h2>

            <p className="text-text-light-2 mb-6">
              {t("If an account exists for")} <strong>{submittedEmail}</strong>,{" "}
              {t(
                "you will receive password reset instructions at that email address."
              )}
            </p>

            <div className="bg-blue-50 border border-blue-200 rounded-sm p-4 mb-6">
              <p className="text-sm text-blue-800">
                <strong>{t("Didn't receive the email?")}</strong>
              </p>
              <ul className="text-sm text-blue-700 mt-2 text-left list-disc list-inside">
                <li>{t("Check your spam/junk folder")}</li>
                <li>{t("Make sure you entered the correct email")}</li>
                <li>{t("Wait a few minutes and try again")}</li>
              </ul>
            </div>

            <div className="space-y-3">
              <Link
                to="/"
                className="block capitalize text-sm sm:text-[16px] px-5 py-3 bg-primary text-white text-nowrap font-semibold hover:bg-indigo-700 cursor-pointer transition-colors delay-100"
              >
                {t("Back to Login")}
              </Link>

              <button
                onClick={() => setEmailSent(false)}
                className="block w-full text-sm sm:text-[16px] px-5 py-2 sm:py-3 border border-inputBorder text-text-light-2 hover:border-gray-500 hover:text-text-dark cursor-pointer transition-colors delay-100"
              >
                {t("Try Different Email")}
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
      <header className="bg-white border-b border-[#E9EEF1] flex items-center justify-between px-6 sm:px-14 py-2">
        <Link to="/" className="flex items-center">
          <img
            src="/rimilogo.png"
            alt="RIMI Logo"
            className="h-10 w-20 sm:h-12 sm:w-24"
          />
        </Link>
        <Link
          to="/"
          className="text-primary hover:text-indigo-700 transition-all"
        >
          {t("Back to Login")}
        </Link>
      </header>

      <div className="flex items-center justify-center px-4 min-h-[calc(100vh-64px)]">
        <div className="w-full max-w-md bg-white p-6 sm:p-8 border border-[#E9EEF1] shadow-lg">
          <h2 className="text-center text-2xl font-bold text-neutral-800 mb-4">
            {t("Forgot Password?")}
          </h2>

          <p className="text-center text-text-light-2 mb-8">
            {t(
              "Enter your email address and we'll send you instructions to reset your password."
            )}
          </p>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-text-light"
              >
                Email
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
                placeholder={t("Enter your email")}
                className="w-full border border-inputBorder px-4 py-3 focus:outline-none focus:ring-1 focus:ring-primary"
              />
              {errors.email && (
                <p className="text-red-600 text-sm mt-1">
                  {t(String(errors.email.message))}
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full capitalize text-sm sm:text-[16px] px-5 py-3 bg-primary text-white text-nowrap font-semibold hover:bg-indigo-700 cursor-pointer transition-colors delay-100 disabled:cursor-not-allowed"
            >
              {loading ? t("Sending...") : t("Send Reset Link")}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-neutral-600">
              {t("Remember your password?")}{" "}
              <Link
                to="/"
                className="text-primary hover:text-indigo-700 hover:underline transition-all"
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

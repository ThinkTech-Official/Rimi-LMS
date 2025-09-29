import React, { useState } from "react";
import { useForm } from "react-hook-form";
import {
  useAdminCreateClient,
  type CreateClientUserDto,
} from "../../hooks/useAdminCreateClient";
import useNotification from "../../hooks/useNotification";
import { useTranslation } from "react-i18next";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";

export const AdminCreateUser: React.FC = () => {
  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm<CreateClientUserDto & { confirmPassword: string }>();
  const { createClient, loading, error, success } = useAdminCreateClient();
  const { triggerNotification, NotificationComponent } = useNotification();
  const { t } = useTranslation();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const onSubmit = async (
    data: CreateClientUserDto & { confirmPassword: string }
  ) => {
    const { name, email, password } = data;
    try {
      await createClient({ name, email, password });
      triggerNotification({
        type: "success",
        message: t("Client created successfully"),
        duration: 3000,
      });
      reset();
    } catch (error: any) {
      let errorMessage = t("Failed to create client"); // fallback message

      if (error?.response?.data?.message) {
        // If backend sends structured error response
        errorMessage = error.response.data.message;
      } else if (error?.response?.data?.error) {
        // Alternative error field
        errorMessage = error.response.data.error;
      } else if (error?.message) {
        // If error has a message property
        errorMessage = error.message;
      }
      triggerNotification({
        type: "error",
        message: errorMessage,
        duration: 3000,
      });
    }
  };

  return (
    <div className="w-[90%] sm:w-md mx-auto p-3 sm:p-6 bg-white shadow-lg mt-[10%] sm:mt-[5%]">
      <h2 className="text-xl text-center font-semibold mb-4 text-text-dark">
        {t("Create Client")}
      </h2>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Name */}
        <div>
          <label className="block mb-1 font-medium text-text-light-2">
            {t("name")}
          </label>
          <input
            {...register("name", {
              setValueAs: (value) => value.trim(),
              required: t("Name is required"),
            })}
            className="w-full p-2 sm:px-4 sm:py-3 border border-zinc-300 focus:border-0 focus:outline-none focus:ring-1 focus:ring-primary"
          />
          {errors.name && (
            <p className="text-red-600 mt-1 text-sm">{t("Name is required")}</p>
          )}
        </div>

        {/* Email */}
        <div>
          <label className="block mb-1 font-medium text-text-light-2">
            {t("Email")}
          </label>
          <input
            type="email"
            {...register("email", {
              //trim email and make it of smaller letters
              setValueAs: (value) => value.trim().toLowerCase(),
              required: t("Email is required"),
              pattern: {
                value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                message: "Invalid email address",
              },
            })}
            className="w-full p-2 sm:px-4 sm:py-3 border border-zinc-300 focus:border-0 focus:outline-none focus:ring-1 focus:ring-primary"
          />
          {errors.email && (
            <p className="text-red-600 mt-1 text-sm">
              {t(String(errors.email.message))}
            </p>
          )}
        </div>

        {/* Password */}
        <div>
          <label className="block mb-1 font-medium text-text-light-2">
            {t("Password")}
          </label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              {...register("password", {
                setValueAs: (value) => value.trim(),
                required: t("Password is required"),
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
              className="w-full px-2 sm:px-4 py-2 sm:py-3 border border-zinc-300 focus:outline-none focus:ring-1 focus:ring-primary pr-10 sm:pr-10"
            />
            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-zinc-500"
            >
              {showPassword ? (
                <EyeIcon
                  className="h-5 w-5 cursor-pointer"
                  aria-hidden="true"
                />
              ) : (
                <EyeSlashIcon
                  className="h-5 w-5 cursor-pointer"
                  aria-hidden="true"
                />
              )}
            </button>
          </div>
          {errors.password && (
            <p className="text-red-600 mt-1 text-sm">
              {t(String(errors.password.message))}
            </p>
          )}
        </div>

        {/* Confirm Password */}
        <div>
          <label className="block mb-1 font-medium text-text-light-2">
            {t("Confirm Password")}
          </label>
          <div className="relative">
            <input
              type={showConfirmPassword ? "text" : "password"}
              {...register("confirmPassword", {
                setValueAs: (value) => value.trim(),
                required: "Please confirm password",
                validate: (value) =>
                  value === watch("password") || "Passwords do not match",
              })}
              className="w-full p-2 sm:px-4 sm:py-3 border border-zinc-300 focus:border-0 focus:outline-none focus:ring-1 focus:ring-primary pr-10 sm:pr-10"
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword((prev) => !prev)}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-zinc-500"
            >
              {showConfirmPassword ? (
                <EyeIcon
                  className="h-5 w-5 cursor-pointer"
                  aria-hidden="true"
                />
              ) : (
                <EyeSlashIcon
                  className="h-5 w-5 cursor-pointer"
                  aria-hidden="true"
                />
              )}
            </button>
          </div>
          {errors.confirmPassword?.message && (
            <p className="text-red-600 mt-1 text-sm">
              {t(String(errors.confirmPassword.message))}
            </p>
          )}
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full p-2 sm:py-3 bg-primary text-white font-semibold cursor-pointer transition-all delay-100 shadow hover:bg-indigo-700"
        >
          {loading ? `${t("Creating")}…` : t("Create User")}
        </button>
      </form>
      {NotificationComponent}
    </div>
  );
};

export default AdminCreateUser;

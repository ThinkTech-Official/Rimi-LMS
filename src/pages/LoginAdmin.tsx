import React, { useState } from "react";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";
import { useAdminAuth, type SignInDto } from "../hooks/useAdminAuth";
import { useForm, type SubmitHandler } from "react-hook-form";
import useNotification from "../hooks/useNotification";

const LoginAdmin: React.FC = () => {
  const { login, loading, error } = useAdminAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignInDto>();
  const { NotificationComponent, triggerNotification } = useNotification();

  // const handleSubmit = (e: React.FormEvent) => {
  //   e.preventDefault();
  //   login({ email, password } as SignInDto);
  // };
  const onSubmit: SubmitHandler<SignInDto> = async (data: SignInDto) => {
    try {
      await login(data);
    } catch (error) {
      console.error(error);
      triggerNotification({
        type: "error",
        message: "Invalid email or password",
        duration: 3000,
      });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white px-4">
      <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-md">
        {/* Logo */}
        <div className="flex justify-center mb-6">
          <img
            src="/rimilogo.png"
            alt="RIMI Logo"
            className="h-12 w-32 sm:h-[75px] sm:w-40"
          />
        </div>

        {/* Heading */}
        <h2 className="text-center text-2xl font-bold text-neutral-800 mb-8">
          Welcome to RIMI Insurance Learning Portal
        </h2>

        {/* Login Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div>
            <label htmlFor="email" className="sr-only">
              Username/email
            </label>
            <input
              id="email"
              type="email"
              autoComplete="email"
              {...register("email", {
                required: "Email is required",
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: "Invalid email address",
                },
              })}
              placeholder="Username/email"
              className="w-full px-4 py-3 border border-zinc-300 focus:outline-none focus:ring-1 focus:ring-primary"
            />
            {errors.email && (
              <p className="mt-1 text-sm text-red-600">
                {errors.email.message}
              </p>
            )}
          </div>

          <div className="relative">
            <label htmlFor="password" className="sr-only">
              Password
            </label>
            <div className="relative">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                autoComplete="current-password"
                {...register("password", {
                  required: "Password is required",
                  minLength: {
                    value: 4,
                    message: "Password must be at least 4 characters",
                  },
                })}
                placeholder="Password"
                className="w-full px-4 py-3 border border-zinc-300 focus:border-0 focus:outline-none focus:ring-1 focus:ring-primary"
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-zinc-500 cursor-pointer"
              >
                {showPassword ? (
                  <EyeSlashIcon className="h-5 w-5" aria-hidden="true" />
                ) : (
                  <EyeIcon className="h-5 w-5" aria-hidden="true" />
                )}
              </button>
            </div>
            {errors.password && (
              <p className="mt-1 text-sm text-red-600">
                {errors.password.message}
              </p>
            )}
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-primary text-white font-semibold cursor-pointer transition-all delay-100 shadow hover:bg-indigo-700"
          >
            {loading ? "Signing in…" : "Sign in"}
          </button>
        </form>
      </div>
      {NotificationComponent}
    </div>
  );
};

export default LoginAdmin;

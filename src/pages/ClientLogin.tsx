import React, { useState } from "react";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";
import { useForm } from "react-hook-form";
import type { SubmitHandler } from "react-hook-form";
import useNotification from "../hooks/useNotification";
import { useLogin } from "../hooks/useLogin";
import { useUser } from "../hooks/useUser";
import { useNavigate } from "react-router-dom";

interface LoginFormInput {
  email: string;
  password: string;
}

const LoginClient: React.FC = () => {
  const navigate = useNavigate()
  const [showPassword, setShowPassword] = useState(false);
  const { register, handleSubmit } = useForm<LoginFormInput>();
  const {NotificationComponent, triggerNotification } = useNotification();

   const { login, loading, error } = useLogin();
  const { refreshUser } = useUser();

  // const handleSubmit = (e: React.FormEvent) => {
  //   e.preventDefault();
  //   //  integrate login API
  //   console.log({ email, password });
  // };

  // const onSubmit: SubmitHandler<LoginFormInput> = (data) => {
  //   console.log(data);
  //   triggerNotification({
  //     type: "info",
  //     message: "Login successful",
  //     duration: 3000,
  //   });
  // };

   const onSubmit: SubmitHandler<LoginFormInput> = async (data) => {
    try {
      await login(data);
      await refreshUser();
      triggerNotification({ type: 'success', message: 'Logged in!', duration: 3000 });
      navigate('/client');
    } catch {
      triggerNotification({ type: 'error', message: error || 'Login failed', duration: 3000 });
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
              required
              {...register("email", {
                required: true,
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: "Invalid email address",
                },
              })}
              placeholder="email"
              className="w-full px-4 py-3 border border-zinc-300 focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>

          <div className="relative">
            <label htmlFor="password" className="sr-only">
              Password
            </label>
            <input
              id="password"
              {...register("password", { required: true, minLength: 4 })}
              type={showPassword ? "text" : "password"}
              autoComplete="current-password"
              required
              placeholder="Password"
              className="w-full px-4 py-3 border border-zinc-300 focus:outline-none focus:ring-1 focus:ring-primary"
            />
            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-zinc-500"
            >
              {showPassword ? (
                <EyeSlashIcon className="h-5 w-5" aria-hidden="true" />
              ) : (
                <EyeIcon className="h-5 w-5" aria-hidden="true" />
              )}
            </button>
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-primary text-white font-semibold cursor-pointer transition-all delay-100 shadow hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            {loading ? 'Signing in...' : 'Sign in Client'}
          </button>
        </form>
      </div>
      {NotificationComponent}
    </div>
  );
};

export default LoginClient;

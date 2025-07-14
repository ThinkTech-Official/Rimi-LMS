

import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useAdminCreateClient, type CreateClientUserDto } from '../../hooks/useAdminCreateClient';
import useNotification from '../../hooks/useNotification';

export const AdminCreateUser: React.FC = () => {
  const { register, handleSubmit, watch, formState: { errors } } =
    useForm<CreateClientUserDto & { confirmPassword: string }>();
  const { createClient, loading, error, success } = useAdminCreateClient();
  const { triggerNotification, NotificationComponent } = useNotification();

  const onSubmit = async (data: CreateClientUserDto & { confirmPassword: string }) => {
    const { name, email, password } = data;
    try {
      await createClient({ name, email, password });
      triggerNotification({ type: 'success', message: 'Client created successfully', duration: 3000 });
    } catch(error) {
      console.log('error in creting client', error)
      triggerNotification({ type: 'error', message: 'Failed to create client', duration: 3000 });
    }
  };

  return (
    <div className="w-[90%] sm:w-md mx-auto p-3 sm:p-6 bg-white shadow-lg mt-[10%] sm:mt-[5%]">
      <h2 className="text-xl text-center font-semibold mb-4 text-text-dark">Create Client</h2>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Name */}
        <div>
          <label className="block mb-1 font-medium text-text-light-2">Name</label>
          <input
            {...register('name', { required: 'Name is required' })}
            className="w-full p-2 sm:px-4 sm:py-3 border border-zinc-300 focus:border-0 focus:outline-none focus:ring-1 focus:ring-primary"
          />
          {errors.name && <p className="text-red-600 mt-1">{errors.name.message}</p>}
        </div>

        {/* Email */}
        <div>
          <label className="block mb-1 font-medium text-text-light-2">Email</label>
          <input
            type="email"
            {...register('email', {
              required: 'Email is required',
              pattern: {
                value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                message: 'Invalid email address',
              },
            })}
            className="w-full p-2 sm:px-4 sm:py-3 border border-zinc-300 focus:border-0 focus:outline-none focus:ring-1 focus:ring-primary"
          />
          {errors.email && <p className="text-red-600 mt-1">{errors.email.message}</p>}
        </div>

        {/* Password */}
        <div>
          <label className="block mb-1 font-medium text-text-light-2">Password</label>
          <input
            type="password"
            {...register('password', {
              required: 'Password is required',
              minLength: { value: 6, message: 'Minimum length is 6' },
            })}
            className="w-full p-2 sm:px-4 sm:py-3 border border-zinc-300 focus:border-0 focus:outline-none focus:ring-1 focus:ring-primary"
          />
          {errors.password && <p className="text-red-600 mt-1">{errors.password.message}</p>}
        </div>

        {/* Confirm Password */}
        <div>
          <label className="block mb-1 font-medium text-text-light-2">Confirm Password</label>
          <input
            type="password"
            {...register('confirmPassword', {
              required: 'Please confirm password',
              validate: (value) =>
                value === watch('password') || 'Passwords do not match',
            })}
            className="w-full p-2 sm:px-4 sm:py-3 border border-zinc-300 focus:border-0 focus:outline-none focus:ring-1 focus:ring-primary"
          />
          {errors.confirmPassword && (
            <p className="text-red-600 mt-1">{errors.confirmPassword.message}</p>
          )}
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full p-2 sm:py-3 bg-primary text-white font-semibold cursor-pointer transition-all delay-100 shadow hover:bg-indigo-700"
        >
          {loading ? 'Creating…' : 'Create User'}
        </button>
      </form>
      {NotificationComponent}
    </div>
  );
};

export default AdminCreateUser;
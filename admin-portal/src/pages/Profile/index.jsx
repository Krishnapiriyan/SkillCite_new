import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuth } from '../../context/AuthContext';
import { updateAdminProfileApi } from '../../services/api';
import { User, Mail, Lock, CheckCircle2, AlertTriangle, ShieldCheck } from 'lucide-react';

import AdminLayout from '../../components/layout/AdminLayout';

// Zod Form Validation Schema
const schema = z.object({
  name: z.string().min(1, 'Administrator name is required'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters').optional().or(z.literal('')),
  confirmPassword: z.string().optional().or(z.literal('')),
}).refine((data) => {
  if (data.password && data.password !== data.confirmPassword) {
    return false;
  }
  return true;
}, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

export default function Profile() {
  const { admin, updateAdminUser } = useAuth();
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm({
    resolver: zodResolver(schema),
    mode: 'onChange',
    defaultValues: {
      name: admin?.name || '',
      email: admin?.email || '',
      password: '',
      confirmPassword: '',
    }
  });

  const onSubmit = async (data) => {
    setLoading(true);
    setSuccessMessage('');
    setErrorMessage('');
    try {
      const payload = {
        name: data.name,
        email: data.email,
      };
      if (data.password) {
        payload.password = data.password;
      }

      const res = await updateAdminProfileApi(payload);
      if (res.success && res.data) {
        const { admin: updatedUser, accessToken, refreshToken } = res.data;
        // Sync context
        updateAdminUser(updatedUser, accessToken, refreshToken);
        setSuccessMessage('Administrator profile updated successfully!');
        
        // Reset password fields
        reset({
          name: updatedUser.name,
          email: updatedUser.email,
          password: '',
          confirmPassword: '',
        });
      }
    } catch (err) {
      console.error(err);
      setErrorMessage(err.response?.data?.error || 'Failed to update administrative profile');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AdminLayout title="Profile Settings">
      <div className="max-w-2xl mx-auto flex flex-col gap-6 select-none">
        
        {/* Info Header Card */}
        <div className="bg-gradient-to-r from-primary to-blue-900 text-white p-8 rounded-3xl shadow-lg relative overflow-hidden flex items-center gap-6">
          <div className="absolute right-0 bottom-0 opacity-10 pointer-events-none transform translate-y-1/4 translate-x-1/4">
            <ShieldCheck className="w-64 h-64" />
          </div>
          <div className="w-16 h-16 rounded-2xl bg-white/10 flex items-center justify-center border border-white/20 shrink-0">
            <User className="w-8 h-8 text-white" />
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-white/60 text-[9px] uppercase font-bold tracking-widest">Active Session Role</span>
            <h2 className="text-xl font-bold font-display">{admin?.name}</h2>
            <span className="text-xs text-white/80 font-medium break-all">{admin?.email}</span>
          </div>
        </div>

        {/* Notifications and Alerts */}
        {successMessage && (
          <div className="flex items-center gap-3 p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-2xl text-xs font-semibold animate-fadeIn">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            <span>{successMessage}</span>
          </div>
        )}

        {errorMessage && (
          <div className="flex items-center gap-3 p-4 bg-red-50 border border-red-200 text-red-800 rounded-2xl text-xs font-semibold animate-fadeIn">
            <AlertTriangle className="w-5 h-5 text-red-600 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Profile Edit Panel Form */}
        <div className="bg-surface border border-border p-8 rounded-3xl shadow-sm">
          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">
            <h3 className="font-bold text-sm text-primary uppercase tracking-wide border-b border-border/60 pb-3">
              Administrative Credentials
            </h3>

            {/* Admin Name Field */}
            <div className="w-full flex flex-col gap-1.5">
              <label className="text-xs font-bold text-primary/80 uppercase tracking-wide flex items-center gap-1.5">
                <User className="w-4 h-4 text-accent" /> Administrator Name *
              </label>
              <input
                type="text"
                placeholder="e.g. Administrator"
                className={`w-full px-4 py-3 rounded-xl border text-sm text-primary bg-bg-page outline-none transition-all focus:ring-4 focus:ring-accent-light focus:border-accent
                  ${errors.name ? 'border-red-500' : 'border-border/60'}`}
                {...register('name')}
              />
              {errors.name && (
                <span className="text-xs text-red-500 font-semibold">{errors.name.message}</span>
              )}
            </div>

            {/* Admin Email Field */}
            <div className="w-full flex flex-col gap-1.5">
              <label className="text-xs font-bold text-primary/80 uppercase tracking-wide flex items-center gap-1.5">
                <Mail className="w-4 h-4 text-accent" /> Email Address *
              </label>
              <input
                type="email"
                placeholder="admin@skillcite.com"
                className={`w-full px-4 py-3 rounded-xl border text-sm text-primary bg-bg-page outline-none transition-all focus:ring-4 focus:ring-accent-light focus:border-accent
                  ${errors.email ? 'border-red-500' : 'border-border/60'}`}
                {...register('email')}
              />
              {errors.email && (
                <span className="text-xs text-red-500 font-semibold">{errors.email.message}</span>
              )}
            </div>

            <h3 className="font-bold text-sm text-primary uppercase tracking-wide border-b border-border/60 pb-3 mt-4">
              Update Password (Optional)
            </h3>
            <p className="text-[11px] text-muted -mt-2 leading-relaxed">
              Leave these fields blank if you do not wish to change your active login credentials.
            </p>

            {/* New Password */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="w-full flex flex-col gap-1.5">
                <label className="text-xs font-bold text-primary/80 uppercase tracking-wide flex items-center gap-1.5">
                  <Lock className="w-4 h-4 text-accent" /> New Password
                </label>
                <input
                  type="password"
                  placeholder="••••••••"
                  className={`w-full px-4 py-3 rounded-xl border text-sm text-primary bg-bg-page outline-none transition-all focus:ring-4 focus:ring-accent-light focus:border-accent
                    ${errors.password ? 'border-red-500' : 'border-border/60'}`}
                  {...register('password')}
                />
                {errors.password && (
                  <span className="text-xs text-red-500 font-semibold">{errors.password.message}</span>
                )}
              </div>

              {/* Confirm Password */}
              <div className="w-full flex flex-col gap-1.5">
                <label className="text-xs font-bold text-primary/80 uppercase tracking-wide flex items-center gap-1.5">
                  <Lock className="w-4 h-4 text-accent" /> Confirm Password
                </label>
                <input
                  type="password"
                  placeholder="••••••••"
                  className={`w-full px-4 py-3 rounded-xl border text-sm text-primary bg-bg-page outline-none transition-all focus:ring-4 focus:ring-accent-light focus:border-accent
                    ${errors.confirmPassword ? 'border-red-500' : 'border-border/60'}`}
                  {...register('confirmPassword')}
                />
                {errors.confirmPassword && (
                  <span className="text-xs text-red-500 font-semibold">{errors.confirmPassword.message}</span>
                )}
              </div>
            </div>

            {/* Save Button */}
            <div className="flex justify-end mt-4 border-t border-border/60 pt-6">
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-3 rounded-full bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md transition-all active:scale-95 flex items-center gap-2 disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Saving Changes...
                  </>
                ) : (
                  'Save Profile Details'
                )}
              </button>
            </div>

          </form>
        </div>

      </div>
    </AdminLayout>
  );
}

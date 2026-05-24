import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuth } from '../../context/AuthContext';
import { Mail, Lock, LogIn } from 'lucide-react';

const schema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required')
});

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: { email: '', password: '' }
  });

  const onSubmit = async (data) => {
    setError(null);
    setLoading(true);
    try {
      await login(data.email, data.password);
      navigate('/');
    } catch (err) {
      console.error(err);
      setError(err.message || 'Login failed. Please verify credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full min-h-screen bg-bg-page flex items-center justify-center p-6 select-none">
      <div className="w-full max-w-md bg-surface border border-border p-8 sm:p-10 rounded-3xl shadow-xl flex flex-col gap-6">
        
        {/* Brand header */}
        <div className="text-center">
          <div className="w-12 h-12 rounded-2xl bg-accent text-white flex items-center justify-center font-display font-extrabold text-2xl mx-auto mb-4">S</div>
          <h1 className="text-2xl font-bold font-display text-primary tracking-tight">Admin Dashboard</h1>
          <p className="text-xs text-muted font-medium mt-1">
            SkillCite secure administrative intake portal
          </p>
        </div>

        {error && (
          <div className="p-3.5 rounded-xl border border-red-200 bg-red-50 text-xs text-red-500 font-semibold">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          
          {/* Email */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-primary/80 uppercase tracking-wide">
              Email Address
            </label>
            <div className="relative w-full">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-hint pointer-events-none" />
              <input
                type="email"
                placeholder="admin@skillcite.com"
                required
                className={`w-full pl-10 pr-4 py-3 rounded-xl border text-sm text-primary bg-surface outline-none transition-all
                  ${errors.email ? 'border-red-500 focus:ring-red-100' : 'border-border focus:ring-accent-light focus:border-accent'}`}
                {...register('email')}
              />
            </div>
            {errors.email && <span className="text-xs text-red-500 ml-1">{errors.email.message}</span>}
          </div>

          {/* Password */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-primary/80 uppercase tracking-wide">
              Password
            </label>
            <div className="relative w-full">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-hint pointer-events-none" />
              <input
                type="password"
                placeholder="••••••••"
                required
                className={`w-full pl-10 pr-4 py-3 rounded-xl border text-sm text-primary bg-surface outline-none transition-all
                  ${errors.password ? 'border-red-500 focus:ring-red-100' : 'border-border focus:ring-accent-light focus:border-accent'}`}
                {...register('password')}
              />
            </div>
            {errors.password && <span className="text-xs text-red-500 ml-1">{errors.password.message}</span>}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 rounded-xl bg-accent hover:bg-blue-700 active:scale-[0.98] transition-all text-white text-sm font-semibold flex items-center justify-center gap-2 mt-2 disabled:opacity-50 disabled:pointer-events-none"
          >
            <LogIn className="w-4 h-4" />
            {loading ? 'Logging in...' : 'Sign In to Cite'}
          </button>

        </form>

      </div>
    </div>
  );
}

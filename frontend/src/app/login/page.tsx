'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { authApi } from '@/lib/api';
import { useAuthStore } from '@/lib/store';
import { Newspaper, AlertCircle } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const setAuth = useAuthStore((state) => state.setAuth);
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isLogin) {
        const response = await authApi.login({
          username: formData.username,
          password: formData.password,
        });
        setAuth({ id: 0, username: formData.username, email: '', created_at: '' }, response.access_token);
        router.push('/dashboard');
      } else {
        await authApi.register({
          username: formData.username,
          email: formData.email,
          password: formData.password,
        });
        const response = await authApi.login({
          username: formData.username,
          password: formData.password,
        });
        setAuth({ id: 0, username: formData.username, email: formData.email, created_at: '' }, response.access_token);
        router.push('/dashboard');
      }
    } catch (err: any) {
      setError(err.response?.data?.detail || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen" style={{ background: 'var(--apple-gray)' }}>
      <div className="w-full max-w-md px-4 md:px-6">
        <div className="apple-card p-6 md:p-8">
          {/* Logo/Icon */}
          <div className="flex justify-center mb-6">
            <div className="w-20 h-20 rounded-full flex items-center justify-center"
                 style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
              <Newspaper size={40} color="white" />
            </div>
          </div>

          <h1 className="text-2xl md:text-3xl font-semibold text-center mb-2" style={{ color: 'var(--apple-text)' }}>
            RSS Reader
          </h1>
          <p className="text-center mb-8" style={{ color: 'var(--apple-text-tertiary)', fontSize: '15px' }}>
            {isLogin ? 'Sign in to continue' : 'Create your account'}
          </p>

          {error && (
            <div className="mb-6 p-4" style={{
              background: 'rgba(255, 59, 48, 0.1)',
              border: '1px solid rgba(255, 59, 48, 0.2)',
              color: '#FF3B30',
              borderRadius: '12px'
            }}>
              <div className="flex items-center gap-2">
                <AlertCircle size={18} />
                <span style={{ fontSize: '14px' }}>{error}</span>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block mb-2 font-medium" style={{ color: 'var(--apple-text)', fontSize: '14px' }}>
                Username
              </label>
              <input
                type="text"
                value={formData.username}
                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                className="apple-input"
                placeholder="Enter your username"
                required
              />
            </div>

            {!isLogin && (
              <div>
                <label className="block mb-2 font-medium" style={{ color: 'var(--apple-text)', fontSize: '14px' }}>
                  Email
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="apple-input"
                  placeholder="Enter your email"
                  required
                />
              </div>
            )}

            <div>
              <label className="block mb-2 font-medium" style={{ color: 'var(--apple-text)', fontSize: '14px' }}>
                Password
              </label>
              <input
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="apple-input"
                placeholder="Enter your password"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="apple-button w-full mt-6"
            >
              {loading ? 'Loading...' : isLogin ? 'Sign In' : 'Create Account'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <button
              onClick={() => setIsLogin(!isLogin)}
              className="text-sm font-medium"
              style={{ color: 'var(--apple-blue)' }}
            >
              {isLogin ? "Don't have an account? Sign up" : 'Already have an account? Sign in'}
            </button>
          </div>
        </div>

        <p className="text-center mt-6" style={{ color: 'var(--apple-text-tertiary)', fontSize: '13px' }}>
          By continuing, you agree to our Terms of Service and Privacy Policy
        </p>
      </div>
    </div>
  );
}

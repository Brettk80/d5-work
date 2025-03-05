import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Package2, ArrowLeft } from 'lucide-react';
import LoginMethods from './LoginMethods';
import PasswordlessForm from './PasswordlessForm';
import MagicLinkForm from './MagicLinkForm';

const loginSchema = z.object({
  identifier: z.string().min(1, 'Required'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

const twoFactorSchema = z.object({
  code: z.string().length(6, 'Code must be 6 digits'),
});

const forgotPasswordSchema = z.object({
  identifier: z.string().min(1, 'Required'),
});

type LoginForm = z.infer<typeof loginSchema>;
type TwoFactorForm = z.infer<typeof twoFactorSchema>;
type ForgotPasswordForm = z.infer<typeof forgotPasswordSchema>;

interface LoginPageProps {
  onLogin: (userData: { name: string; email: string }) => void;
  mockUser: { name: string; email: string; has2FAEnabled: boolean };
}

const LoginPage: React.FC<LoginPageProps> = ({ onLogin, mockUser }) => {
  const [loginMethod, setLoginMethod] = useState<'account' | 'passwordless' | 'magic-link'>('account');
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [show2FA, setShow2FA] = useState(false);
  const [passwordlessLinkSent, setPasswordlessLinkSent] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);

  const { register: loginRegister, handleSubmit: handleLoginSubmit, formState: { errors: loginErrors } } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
  });

  const { register: twoFactorRegister, handleSubmit: handle2FASubmit, formState: { errors: twoFactorErrors } } = useForm<TwoFactorForm>({
    resolver: zodResolver(twoFactorSchema),
  });

  const { register: forgotPasswordRegister, handleSubmit: handleForgotSubmit, formState: { errors: forgotErrors } } = useForm<ForgotPasswordForm>({
    resolver: zodResolver(forgotPasswordSchema),
  });

  const onLoginSubmit = (data: LoginForm) => {
    setLoginError(null);
    // Simulate login validation
    if (data.identifier === mockUser.email) {
      if (mockUser.has2FAEnabled) {
        setShow2FA(true);
      } else {
        onLogin(mockUser);
      }
    } else {
      setLoginError('Invalid credentials');
    }
  };

  const on2FASubmit = (data: TwoFactorForm) => {
    // Simulate 2FA validation - in real app would verify against backend
    if (data.code === '123456') {
      onLogin(mockUser);
    } else {
      setLoginError('Invalid 2FA code');
    }
  };

  const onForgotPasswordSubmit = (data: ForgotPasswordForm) => {
    // Simulate password reset email
    alert(`Password reset link sent to ${data.identifier}`);
    setShowForgotPassword(false);
  };

  const handlePasswordlessSuccess = () => {
    setPasswordlessLinkSent(true);
  };

  const renderLoginForm = () => (
    <form onSubmit={handleLoginSubmit(onLoginSubmit)} className="space-y-6">
      {loginError && (
        <div className="rounded-md bg-red-50 p-4">
          <div className="flex">
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">
                {loginError}
              </h3>
            </div>
          </div>
        </div>
      )}

      <div>
        <label htmlFor="identifier" className="block text-sm font-medium text-gray-700">
          Email or Username
        </label>
        <div className="mt-1">
          <input
            {...loginRegister('identifier')}
            type="text"
            className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          />
          {loginErrors.identifier && (
            <p className="mt-1 text-sm text-red-600">{loginErrors.identifier.message}</p>
          )}
        </div>
      </div>

      <div>
        <label htmlFor="password" className="block text-sm font-medium text-gray-700">
          Password
        </label>
        <div className="mt-1">
          <input
            {...loginRegister('password')}
            type="password"
            className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          />
          {loginErrors.password && (
            <p className="mt-1 text-sm text-red-600">{loginErrors.password.message}</p>
          )}
        </div>
      </div>

      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={() => setShowForgotPassword(true)}
          className="text-sm font-medium text-blue-600 hover:text-blue-500"
        >
          Forgot password?
        </button>
      </div>

      <div>
        <button
          type="submit"
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          Sign in
        </button>
      </div>
    </form>
  );

  const render2FAForm = () => (
    <form onSubmit={handle2FASubmit(on2FASubmit)} className="space-y-6">
      {loginError && (
        <div className="rounded-md bg-red-50 p-4">
          <div className="flex">
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">
                {loginError}
              </h3>
            </div>
          </div>
        </div>
      )}

      <div>
        <label htmlFor="code" className="block text-sm font-medium text-gray-700">
          Enter 2FA Code
        </label>
        <p className="mt-1 text-sm text-gray-500">
          Enter the 6-digit code from your authenticator app
        </p>
        <div className="mt-1">
          <input
            {...twoFactorRegister('code')}
            type="text"
            maxLength={6}
            className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            placeholder="123456"
          />
          {twoFactorErrors.code && (
            <p className="mt-1 text-sm text-red-600">{twoFactorErrors.code.message}</p>
          )}
        </div>
      </div>

      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={() => setShow2FA(false)}
          className="text-sm font-medium text-gray-600 hover:text-gray-500"
        >
          ← Back to login
        </button>
        <button
          type="submit"
          className="flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          Verify Code
        </button>
      </div>
    </form>
  );

  const renderForgotPasswordForm = () => (
    <div className="space-y-6">
      <div className="flex items-center">
        <button
          type="button"
          onClick={() => setShowForgotPassword(false)}
          className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-gray-700"
        >
          <ArrowLeft className="h-5 w-5 mr-1" />
          Back to login
        </button>
      </div>

      <form onSubmit={handleForgotSubmit(onForgotPasswordSubmit)} className="space-y-6">
        <div>
          <label htmlFor="identifier" className="block text-sm font-medium text-gray-700">
            Email Address
          </label>
          <div className="mt-1">
            <input
              {...forgotPasswordRegister('identifier')}
              type="email"
              className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
            {forgotErrors.identifier && (
              <p className="mt-1 text-sm text-red-600">{forgotErrors.identifier.message}</p>
            )}
          </div>
        </div>

        <div>
          <button
            type="submit"
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Send Reset Link
          </button>
        </div>
      </form>
    </div>
  );

  return (
    <div className="min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8 bg-gray-50">
      <div className="max-w-md w-full space-y-8">
        <div>
          <div className="flex justify-center">
            <Package2 className="h-12 w-12 text-blue-600" />
          </div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Sign in to your account
          </h2>
        </div>

        <LoginMethods loginMethod={loginMethod} setLoginMethod={setLoginMethod} />

        {loginMethod === 'account' && !show2FA && !showForgotPassword && renderLoginForm()}
        {show2FA && render2FAForm()}
        {showForgotPassword && renderForgotPasswordForm()}
        {loginMethod === 'passwordless' && (
          <PasswordlessForm onSuccess={handlePasswordlessSuccess} />
        )}
        {loginMethod === 'magic-link' && (
          <MagicLinkForm onSuccess={handlePasswordlessSuccess} />
        )}

        {passwordlessLinkSent && (
          <div className="rounded-md bg-blue-50 p-4">
            <div className="flex">
              <div className="ml-3">
                <h3 className="text-sm font-medium text-blue-800">
                  Magic link sent!
                </h3>
                <div className="mt-2 text-sm text-blue-700">
                  <p>
                    Check your email for the login link. The link will expire in 10 minutes.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default LoginPage;

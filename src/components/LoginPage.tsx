import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Package2, ArrowLeft } from 'lucide-react';
import LoginMethods from './LoginMethods';
import PasswordlessForm from './PasswordlessForm';

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
  const [loginMethod, setLoginMethod] = useState<'account' | 'passwordless'>('account');
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [show2FA, setShow2FA] = useState(false);
  const [passwordlessLinkSent, setPasswordlessLinkSent] = useState(false);

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
    if (mockUser.has2FAEnabled) {
      setShow2FA(true);
    } else {
      onLogin(mockUser);
    }
  };

  const on2FASubmit = (data: TwoFactorForm) => {
    onLogin(mockUser);
  };

  const onForgotPasswordSubmit = (data: ForgotPasswordForm) => {
    alert(`Password reset link sent to ${data.identifier}`);
    setShowForgotPassword(false);
  };

  const handlePasswordlessSuccess = () => {
    setPasswordlessLinkSent(true);
  };

  const renderLoginForm = () => (
    <form onSubmit={handleLoginSubmit(onLoginSubmit)} className="space-y-6">
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
      <div>
        <label htmlFor="code" className="block text-sm font-medium text-gray-700">
          2FA Code
        </label>
        <div className="mt-1">
          <input
            {...twoFactorRegister('code')}
            type="text"
            className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          />
          {twoFactorErrors.code && (
            <p className="mt-1 text-sm text-red-600">{twoFactorErrors.code.message}</p>
          )}
        </div>
      </div>

      <div>
        <button
          type="submit"
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          Verify
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
            Email or Username
          </label>
          <div className="mt-1">
            <input
              {...forgotPasswordRegister('identifier')}
              type="text"
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
            Reset Password
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

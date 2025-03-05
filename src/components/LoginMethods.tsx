import React from 'react';
import { User, LogIn, Mail } from 'lucide-react';

interface LoginMethodsProps {
  loginMethod: 'account' | 'passwordless' | 'magic-link';
  setLoginMethod: (method: 'account' | 'passwordless' | 'magic-link') => void;
}

const LoginMethods: React.FC<LoginMethodsProps> = ({ loginMethod, setLoginMethod }) => {
  return (
    <div className="flex justify-center space-x-4 mb-8">
      <button
        onClick={() => setLoginMethod('account')}
        className={`flex items-center px-4 py-2 rounded-md ${
          loginMethod === 'account'
            ? 'bg-blue-50 text-blue-700'
            : 'text-gray-500 hover:text-gray-700'
        }`}
      >
        <User className="h-5 w-5 mr-2" />
        Account
      </button>
      <button
        onClick={() => setLoginMethod('passwordless')}
        className={`flex items-center px-4 py-2 rounded-md ${
          loginMethod === 'passwordless'
            ? 'bg-blue-50 text-blue-700'
            : 'text-gray-500 hover:text-gray-700'
        }`}
      >
        <LogIn className="h-5 w-5 mr-2" />
        Passwordless
      </button>
      <button
        onClick={() => setLoginMethod('magic-link')}
        className={`flex items-center px-4 py-2 rounded-md ${
          loginMethod === 'magic-link'
            ? 'bg-blue-50 text-blue-700'
            : 'text-gray-500 hover:text-gray-700'
        }`}
      >
        <Mail className="h-5 w-5 mr-2" />
        Magic Link
      </button>
    </div>
  );
};

export default LoginMethods;

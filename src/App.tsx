import React, { useState } from 'react';
import LoginPage from './components/LoginPage';

// Mock user data for testing
const mockUser = {
  name: 'Test User',
  email: 'test@example.com',
  has2FAEnabled: false
};

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userData, setUserData] = useState<{ name: string; email: string } | null>(null);

  const handleLogin = (userData: { name: string; email: string }) => {
    setIsLoggedIn(true);
    setUserData(userData);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {!isLoggedIn ? (
        <LoginPage 
          onLogin={handleLogin}
          mockUser={mockUser}
        />
      ) : (
        <div className="p-4">
          <h1>Welcome, {userData?.name}!</h1>
          <button
            onClick={() => setIsLoggedIn(false)}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Logout
          </button>
        </div>
      )}
    </div>
  );
}

export default App;

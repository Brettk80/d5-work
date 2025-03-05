import React from 'react';
import Dashboard from './components/Dashboard';

const mockUser = {
  name: 'Test User',
  email: 'test@example.com'
};

function App() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Dashboard user={mockUser} />
    </div>
  );
}

export default App;

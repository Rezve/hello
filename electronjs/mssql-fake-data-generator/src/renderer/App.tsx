import React, { useState } from 'react';
import './styles/App.css';
import HomePage from './pages/HomePage';
import { NotificationProvider } from './components/notification/NotificationContext';

const App: React.FC = () => {
  return (
    <NotificationProvider>
      <div>
        <HomePage />
      </div>
    </NotificationProvider>

  );
};

export default App;
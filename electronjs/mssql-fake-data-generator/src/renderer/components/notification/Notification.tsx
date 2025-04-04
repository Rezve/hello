import React, { createContext, useContext, useState, ReactNode } from 'react';
import './Notification.css';

// Define notification types
export type NotificationType = 'success' | 'warning' | 'error';

// Ensure Notification interface is correctly defined
export interface Notification {
  id: number;
  message: string;
  type: NotificationType;
}

export interface NotificationContextType {
  addNotification: (message: string, type?: NotificationType) => void;
  removeNotification: (id: number) => void;
}

export const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

// Notification Component
interface NotificationProps {
  message: string;
  type: NotificationType;
  onClose: () => void;
}

export const Notification: React.FC<NotificationProps> = ({ message, type, onClose }) => {
  console.log('Rendering Notification:', { message, type });
  const getTypeStyles = (): string => {
    switch (type) {
      case 'success':
        return 'bg-green-100 border-green-500 text-green-700';
      case 'warning':
        return 'bg-yellow-100 border-yellow-500 text-yellow-700';
      case 'error':
        return 'bg-red-100 border-red-500 text-red-700';
      default:
        return 'bg-gray-100 border-gray-500 text-gray-700';
    }
  };

  return (
    <div className={`notification ${getTypeStyles()} border-l-4 p-4 mb-4 rounded shadow-md flex justify-between items-center`}>
      <span>{message}</span>
      <button 
        onClick={onClose}
        className="ml-4 text-sm font-medium hover:text-gray-900 focus:outline-none"
      >
        ×
      </button>
    </div>
  );
};
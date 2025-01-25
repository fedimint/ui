import React, { createContext, useContext, useCallback } from 'react';
import { useToast, UseToastOptions } from '@chakra-ui/react';

interface NotificationContextType {
  showSuccess: (message: string, options?: UseToastOptions) => void;
  showError: (message: string, options?: UseToastOptions) => void;
  showWarning: (message: string, options?: UseToastOptions) => void;
  showInfo: (message: string, options?: UseToastOptions) => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(
  undefined
);

export const NotificationProvider: React.FC<React.PropsWithChildren> = ({
  children,
}) => {
  const toast = useToast();

  const showNotification = useCallback(
    (
      message: string,
      status: UseToastOptions['status'],
      options?: UseToastOptions
    ) => {
      toast({
        description: message,
        status,
        duration: 5000,
        isClosable: true,
        position: 'top-right',
        ...options,
      });
    },
    [toast]
  );

  const showSuccess = useCallback(
    (message: string, options?: UseToastOptions) =>
      showNotification(message, 'success', options),
    [showNotification]
  );

  const showError = useCallback(
    (message: string, options?: UseToastOptions) =>
      showNotification(message, 'error', options),
    [showNotification]
  );

  const showWarning = useCallback(
    (message: string, options?: UseToastOptions) =>
      showNotification(message, 'warning', options),
    [showNotification]
  );

  const showInfo = useCallback(
    (message: string, options?: UseToastOptions) =>
      showNotification(message, 'info', options),
    [showNotification]
  );

  return (
    <NotificationContext.Provider
      value={{ showSuccess, showError, showWarning, showInfo }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error(
      'useNotification must be used within a NotificationProvider'
    );
  }
  return context;
};

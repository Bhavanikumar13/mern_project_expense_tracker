import { createContext, useContext, useEffect, useState } from 'react';

const TransactionContext = createContext();

export const useTransaction = () => {
  const context = useContext(TransactionContext);
  if (!context) {
    throw new Error('useTransaction must be used within TransactionProvider');
  }
  return context;
};

export const TransactionProvider = ({ children }) => {
  const [transactionUpdate, setTransactionUpdate] = useState(0);

  const triggerUpdate = () => {
    setTransactionUpdate(prev => prev + 1);
  };

  const value = {
    transactionUpdate,
    triggerUpdate
  };

  return (
    <TransactionContext.Provider value={value}>
      {children}
    </TransactionContext.Provider>
  );
};
// src/utils/errorLogger.js
export const logError = (context, error) => {
    console.group(`Error in ${context}`);
    console.error('Error message:', error.message);
    console.error('Error object:', error);
    console.error('Stack trace:', error.stack);
    console.groupEnd();
  };
//store.js
// Import configureStore from Redux Toolkit
import { configureStore } from '@reduxjs/toolkit';
// Import the user reducer
import userReducer from './userSlice';

// Create and configure the Redux store
export const store = configureStore({
  reducer: {
    // Add the user reducer to the store
    users: userReducer,
  },
});

// Export the configured store
export default store;
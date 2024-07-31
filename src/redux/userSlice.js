//userSlice.js
// Import necessary functions from Redux Toolkit and axios for API calls
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Create an asynchronous thunk for fetching users
export const fetchUsers = createAsyncThunk('users/fetchUsers', async () => {
  // Make a GET request to the API
  const response = await axios.get('https://dummyjson.com/users?limit=100');
  // Return the users data from the response
  return response.data.users;
});

// Create a slice for managing user state
const userSlice = createSlice({
  name: 'users',
  initialState: {
    allUsers: [],        // Store all fetched users
    filteredUsers: [],   // Store users after applying filters
    users: [],           // Store users for current page
    status: 'idle',      // API call status
    error: null,         // Store any error messages
    sortBy: null,        // Current sort column
    order: 'asc',        // Sort order (ascending or descending)
    gender: '',          // Gender filter
    country: '',         // Country filter
    total: 0,            // Total number of users
    pageSize: 10,        // Number of users per page
    currentPage: 0,      // Current page number
  },
  reducers: {
    // Set the column to sort by
    setSortBy: (state, action) => {
      state.sortBy = action.payload;
    },
    // Set the sort order
    setOrder: (state, action) => {
      state.order = action.payload;
    },
    // Set the gender filter
    setGenderFilter: (state, action) => {
      state.gender = action.payload;
    },
    // Set the country filter
    setCountryFilter: (state, action) => {
      state.country = action.payload;
    },
    // Reset users (used when applying new filters)
    resetUsers: (state) => {
      state.users = [];
      state.status = 'idle';
    },
    // Set the current page
    setCurrentPage: (state, action) => {
      state.currentPage = action.payload;
    },
    // Apply filters and sorting to users
    filterAndSortUsers: (state) => {
      let filteredUsers = [...state.allUsers];

      // Apply gender filter
      if (state.gender) {
        filteredUsers = filteredUsers.filter(user => user.gender === state.gender);
      }

      // Apply country filter
      if (state.country) {
        filteredUsers = filteredUsers.filter(user => user.address.country === state.country);
      }

      // Apply sorting
      if (state.sortBy) {
        filteredUsers.sort((a, b) => {
          if (state.order === 'asc') {
            return a[state.sortBy] > b[state.sortBy] ? 1 : -1;
          } else {
            return a[state.sortBy] < b[state.sortBy] ? 1 : -1;
          }
        });
      }

      // Update state
      state.total = filteredUsers.length;
      state.filteredUsers = filteredUsers;
      // Get users for current page
      state.users = filteredUsers.slice(state.currentPage * state.pageSize, (state.currentPage + 1) * state.pageSize);
    }
  },
  // Handle async action state changes
  extraReducers: (builder) => {
    builder
      .addCase(fetchUsers.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.allUsers = action.payload;
        state.total = action.payload.length;
        state.filteredUsers = action.payload;
        state.users = action.payload.slice(0, state.pageSize);
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });
  },
});

// Export action creators
export const { 
  setSortBy, 
  setOrder, 
  setGenderFilter, 
  setCountryFilter, 
  resetUsers, 
  setCurrentPage, 
  filterAndSortUsers 
} = userSlice.actions;

// Export the reducer
export default userSlice.reducer;
//UserList.js
// Import necessary dependencies and components
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { 
  fetchUsers, 
  setSortBy, 
  setOrder, 
  setGenderFilter, 
  setCountryFilter, 
  resetUsers, 
  setCurrentPage, 
  filterAndSortUsers 
} from '../redux/userSlice';
import './UserList.css';

const UserList = () => {
  // Initialize dispatch function for Redux actions
  const dispatch = useDispatch();

  // Select relevant state from the Redux store
  const { 
    users, 
    status, 
    sortBy, 
    order, 
    gender, 
    country, 
    total, 
    pageSize, 
    currentPage 
  } = useSelector((state) => state.users);

  // Local state to manage visibility of sorting options
  const [showSortingOptions, setShowSortingOptions] = useState(false);

  // Effect to fetch users when component mounts
  useEffect(() => {
    dispatch(fetchUsers());
  }, [dispatch]);

  // Effect to filter and sort users when relevant state changes
  useEffect(() => {
    dispatch(filterAndSortUsers());
  }, [dispatch, sortBy, order, gender, country, currentPage]);

  // Handler for sorting columns
  const handleSort = (column) => {
    dispatch(setSortBy(column));
    dispatch(setOrder(order === 'asc' ? 'desc' : 'asc'));
    dispatch(resetUsers());
    dispatch(setCurrentPage(0));
  };

  // Handler for filter changes (gender and country)
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    if (name === 'gender') {
      dispatch(setGenderFilter(value));
    } else if (name === 'country') {
      dispatch(setCountryFilter(value));
    }
    dispatch(resetUsers());
    dispatch(setCurrentPage(0));
  };

  // Handler for navigating to the next page
  const handleNextPage = () => {
    dispatch(setCurrentPage(currentPage + 1));
  };

  // Handler for navigating to the previous page
  const handlePreviousPage = () => {
    if (currentPage > 0) {
      dispatch(setCurrentPage(currentPage - 1));
    }
  };

  // Toggle visibility of sorting options
  const toggleSortingOptions = () => {
    setShowSortingOptions(!showSortingOptions);
  };

  // Apply selected sorting option
  const applySortingOption = (option) => {
    handleSort(option);
    setShowSortingOptions(false);
  };

  // Helper function to get the appropriate sort icon
  const getSortIcon = (column) => {
    if (sortBy === column) {
      return order === 'asc' ? '↑' : '↓';
    }
    return '';
  };

  // Render the component
  return (
    <div className="user-list-container">
      <h1>Employees Directory</h1>

      {/* Filters and Sorting Section */}
      <div className="filters-and-sorting">
        {/* Gender and Country Filters */}
        <div className="filters">
          <label>
            Gender:
            <select name="gender" onChange={handleFilterChange} value={gender}>
              <option value="">All</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
            </select>
          </label>
          <label>
            Country:
            <select name="country" onChange={handleFilterChange} value={country}>
              <option value="">All</option>
              {/* Add more country options here */}
            </select>
          </label>
        </div>

        {/* Sorting Options */}
        <div className="sorting">
          <button onClick={toggleSortingOptions}>Sort</button>
          {showSortingOptions && (
            <div className="sorting-options">
              <button onClick={() => applySortingOption('age')}>Sort by Age</button>
              <button onClick={() => applySortingOption('id')}>Sort by ID</button>
              <button onClick={() => applySortingOption('firstName')}>Sort by Name</button>
            </div>
          )}
        </div>
      </div>

      {/* User List Table */}
      <div className="user-list-box">
        <table>
          <thead>
            <tr>
              <th onClick={() => handleSort('id')}>ID {getSortIcon('id')}</th>
              <th onClick={() => handleSort('firstName')}>Full Name {getSortIcon('firstName')}</th>
              <th onClick={() => handleSort('age')}>Demography {getSortIcon('age')}</th>
              <th>Designation</th>
              <th>Location</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user, index) => (
              <tr key={user.id}>
                <td>{currentPage * pageSize + index + 1}</td>
                <td>{user.firstName} {user.lastName}</td>
                <td>{`${user.gender} / ${user.age}`}</td>
                <td>{user.company.title}</td>
                <td>{`${user.address.city}, ${user.address.state}, ${user.address.country}`}</td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Loading Indicator */}
        {status === 'loading' && (
          <div className="loading">
            <div className="loading-spinner"></div>
          </div>
        )}

        {/* Pagination Controls */}
        <div className="pagination-controls">
          {currentPage > 0 && (
            <button onClick={handlePreviousPage}>Previous Page</button>
          )}
          <span className="page-info">
            Page {currentPage + 1} of {Math.ceil(total / pageSize)}
          </span>
          {total > (currentPage + 1) * pageSize && (
            <button onClick={handleNextPage}>Next Page</button>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserList;
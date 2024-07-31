// PaginationControls component for handling pagination
const PaginationControls = ({ page, setPage, total, pageSize }) => {
  // Calculate the total number of pages
  const totalPages = Math.ceil(total / pageSize);

  return (
    <div className="pagination-controls">
      {/* Generate an array of page numbers and map over it to create buttons */}
      {Array.from({ length: totalPages }, (_, index) => (
        <button 
          key={index} 
          // Disable the button for the current page
          disabled={page === index} 
          // Set the page when a button is clicked
          onClick={() => setPage(index)}
        >
          {/* Display page number (add 1 because index is zero-based) */}
          {index + 1}
        </button>
      ))}
    </div>
  );
};

// Export the component
export default PaginationControls;
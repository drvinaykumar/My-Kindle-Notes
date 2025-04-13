// Search functionality for Kindle Notes Website
document.addEventListener('DOMContentLoaded', function() {
    // Search functionality is integrated in main.js
    // This file provides additional search features and utilities

    // Advanced search features
    const searchInput = document.getElementById('search-input');
    
    // Add clear search button functionality
    function addClearSearchButton() {
        const searchContainer = document.querySelector('.search-container');
        
        // Create clear button
        const clearButton = document.createElement('button');
        clearButton.className = 'clear-search';
        clearButton.innerHTML = '&times;';
        clearButton.style.display = 'none';
        clearButton.style.position = 'absolute';
        clearButton.style.right = '10px';
        clearButton.style.top = '50%';
        clearButton.style.transform = 'translateY(-50%)';
        clearButton.style.background = 'none';
        clearButton.style.border = 'none';
        clearButton.style.fontSize = '1.2rem';
        clearButton.style.cursor = 'pointer';
        clearButton.style.color = '#666';
        
        // Position the search container relatively
        searchContainer.style.position = 'relative';
        
        // Add clear button to search container
        searchContainer.appendChild(clearButton);
        
        // Show/hide clear button based on search input
        searchInput.addEventListener('input', function() {
            clearButton.style.display = this.value ? 'block' : 'none';
        });
        
        // Clear search when button is clicked
        clearButton.addEventListener('click', function() {
            searchInput.value = '';
            searchInput.dispatchEvent(new Event('input'));
            this.style.display = 'none';
            searchInput.focus();
        });
    }
    
    // Initialize search enhancements
    function initSearchEnhancements() {
        addClearSearchButton();
    }
    
    // Call initialization
    initSearchEnhancements();
});

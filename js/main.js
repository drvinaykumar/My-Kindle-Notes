// Update main.js to load notes data from notes-data.js
document.addEventListener('DOMContentLoaded', function() {
    // Global variables
    const cardGrid = document.getElementById('card-grid');
    const searchInput = document.getElementById('search-input');
    const sortSelect = document.getElementById('sort-select');
    const alphabetFilter = document.querySelector('.alphabet-filter');
    const loadingIndicator = document.getElementById('loading');
    const noResultsMessage = document.getElementById('no-results');
    const paginationContainer = document.getElementById('pagination');
    const backToTopButton = document.getElementById('back-to-top');
    
    // Pagination settings
    const itemsPerPage = 24;
    let currentPage = 1;
    let filteredNotes = [];
    let allNotes = [];
    
    // Initialize the application
    init();
    
    // Initialize the application
    async function init() {
        showLoading(true);
        
        try {
            // Use the notes data from notes-data.js
            allNotes = notesData;
            
            // Initialize the filtered notes with all notes
            filteredNotes = [...allNotes];
            
            // Generate alphabet filter buttons
            generateAlphabetFilter();
            
            // Sort notes by default (A-Z)
            sortNotes('title-asc');
            
            // Display the first page of notes
            displayNotes();
            
            // Set up event listeners
            setupEventListeners();
            
        } catch (error) {
            console.error('Error initializing application:', error);
            noResultsMessage.textContent = 'Error loading notes. Please try again later.';
            showNoResults(true);
        } finally {
            showLoading(false);
        }
    }
    
    // Generate alphabet filter buttons
    function generateAlphabetFilter() {
        const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
        
        letters.forEach(letter => {
            const button = document.createElement('button');
            button.textContent = letter;
            button.setAttribute('data-letter', letter);
            
            // Check if there are any notes starting with this letter
            const hasNotes = allNotes.some(note => {
                const firstChar = note.title.charAt(0).toUpperCase();
                return firstChar === letter;
            });
            
            if (!hasNotes) {
                button.disabled = true;
            }
            
            alphabetFilter.appendChild(button);
        });
    }
    
    // Set up event listeners
    function setupEventListeners() {
        // Search input event listener
        searchInput.addEventListener('input', debounce(function() {
            filterNotes();
        }, 300));
        
        // Sort select event listener
        sortSelect.addEventListener('change', function() {
            sortNotes(this.value);
            displayNotes();
        });
        
        // Alphabet filter event listener
        alphabetFilter.addEventListener('click', function(e) {
            if (e.target.tagName === 'BUTTON') {
                // Remove active class from all buttons
                document.querySelectorAll('.alphabet-filter button').forEach(btn => {
                    btn.classList.remove('active');
                });
                
                // Add active class to clicked button
                e.target.classList.add('active');
                
                // Filter notes by selected letter
                const letter = e.target.getAttribute('data-letter');
                filterByLetter(letter);
            }
        });
        
        // Back to top button event listener
        backToTopButton.addEventListener('click', function() {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
        
        // Window scroll event listener for back to top button
        window.addEventListener('scroll', function() {
            if (window.pageYOffset > 300) {
                backToTopButton.classList.add('visible');
            } else {
                backToTopButton.classList.remove('visible');
            }
        });
    }
    
    // Filter notes by search term
    function filterNotes() {
        const searchTerm = searchInput.value.toLowerCase().trim();
        
        if (searchTerm === '') {
            // If search term is empty, reset to all notes
            filteredNotes = [...allNotes];
        } else {
            // Filter notes by search term
            filteredNotes = allNotes.filter(note => {
                return note.title.toLowerCase().includes(searchTerm);
            });
        }
        
        // Reset to first page
        currentPage = 1;
        
        // Display filtered notes
        displayNotes();
        
        // Reset alphabet filter if search is used
        if (searchTerm !== '') {
            document.querySelectorAll('.alphabet-filter button').forEach(btn => {
                btn.classList.remove('active');
            });
            document.querySelector('.alphabet-filter button.all').classList.add('active');
        }
    }
    
    // Filter notes by letter
    function filterByLetter(letter) {
        if (letter === 'all') {
            // If 'All' is selected, show all notes
            filteredNotes = [...allNotes];
        } else {
            // Filter notes by starting letter
            filteredNotes = allNotes.filter(note => {
                const firstChar = note.title.charAt(0).toUpperCase();
                return firstChar === letter;
            });
        }
        
        // Reset search input
        searchInput.value = '';
        
        // Reset to first page
        currentPage = 1;
        
        // Display filtered notes
        displayNotes();
    }
    
    // Sort notes by specified criteria
    function sortNotes(criteria) {
        switch (criteria) {
            case 'title-asc':
                filteredNotes.sort((a, b) => a.title.localeCompare(b.title));
                break;
            case 'title-desc':
                filteredNotes.sort((a, b) => b.title.localeCompare(a.title));
                break;
            default:
                filteredNotes.sort((a, b) => a.title.localeCompare(b.title));
        }
    }
    
    // Display notes with pagination
    function displayNotes() {
        // Clear the card grid
        cardGrid.innerHTML = '';
        
        // Check if there are any notes to display
        if (filteredNotes.length === 0) {
            showNoResults(true);
            return;
        } else {
            showNoResults(false);
        }
        
        // Calculate pagination
        const totalPages = Math.ceil(filteredNotes.length / itemsPerPage);
        const startIndex = (currentPage - 1) * itemsPerPage;
        const endIndex = Math.min(startIndex + itemsPerPage, filteredNotes.length);
        
        // Display notes for current page
        for (let i = startIndex; i < endIndex; i++) {
            const note = filteredNotes[i];
            const card = createNoteCard(note);
            cardGrid.appendChild(card);
        }
        
        // Update pagination
        updatePagination(totalPages);
    }
    
    // Create a note card element
    function createNoteCard(note) {
        const card = document.createElement('div');
        card.className = 'card';
        
        const cardContent = document.createElement('div');
        cardContent.className = 'card-content';
        
        const cardTitle = document.createElement('h2');
        cardTitle.className = 'card-title';
        cardTitle.textContent = note.title;
        
        const cardFooter = document.createElement('div');
        cardFooter.className = 'card-footer';
        
        const viewButton = document.createElement('a');
        viewButton.className = 'view-button';
        viewButton.href = `notes/${note.filename}.html`;
        viewButton.textContent = 'View Notes';
        
        cardContent.appendChild(cardTitle);
        cardFooter.appendChild(viewButton);
        
        card.appendChild(cardContent);
        card.appendChild(cardFooter);
        
        return card;
    }
    
    // Update pagination controls
    function updatePagination(totalPages) {
        paginationContainer.innerHTML = '';
        
        if (totalPages <= 1) {
            return;
        }
        
        // Previous button
        const prevButton = document.createElement('button');
        prevButton.textContent = 'Previous';
        prevButton.disabled = currentPage === 1;
        prevButton.addEventListener('click', () => {
            if (currentPage > 1) {
                currentPage--;
                displayNotes();
                window.scrollTo(0, 0);
            }
        });
        
        // Next button
        const nextButton = document.createElement('button');
        nextButton.textContent = 'Next';
        nextButton.disabled = currentPage === totalPages;
        nextButton.addEventListener('click', () => {
            if (currentPage < totalPages) {
                currentPage++;
                displayNotes();
                window.scrollTo(0, 0);
            }
        });
        
        // Page indicator
        const pageIndicator = document.createElement('span');
        pageIndicator.textContent = `Page ${currentPage} of ${totalPages}`;
        pageIndicator.style.margin = '0 10px';
        
        paginationContainer.appendChild(prevButton);
        paginationContainer.appendChild(pageIndicator);
        paginationContainer.appendChild(nextButton);
    }
    
    // Show or hide loading indicator
    function showLoading(show) {
        loadingIndicator.classList.toggle('active', show);
    }
    
    // Show or hide no results message
    function showNoResults(show) {
        noResultsMessage.classList.toggle('active', show);
    }
    
    // Debounce function for search input
    function debounce(func, delay) {
        let timeout;
        return function() {
            const context = this;
            const args = arguments;
            clearTimeout(timeout);
            timeout = setTimeout(() => func.apply(context, args), delay);
        };
    }
});

function searchContacts() {
    const searchTerm = document.getElementById('searchInput').value.trim().toLowerCase();
    const resultsDiv = document.getElementById('results');
    const loadingDiv = document.getElementById('loading');
    
    // Show loading indicator
    resultsDiv.innerHTML = '';
    loadingDiv.classList.remove('d-none');
    
    // Fetch data from the JSON endpoint
    fetch('https://amiel143.github.io/Act3_Books/books.json')
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            loadingDiv.classList.add('d-none');
            
            if (!searchTerm) {
                resultsDiv.innerHTML = `
                    <div class="no-results">
                        <i class="fas fa-info-circle"></i>
                        <h5>Please enter a Books</h5>
                    </div>
                `;
                return;
            }
            
            // Convert single contact object to array for consistent processing
            const books = Array.isArray(data) ? data : [data];
            
            const filteredBooks = books.filter(books => 
                books.title.author.genre.available.toLowerCase().includes(searchTerm)
            );
            
            displayResults(filteredBooks);
        })
        .catch(error => {
            loadingDiv.classList.add('d-none');
            resultsDiv.innerHTML = `
                <div class="no-results">
                    <i class="fas fa-exclamation-triangle text-danger"></i>
                    <h5>Error loading books</h5>
                    <p class="text-muted">${error.message}</p>
                </div>
            `;
            console.error('Error fetching data:', error);
        });
}

function displayResults(books) {
    const resultsDiv = document.getElementById('results');
    
    if (books.length === 0) {
        resultsDiv.innerHTML = `
            <div class="no-results">
                <i class="fas fa-user-slash"></i>
                <h5>No book found</h5>
                <p class="text-muted">Try a different search term</p>
            </div>
        `;
        return;
    }
    
    let html = `
        <table class="table contact-table table-hover">
            <thead>
                <tr>
                    <th>Title</th>
                    <th>Author</th>
                    <th>Genre</th>
                    <th>Status</th>
                </tr>
            </thead>
            <tbody>
    `;
    
    books.forEach(books => {
        const statusText = books.available 
        ? `<span class="text-success">Available</span>` 
        : `<span class="text-danger">Checked Out</span>`;
        html += `
            <tr>
                <td>
                    <strong>${books.title || 'N/A'}</strong>
                </td>
                <td>
                    ${books.author ? `<div>${books.author}</div>` : ''}

                </td>
                <td>
                ${books.genre ? `<div>${books.genre}</div>` : ''}
                </td>
                <td>
                ${statusText}
                </td>
            </tr>
        `;
    });
    
    html += `
            </tbody>
        </table>
    `;
    
    resultsDiv.innerHTML = html;
}

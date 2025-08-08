document.addEventListener('DOMContentLoaded', function() {
            // Add hover effect to category buttons
            const categoryBtns = document.querySelectorAll('.category-btn');
            categoryBtns.forEach(btn => {
                btn.addEventListener('mouseenter', function() {
                    this.style.transform = 'translateY(-5px)';
                    this.style.boxShadow = '0 8px 15px rgba(42, 82, 152, 0.35)';
                });
                
                btn.addEventListener('mouseleave', function() {
                    this.style.transform = 'translateY(0)';
                    this.style.boxShadow = '0 4px 8px rgba(42, 82, 152, 0.2)';
                });
            });
            
            // Add click effect to buy buttons
            const buyBtns = document.querySelectorAll('.buy-btn');
            buyBtns.forEach(btn => {
                btn.addEventListener('click', function() {
                    const productName = this.closest('.product-card').querySelector('.product-name').textContent;
                    
                    // Temporarily change the text to indicate processing
                    const originalText = this.textContent;
                    this.textContent = 'Loading...';
                    this.disabled = true;
                    
                    setTimeout(() => {
                        this.textContent = 'Completed!';
                        this.style.background = 'linear-gradient(to right, #27ae60, #2ecc71)';
                        
                        setTimeout(() => {
                            this.textContent = originalText;
                            this.disabled = false;
                            this.style.background = 'linear-gradient(to right, #e74c3c, #c0392b)';
                            
                            // Confirmation message
                            alert(`Added ${productName} to the shopping cart!`);
                        }, 1500);
                    }, 1000);
                });
            });
            
            // Auto search function
            const searchInput = document.querySelector('#searchInput');
            
            const productCards = document.querySelectorAll('.product-card');
            const noResults = document.querySelector('.no-results');
            const categoryButtons = document.querySelectorAll('.category-btn');
            const resultsInfo = document.getElementById('resultsInfo');
            const resultsCount = document.getElementById('resultsCount');
            const totalProducts = document.getElementById('totalProducts');
            const productsContainer = document.getElementById('productsContainer');
            const categoryNotification = document.getElementById('categoryNotification');
            const currentCategoryText = document.getElementById('currentCategoryText');
            
            let currentCategory = "All";
            totalProducts.textContent = productCards.length;
            
            // Enable search on typing
            searchInput.addEventListener('input', function() {
                performSearch(this.value.trim());
            });
            
            // Enable search on search button click
            
            
            // Enable search when pressing Enter
            searchInput.addEventListener('keypress', function(e) {
                if(e.key === 'Enter') {
                    performSearch(this.value.trim());
                }
            });
            
            // Main search function
            function performSearch(searchTerm) {
                const lowerTerm = searchTerm.toLowerCase();
                let foundResults = 0;
                let totalVisible = 0;
                
                // Show all products if search is empty
                if(searchTerm === '') {
                    productCards.forEach(card => {
                        if(currentCategory.toLowerCase() === 'all' || card.dataset.category.toLowerCase() === currentCategory.toLowerCase()) {
                            card.style.display = 'flex';
                            foundResults++;
                            totalVisible++;
                        } else {
                            card.style.display = 'none';
                        }
                    });
                } else {
                    // Search within products
                    productCards.forEach(card => {
                        const name = card.dataset.name.toLowerCase();
                        const category = card.dataset.category.toLowerCase();
                        const description = card.dataset.description.toLowerCase();
                        
                        const nameMatch = name.includes(lowerTerm);
                        const categoryMatch = category.includes(lowerTerm);
                        const descriptionMatch = description.includes(lowerTerm);
                        
                        const matchesSearch = nameMatch || categoryMatch || descriptionMatch;
                        const matchesCategory = currentCategory.toLowerCase() === 'all' || card.dataset.category.toLowerCase() === currentCategory.toLowerCase();
                        
                        if(matchesSearch && matchesCategory) {
                            card.style.display = 'flex';
                            foundResults++;
                            totalVisible++;
                            
                            // Highlight matching words in name and description
                            if(nameMatch) {
                                highlightText(card.querySelector('.product-name'), searchTerm);
                            }
                            
                            if(descriptionMatch) {
                                highlightText(card.querySelector('.product-description'), searchTerm);
                            }
                        } else {
                            card.style.display = 'none';
                        }
                    });
                }
                
                // Show 'no results' message if needed
                if(foundResults === 0) {
                    noResults.style.display = 'block';
                    resultsInfo.style.display = 'none';
                } else {
                    noResults.style.display = 'none';
                    resultsInfo.style.display = 'block';
                    resultsCount.textContent = foundResults;
                }
                
                // Display number of results
                resultsInfo.style.display = searchTerm !== '' || currentCategory !== 'All' ? 'block' : 'none';
            }
            
            // Text highlight function
            function highlightText(element, term) {
                const regex = new RegExp(term, 'gi');
                const originalText = element.getAttribute('data-original') || element.innerHTML;
                element.setAttribute('data-original', originalText);
                
                const highlightedText = originalText.replace(
                    regex, 
                    match => `<span class="search-highlight">${match}</span>`
                );
                
                element.innerHTML = highlightedText;
            }
            
            // Enable category selection
            categoryButtons.forEach(btn => {
                btn.addEventListener('click', function() {
                    // Remove active state from all buttons
                    categoryButtons.forEach(b => b.classList.remove('active-category'));
                    
                    // Add active state to current button
                    this.classList.add('active-category');
                    
                    // Update current category
                    currentCategory = this.dataset.category;
                    currentCategoryText.textContent = currentCategory;
                    
                    // Show notification
                    categoryNotification.style.opacity = '1';
                    setTimeout(() => {
                        categoryNotification.style.opacity = '0';
                    }, 2000);
                    
                    // Reset search
                    searchInput.value = '';
                    
                    // Perform search with new category
                    if(currentCategory.toLowerCase() === 'all') {
                        productCards.forEach(card => card.style.display = 'flex');
                    }
                    performSearch('');
                });
            });
            
            // Initial search to display all products
            performSearch('');
        });

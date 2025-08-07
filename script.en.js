document.addEventListener('DOMContentLoaded', function() {
            // إضافة تأثير عند تمرير الماوس على أزرار التصنيفات
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
            
            // إضافة تأثير عند الضغط على أزرار الشراء
            const buyBtns = document.querySelectorAll('.buy-btn');
            buyBtns.forEach(btn => {
                btn.addEventListener('click', function() {
                    const productName = this.closest('.product-card').querySelector('.product-name').textContent;
                    
                    // تغيير النص مؤقتًا للإشارة إلى العملية
                    const originalText = this.textContent;
                    this.textContent = 'جاري التحميل...';
                    this.disabled = true;
                    
                    setTimeout(() => {
                        this.textContent = 'تمت العملية!';
                        this.style.background = 'linear-gradient(to right, #27ae60, #2ecc71)';
                        
                        setTimeout(() => {
                            this.textContent = originalText;
                            this.disabled = false;
                            this.style.background = 'linear-gradient(to right, #e74c3c, #c0392b)';
                            
                            // رسالة تأكيد
                            alert(`تمت إضافة ${productName} إلى سلة التسوق!`);
                        }, 1500);
                    }, 1000);
                });
            });
            
            // وظيفة البحث التلقائي
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
            
            let currentCategory = "الكل";
            totalProducts.textContent = productCards.length;
            
            // تفعيل البحث عند الكتابة
            searchInput.addEventListener('input', function() {
                performSearch(this.value.trim());
            });
            
            // تفعيل البحث عند الضغط على زر البحث
            
            
            // تفعيل البحث عند الضغط على Enter
            searchInput.addEventListener('keypress', function(e) {
                if(e.key === 'Enter') {
                    performSearch(this.value.trim());
                }
            });
            
            // وظيفة البحث الرئيسية
            function performSearch(searchTerm) {
                const lowerTerm = searchTerm.toLowerCase();
                let foundResults = 0;
                let totalVisible = 0;
                
                // إظهار جميع المنتجات إذا كان البحث فارغاً
                if(searchTerm === '') {
                    productCards.forEach(card => {
                        if(currentCategory === "الكل" || card.dataset.category === currentCategory) {
                            card.style.display = 'flex';
                            foundResults++;
                            totalVisible++;
                        } else {
                            card.style.display = 'none';
                        }
                    });
                } else {
                    // البحث في المنتجات
                    productCards.forEach(card => {
                        const name = card.dataset.name.toLowerCase();
                        const category = card.dataset.category.toLowerCase();
                        const description = card.dataset.description.toLowerCase();
                        
                        const nameMatch = name.includes(lowerTerm);
                        const categoryMatch = category.includes(lowerTerm);
                        const descriptionMatch = description.includes(lowerTerm);
                        
                        const matchesSearch = nameMatch || categoryMatch || descriptionMatch;
                        const matchesCategory = currentCategory === "الكل" || card.dataset.category === currentCategory;
                        
                        if(matchesSearch && matchesCategory) {
                            card.style.display = 'flex';
                            foundResults++;
                            totalVisible++;
                            
                            // تمييز الكلمات المطابقة في الاسم والوصف
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
                
                // إظهار رسالة عدم وجود نتائج إذا لزم الأمر
                if(foundResults === 0) {
                    noResults.style.display = 'block';
                    resultsInfo.style.display = 'none';
                } else {
                    noResults.style.display = 'none';
                    resultsInfo.style.display = 'block';
                    resultsCount.textContent = foundResults;
                }
                
                // إظهار عدد النتائج
                resultsInfo.style.display = searchTerm !== '' || currentCategory !== 'الكل' ? 'block' : 'none';
            }
            
            // وظيفة تمييز النص
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
            
            // تفعيل التصنيفات
            categoryButtons.forEach(btn => {
                btn.addEventListener('click', function() {
                    // إزالة النشاط من جميع الأزرار
                    categoryButtons.forEach(b => b.classList.remove('active-category'));
                    
                    // إضافة النشاط للزر الحالي
                    this.classList.add('active-category');
                    
                    // تحديث التصنيف الحالي
                    currentCategory = this.dataset.category;
                    currentCategoryText.textContent = currentCategory;
                    
                    // إظهار الإشعار
                    categoryNotification.style.opacity = '1';
                    setTimeout(() => {
                        categoryNotification.style.opacity = '0';
                    }, 2000);
                    
                    // إعادة تعيين البحث
                    searchInput.value = '';
                    
                    // تنفيذ البحث مع التصنيف الجديد
                    performSearch('');
                });
            });
            
            // البحث الأولي لإظهار جميع المنتجات
            performSearch('');
        });
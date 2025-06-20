// Main JavaScript functionality
document.addEventListener('DOMContentLoaded', function() {
    // Debug function for mobile menu
    function debugMobileMenu() {
        console.log('Mobile menu debug info:');
        console.log('Window width:', window.innerWidth);
        console.log('Hamburger element:', document.querySelector('.hamburger'));
        console.log('Nav menu element:', document.querySelector('.nav-menu'));
        console.log('User agent:', navigator.userAgent);
    }

    // Call debug function (remove in production)
    if (window.innerWidth <= 768) {
        debugMobileMenu();
    }
    // Mobile menu toggle
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');

    // Create mobile menu overlay
    let mobileOverlay = document.querySelector('.mobile-menu-overlay');
    if (!mobileOverlay) {
        mobileOverlay = document.createElement('div');
        mobileOverlay.className = 'mobile-menu-overlay';
        document.body.appendChild(mobileOverlay);
    }

    if (hamburger && navMenu) {
        // Function to toggle menu
        function toggleMenu() {
            const isActive = hamburger.classList.contains('active');

            if (isActive) {
                closeMenu();
            } else {
                openMenu();
            }
        }

        // Function to open menu
        function openMenu() {
            hamburger.classList.add('active');
            navMenu.classList.add('active');
            mobileOverlay.classList.add('active');
            document.body.style.overflow = 'hidden';
        }

        // Function to close menu
        function closeMenu() {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
            mobileOverlay.classList.remove('active');
            document.body.style.overflow = '';
        }

        // Add multiple event listeners for better compatibility
        hamburger.addEventListener('click', toggleMenu);
        hamburger.addEventListener('touchstart', function(e) {
            e.preventDefault();
            toggleMenu();
        });

        // Close mobile menu when clicking on nav links
        const navLinks = navMenu.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.addEventListener('click', function() {
                if (window.innerWidth <= 768) {
                    closeMenu();
                }
            });

            // Add touch event for better mobile support
            link.addEventListener('touchend', function() {
                if (window.innerWidth <= 768) {
                    closeMenu();
                }
            });
        });

        // Close mobile menu when clicking outside
        document.addEventListener('click', function(event) {
            if (window.innerWidth <= 768) {
                const isClickInsideNav = navMenu.contains(event.target) || hamburger.contains(event.target);
                if (!isClickInsideNav && navMenu.classList.contains('active')) {
                    closeMenu();
                }
            }
        });

        // Add touch event for closing menu
        document.addEventListener('touchstart', function(event) {
            if (window.innerWidth <= 768) {
                const isClickInsideNav = navMenu.contains(event.target) || hamburger.contains(event.target);
                if (!isClickInsideNav && navMenu.classList.contains('active')) {
                    closeMenu();
                }
            }
        });

        // Close menu when clicking on overlay
        mobileOverlay.addEventListener('click', closeMenu);
        mobileOverlay.addEventListener('touchstart', closeMenu);

        // Close menu on window resize
        window.addEventListener('resize', function() {
            if (window.innerWidth > 768) {
                closeMenu();
            }
        });

        // Close menu on escape key
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && navMenu.classList.contains('active')) {
                closeMenu();
            }
        });
    }

    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Navbar scroll effect
    window.addEventListener('scroll', function() {
        const navbar = document.querySelector('.navbar');
        if (window.scrollY > 100) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // Form submission handling
    const applicationForm = document.getElementById('applicationForm');
    if (applicationForm) {
        applicationForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form data
            const formData = new FormData(this);
            const data = Object.fromEntries(formData);
            
            // Basic validation
            if (!data.firstName || !data.lastName || !data.email || !data.phone) {
                alert(translations[currentLanguage]['form-validation-error'] || '请填写所有必填字段');
                return;
            }
            
            // Email validation
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(data.email)) {
                alert(translations[currentLanguage]['form-email-error'] || '请输入有效的邮箱地址');
                return;
            }
            
            // Simulate form submission
            const submitBtn = this.querySelector('button[type="submit"]');
            const originalText = submitBtn.textContent;
            submitBtn.textContent = translations[currentLanguage]['form-submitting'] || '提交中...';
            submitBtn.disabled = true;
            
            setTimeout(() => {
                alert(translations[currentLanguage]['form-success'] || '申请提交成功！我们会尽快与您联系。');
                this.reset();
                submitBtn.textContent = originalText;
                submitBtn.disabled = false;
            }, 2000);
        });
    }

    // Counter animation for statistics
    function animateCounters() {
        const counters = document.querySelectorAll('.stat-number');
        const speed = 200;

        counters.forEach(counter => {
            const updateCount = () => {
                const target = parseInt(counter.getAttribute('data-target') || counter.textContent.replace(/[^\d]/g, ''));
                const count = parseInt(counter.textContent.replace(/[^\d]/g, '')) || 0;
                const inc = target / speed;

                if (count < target) {
                    const newCount = Math.ceil(count + inc);
                    const originalText = counter.textContent;
                    const suffix = originalText.replace(/[\d,]/g, '');
                    counter.textContent = newCount.toLocaleString() + suffix;
                    setTimeout(updateCount, 1);
                } else {
                    const originalText = counter.getAttribute('data-original') || counter.textContent;
                    counter.textContent = originalText;
                }
            };

            // Store original text
            if (!counter.getAttribute('data-original')) {
                counter.setAttribute('data-original', counter.textContent);
            }

            updateCount();
        });
    }

    // Intersection Observer for animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate');
                
                // Trigger counter animation for stats
                if (entry.target.classList.contains('stats') || entry.target.classList.contains('stats-detailed')) {
                    animateCounters();
                }
            }
        });
    }, observerOptions);

    // Observe elements for animation
    document.querySelectorAll('.feature-card, .news-card, .stat-item, .stats, .stats-detailed').forEach(el => {
        observer.observe(el);
    });

    // Image lazy loading
    const images = document.querySelectorAll('img[data-src]');
    const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.remove('lazy');
                imageObserver.unobserve(img);
            }
        });
    });

    images.forEach(img => imageObserver.observe(img));

    // Search functionality (if search box exists)
    const searchBox = document.querySelector('.search-box');
    if (searchBox) {
        searchBox.addEventListener('input', function(e) {
            const searchTerm = e.target.value.toLowerCase();
            const searchableItems = document.querySelectorAll('.news-card, .program-category, .facility-card');
            
            searchableItems.forEach(item => {
                const text = item.textContent.toLowerCase();
                if (text.includes(searchTerm)) {
                    item.style.display = '';
                } else {
                    item.style.display = 'none';
                }
            });
        });
    }

    // Back to top button
    const backToTopBtn = document.createElement('button');
    backToTopBtn.innerHTML = '<i class="fas fa-arrow-up"></i>';
    backToTopBtn.className = 'back-to-top';
    backToTopBtn.style.cssText = `
        position: fixed;
        bottom: 30px;
        right: 30px;
        width: 50px;
        height: 50px;
        background: #2c5530;
        color: white;
        border: none;
        border-radius: 50%;
        cursor: pointer;
        display: none;
        z-index: 1000;
        transition: all 0.3s ease;
        box-shadow: 0 5px 15px rgba(0,0,0,0.2);
    `;
    
    document.body.appendChild(backToTopBtn);

    backToTopBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });

    window.addEventListener('scroll', () => {
        if (window.scrollY > 300) {
            backToTopBtn.style.display = 'block';
        } else {
            backToTopBtn.style.display = 'none';
        }
    });

    // Add hover effects
    backToTopBtn.addEventListener('mouseenter', () => {
        backToTopBtn.style.background = '#ff6b35';
        backToTopBtn.style.transform = 'scale(1.1)';
    });

    backToTopBtn.addEventListener('mouseleave', () => {
        backToTopBtn.style.background = '#2c5530';
        backToTopBtn.style.transform = 'scale(1)';
    });
});

// Language toggle functionality
function toggleLanguageMenu() {
    const languageMenu = document.getElementById('languageMenu');
    languageMenu.classList.toggle('show');
}

// Close language menu when clicking outside
document.addEventListener('click', function(event) {
    const languageSelector = document.querySelector('.language-selector');
    const languageMenu = document.getElementById('languageMenu');
    
    if (languageSelector && languageMenu && !languageSelector.contains(event.target)) {
        languageMenu.classList.remove('show');
    }
});

// Global variable for current language
let currentLanguage = localStorage.getItem('selectedLanguage') || 'ky';

// Change language function
function changeLanguage(lang) {
    currentLanguage = lang;
    localStorage.setItem('selectedLanguage', lang);
    
    // Update current language display
    const currentLangSpan = document.getElementById('current-lang');
    const langNames = {
        'zh': '中文',
        'en': 'English',
        'ky': 'Кыргызча'
    };
    
    if (currentLangSpan) {
        currentLangSpan.textContent = langNames[lang];
    }
    
    // Update page content
    updatePageContent(lang);
    
    // Close language menu
    const languageMenu = document.getElementById('languageMenu');
    if (languageMenu) {
        languageMenu.classList.remove('show');
    }
}

// Update page content based on selected language
function updatePageContent(lang) {
    if (typeof translations === 'undefined') {
        console.warn('Translations not loaded');
        return;
    }
    
    const elements = document.querySelectorAll('[data-key]');
    elements.forEach(element => {
        const key = element.getAttribute('data-key');
        if (translations[lang] && translations[lang][key]) {
            if (element.tagName === 'INPUT' && element.type === 'submit') {
                element.value = translations[lang][key];
            } else if (element.tagName === 'INPUT' && element.placeholder) {
                element.placeholder = translations[lang][key];
            } else {
                element.textContent = translations[lang][key];
            }
        }
    });
    
    // Update document title
    const titleElement = document.querySelector('title[data-key]');
    if (titleElement && translations[lang]) {
        const titleKey = titleElement.getAttribute('data-key');
        if (translations[lang][titleKey]) {
            document.title = translations[lang][titleKey];
        }
    }
    
    // Update HTML lang attribute
    document.documentElement.lang = lang === 'zh' ? 'zh-CN' : (lang === 'en' ? 'en' : 'ky');
}

// Initialize language on page load
document.addEventListener('DOMContentLoaded', function() {
    // Set initial language
    changeLanguage(currentLanguage);
});

// Utility functions
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Performance optimization
window.addEventListener('load', function() {
    // Remove loading class if exists
    document.body.classList.remove('loading');
    
    // Preload critical images
    const criticalImages = [
        'images/campus-hero.jpg',
        'images/logo.png'
    ];
    
    criticalImages.forEach(src => {
        const img = new Image();
        img.src = src;
    });
});

// Leadership card mobile touch support
function initializeLeadershipCards() {
    const leaderCards = document.querySelectorAll('.leader-card');

    leaderCards.forEach(card => {
        card.addEventListener('click', function(e) {
            // Only handle on mobile devices
            if (window.innerWidth <= 768) {
                e.preventDefault();

                // Remove active class from all other cards
                leaderCards.forEach(otherCard => {
                    if (otherCard !== card) {
                        otherCard.classList.remove('active');
                    }
                });

                // Toggle active class on clicked card
                card.classList.toggle('active');
            }
        });
    });

    // Close overlay when clicking outside
    document.addEventListener('click', function(e) {
        if (window.innerWidth <= 768) {
            const clickedCard = e.target.closest('.leader-card');
            if (!clickedCard) {
                leaderCards.forEach(card => {
                    card.classList.remove('active');
                });
            }
        }
    });
}

// Initialize leadership cards when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    initializeLeadershipCards();
});

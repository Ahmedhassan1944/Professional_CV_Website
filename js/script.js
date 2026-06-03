
// ============================================
// NAVIGATION LOGIC
// ============================================
document.addEventListener('DOMContentLoaded', function () {
    const navLinks = document.querySelectorAll('.nav-link');
    const pageSections = document.querySelectorAll('.page-section');
    const mainContent = document.querySelector('.main-content');

    // Parent Containers
    const portfolioContainer = document.querySelector('.portfolio-section');
    const remainingContainer = document.querySelector('.remaining-sections');

    // Function to switch sections
    function switchSection(sectionId) {
        // 1. Update Navigation State
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('data-section') === sectionId) {
                link.classList.add('active');
            }
        });

        // 2. Manage Parent Container Visibility
        if (['home', 'portfolio'].includes(sectionId)) {
            // Show Portfolio Container (contains Home and Portfolio)
            if (portfolioContainer) portfolioContainer.classList.remove('container-hidden');
            // Hide Remaining Container (contains Experience, Skills, etc.) - OPTIONAL
            // Actually, if we want to "toggle" between views, we should hide .remaining-sections
            // when viewing Home/Portfolio to get a clean view?
            if (remainingContainer) remainingContainer.classList.add('container-hidden');

            // Re-enable particles if they were somehow paused (not needed if just CSS display)

        } else {
            // Content Sections (Experience, Skills, etc.)
            // Hide Portfolio Container to remove the "Blank Page" at the top
            if (portfolioContainer) portfolioContainer.classList.add('container-hidden');
            // Show Remaining Container
            if (remainingContainer) remainingContainer.classList.remove('container-hidden');
        }

        // 3. Handle Content Section Visibility (Inner Sections)
        pageSections.forEach(section => {
            section.classList.remove('active');
            if (section.id === sectionId) {
                setTimeout(() => {
                    section.classList.add('active');
                }, 10);
            }
        });

        // 4. Layout Adjustments
        if (['experience', 'skills', 'projects', 'education', 'certifications'].includes(sectionId)) {
            if (mainContent) mainContent.classList.add('single-view-mode');
        } else {
            if (mainContent) mainContent.classList.remove('single-view-mode');
        }

        // 5. Trigger Scroll/Animation Updates
        window.dispatchEvent(new Event('scroll'));
    }

    // Add click event listeners to nav links
    navLinks.forEach(link => {
        link.addEventListener('click', function (e) {
            e.preventDefault();
            const sectionId = this.getAttribute('data-section');
            if (sectionId) {
                switchSection(sectionId);
            }
        });
    });

    // Initialize with Home
    switchSection('home');

    console.log('Navigation refined initialized');
});

// ============================================
// TECHNOLOGY ECOSYSTEM LOGIC (SKILLS SECTION)
// ============================================
document.addEventListener('DOMContentLoaded', function () {
    const categoryBtns = document.querySelectorAll('.category-btn');
    const skillCards = document.querySelectorAll('.skill-card');
    const searchInput = document.getElementById('skills-search');
    const noSkillsFound = document.getElementById('no-skills-found');
    const ecosystemCanvas = document.querySelector('.ecosystem-canvas');
    const ecosystemGlow = document.querySelector('.ecosystem-glow');

    // Premium Animated Filter Logic
    function filterSkills(filterValue, searchQuery = '') {
        searchQuery = searchQuery.toLowerCase();
        
        const cardsToShow = [];
        const cardsToHide = [];
        
        skillCards.forEach(card => {
            const category = card.getAttribute('data-category');
            const skillName = card.querySelector('.skill-name').textContent.toLowerCase();
            
            const matchesCategory = filterValue === 'all' || category === filterValue;
            const matchesSearch = skillName.includes(searchQuery);

            if (matchesCategory && matchesSearch) {
                cardsToShow.push(card);
            } else {
                if (!card.classList.contains('d-none')) {
                    cardsToHide.push(card);
                }
            }
        });

        // 1. Animate out the cards that are leaving
        cardsToHide.forEach(card => {
            card.classList.add('filtering-out');
        });

        // Wait for fade out to finish (matches CSS transition time)
        setTimeout(() => {
            // Hide the outgoing cards completely
            cardsToHide.forEach(card => {
                card.classList.add('d-none');
                card.classList.remove('filtering-out');
            });

            // Prepare incoming cards
            cardsToShow.forEach(card => {
                if (card.classList.contains('d-none')) {
                    card.classList.add('filtering-in');
                    card.classList.remove('d-none');
                }
            });

            // Empty state check
            if (cardsToShow.length === 0) {
                noSkillsFound.style.display = 'block';
                noSkillsFound.style.opacity = '0';
                setTimeout(() => noSkillsFound.style.opacity = '1', 10);
            } else {
                noSkillsFound.style.display = 'none';
            }

            // 2. Animate in the matching cards with a stagger
            cardsToShow.forEach((card, index) => {
                // Force a reflow so the transition restarts
                void card.offsetWidth;
                
                setTimeout(() => {
                    card.classList.remove('filtering-in');
                }, index * 50); // 50ms stagger effect per card
            });

        }, 300); // 300ms wait for the fade out to finish smoothly
    }

    // Category Button Click Events
    categoryBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Remove active class from all
            categoryBtns.forEach(b => b.classList.remove('active'));
            // Add active class to clicked
            btn.classList.add('active');
            
            const filterValue = btn.getAttribute('data-filter');
            filterSkills(filterValue, searchInput ? searchInput.value : '');
        });
    });

    // Search Input Event
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            const activeBtn = document.querySelector('.category-btn.active');
            const filterValue = activeBtn ? activeBtn.getAttribute('data-filter') : 'all';
            filterSkills(filterValue, e.target.value);
        });
    }

    // Mouse Glow Effect on Canvas
    if (ecosystemCanvas && ecosystemGlow) {
        ecosystemCanvas.addEventListener('mousemove', (e) => {
            const rect = ecosystemCanvas.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            ecosystemGlow.style.left = `${x}px`;
            ecosystemGlow.style.top = `${y}px`;
        });
        
        ecosystemCanvas.addEventListener('mouseleave', () => {
            ecosystemGlow.style.opacity = '0';
        });
        ecosystemCanvas.addEventListener('mouseenter', () => {
            ecosystemGlow.style.opacity = '1';
        });
    }
});

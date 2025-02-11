function handleScrollAnimations() {
    const sections = document.querySelectorAll('[data-scroll-section]');
    const timelineItems = document.querySelectorAll('.timeline-item');
    const projectCards = document.querySelectorAll('.project-card');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, { threshold: 0.1 });
    
    sections.forEach(section => observer.observe(section));
    timelineItems.forEach(item => observer.observe(item));
    projectCards.forEach(card => observer.observe(card));
}

// Add mobile menu functionality
function initializeMobileMenu() {
    const mobileMenuButton = document.querySelector('.mobile-menu-toggle');
    const nav = document.querySelector('.cyber-nav');
    
    if (mobileMenuButton && nav) {
        mobileMenuButton.addEventListener('click', () => {
            nav.classList.toggle('active');
            document.body.classList.toggle('menu-open');
        });

        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!nav.contains(e.target) && !mobileMenuButton.contains(e.target) && nav.classList.contains('active')) {
                nav.classList.remove('active');
                document.body.classList.remove('menu-open');
            }
        });
    }
}

function initializeSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
                
                // Close mobile menu if open
                const nav = document.querySelector('.cyber-nav');
                if (nav.classList.contains('active')) {
                    nav.classList.remove('active');
                    document.body.classList.remove('menu-open');
                }
            }
        });
    });
}

document.addEventListener('DOMContentLoaded', () => {
    handleScrollAnimations();
    initializeMobileMenu();
    initializeSmoothScroll();
}); 
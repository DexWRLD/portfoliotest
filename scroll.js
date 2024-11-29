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

document.addEventListener('DOMContentLoaded', handleScrollAnimations); 
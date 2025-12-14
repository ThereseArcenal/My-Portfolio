// Dark mode functionality
const darkModeToggle = document.getElementById('dark-mode-toggle');
const darkModeToggleMobile = document.getElementById('dark-mode-toggle-mobile');

// Check for saved theme preference or respect OS preference
if (localStorage.theme === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
    document.documentElement.classList.add('dark');
    if (darkModeToggle) darkModeToggle.checked = true;
    if (darkModeToggleMobile) darkModeToggleMobile.checked = true;
} else {
    document.documentElement.classList.remove('dark');
    if (darkModeToggle) darkModeToggle.checked = false;
    if (darkModeToggleMobile) darkModeToggleMobile.checked = false;
}

// Function to toggle dark mode
function toggleDarkMode() {
    if (document.documentElement.classList.contains('dark')) {
        document.documentElement.classList.remove('dark');
        localStorage.theme = 'light';
        if (darkModeToggle) darkModeToggle.checked = false;
        if (darkModeToggleMobile) darkModeToggleMobile.checked = false;
    } else {
        document.documentElement.classList.add('dark');
        localStorage.theme = 'dark';
        if (darkModeToggle) darkModeToggle.checked = true;
        if (darkModeToggleMobile) darkModeToggleMobile.checked = true;
    }
}

// Add event listeners to both toggles
if (darkModeToggle) {
    darkModeToggle.addEventListener('change', toggleDarkMode);
}

if (darkModeToggleMobile) {
    darkModeToggleMobile.addEventListener('change', toggleDarkMode);
}

// Mobile menu toggle
const mobileMenuButton = document.getElementById('mobile-menu-button');
const mobileMenu = document.getElementById('mobile-menu');

mobileMenuButton.addEventListener('click', () => {
    mobileMenu.classList.toggle('hidden');
});

// Back to top button
const backToTopButton = document.getElementById('back-to-top');

window.addEventListener('scroll', () => {
    if (window.pageYOffset > 300) {
        backToTopButton.classList.remove('hidden');
    } else {
        backToTopButton.classList.add('hidden');
    }
});

backToTopButton.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
});

// Smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        
        const targetId = this.getAttribute('href');
        if (targetId === '#') return;
        
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
            targetElement.scrollIntoView({
                behavior: 'smooth'
            });
            
            // Close mobile menu if open
            if (!mobileMenu.classList.contains('hidden')) {
                mobileMenu.classList.add('hidden');
            }
        }
    });
});

// Navbar background change on scroll
window.addEventListener('scroll', function() {
    if (window.scrollY > 50) {
        document.getElementById('navbar').classList.add('bg-white', 'shadow-md');
        document.getElementById('navbar').classList.add('dark:bg-darkBg');
    } else {
        document.getElementById('navbar').classList.remove('bg-white', 'shadow-md');
        document.getElementById('navbar').classList.remove('dark:bg-darkBg');
    }
});

// Initialize animations
function initAnimations() {
    // Animate skills items with staggered delay
    const skillItems = document.querySelectorAll('.skill-item');
    skillItems.forEach((item, index) => {
        setTimeout(() => {
            item.style.opacity = '1';
            item.style.transform = 'translateY(0)';
            item.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
        }, index * 200);
    });
    
    // Intersection Observer for section animations
    const sections = document.querySelectorAll('.section-hidden');
    
    const sectionObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('section-visible');
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });
    
    sections.forEach(section => {
        sectionObserver.observe(section);
    });
    
    // Parallax effect for hero section
    window.addEventListener('scroll', function() {
        const scrolled = window.pageYOffset;
        const parallaxElement = document.getElementById('home');
        const rate = scrolled * -0.5;
        
        parallaxElement.style.backgroundPosition = `center ${rate}px`;
    });
}

// Initialize animations on DOM content loaded
document.addEventListener('DOMContentLoaded', initAnimations);

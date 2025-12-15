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

if (mobileMenuButton) {
    mobileMenuButton.addEventListener('click', () => {
        mobileMenu.classList.toggle('hidden');
    });
}

// Back to top button
const backToTopButton = document.getElementById('back-to-top');
let isScrolling = false;

if (backToTopButton) {
    window.addEventListener('scroll', () => {
        if (window.pageYOffset > 300) {
            backToTopButton.classList.remove('opacity-0', 'pointer-events-none');
            backToTopButton.classList.add('opacity-100', 'pointer-events-auto');
        } else {
            backToTopButton.classList.remove('opacity-100', 'pointer-events-auto');
            backToTopButton.classList.add('opacity-0', 'pointer-events-none');
        }
    });

    backToTopButton.addEventListener('click', () => {
        smoothScrollTo(0, 800);
    });
}

// Ultra-smooth scrolling function
function smoothScrollTo(targetPosition, duration = 1000) {
    const startPosition = window.pageYOffset;
    const distance = targetPosition - startPosition;
    let startTime = null;
    let animationFrameId = null;

    function animation(currentTime) {
        if (!startTime) startTime = currentTime;
        const timeElapsed = currentTime - startTime;
        const progress = Math.min(timeElapsed / duration, 1);
        
        // Custom cubic-bezier easing for ultra-smooth feel
        const ease = cubicBezier(0.25, 0.1, 0.25, 1.0, progress);
        
        window.scrollTo(0, startPosition + distance * ease);
        
        if (progress < 1) {
            animationFrameId = requestAnimationFrame(animation);
        }
    }

    if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
    }
    
    animationFrameId = requestAnimationFrame(animation);
}

// Cubic bezier easing function
function cubicBezier(x1, y1, x2, y2, t) {
    // Convert to polynomial form
    const cx = 3 * x1;
    const bx = 3 * (x2 - x1) - cx;
    const ax = 1 - cx - bx;
    
    const cy = 3 * y1;
    const by = 3 * (y2 - y1) - cy;
    const ay = 1 - cy - by;
    
    // Solve for x(t) using Newton's method
    let x = t;
    for (let i = 0; i < 8; i++) {
        const x2 = x * x;
        const x3 = x2 * x;
        const fx = ax * x3 + bx * x2 + cx * x - t;
        const dfx = 3 * ax * x2 + 2 * bx * x + cx;
        x -= fx / dfx;
    }
    
    // Calculate y(t)
    const y = ay * x * x * x + by * x * x + cy * x;
    return y;
}

// Enhanced Smooth scrolling for anchor links with momentum scrolling
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        
        const targetId = this.getAttribute('href');
        if (targetId === '#') return;
        
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
            const headerHeight = document.querySelector('nav').offsetHeight;
            const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - headerHeight;
            
            // Add click animation effect to the link
            this.style.transform = 'scale(0.95)';
            setTimeout(() => {
                this.style.transform = 'scale(1)';
            }, 150);
            
            // Smooth scroll to target
            smoothScrollTo(targetPosition, 1200);
            
            // Add highlight effect to target section
            targetElement.style.boxShadow = '0 0 0 2px rgba(236, 72, 153, 0.3)';
            setTimeout(() => {
                targetElement.style.boxShadow = '';
                targetElement.style.transition = 'box-shadow 0.5s ease';
            }, 1500);
            
            // Close mobile menu if open
            if (mobileMenu && !mobileMenu.classList.contains('hidden')) {
                mobileMenu.classList.add('hidden');
            }
        }
    });
});

// Enhanced Navbar with smooth transitions
let lastScrollTop = 0;
let ticking = false;

window.addEventListener('scroll', function() {
    if (!ticking) {
        requestAnimationFrame(function() {
            const navbar = document.getElementById('navbar');
            const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
            
            if (navbar) {
                // Show/hide based on scroll direction
                if (scrollTop > lastScrollTop && scrollTop > 100) {
                    // Scrolling down - hide navbar slightly
                    navbar.style.transform = 'translateY(-10px)';
                    navbar.style.opacity = '0.9';
                } else {
                    // Scrolling up - show navbar
                    navbar.style.transform = 'translateY(0)';
                    navbar.style.opacity = '1';
                }
                
                // Add shadow when scrolled
                if (scrollTop > 50) {
                    navbar.classList.add('shadow-lg', 'bg-opacity-95', 'backdrop-blur-sm', 'dark:bg-opacity-95');
                    navbar.classList.remove('bg-opacity-100');
                } else {
                    navbar.classList.remove('shadow-lg', 'bg-opacity-95', 'backdrop-blur-sm', 'dark:bg-opacity-95');
                    navbar.classList.add('bg-opacity-100');
                }
                
                lastScrollTop = scrollTop;
            }
            
            ticking = false;
        });
        
        ticking = true;
    }
});

// Mouse wheel smooth scrolling enhancement
let wheelTimeout;
window.addEventListener('wheel', function(e) {
    // Prevent default scrolling for smoother experience
    if (Math.abs(e.deltaY) > 50) {
        clearTimeout(wheelTimeout);
        wheelTimeout = setTimeout(() => {
            // Add smooth momentum effect
            document.body.style.scrollBehavior = 'smooth';
            setTimeout(() => {
                document.body.style.scrollBehavior = 'auto';
            }, 100);
        }, 50);
    }
}, { passive: true });

// Enhanced animations with Intersection Observer
function initAnimations() {
    // Animate skills items with staggered delay and bounce effect
    const skillItems = document.querySelectorAll('.skill-item');
    skillItems.forEach((item, index) => {
        setTimeout(() => {
            item.style.opacity = '1';
            item.style.transform = 'translateY(0) scale(1)';
            item.style.transition = 'opacity 0.8s cubic-bezier(0.175, 0.885, 0.32, 1.275), transform 0.8s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
            
            // Add hover effect
            item.addEventListener('mouseenter', () => {
                item.style.transform = 'translateY(-5px) scale(1.02)';
            });
            
            item.addEventListener('mouseleave', () => {
                item.style.transform = 'translateY(0) scale(1)';
            });
        }, index * 200);
    });
    
    // Enhanced Intersection Observer for section animations with parallax
    const sections = document.querySelectorAll('.section-hidden');
    
    const sectionObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('section-visible');
                
                // Add subtle parallax to child elements
                const children = entry.target.querySelectorAll('.fade-in-element');
                children.forEach((child, index) => {
                    setTimeout(() => {
                        child.classList.add('visible');
                        
                        // Add subtle translate effect based on position
                        const delay = index * 100;
                        setTimeout(() => {
                            child.style.transform = 'translateY(0)';
                        }, delay);
                    }, index * 150);
                });
            }
        });
    }, {
        threshold: 0.05,
        rootMargin: '0px 0px -100px 0px'
    });
    
    sections.forEach(section => {
        sectionObserver.observe(section);
    });
    
    // Enhanced fade observer
    const fadeElements = document.querySelectorAll('.fade-in-element');
    const fadeObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.classList.add('visible');
                }, 100);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '50px'
    });
    
    fadeElements.forEach(element => {
        fadeObserver.observe(element);
    });
    
    // Enhanced hover effects for project cards
    const projectCards = document.querySelectorAll('.hover-lift');
    projectCards.forEach(card => {
        card.style.willChange = 'transform, box-shadow';
        card.style.backfaceVisibility = 'hidden';
        
        card.addEventListener('mouseenter', () => {
            card.style.transform = 'translateY(-10px) scale(1.02)';
            card.style.transition = 'transform 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275), box-shadow 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
            card.style.boxShadow = '0 20px 40px -10px rgba(0, 0, 0, 0.15)';
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'translateY(0) scale(1)';
            card.style.boxShadow = '';
        });
    });
}

// Smooth page load with enhanced transitions
window.addEventListener('load', function() {
    // Add loaded class to body for CSS transitions
    document.body.classList.add('loaded');
    
    // Remove any initial opacity
    setTimeout(() => {
        document.body.style.opacity = '1';
        document.body.style.overflow = 'visible';
        
        // Initialize animations
        initAnimations();
        
        // Add subtle background animation
        const heroSection = document.getElementById('home');
        if (heroSection) {
            heroSection.style.background = 'linear-gradient(45deg, #EC4899, #F43F5E, #EC4899)';
            heroSection.style.backgroundSize = '400% 400%';
            heroSection.style.animation = 'gradientShift 15s ease infinite';
        }
    }, 100);
});

// Initialize everything on DOM content loaded
document.addEventListener('DOMContentLoaded', function() {
    // Set initial styles for smooth appearance
    document.body.style.opacity = '0';
    document.body.style.transition = 'opacity 0.5s ease';
    
    // Prevent FOUC (Flash of Unstyled Content)
    document.body.style.visibility = 'visible';
    
    // Add CSS for enhanced animations
    const style = document.createElement('style');
    style.textContent = `
        @keyframes gradientShift {
            0% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
            100% { background-position: 0% 50%; }
        }
        
        @keyframes gentlePulse {
            0%, 100% { transform: scale(1); }
            50% { transform: scale(1.02); }
        }
        
        .animate-gentle-pulse {
            animation: gentlePulse 3s ease-in-out infinite;
        }
        
        /* Enhanced scroll snapping */
        .scroll-snap-section {
            scroll-snap-align: start;
        }
        
        /* Smooth text reveal */
        .text-reveal {
            opacity: 0;
            transform: translateY(20px);
            animation: textReveal 0.8s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
        }
        
        @keyframes textReveal {
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }
        
        /* Button ripple effect */
        .ripple-button {
            position: relative;
            overflow: hidden;
        }
        
        .ripple-button:after {
            content: '';
            position: absolute;
            top: 50%;
            left: 50%;
            width: 5px;
            height: 5px;
            background: rgba(255, 255, 255, 0.5);
            opacity: 0;
            border-radius: 100%;
            transform: scale(1, 1) translate(-50%);
            transform-origin: 50% 50%;
        }
        
        .ripple-button:focus:after {
            animation: ripple 1s ease-out;
        }
        
        @keyframes ripple {
            0% {
                transform: scale(0, 0);
                opacity: 0.5;
            }
            100% {
                transform: scale(20, 20);
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(style);
});

// Touch device optimizations
let touchStartY = 0;
let touchEndY = 0;

document.addEventListener('touchstart', function(e) {
    touchStartY = e.changedTouches[0].screenY;
}, { passive: true });

document.addEventListener('touchend', function(e) {
    touchEndY = e.changedTouches[0].screenY;
    handleSwipe();
}, { passive: true });

function handleSwipe() {
    const swipeDistance = touchEndY - touchStartY;
    
    // If it's a significant swipe, add momentum
    if (Math.abs(swipeDistance) > 50) {
        // Add smooth momentum scrolling
        const currentScroll = window.pageYOffset;
        const targetScroll = currentScroll - (swipeDistance * 2);
        
        smoothScrollTo(targetScroll, 800);
    }
}

// Add ripple effect to buttons
document.querySelectorAll('button, .hover-lift').forEach(button => {
    button.classList.add('ripple-button');
    
    button.addEventListener('click', function(e) {
        // Create ripple effect
        const ripple = document.createElement('span');
        const rect = this.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = e.clientX - rect.left - size / 2;
        const y = e.clientY - rect.top - size / 2;
        
        ripple.style.cssText = `
            position: absolute;
            border-radius: 50%;
            background: rgba(255, 255, 255, 0.7);
            transform: scale(0);
            animation: ripple-animation 0.6s linear;
            width: ${size}px;
            height: ${size}px;
            top: ${y}px;
            left: ${x}px;
            pointer-events: none;
        `;
        
        this.appendChild(ripple);
        
        setTimeout(() => {
            ripple.remove();
        }, 600);
    });
});

// Add CSS for ripple animation
const rippleStyle = document.createElement('style');
rippleStyle.textContent = `
    @keyframes ripple-animation {
        to {
            transform: scale(4);
            opacity: 0;
        }
    }
`;
document.head.appendChild(rippleStyle);

// Lazy loading for images with smooth reveal
document.addEventListener('DOMContentLoaded', function() {
    const images = document.querySelectorAll('img[data-src]');
    
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.style.opacity = '0';
                img.style.transition = 'opacity 0.8s ease';
                
                img.onload = function() {
                    setTimeout(() => {
                        img.style.opacity = '1';
                    }, 100);
                };
                
                observer.unobserve(img);
            }
        });
    });
    
    images.forEach(img => imageObserver.observe(img));
});
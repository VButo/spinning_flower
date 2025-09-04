// Animation control state
let isAnimationPaused = false;

// DOM elements
const flowerImage = document.getElementById('flowerImage');
const pausePlayBtn = document.getElementById('pausePlayBtn');
const btnIcon = document.getElementById('btnIcon');
const btnText = document.getElementById('btnText');

// Initialize the application
function initApp() {
    // Set up event listeners
    setupEventListeners();
    
    // Add fade-in effect for better loading experience
    document.body.style.opacity = '0';
    setTimeout(() => {
        document.body.style.transition = 'opacity 0.5s ease-in';
        document.body.style.opacity = '1';
    }, 100);
}

// Set up all event listeners
function setupEventListeners() {
    // Pause/Play button click handler
    pausePlayBtn.addEventListener('click', toggleAnimation);
    
    // Keyboard controls (spacebar)
    document.addEventListener('keydown', handleKeyPress);
    
    // Handle image load error
    flowerImage.addEventListener('error', handleImageError);
    
    // Add hover effects to enhance the glow
    flowerImage.addEventListener('mouseenter', enhanceGlow);
    flowerImage.addEventListener('mouseleave', normalizeGlow);
    
    // Prevent right-click context menu on the flower image
    flowerImage.addEventListener('contextmenu', (e) => e.preventDefault());
    
    // Handle focus for accessibility
    pausePlayBtn.addEventListener('focus', () => {
        pausePlayBtn.style.outline = '2px solid rgba(168, 85, 247, 0.8)';
    });
    
    pausePlayBtn.addEventListener('blur', () => {
        pausePlayBtn.style.outline = 'none';
    });
}

// Toggle animation pause/play
function toggleAnimation() {
    isAnimationPaused = !isAnimationPaused;
    
    if (isAnimationPaused) {
        pauseAnimation();
    } else {
        resumeAnimation();
    }
    
    // Update button appearance
    updateButtonState();
    
    // Add button press animation
    animateButtonPress();
}

// Pause the spinning animation
function pauseAnimation() {
    flowerImage.style.animationPlayState = 'paused';
    
    // Also pause the glow ring animation for consistency
    const glowRing = document.querySelector('.glow-ring');
    if (glowRing) {
        glowRing.style.animationPlayState = 'paused';
    }
}

// Resume the spinning animation
function resumeAnimation() {
    flowerImage.style.animationPlayState = 'running';
    
    // Resume the glow ring animation
    const glowRing = document.querySelector('.glow-ring');
    if (glowRing) {
        glowRing.style.animationPlayState = 'running';
    }
}

// Update button icon and text based on state
function updateButtonState() {
    if (isAnimationPaused) {
        btnIcon.textContent = '▶';
        btnText.textContent = 'Play';
        pausePlayBtn.setAttribute('aria-label', 'Resume animation');
    } else {
        btnIcon.textContent = '⏸';
        btnText.textContent = 'Pause';
        pausePlayBtn.setAttribute('aria-label', 'Pause animation');
    }
}

// Add button press animation
function animateButtonPress() {
    pausePlayBtn.style.transform = 'scale(0.95)';
    
    setTimeout(() => {
        pausePlayBtn.style.transform = '';
    }, 100);
}

// Handle keyboard input
function handleKeyPress(event) {
    // Spacebar to toggle animation
    if (event.code === 'Space') {
        event.preventDefault(); // Prevent page scroll
        toggleAnimation();
    }
    
    // Escape key to ensure animation is playing
    if (event.code === 'Escape' && isAnimationPaused) {
        toggleAnimation();
    }
}

// Handle image loading errors
function handleImageError() {
    console.warn('Failed to load the flower image');
    
    // Create a fallback visual element
    const fallbackElement = document.createElement('div');
    fallbackElement.className = 'spinning-flower fallback-flower';
    fallbackElement.style.cssText = `
        width: 375px;
        height: 375px;
        border-radius: 50%;
        background: radial-gradient(circle, #e879f9, #a855f7, #7c3aed);
        display: flex;
        align-items: center;
        justify-content: center;
        color: white;
        font-size: var(--font-size-xl);
        font-weight: var(--font-weight-bold);
        text-align: center;
        animation: spin 7s linear infinite;
        filter: drop-shadow(0 0 30px rgba(168, 85, 247, 0.7));
    `;
    fallbackElement.innerHTML = '🌸<br>Purple Lily';
    
    // Replace the broken image
    flowerImage.parentNode.replaceChild(fallbackElement, flowerImage);
}

// Enhance glow effect on hover
function enhanceGlow() {
    flowerImage.style.filter = 'drop-shadow(0 0 40px rgba(168, 85, 247, 1)) drop-shadow(0 0 60px rgba(232, 121, 249, 0.5))';
}

// Normalize glow effect when not hovering
function normalizeGlow() {
    flowerImage.style.filter = 'drop-shadow(0 0 30px rgba(168, 85, 247, 0.7))';
}

// Performance optimization: Reduce motion for better performance on low-end devices
function optimizePerformance() {
    // Check if device prefers reduced motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    
    if (prefersReducedMotion) {
        // Disable animations for accessibility
        const styleSheet = document.createElement('style');
        styleSheet.textContent = `
            * {
                animation-duration: 0.01ms !important;
                animation-iteration-count: 1 !important;
                transition-duration: 0.01ms !important;
            }
        `;
        document.head.appendChild(styleSheet);
    }
}

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    initApp();
    setupFlowerClickEffect();
    optimizePerformance();
});

// Handle page visibility changes to pause/resume animation
document.addEventListener('visibilitychange', () => {
    if (document.hidden && !isAnimationPaused) {
        // Page is hidden, pause animation to save resources
        flowerImage.style.animationPlayState = 'paused';
    } else if (!document.hidden && !isAnimationPaused) {
        // Page is visible, resume animation
        flowerImage.style.animationPlayState = 'running';
    }
});

// Smooth scroll prevention during spacebar usage
window.addEventListener('keydown', (e) => {
    if (e.code === 'Space' && e.target === document.body) {
        e.preventDefault();
    }
});
// Mobile Navigation Toggle
const hamburger = document.getElementById('hamburger');
const navMenu = document.getElementById('nav-menu');

hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('active');
});

// Close mobile menu when clicking on a link
document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
    });
});

// Smooth scrolling for navigation links
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

// Navbar background on scroll
window.addEventListener('scroll', () => {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 100) {
        navbar.style.background = 'rgba(10, 10, 10, 0.98)';
    } else {
        navbar.style.background = 'rgba(10, 10, 10, 0.95)';
    }
});

// Intersection Observer for animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
            
            // Animate skill bars
            if (entry.target.classList.contains('skill-card')) {
                const skillBar = entry.target.querySelector('.skill-bar');
                const level = skillBar.getAttribute('data-level');
                setTimeout(() => {
                    skillBar.style.width = level + '%';
                }, 200);
            }
            
            // Animate stats
            if (entry.target.classList.contains('stat-item')) {
                const statNumber = entry.target.querySelector('.stat-number');
                const finalNumber = statNumber.textContent;
                animateNumber(statNumber, finalNumber);
            }
        }
    });
}, observerOptions);

// Observe elements for animation
document.querySelectorAll('.skill-card, .project-card, .contact-item, .stat-item, .about-text, .code-window').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(el);
});

// Animate numbers
function animateNumber(element, target) {
    const duration = 2000;
    const start = 0;
    const increment = target / (duration / 16);
    let current = start;
    
    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            element.textContent = target;
            clearInterval(timer);
        } else {
            element.textContent = Math.floor(current) + (target.includes('+') ? '+' : '');
        }
    }, 16);
}

// Typing animation for hero title
function typeWriter(element, text, speed = 100) {
    let i = 0;
    element.innerHTML = '';
    
    function type() {
        if (i < text.length) {
            element.innerHTML += text.charAt(i);
            i++;
            setTimeout(type, speed);
        }
    }
    type();
}

// Initialize typing animation when page loads
window.addEventListener('load', () => {
    const heroTitle = document.querySelector('.hero-title');
    const originalText = heroTitle.innerHTML;
    typeWriter(heroTitle, originalText, 50);
});

// Parallax effect for hero section
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const hero = document.querySelector('.hero');
    const heroContent = document.querySelector('.hero-content');
    
    if (hero && heroContent) {
        heroContent.style.transform = `translateY(${scrolled * 0.5}px)`;
    }
});

// Form submission with localStorage database
const contactForm = document.querySelector('.form');
const formStatus = document.getElementById('form-status');

if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        // Show loading state
        formStatus.className = 'form-status loading';
        formStatus.textContent = 'Saving your message...';
        
        // Get form data
        const name = contactForm.querySelector('input[name="name"]').value;
        const email = contactForm.querySelector('input[name="email"]').value;
        const message = contactForm.querySelector('textarea[name="message"]').value;
        
        // Validation
        if (!name || !email || !message) {
            formStatus.className = 'form-status error';
            formStatus.textContent = 'Please fill in all fields.';
            return;
        }
        
        if (!isValidEmail(email)) {
            formStatus.className = 'form-status error';
            formStatus.textContent = 'Please enter a valid email address.';
            return;
        }
        
        try {
            // Create contact entry
            const contact = {
                id: Date.now().toString(),
                name: name.trim(),
                email: email.trim().toLowerCase(),
                message: message.trim(),
                timestamp: new Date().toISOString(),
                date: new Date().toLocaleDateString(),
                time: new Date().toLocaleTimeString()
            };
            
            // Get existing contacts from localStorage
            let contacts = [];
            try {
                const existingContacts = localStorage.getItem('portfolioContacts');
                if (existingContacts) {
                    contacts = JSON.parse(existingContacts);
                }
            } catch (e) {
                console.log('No existing contacts found');
            }
            
            // Add new contact to beginning of array
            contacts.unshift(contact);
            
            // Save to localStorage
            localStorage.setItem('portfolioContacts', JSON.stringify(contacts));
            
            // Show success message
            formStatus.className = 'form-status success';
            formStatus.textContent = '✅ Message saved successfully! You can view it in the admin panel.';
            
            // Reset form
            contactForm.reset();
            
            // Hide success message after 5 seconds
            setTimeout(() => {
                formStatus.style.display = 'none';
            }, 5000);
            
            // Also create email notification
            const subject = `Portfolio Contact from ${name}`;
            const body = `Name: ${name}%0D%0AEmail: ${email}%0D%0A%0D%0AMessage:%0D%0A${message}`;
            const mailtoLink = `mailto:chalams115@gmail.com?subject=${encodeURIComponent(subject)}&body=${body}`;
            
            // Optional: Open email client
            setTimeout(() => {
                if (confirm('Message saved! Would you also like to send this via email?')) {
                    window.open(mailtoLink);
                }
            }, 2000);
            
            console.log('Contact saved:', contact);
            
        } catch (error) {
            console.error('Form submission error:', error);
            formStatus.className = 'form-status error';
            formStatus.textContent = '❌ Error saving message. Please try again.';
        }
    });
}

// Email validation function
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Notification system
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    
    // Style the notification
    Object.assign(notification.style, {
        position: 'fixed',
        top: '20px',
        right: '20px',
        padding: '15px 25px',
        borderRadius: '8px',
        color: 'white',
        fontWeight: '500',
        zIndex: '10000',
        transform: 'translateX(400px)',
        transition: 'transform 0.3s ease',
        maxWidth: '300px'
    });
    
    // Set background color based on type
    const colors = {
        success: '#4ecdc4',
        error: '#ff6b6b',
        info: '#00d4ff'
    };
    notification.style.background = colors[type] || colors.info;
    
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Remove after 5 seconds
    setTimeout(() => {
        notification.style.transform = 'translateX(400px)';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 5000);
}

// Add hover effects to project cards
document.querySelectorAll('.project-card').forEach(card => {
    card.addEventListener('mouseenter', () => {
        card.style.transform = 'translateY(-10px) scale(1.02)';
    });
    
    card.addEventListener('mouseleave', () => {
        card.style.transform = 'translateY(0) scale(1)';
    });
});

// Add click effects to buttons
document.querySelectorAll('.btn').forEach(btn => {
    btn.addEventListener('click', function(e) {
        // Create ripple effect
        const ripple = document.createElement('span');
        const rect = this.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = e.clientX - rect.left - size / 2;
        const y = e.clientY - rect.top - size / 2;
        
        ripple.style.cssText = `
            position: absolute;
            width: ${size}px;
            height: ${size}px;
            left: ${x}px;
            top: ${y}px;
            background: rgba(255, 255, 255, 0.3);
            border-radius: 50%;
            transform: scale(0);
            animation: ripple 0.6s linear;
            pointer-events: none;
        `;
        
        this.style.position = 'relative';
        this.style.overflow = 'hidden';
        this.appendChild(ripple);
        
        setTimeout(() => {
            ripple.remove();
        }, 600);
    });
});

// Add CSS for ripple animation
const style = document.createElement('style');
style.textContent = `
    @keyframes ripple {
        to {
            transform: scale(4);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// Cursor trail effect
let mouseX = 0;
let mouseY = 0;
let trail = [];

document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
});

function createTrail() {
    const dot = document.createElement('div');
    dot.className = 'cursor-trail';
    dot.style.cssText = `
        position: fixed;
        width: 4px;
        height: 4px;
        background: var(--primary-color);
        border-radius: 50%;
        pointer-events: none;
        z-index: 9999;
        left: ${mouseX}px;
        top: ${mouseY}px;
        opacity: 0.7;
        transition: opacity 0.5s ease;
    `;
    
    document.body.appendChild(dot);
    trail.push(dot);
    
    setTimeout(() => {
        dot.style.opacity = '0';
        setTimeout(() => {
            if (dot.parentNode) {
                dot.parentNode.removeChild(dot);
            }
            trail = trail.filter(d => d !== dot);
        }, 500);
    }, 100);
    
    // Limit trail length
    if (trail.length > 20) {
        const oldDot = trail.shift();
        if (oldDot && oldDot.parentNode) {
            oldDot.parentNode.removeChild(oldDot);
        }
    }
}

// Create trail effect on mouse move
let trailTimer;
document.addEventListener('mousemove', () => {
    clearTimeout(trailTimer);
    trailTimer = setTimeout(createTrail, 50);
});

// Add loading animation
window.addEventListener('load', () => {
    const loader = document.createElement('div');
    loader.id = 'loader';
    loader.innerHTML = `
        <div class="loader-content">
            <div class="loader-spinner"></div>
            <p>Loading Portfolio...</p>
        </div>
    `;
    
    loader.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: var(--bg-primary);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 10000;
        opacity: 1;
        transition: opacity 0.5s ease;
    `;
    
    const loaderStyle = document.createElement('style');
    loaderStyle.textContent = `
        .loader-content {
            text-align: center;
            color: var(--text-primary);
        }
        .loader-spinner {
            width: 50px;
            height: 50px;
            border: 3px solid rgba(0, 212, 255, 0.3);
            border-top: 3px solid var(--primary-color);
            border-radius: 50%;
            animation: spin 1s linear infinite;
            margin: 0 auto 20px;
        }
        @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }
    `;
    document.head.appendChild(loaderStyle);
    document.body.appendChild(loader);
    
    setTimeout(() => {
        loader.style.opacity = '0';
        setTimeout(() => {
            if (loader.parentNode) {
                loader.parentNode.removeChild(loader);
            }
        }, 500);
    }, 2000);
});

console.log('🚀 Portfolio loaded successfully!');
console.log('💫 Welcome to Dhavala Dinesh Kumar\'s Portfolio');
console.log('🎨 Designed with modern UI/UX principles');
console.log('⚡ Optimized for performance and accessibility');
// =
==== MINECRAFT CHARACTER CONTROLLER =====
class MinecraftCharacter {
    constructor() {
        this.character = document.getElementById('minecraft-character');
        this.isFollowing = false;
        this.mouseX = 0;
        this.mouseY = 0;
        this.characterX = window.innerWidth / 2;
        this.characterY = window.innerHeight / 2;
        this.targetX = this.characterX;
        this.targetY = this.characterY;
        this.speed = 0.08;
        this.isVisible = true;
        this.lastMoveTime = Date.now();
        this.idleTimer = null;
        
        this.init();
    }
    
    init() {
        if (!this.character) return;
        
        // Start following mouse after entry animation
        setTimeout(() => {
            this.startFollowing();
        }, 3000);
        
        // Mouse move handler
        document.addEventListener('mousemove', (e) => {
            this.mouseX = e.clientX;
            this.mouseY = e.clientY;
            this.lastMoveTime = Date.now();
            
            if (this.idleTimer) {
                clearTimeout(this.idleTimer);
            }
            
            // Set idle state after 3 seconds of no movement
            this.idleTimer = setTimeout(() => {
                this.setIdleState();
            }, 3000);
        });
        
        // Click handler for special effects
        document.addEventListener('click', (e) => {
            this.triggerClickEffect(e.clientX, e.clientY);
        });
        
        // Scroll handler to adjust character behavior
        window.addEventListener('scroll', () => {
            this.handleScroll();
        });
        
        // Resize handler
        window.addEventListener('resize', () => {
            this.handleResize();
        });
        
        // Keyboard interactions
        document.addEventListener('keydown', (e) => {
            this.handleKeyPress(e);
        });
        
        // Start animation loop
        this.animate();
        
        console.log('🎮 Minecraft Character initialized!');
    }
    
    startFollowing() {
        this.isFollowing = true;
        this.character.classList.add('following');
        
        // Show welcome message
        this.showCharacterMessage("Hey there! I'm Steve, your coding companion! 👋");
    }
    
    animate() {
        if (!this.character || !this.isFollowing) {
            requestAnimationFrame(() => this.animate());
            return;
        }
        
        // Smooth following with easing
        const dx = this.mouseX - this.characterX;
        const dy = this.mouseY - this.characterY;
        
        this.targetX = this.mouseX;
        this.targetY = this.mouseY;
        
        // Apply easing
        this.characterX += dx * this.speed;
        this.characterY += dy * this.speed;
        
        // Keep character within viewport bounds
        const margin = 100;
        this.characterX = Math.max(margin, Math.min(window.innerWidth - margin, this.characterX));
        this.characterY = Math.max(margin, Math.min(window.innerHeight - margin, this.characterY));
        
        // Update character position
        this.character.style.left = this.characterX + 'px';
        this.character.style.top = this.characterY + 'px';
        this.character.style.transform = 'translate(-50%, -50%)';
        
        // Add rotation based on movement direction
        const angle = Math.atan2(dy, dx) * (180 / Math.PI);
        const rotation = angle * 0.1; // Subtle rotation
        
        const characterBody = this.character.querySelector('.character-body');
        if (characterBody) {
            characterBody.style.transform = `rotateY(${rotation}deg)`;
        }
        
        // Continue animation
        requestAnimationFrame(() => this.animate());
    }
    
    triggerClickEffect(x, y) {
        // Create explosion effect at click position
        this.createExplosion(x, y);
        
        // Make character jump
        this.characterJump();
        
        // Play sound effect (visual feedback)
        this.showCharacterMessage(this.getRandomMessage());
    }
    
    createExplosion(x, y) {
        const explosion = document.createElement('div');
        explosion.className = 'click-explosion';
        explosion.style.cssText = `
            position: fixed;
            left: ${x}px;
            top: ${y}px;
            width: 20px;
            height: 20px;
            background: radial-gradient(circle, #FFD700 0%, #FF6B6B 50%, transparent 100%);
            border-radius: 50%;
            transform: translate(-50%, -50%) scale(0);
            animation: explosionEffect 0.6s ease-out forwards;
            pointer-events: none;
            z-index: 10000;
        `;
        
        document.body.appendChild(explosion);
        
        // Create particles
        for (let i = 0; i < 8; i++) {
            const particle = document.createElement('div');
            particle.style.cssText = `
                position: fixed;
                left: ${x}px;
                top: ${y}px;
                width: 4px;
                height: 4px;
                background: ${this.getRandomColor()};
                border-radius: 50%;
                transform: translate(-50%, -50%);
                animation: particleExplosion 1s ease-out forwards;
                animation-delay: ${i * 0.1}s;
                pointer-events: none;
                z-index: 10000;
            `;
            document.body.appendChild(particle);
            
            setTimeout(() => {
                if (particle.parentNode) {
                    particle.parentNode.removeChild(particle);
                }
            }, 1000);
        }
        
        setTimeout(() => {
            if (explosion.parentNode) {
                explosion.parentNode.removeChild(explosion);
            }
        }, 600);
    }
    
    characterJump() {
        const characterContainer = this.character.querySelector('.character-container');
        if (characterContainer) {
            characterContainer.style.animation = 'characterJump 0.6s ease-out';
            setTimeout(() => {
                characterContainer.style.animation = 'characterEntry 3s ease-out forwards, characterFloat 4s ease-in-out infinite 3s';
            }, 600);
        }
    }
    
    setIdleState() {
        const characterContainer = this.character.querySelector('.character-container');
        if (characterContainer) {
            characterContainer.classList.add('idle');
        }
    }
    
    handleScroll() {
        const scrollY = window.scrollY;
        const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
        const scrollProgress = scrollY / maxScroll;
        
        // Adjust character behavior based on scroll position
        if (scrollProgress > 0.8) {
            this.showCharacterMessage("Almost at the bottom! 🚀");
        }
    }
    
    handleResize() {
        // Adjust character position on resize
        this.characterX = Math.min(this.characterX, window.innerWidth - 100);
        this.characterY = Math.min(this.characterY, window.innerHeight - 100);
    }
    
    handleKeyPress(e) {
        const messages = {
            'Enter': "Let's code something amazing! 💻",
            'Space': "Jump! 🦘",
            'Escape': "Taking a break? I'll be here! 😊",
            'ArrowUp': "Going up! ⬆️",
            'ArrowDown': "Going down! ⬇️",
            'ArrowLeft': "Moving left! ⬅️",
            'ArrowRight': "Moving right! ➡️"
        };
        
        if (messages[e.code]) {
            this.showCharacterMessage(messages[e.code]);
            this.characterJump();
        }
    }
    
    showCharacterMessage(message) {
        // Remove existing message
        const existingMessage = document.querySelector('.character-message');
        if (existingMessage) {
            existingMessage.remove();
        }
        
        const messageElement = document.createElement('div');
        messageElement.className = 'character-message';
        messageElement.textContent = message;
        messageElement.style.cssText = `
            position: fixed;
            left: ${this.characterX}px;
            top: ${this.characterY - 120}px;
            transform: translateX(-50%);
            background: rgba(0, 0, 0, 0.9);
            color: white;
            padding: 10px 15px;
            border-radius: 20px;
            border: 2px solid var(--primary-color);
            font-size: 14px;
            font-weight: 500;
            z-index: 10001;
            pointer-events: none;
            backdrop-filter: blur(10px);
            box-shadow: 0 10px 30px rgba(0, 212, 255, 0.3);
            animation: messageAppear 0.3s ease-out forwards;
            max-width: 200px;
            text-align: center;
            word-wrap: break-word;
        `;
        
        document.body.appendChild(messageElement);
        
        setTimeout(() => {
            messageElement.style.animation = 'messageDisappear 0.3s ease-out forwards';
            setTimeout(() => {
                if (messageElement.parentNode) {
                    messageElement.parentNode.removeChild(messageElement);
                }
            }, 300);
        }, 3000);
    }
    
    getRandomMessage() {
        const messages = [
            "Nice click! ✨",
            "Awesome! 🎉",
            "Keep exploring! 🔍",
            "You're doing great! 👍",
            "Let's build something! 🔨",
            "Code is poetry! 📝",
            "Stay creative! 🎨",
            "Keep learning! 📚",
            "You rock! 🤘",
            "Amazing work! ⭐"
        ];
        return messages[Math.floor(Math.random() * messages.length)];
    }
    
    getRandomColor() {
        const colors = [
            '#FFD700', '#FF6B6B', '#4ECDC4', '#45B7D1', 
            '#96CEB4', '#FFEAA7', '#DDA0DD', '#98D8C8',
            '#FF7675', '#74B9FF', '#00B894', '#FDCB6E'
        ];
        return colors[Math.floor(Math.random() * colors.length)];
    }
    
    // Public methods for external control
    hide() {
        if (this.character) {
            this.character.style.opacity = '0';
            this.character.style.pointerEvents = 'none';
            this.isVisible = false;
        }
    }
    
    show() {
        if (this.character) {
            this.character.style.opacity = '1';
            this.character.style.pointerEvents = 'none';
            this.isVisible = true;
        }
    }
    
    setSpeed(speed) {
        this.speed = Math.max(0.01, Math.min(0.2, speed));
    }
    
    teleportTo(x, y) {
        this.characterX = x;
        this.characterY = y;
        this.mouseX = x;
        this.mouseY = y;
    }
}

// Add additional CSS animations
const minecraftAnimations = document.createElement('style');
minecraftAnimations.textContent = `
    @keyframes explosionEffect {
        0% {
            transform: translate(-50%, -50%) scale(0);
            opacity: 1;
        }
        50% {
            transform: translate(-50%, -50%) scale(2);
            opacity: 0.8;
        }
        100% {
            transform: translate(-50%, -50%) scale(4);
            opacity: 0;
        }
    }
    
    @keyframes particleExplosion {
        0% {
            transform: translate(-50%, -50%) scale(1);
            opacity: 1;
        }
        100% {
            transform: translate(-50%, -50%) translate(${Math.random() * 200 - 100}px, ${Math.random() * 200 - 100}px) scale(0);
            opacity: 0;
        }
    }
    
    @keyframes characterJump {
        0%, 100% {
            transform: translateY(0px) scale(1);
        }
        50% {
            transform: translateY(-40px) scale(1.1);
        }
    }
    
    @keyframes messageAppear {
        0% {
            transform: translateX(-50%) translateY(20px) scale(0.8);
            opacity: 0;
        }
        100% {
            transform: translateX(-50%) translateY(0px) scale(1);
            opacity: 1;
        }
    }
    
    @keyframes messageDisappear {
        0% {
            transform: translateX(-50%) translateY(0px) scale(1);
            opacity: 1;
        }
        100% {
            transform: translateX(-50%) translateY(-20px) scale(0.8);
            opacity: 0;
        }
    }
    
    .character-container.idle {
        animation: characterFloat 4s ease-in-out infinite, characterIdle 6s ease-in-out infinite;
    }
    
    @keyframes characterIdle {
        0%, 100% {
            transform: rotateY(0deg);
        }
        25% {
            transform: rotateY(10deg);
        }
        50% {
            transform: rotateY(0deg);
        }
        75% {
            transform: rotateY(-10deg);
        }
    }
`;
document.head.appendChild(minecraftAnimations);

// Initialize Minecraft Character
let minecraftCharacter;

// Wait for DOM to be ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        minecraftCharacter = new MinecraftCharacter();
    });
} else {
    minecraftCharacter = new MinecraftCharacter();
}

// Global access for debugging/control
window.minecraftCharacter = minecraftCharacter;

// Add special effects for different sections
const sectionEffects = {
    'hero': () => minecraftCharacter?.showCharacterMessage("Welcome to the adventure! 🏠"),
    'about': () => minecraftCharacter?.showCharacterMessage("Learning about the developer! 📖"),
    'skills': () => minecraftCharacter?.showCharacterMessage("Check out these skills! ⚡"),
    'projects': () => minecraftCharacter?.showCharacterMessage("Amazing projects ahead! 🚀"),
    'contact': () => minecraftCharacter?.showCharacterMessage("Let's connect! 📧")
};

// Trigger section effects when scrolling
const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting && sectionEffects[entry.target.id]) {
            sectionEffects[entry.target.id]();
        }
    });
}, { threshold: 0.5 });

// Observe all main sections
document.querySelectorAll('section[id]').forEach(section => {
    sectionObserver.observe(section);
});

console.log('🎮 Minecraft Character System Loaded!');
console.log('🎯 Features: Mouse Following, Click Effects, Animations, Messages');
console.log('🎨 Try clicking around and pressing keys!');
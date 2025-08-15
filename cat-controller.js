// ===== SIMPLE CAT EMOJI CONTROLLER =====
class WalkingCat {
    constructor() {
        this.cat = document.getElementById('walking-cat');
        this.catEmoji = this.cat?.querySelector('.cat-emoji');
        this.catX = window.innerWidth / 2;
        this.catY = window.innerHeight / 2;
        this.targetX = this.catX;
        this.targetY = this.catY;
        this.walkSpeed = 0.03;
        this.currentWallSide = 'bottom';
        this.wallProgress = 0;
        this.walkingDirection = 1;
        this.autonomousMode = true;
        this.isWalking = false;
        
        // Cat expressions
        this.expressions = ['🐱', '😸', '😻', '🙀', '😽', '😺', '😹'];
        this.currentExpression = 0;
        
        // Cat messages
        this.meows = ['Meow!', 'Purr~', 'Nya~', 'Mrow!', 'Miau!', '*purr*'];
        
        this.init();
    }
    
    init() {
        if (!this.cat || !this.catEmoji) {
            console.log('❌ Cat element not found');
            return;
        }
        
        // Position cat initially
        this.cat.style.left = this.catX + 'px';
        this.cat.style.top = this.catY + 'px';
        this.cat.style.visibility = 'visible';
        this.cat.style.opacity = '1';
        
        console.log('🐱 Cat positioned at:', this.catX, this.catY);
        console.log('🐱 Cat element:', this.cat);
        console.log('🐱 Cat emoji element:', this.catEmoji);
        
        // Start walking after entry animation
        setTimeout(() => {
            this.startWalking();
            this.scheduleExpressionChange();
        }, 2000);
        
        // Mouse interaction
        document.addEventListener('mousemove', (e) => {
            this.mouseX = e.clientX;
            this.mouseY = e.clientY;
            
            const distance = this.getDistance(this.catX, this.catY, this.mouseX, this.mouseY);
            if (distance < 100) {
                this.lookAtMouse();
            }
        });
        
        // Click handler
        document.addEventListener('click', (e) => {
            this.petCat(e.clientX, e.clientY);
        });
        
        // Start animation loop
        this.animate();
        
        console.log('🐱 Simple Cat Emoji initialized!');
        
        // Show immediate message to confirm cat is working
        this.showMessage('I am here! 🐱');
        this.cat.classList.add('speaking');
    }
    
    startWalking() {
        this.isWalking = true;
        this.cat.classList.add('walking');
        this.showMessage('Meow! Walking around! 🐾');
    }
    
    animate() {
        if (!this.cat || !this.isWalking) {
            requestAnimationFrame(() => this.animate());
            return;
        }
        
        // Wall walking
        this.wallProgress += 0.002;
        
        if (this.wallProgress >= 1) {
            this.wallProgress = 0;
            this.switchWall();
        }
        
        this.moveAlongWall();
        
        // Update position
        const dx = this.targetX - this.catX;
        const dy = this.targetY - this.catY;
        
        this.catX += dx * this.walkSpeed;
        this.catY += dy * this.walkSpeed;
        
        // Keep in bounds
        const margin = 60;
        this.catX = Math.max(margin, Math.min(window.innerWidth - margin, this.catX));
        this.catY = Math.max(margin, Math.min(window.innerHeight - margin, this.catY));
        
        // Update cat position
        this.cat.style.left = this.catX + 'px';
        this.cat.style.top = this.catY + 'px';
        
        // Flip cat based on direction
        if (Math.abs(dx) > 1) {
            this.walkingDirection = dx > 0 ? 1 : -1;
            this.catEmoji.style.transform = `scaleX(${this.walkingDirection})`;
        }
        
        requestAnimationFrame(() => this.animate());
    }
    
    moveAlongWall() {
        const margin = 50;
        switch(this.currentWallSide) {
            case 'top':
                this.targetX = margin + (this.wallProgress * (window.innerWidth - 2 * margin));
                this.targetY = margin;
                break;
            case 'right':
                this.targetX = window.innerWidth - margin;
                this.targetY = margin + (this.wallProgress * (window.innerHeight - 2 * margin));
                break;
            case 'bottom':
                this.targetX = window.innerWidth - margin - (this.wallProgress * (window.innerWidth - 2 * margin));
                this.targetY = window.innerHeight - margin;
                break;
            case 'left':
                this.targetX = margin;
                this.targetY = window.innerHeight - margin - (this.wallProgress * (window.innerHeight - 2 * margin));
                break;
        }
    }
    
    switchWall() {
        const walls = ['top', 'right', 'bottom', 'left'];
        const currentIndex = walls.indexOf(this.currentWallSide);
        this.currentWallSide = walls[(currentIndex + 1) % walls.length];
        
        // Change expression when switching walls
        this.changeExpression();
        
        // Sometimes show a message
        if (Math.random() < 0.3) {
            const messages = ['New wall!', 'Exploring!', 'Walking~', 'Meow!'];
            this.showMessage(messages[Math.floor(Math.random() * messages.length)]);
        }
    }
    
    changeExpression() {
        this.currentExpression = (this.currentExpression + 1) % this.expressions.length;
        this.catEmoji.textContent = this.expressions[this.currentExpression];
    }
    
    scheduleExpressionChange() {
        const delay = 3000 + Math.random() * 5000; // 3-8 seconds
        setTimeout(() => {
            this.changeExpression();
            this.scheduleExpressionChange();
        }, delay);
    }
    
    lookAtMouse() {
        // Cat gets excited when mouse is near
        this.cat.classList.add('happy');
        this.catEmoji.textContent = '😸';
        
        setTimeout(() => {
            this.cat.classList.remove('happy');
            this.catEmoji.textContent = this.expressions[this.currentExpression];
        }, 2000);
    }
    
    petCat(x, y) {
        // Create heart effect
        this.createHeartEffect(x, y);
        
        // Cat gets very happy
        this.catEmoji.textContent = '😻';
        this.cat.classList.add('speaking');
        
        // Show purr message
        const purrs = ['Purr purr! 💕', 'Meow! Happy! 😸', 'Nya~ Thank you!', '*purr* So nice!'];
        this.showMessage(purrs[Math.floor(Math.random() * purrs.length)]);
        
        // Make cat jump
        this.catEmoji.style.animation = 'catJump 0.6s ease-out';
        
        setTimeout(() => {
            this.cat.classList.remove('speaking');
            this.catEmoji.textContent = this.expressions[this.currentExpression];
            this.catEmoji.style.animation = '';
        }, 2000);
    }
    
    createHeartEffect(x, y) {
        const hearts = ['💕', '💖', '💗', '💝', '❤️'];
        
        for (let i = 0; i < 5; i++) {
            const heart = document.createElement('div');
            heart.textContent = hearts[Math.floor(Math.random() * hearts.length)];
            heart.style.cssText = `
                position: fixed;
                left: ${x + (Math.random() * 60 - 30)}px;
                top: ${y + (Math.random() * 60 - 30)}px;
                font-size: 20px;
                animation: heartFloat 2s ease-out forwards;
                animation-delay: ${i * 0.1}s;
                pointer-events: none;
                z-index: 10000;
            `;
            
            document.body.appendChild(heart);
            
            setTimeout(() => {
                if (heart.parentNode) {
                    heart.parentNode.removeChild(heart);
                }
            }, 2000);
        }
    }
    
    showMessage(text) {
        const speechBubble = this.cat.querySelector('.cat-speech .speech-text');
        if (speechBubble) {
            speechBubble.textContent = text;
            this.cat.classList.add('speaking');
            
            setTimeout(() => {
                this.cat.classList.remove('speaking');
            }, 2500);
        }
    }
    
    getDistance(x1, y1, x2, y2) {
        return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
    }
    
    // Public methods
    spin() {
        this.catEmoji.style.animation = 'catSpin 1s ease-in-out';
        this.catEmoji.textContent = '🙀';
        this.showMessage('Wheee! Spinning!');
        
        setTimeout(() => {
            this.catEmoji.style.animation = '';
            this.catEmoji.textContent = this.expressions[this.currentExpression];
        }, 1000);
    }
    
    sleep() {
        this.catEmoji.textContent = '😴';
        this.showMessage('Zzz... sleepy...');
        
        setTimeout(() => {
            this.catEmoji.textContent = this.expressions[this.currentExpression];
        }, 3000);
    }
    
    play() {
        this.catEmoji.textContent = '😹';
        this.showMessage('Playful mood!');
        this.catEmoji.style.animation = 'catExcited 0.5s ease-in-out 3';
        
        setTimeout(() => {
            this.catEmoji.style.animation = '';
            this.catEmoji.textContent = this.expressions[this.currentExpression];
        }, 1500);
    }
}

// Initialize cat
let walkingCat;

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        walkingCat = new WalkingCat();
    });
} else {
    walkingCat = new WalkingCat();
}

// Global access
window.walkingCat = walkingCat;

// Keyboard shortcuts for fun
document.addEventListener('keydown', (e) => {
    if (!walkingCat) return;
    
    switch(e.key.toLowerCase()) {
        case 's':
            walkingCat.spin();
            break;
        case 'p':
            walkingCat.play();
            break;
        case 'z':
            walkingCat.sleep();
            break;
    }
});

console.log('🐱 Simple Cat Emoji System Loaded!');
console.log('🐾 Click anywhere to pet the cat!');
console.log('⌨️ Press S to spin, P to play, Z to sleep!');
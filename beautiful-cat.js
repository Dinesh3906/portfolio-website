// ===== BEAUTIFUL WALKING CAT CONTROLLER =====
class BeautifulCat {
    constructor() {
        this.cat = document.getElementById('beautiful-cat');
        this.catEmoji = this.cat?.querySelector('.cat-emoji');
        this.messageText = this.cat?.querySelector('.message-text');
        
        // Cat is fixed in bottom-right corner (no movement)
        this.isWalking = false;
        
        // Cat personality
        this.expressions = ['🐱', '😸', '😺', '😻', '🙀', '😽', '😹'];
        this.currentExpression = 0;
        this.messages = [
            'Meow! 🐾', 'Purr~ 💕', 'Hello there! 👋', 'Walking around! 🚶‍♀️',
            'So cozy here! ✨', 'Nya~ 🌟', 'Having fun! 🎉', 'Love this place! 💖'
        ];
        
        this.init();
    }
    
    init() {
        if (!this.cat || !this.catEmoji) {
            console.error('❌ Beautiful cat elements not found');
            return;
        }
        
        // Schedule expression and message changes (cat stays in place)
        setTimeout(() => {
            this.scheduleExpressionChange();
            this.scheduleMessageChange();
        }, 2500);
        
        // Click interactions on the cat itself
        this.setupClickInteractions();
        
        // Keyboard shortcuts
        this.setupKeyboardShortcuts();
        
        console.log('🐱 Beautiful Cat initialized successfully!');
    }
    
    // Cat stays fixed — no walking or position updates needed
    
    changeExpression() {
        this.currentExpression = (this.currentExpression + 1) % this.expressions.length;
        this.catEmoji.textContent = this.expressions[this.currentExpression];
    }
    
    scheduleExpressionChange() {
        const delay = 4000 + Math.random() * 6000; // 4-10 seconds
        setTimeout(() => {
            this.changeExpression();
            this.scheduleExpressionChange();
        }, delay);
    }
    
    scheduleMessageChange() {
        const delay = 8000 + Math.random() * 12000; // 8-20 seconds
        setTimeout(() => {
            this.showRandomMessage();
            this.scheduleMessageChange();
        }, delay);
    }
    
    showMessage(text) {
        this.messageText.textContent = text;
        this.cat.classList.add('speaking');
        
        setTimeout(() => {
            this.cat.classList.remove('speaking');
        }, 3000);
    }
    
    showRandomMessage() {
        const message = this.messages[Math.floor(Math.random() * this.messages.length)];
        this.showMessage(message);
    }
    
    setupClickInteractions() {
        // Only respond to clicks on the cat itself
        this.cat.addEventListener('click', (e) => {
            e.stopPropagation();
            this.petCat(e.clientX, e.clientY);
        });
    }
    
    setupKeyboardShortcuts() {
        document.addEventListener('keydown', (e) => {
            switch (e.key.toLowerCase()) {
                case 'c':
                    this.performTrick('spin');
                    break;
                case 'p':
                    this.performTrick('play');
                    break;
                case 's':
                    this.performTrick('sleep');
                    break;
                case 'h':
                    this.performTrick('happy');
                    break;
            }
        });
    }
    
    petCat(x, y) {
        // Create beautiful heart effects
        this.createHeartEffect(x, y);
        
        // Cat gets very happy
        this.catEmoji.textContent = '😻';
        this.cat.classList.add('happy');
        
        // Show loving message
        const loveMessages = [
            'Purr purr! 💕', 'So nice! 😻', 'Thank you! ✨',
            'I love pets! 💖', 'More please! 🥰', 'You\'re the best! 🌟'
        ];
        this.showMessage(loveMessages[Math.floor(Math.random() * loveMessages.length)]);
        
        // Create sparkle effects around cat
        this.createSparkleEffect();
        
        setTimeout(() => {
            this.cat.classList.remove('happy');
            this.catEmoji.textContent = this.expressions[this.currentExpression];
        }, 3000);
        
        console.log('💕 Cat was petted!');
    }
    
    createHeartEffect(x, y) {
        const hearts = ['💕', '💖', '💗', '💝', '❤️', '💜', '💙', '💚'];
        
        for (let i = 0; i < 6; i++) {
            const heart = document.createElement('div');
            heart.textContent = hearts[Math.floor(Math.random() * hearts.length)];
            heart.style.cssText = `
                position: fixed;
                left: ${x + (Math.random() * 100 - 50)}px;
                top: ${y + (Math.random() * 100 - 50)}px;
                font-size: ${20 + Math.random() * 15}px;
                animation: heartFloat 2.5s ease-out forwards;
                animation-delay: ${i * 0.15}s;
                pointer-events: none;
                z-index: 10000;
            `;
            
            document.body.appendChild(heart);
            
            setTimeout(() => {
                if (heart.parentNode) {
                    heart.parentNode.removeChild(heart);
                }
            }, 2500);
        }
    }
    
    createSparkleEffect() {
        const sparkles = ['✨', '⭐', '🌟', '💫', '⚡'];
        
        for (let i = 0; i < 8; i++) {
            const sparkle = document.createElement('div');
            sparkle.textContent = sparkles[Math.floor(Math.random() * sparkles.length)];
            sparkle.style.cssText = `
                position: fixed;
                left: ${this.catX + (Math.random() * 120 - 60)}px;
                top: ${this.catY + (Math.random() * 120 - 60)}px;
                font-size: ${15 + Math.random() * 10}px;
                animation: sparkle 1.5s ease-out forwards;
                animation-delay: ${i * 0.1}s;
                pointer-events: none;
                z-index: 10000;
            `;
            
            document.body.appendChild(sparkle);
            
            setTimeout(() => {
                if (sparkle.parentNode) {
                    sparkle.parentNode.removeChild(sparkle);
                }
            }, 1500);
        }
    }
    
    performTrick(trick) {
        switch (trick) {
            case 'spin':
                this.catEmoji.style.animation = 'catExcited 0.3s ease-in-out 6';
                this.catEmoji.textContent = '🙀';
                this.showMessage('Spinning! Wheee! 🌪️');
                break;
            case 'play':
                this.catEmoji.textContent = '😹';
                this.showMessage('Playtime! Let\'s have fun! 🎉');
                this.cat.classList.add('happy');
                break;
            case 'sleep':
                this.catEmoji.textContent = '😴';
                this.showMessage('Zzz... so sleepy... 💤');
                break;
            case 'happy':
                this.catEmoji.textContent = '😻';
                this.showMessage('I\'m so happy! 🌈');
                this.cat.classList.add('happy');
                this.createSparkleEffect();
                break;
        }
        
        setTimeout(() => {
            this.cat.classList.remove('happy');
            this.catEmoji.style.animation = '';
            this.catEmoji.textContent = this.expressions[this.currentExpression];
        }, 3000);
    }
    
    getDistance(x1, y1, x2, y2) {
        return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
    }
    
    // Public methods
    pause() {
        this.isWalking = false;
    }
    
    resume() {
        this.isWalking = false; // Cat stays fixed
    }
}

// Initialize Beautiful Cat
let beautifulCat;

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        beautifulCat = new BeautifulCat();
    });
} else {
    beautifulCat = new BeautifulCat();
}

// Global access
window.beautifulCat = beautifulCat;

console.log('🐱 Beautiful Cat System Loaded!');
console.log('💕 Click anywhere to pet the cat!');
console.log('⌨️ Keyboard shortcuts: C=spin, P=play, S=sleep, H=happy');
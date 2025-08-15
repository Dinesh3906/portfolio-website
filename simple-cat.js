// Super Simple Cat that WILL work
const cat = document.getElementById('cat');
let catX = 100;
let catY = 100;
let targetX = 100;
let targetY = 100;
let expressions = ['🐱', '😸', '😻', '🙀', '😺'];
let currentExpression = 0;

console.log('🐱 Cat found:', !!cat);

if (cat) {
    // Make cat visible immediately
    cat.style.display = 'block';
    cat.style.visibility = 'visible';
    
    // Change expressions every 2 seconds
    setInterval(() => {
        currentExpression = (currentExpression + 1) % expressions.length;
        cat.textContent = expressions[currentExpression];
        console.log('🐱 Changed to:', expressions[currentExpression]);
    }, 2000);
    
    // Move cat around screen edges
    function moveCat() {
        // Simple wall following
        if (catX < 50) {
            targetX = window.innerWidth - 50;
            targetY = Math.random() * (window.innerHeight - 100) + 50;
        } else if (catX > window.innerWidth - 50) {
            targetX = 50;
            targetY = Math.random() * (window.innerHeight - 100) + 50;
        } else if (catY < 50) {
            targetY = window.innerHeight - 50;
            targetX = Math.random() * (window.innerWidth - 100) + 50;
        } else if (catY > window.innerHeight - 50) {
            targetY = 50;
            targetX = Math.random() * (window.innerWidth - 100) + 50;
        }
        
        // Move towards target
        const dx = targetX - catX;
        const dy = targetY - catY;
        
        catX += dx * 0.02;
        catY += dy * 0.02;
        
        // Update position
        cat.style.left = catX + 'px';
        cat.style.top = catY + 'px';
        
        requestAnimationFrame(moveCat);
    }
    
    // Start moving after 1 second
    setTimeout(() => {
        console.log('🐱 Starting movement');
        targetX = window.innerWidth - 50;
        targetY = 50;
        moveCat();
    }, 1000);
    
    // Click handler
    document.addEventListener('click', (e) => {
        // Create heart at click position
        const heart = document.createElement('div');
        heart.textContent = '💕';
        heart.style.cssText = `
            position: fixed;
            left: ${e.clientX}px;
            top: ${e.clientY}px;
            font-size: 30px;
            pointer-events: none;
            z-index: 10000;
            animation: heartFloat 2s ease-out forwards;
        `;
        document.body.appendChild(heart);
        
        // Remove heart after animation
        setTimeout(() => {
            if (heart.parentNode) {
                heart.parentNode.removeChild(heart);
            }
        }, 2000);
        
        // Make cat happy
        cat.textContent = '😻';
        cat.style.fontSize = '80px';
        
        setTimeout(() => {
            cat.style.fontSize = '60px';
        }, 500);
        
        console.log('🐱 Cat petted!');
    });
    
    console.log('🐱 Simple cat initialized successfully!');
} else {
    console.error('❌ Cat element not found!');
}

// Add heart animation CSS
const style = document.createElement('style');
style.textContent = `
    @keyframes heartFloat {
        0% {
            transform: translate(-50%, -50%) scale(0);
            opacity: 1;
        }
        50% {
            transform: translate(-50%, -50%) scale(1.5);
            opacity: 0.8;
        }
        100% {
            transform: translate(-50%, -50%) scale(2) translateY(-50px);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);
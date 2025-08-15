// ===== ADVANCED WALKING ROBOT CONTROLLER =====
class AdvancedRobot {
    constructor() {
        this.robot = document.getElementById('advanced-robot');
        this.isWalking = false;
        this.mouseX = 0;
        this.mouseY = 0;
        this.robotX = window.innerWidth / 2;
        this.robotY = window.innerHeight / 2;
        this.targetX = this.robotX;
        this.targetY = this.robotY;
        this.walkSpeed = 0.08;
        this.isVisible = true;
        this.lastMoveTime = Date.now();
        this.idleTimer = null;
        this.walkingDirection = 1;
        this.autonomousMode = true;
        this.autonomousTimer = null;
        this.currentWallSide = 'bottom'; // 'top', 'right', 'bottom', 'left'
        this.wallProgress = 0;
        this.isOnWall = false;
        this.cuteActionTimer = null;
        this.lastCuteAction = Date.now();
        this.greetings = ['Hi! 👋', 'Hello! 😊', 'Namaste! 🙏', 'Hey there! 🤖', 'Greetings! ✨'];
        
        this.init();
    }
    
    init() {
        if (!this.robot) return;
        
        // Start autonomous walking after entry animation
        setTimeout(() => {
            this.startWalking();
            this.enableWallWalking();
            this.scheduleCuteActions();
        }, 3000);
        
        // Mouse move handler for interaction
        document.addEventListener('mousemove', (e) => {
            this.mouseX = e.clientX;
            this.mouseY = e.clientY;
            this.lastMoveTime = Date.now();
            
            // Robot looks towards mouse when it's nearby
            const distance = this.getDistance(this.robotX, this.robotY, this.mouseX, this.mouseY);
            if (distance < 150) {
                this.lookAtMouse();
            }
        });
        
        // Click handler for greetings and reactions
        document.addEventListener('click', (e) => {
            this.greetUser(e.clientX, e.clientY);
        });
        
        // Scroll handler
        window.addEventListener('scroll', () => {
            this.handleScroll();
        });
        
        // Resize handler
        window.addEventListener('resize', () => {
            this.handleResize();
            this.generateWaypoints();
        });
        
        // Keyboard interactions
        document.addEventListener('keydown', (e) => {
            this.handleKeyPress(e);
        });
        
        // Initialize wall walking
        this.wallProgress = 0;
        
        // Start animation loop
        this.animate();
        
        console.log('🤖 Advanced Walking Robot initialized!');
    }
    
    startWalking() {
        this.isWalking = true;
        this.robot.classList.add('walking');
        
        // Show welcome message
        this.showRobotMessage("ROBO-DEV v2.0 ONLINE! 🤖 Ready to assist!");
    }
    
    enableWallWalking() {
        this.autonomousMode = true;
        this.isOnWall = true;
        this.robot.classList.add('wall-walking');
        this.moveToWall();
        console.log('🚶 Robot starting wall walking mode');
    }
    
    moveToWall() {
        const margin = 50;
        switch(this.currentWallSide) {
            case 'top':
                this.targetX = margin + (this.wallProgress * (window.innerWidth - 2 * margin));
                this.targetY = margin;
                this.robot.classList.add('on-top');
                break;
            case 'right':
                this.targetX = window.innerWidth - margin;
                this.targetY = margin + (this.wallProgress * (window.innerHeight - 2 * margin));
                this.robot.classList.add('on-right');
                break;
            case 'bottom':
                this.targetX = window.innerWidth - margin - (this.wallProgress * (window.innerWidth - 2 * margin));
                this.targetY = window.innerHeight - margin;
                this.robot.classList.add('on-bottom');
                break;
            case 'left':
                this.targetX = margin;
                this.targetY = window.innerHeight - margin - (this.wallProgress * (window.innerHeight - 2 * margin));
                this.robot.classList.add('on-left');
                break;
        }
    }
    
    scheduleCuteActions() {
        const randomDelay = 3000 + Math.random() * 7000; // 3-10 seconds
        this.cuteActionTimer = setTimeout(() => {
            this.performCuteAction();
            this.scheduleCuteActions(); // Schedule next action
        }, randomDelay);
    }
    
    performCuteAction() {
        const actions = ['backflip', 'frontflip', 'jump', 'spin', 'wave'];
        const randomAction = actions[Math.floor(Math.random() * actions.length)];
        
        switch(randomAction) {
            case 'backflip':
                this.doBackflip();
                break;
            case 'frontflip':
                this.doFrontflip();
                break;
            case 'jump':
                this.doJump();
                break;
            case 'spin':
                this.doSpin();
                break;
            case 'wave':
                this.doWave();
                break;
        }
    }
    
    doBackflip() {
        this.robot.classList.add('flipping');
        this.showRobotMessage("Wheee! Backflip! 🤸‍♂️");
        setTimeout(() => {
            this.robot.classList.remove('flipping');
        }, 1200);
    }
    
    doFrontflip() {
        this.robot.classList.add('front-flipping');
        this.showRobotMessage("Front flip time! 🤸");
        setTimeout(() => {
            this.robot.classList.remove('front-flipping');
        }, 1000);
    }
    
    doJump() {
        const robotContainer = this.robot.querySelector('.robot-container');
        if (robotContainer) {
            robotContainer.style.animation = 'robotJump 0.6s ease-out';
            this.showRobotMessage("Boing! 🦘");
            setTimeout(() => {
                robotContainer.style.animation = 'robotEntry 3s ease-out forwards, robotIdleFloat 2s ease-in-out infinite 3s';
            }, 600);
        }
    }
    
    doSpin() {
        const robotContainer = this.robot.querySelector('.robot-container');
        if (robotContainer) {
            robotContainer.style.animation = 'robotSpin 1s ease-in-out';
            this.showRobotMessage("Spinning! 🌪️");
            setTimeout(() => {
                robotContainer.style.animation = 'robotEntry 3s ease-out forwards, robotIdleFloat 2s ease-in-out infinite 3s';
            }, 1000);
        }
    }
    
    doWave() {
        this.robot.classList.add('greeting');
        this.showRobotMessage("Hello everyone! 👋");
        setTimeout(() => {
            this.robot.classList.remove('greeting');
        }, 1500);
    }
    
    lookAtMouse() {
        const robotHead = this.robot.querySelector('.robot-head');
        if (robotHead) {
            const dx = this.mouseX - this.robotX;
            const angle = Math.atan2(0, dx) * (180 / Math.PI);
            const clampedAngle = Math.max(-30, Math.min(30, angle * 0.3));
            robotHead.style.transform = `rotateY(${clampedAngle}deg)`;
            
            setTimeout(() => {
                robotHead.style.transform = 'rotateY(0deg)';
            }, 2000);
        }
    }
    
    generateWaypoints() {
        this.waypoints = [];
        const margin = 150;
        const cols = 4;
        const rows = 3;
        
        for (let row = 0; row < rows; row++) {
            for (let col = 0; col < cols; col++) {
                const x = margin + (col * (window.innerWidth - 2 * margin) / (cols - 1));
                const y = margin + (row * (window.innerHeight - 2 * margin) / (rows - 1));
                this.waypoints.push({ x, y });
            }
        }
        
        // Shuffle waypoints for random walking pattern
        this.shuffleArray(this.waypoints);
    }
    
    shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
    }
    
    getDistance(x1, y1, x2, y2) {
        return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
    }
    
    animate() {
        if (!this.robot || !this.isWalking) {
            requestAnimationFrame(() => this.animate());
            return;
        }
        
        // Wall walking behavior
        if (this.autonomousMode && this.isOnWall) {
            this.wallProgress += 0.003; // Slow walking speed
            
            if (this.wallProgress >= 1) {
                this.wallProgress = 0;
                this.switchWallSide();
            }
            
            this.moveToWall();
        }
        
        // Smooth walking with easing
        const dx = this.targetX - this.robotX;
        const dy = this.targetY - this.robotY;
        
        // Apply easing
        this.robotX += dx * this.walkSpeed;
        this.robotY += dy * this.walkSpeed;
        
        // Keep robot within viewport bounds
        const margin = 120;
        this.robotX = Math.max(margin, Math.min(window.innerWidth - margin, this.robotX));
        this.robotY = Math.max(margin, Math.min(window.innerHeight - margin, this.robotY));
        
        // Update robot position
        this.robot.style.left = this.robotX + 'px';
        this.robot.style.top = this.robotY + 'px';
        this.robot.style.transform = 'translate(-50%, -50%)';
        
        // Add walking direction and rotation
        const angle = Math.atan2(dy, dx) * (180 / Math.PI);
        const rotation = angle * 0.05; // Subtle rotation
        
        // Determine walking direction for sprite flipping
        if (Math.abs(dx) > 5) {
            this.walkingDirection = dx > 0 ? 1 : -1;
        }
        
        const robotBody = this.robot.querySelector('.robot-body');
        if (robotBody) {
            robotBody.style.transform = `rotateY(${rotation}deg) scaleX(${this.walkingDirection})`;
        }
        
        // Add walking bounce effect
        const walkingSpeed = Math.sqrt(dx * dx + dy * dy);
        if (walkingSpeed > 2) {
            this.robot.classList.add('walking-active');
        } else {
            this.robot.classList.remove('walking-active');
        }
        
        // Continue animation
        requestAnimationFrame(() => this.animate());
    }
    
    greetUser(x, y) {
        // Create cute sparkle effect
        this.createSparkleEffect(x, y);
        
        // Make robot wave and greet
        this.doWave();
        
        // Show random greeting
        const greeting = this.greetings[Math.floor(Math.random() * this.greetings.length)];
        this.showRobotMessage(greeting);
        
        // Make robot happy
        this.robot.classList.add('happy', 'excited');
        setTimeout(() => {
            this.robot.classList.remove('happy', 'excited');
        }, 2000);
        
        // Look towards click
        this.lookTowards(x, y);
    }
    
    lookTowards(x, y) {
        const dx = x - this.robotX;
        const dy = y - this.robotY;
        const angle = Math.atan2(dy, dx) * (180 / Math.PI);
        
        const robotHead = this.robot.querySelector('.robot-head');
        if (robotHead) {
            const headAngle = Math.max(-45, Math.min(45, angle * 0.2));
            robotHead.style.transform = `rotateY(${headAngle}deg)`;
            
            setTimeout(() => {
                robotHead.style.transform = 'rotateY(0deg)';
            }, 3000);
        }
    }
    
    switchWallSide() {
        // Remove current wall class
        this.robot.classList.remove('on-top', 'on-right', 'on-bottom', 'on-left');
        
        // Switch to next wall
        const walls = ['top', 'right', 'bottom', 'left'];
        const currentIndex = walls.indexOf(this.currentWallSide);
        this.currentWallSide = walls[(currentIndex + 1) % walls.length];
        
        // Sometimes do a cute action when switching walls
        if (Math.random() < 0.3) {
            setTimeout(() => {
                this.performCuteAction();
            }, 500);
        }
    }
    
    createSparkleEffect(x, y) {
        const sparkle = document.createElement('div');
        sparkle.className = 'sparkle-effect';
        sparkle.style.cssText = `
            position: fixed;
            left: ${x}px;
            top: ${y}px;
            width: 20px;
            height: 20px;
            background: radial-gradient(circle, #FFD700 0%, #FFFF00 50%, transparent 100%);
            border-radius: 50%;
            transform: translate(-50%, -50%) scale(0);
            animation: sparkleEffect 0.6s ease-out forwards;
            pointer-events: none;
            z-index: 10000;
            box-shadow: 0 0 20px #FFD700;
        `;
        
        document.body.appendChild(sparkle);
        
        // Create sparkle particles
        for (let i = 0; i < 8; i++) {
            const particle = document.createElement('div');
            const colors = ['#FFD700', '#FFFF00', '#FFA500', '#FF69B4', '#00FFFF'];
            const color = colors[Math.floor(Math.random() * colors.length)];
            
            particle.style.cssText = `
                position: fixed;
                left: ${x}px;
                top: ${y}px;
                width: 6px;
                height: 6px;
                background: ${color};
                border-radius: 50%;
                transform: translate(-50%, -50%);
                animation: sparkleParticleExplosion 1s ease-out forwards;
                animation-delay: ${i * 0.08}s;
                pointer-events: none;
                z-index: 10000;
                box-shadow: 0 0 15px ${color};
            `;
            document.body.appendChild(particle);
            
            setTimeout(() => {
                if (particle.parentNode) {
                    particle.parentNode.removeChild(particle);
                }
            }, 1000);
        }
        
        setTimeout(() => {
            if (sparkle.parentNode) {
                sparkle.parentNode.removeChild(sparkle);
            }
        }, 600);
    }
    
    robotJump() {
        const robotContainer = this.robot.querySelector('.robot-container');
        if (robotContainer) {
            robotContainer.style.animation = 'robotJump 0.8s ease-out';
            setTimeout(() => {
                robotContainer.style.animation = 'robotEntry 4s ease-out forwards, robotWalk 3s ease-in-out infinite 4s';
            }, 800);
        }
    }
    
    handleScroll() {
        const scrollY = window.scrollY;
        const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
        const scrollProgress = scrollY / maxScroll;
        
        // Adjust robot behavior based on scroll position
        if (scrollProgress > 0.8) {
            this.showRobotMessage("SCANNING: End of document reached! 📊");
        } else if (scrollProgress > 0.5) {
            this.showRobotMessage("ANALYSIS: Halfway through content! 🔍");
        }
    }
    
    handleResize() {
        // Adjust robot position on resize
        this.robotX = Math.min(this.robotX, window.innerWidth - 120);
        this.robotY = Math.min(this.robotY, window.innerHeight - 120);
    }
    
    handleKeyPress(e) {
        const messages = {
            'Enter': "COMMAND RECEIVED: Execute! ⚡",
            'Space': "SYSTEM: Jump protocol activated! 🚀",
            'Escape': "STATUS: Standby mode engaged! 🔋",
            'ArrowUp': "MOVEMENT: Ascending trajectory! ⬆️",
            'ArrowDown': "MOVEMENT: Descending trajectory! ⬇️",
            'ArrowLeft': "MOVEMENT: Left vector engaged! ⬅️",
            'ArrowRight': "MOVEMENT: Right vector engaged! ➡️"
        };
        
        if (messages[e.code]) {
            this.showRobotMessage(messages[e.code]);
            this.robotJump();
        }
    }
    
    showRobotMessage(message) {
        // Remove existing message
        const existingMessage = document.querySelector('.robot-message');
        if (existingMessage) {
            existingMessage.remove();
        }
        
        const messageElement = document.createElement('div');
        messageElement.className = 'robot-message';
        messageElement.textContent = message;
        messageElement.style.cssText = `
            position: fixed;
            left: ${this.robotX}px;
            top: ${this.robotY - 140}px;
            transform: translateX(-50%);
            background: rgba(0, 0, 0, 0.95);
            color: #00FFFF;
            padding: 12px 18px;
            border-radius: 15px;
            border: 2px solid #00FFFF;
            font-size: 13px;
            font-weight: 500;
            font-family: 'Courier New', monospace;
            z-index: 10001;
            pointer-events: none;
            backdrop-filter: blur(15px);
            box-shadow: 0 15px 35px rgba(0, 255, 255, 0.4);
            max-width: 250px;
            text-align: center;
            word-wrap: break-word;
            animation: robotMessageAppear 0.4s ease-out forwards;
            letter-spacing: 0.5px;
        `;
        
        document.body.appendChild(messageElement);
        
        setTimeout(() => {
            messageElement.style.animation = 'robotMessageDisappear 0.4s ease-out forwards';
            setTimeout(() => {
                if (messageElement.parentNode) {
                    messageElement.parentNode.removeChild(messageElement);
                }
            }, 400);
        }, 3500);
    }
    
    getRandomWalkMessage() {
        const messages = [
            "Walking along the walls! 🚶‍♂️",
            "Exploring the edges! 🔍",
            "Wall patrol mode! 🛡️",
            "Checking the perimeter! 👀",
            "Edge walking is fun! 😊",
            "Following the walls! 🏃‍♂️",
            "Boundary exploration! 🗺️",
            "Wall surfing! 🏄‍♂️"
        ];
        return messages[Math.floor(Math.random() * messages.length)];
    }
    
    // Public methods for external control
    hide() {
        if (this.robot) {
            this.robot.style.opacity = '0';
            this.robot.style.pointerEvents = 'none';
            this.isVisible = false;
        }
    }
    
    show() {
        if (this.robot) {
            this.robot.style.opacity = '1';
            this.robot.style.pointerEvents = 'none';
            this.isVisible = true;
        }
    }
    
    setWalkSpeed(speed) {
        this.walkSpeed = Math.max(0.01, Math.min(0.15, speed));
    }
    
    teleportTo(x, y) {
        this.robotX = x;
        this.robotY = y;
        this.targetX = x;
        this.targetY = y;
    }
    
    pauseWalking() {
        this.isWalking = false;
        this.disableAutonomousMode();
    }
    
    resumeWalking() {
        this.isWalking = true;
        this.enableAutonomousMode();
    }
}

// Add additional CSS animations for robot
const robotAnimations = document.createElement('style');
robotAnimations.textContent = `
    @keyframes sparkleEffect {
        0% {
            transform: translate(-50%, -50%) scale(0);
            opacity: 1;
        }
        50% {
            transform: translate(-50%, -50%) scale(2);
            opacity: 0.9;
        }
        100% {
            transform: translate(-50%, -50%) scale(3);
            opacity: 0;
        }
    }
    
    @keyframes sparkleParticleExplosion {
        0% {
            transform: translate(-50%, -50%) scale(1);
            opacity: 1;
        }
        100% {
            transform: translate(-50%, -50%) translate(${Math.random() * 200 - 100}px, ${Math.random() * 200 - 100}px) scale(0);
            opacity: 0;
        }
    }
    
    @keyframes robotJump {
        0%, 100% {
            transform: translateY(0px) scale(1);
        }
        50% {
            transform: translateY(-50px) scale(1.15);
        }
    }
    
    @keyframes robotMessageAppear {
        0% {
            transform: translateX(-50%) translateY(30px) scale(0.7);
            opacity: 0;
        }
        100% {
            transform: translateX(-50%) translateY(0px) scale(1);
            opacity: 1;
        }
    }
    
    @keyframes robotMessageDisappear {
        0% {
            transform: translateX(-50%) translateY(0px) scale(1);
            opacity: 1;
        }
        100% {
            transform: translateX(-50%) translateY(-30px) scale(0.7);
            opacity: 0;
        }
    }
    
    .advanced-robot.walking-active .robot-body {
        animation: robotWalkBounce 0.6s ease-in-out infinite;
    }
    
    @keyframes robotWalkBounce {
        0%, 100% {
            transform: translateY(0px);
        }
        50% {
            transform: translateY(-8px);
        }
    }
    
    .advanced-robot.autonomous .robot-head {
        animation: robotHeadScan 4s ease-in-out infinite, autonomousGlow 3s ease-in-out infinite;
    }
    
    @keyframes autonomousGlow {
        0%, 100% {
            filter: drop-shadow(0 0 10px rgba(0, 255, 255, 0.5));
        }
        50% {
            filter: drop-shadow(0 0 25px rgba(0, 255, 255, 0.8));
        }
    }
`;
document.head.appendChild(robotAnimations);

// Initialize Advanced Walking Robot
let advancedRobot;

// Wait for DOM to be ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        advancedRobot = new AdvancedRobot();
    });
} else {
    advancedRobot = new AdvancedRobot();
}

// Global access for debugging/control
window.advancedRobot = advancedRobot;

// Add special effects for different sections
const robotSectionEffects = {
    'hero': () => advancedRobot?.showRobotMessage("WELCOME: Portfolio initialization complete! 🏠"),
    'about': () => advancedRobot?.showRobotMessage("SCAN: Analyzing developer profile... 📖"),
    'skills': () => advancedRobot?.showRobotMessage("ASSESSMENT: Impressive skill matrix detected! ⚡"),
    'projects': () => advancedRobot?.showRobotMessage("REVIEW: Outstanding project portfolio! 🚀"),
    'contact': () => advancedRobot?.showRobotMessage("PROTOCOL: Communication channels open! 📧")
};

// Trigger section effects when scrolling
const robotSectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting && robotSectionEffects[entry.target.id]) {
            robotSectionEffects[entry.target.id]();
        }
    });
}, { threshold: 0.5 });

// Observe all main sections
document.querySelectorAll('section[id]').forEach(section => {
    robotSectionObserver.observe(section);
});

console.log('🤖 Advanced Walking Robot System Loaded!');
console.log('🚶 Features: Autonomous Walking, Mouse Interaction, Holographic Effects');
console.log('⚡ Try clicking around and watch the robot explore your portfolio!');
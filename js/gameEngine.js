// Game Engine - Main game logic and rendering
class GameEngine {
    constructor() {
        this.canvas = null;
        this.ctx = null;
        this.assetLoader = null;
        this.animationManager = null;
        this.scrollManager = null;
        this.questionManager = null;
        
        this.gameState = 'loading'; // loading, start, running, question, gameOver
        this.correctAnswers = 0; // Track correct answers properly
        this.incorrectAnswers = 0; // Track incorrect answers
        this.isRunning = false;
        this.chestTriggered = false;
        
        // Timer system for questions
        this.questionTimer = null;
        this.timeRemaining = 12.3; // 12.3 seconds per question
        this.timerStartTime = 0;
        
        this.characterX = 375; // Character always in center
        this.characterY = 340; // Position character ON the dock (dock is at 370, character on top)
        this.chestY = 348; // Position chest just a hair lower than character
        
        this.init();
    }

    async init() {
        // Get canvas and context
        this.canvas = document.getElementById('gameCanvas');
        this.ctx = this.canvas.getContext('2d');
        
        // Disable image smoothing for pixel-perfect rendering
        this.ctx.imageSmoothingEnabled = false;
        this.ctx.webkitImageSmoothingEnabled = false;
        this.ctx.mozImageSmoothingEnabled = false;
        
        // Initialize managers
        this.assetLoader = new AssetLoader();
        this.questionManager = new QuestionManager();
        
        try {
            // Load all assets
            await this.assetLoader.loadAllAssets();
            
            // Initialize other managers after assets are loaded
            this.animationManager = new AnimationManager(this.assetLoader);
            this.scrollManager = new ScrollManager(this.assetLoader);
            
            // Setup animations
            this.animationManager.setupCharacterAnimation();
            this.animationManager.setupChestAnimation();
            
            // Setup event listeners
            this.setupEventListeners();
            
            // Start game
            this.gameState = 'start';
            this.showStartScreen();
            this.gameLoop();
            
        } catch (error) {
            console.error('Failed to initialize game:', error);
        }
    }

    setupEventListeners() {
        // Start button
        const startButton = document.getElementById('startButton');
        startButton.addEventListener('click', () => this.startGame());
        
        // Run button
        const runButton = document.getElementById('runButton');
        runButton.addEventListener('click', () => this.toggleRunning());
        
        // Restart button
        const restartButton = document.getElementById('restartButton');
        restartButton.addEventListener('click', () => this.restart());
        
        // Keyboard controls
        document.addEventListener('keydown', (e) => {
            if (e.code === 'Space') {
                e.preventDefault();
                if (this.gameState === 'start') {
                    this.startGame();
                } else {
                    this.toggleRunning();
                }
            }
        });
        
        // Make this instance globally available for question manager
        window.gameEngine = this;
        
        // Temporary debug function for testing ending sequence
        window.testEndingSequence = () => {
            console.log('Debug: Manual ending sequence test triggered');
            this.gameWon();
        };
    }

    showStartScreen() {
        document.getElementById('startScreen').style.display = 'flex';
        document.getElementById('gameContainer').classList.add('hidden');
    }

    startGame() {
        document.getElementById('startScreen').style.display = 'none';
        document.getElementById('gameContainer').classList.remove('hidden');
        this.gameState = 'ready';
        
        // Set initial button text
        const runButton = document.getElementById('runButton');
        runButton.textContent = 'START';
    }

    toggleRunning() {
        console.log(`toggleRunning called - current state: ${this.gameState}, isRunning: ${this.isRunning}`);
        
        const runButton = document.getElementById('runButton');
        console.log(`Current button text: ${runButton.textContent}`);
        
        if (runButton.textContent === 'START') {
            // Start the game for the first time
            this.isRunning = true;
            runButton.textContent = 'RESET';
            this.animationManager.startAnimation('character_run');
            this.scrollManager.startScrolling();
            this.gameState = 'running';
            this.chestTriggered = false;
            console.log('Game started - button changed to RESET');
        } else {
            // Force a complete page refresh - bypass cache and reload everything
            console.log('Forcing complete page refresh with cache bypass...');
            
            // Stop everything immediately
            if (this.gameLoopId) {
                cancelAnimationFrame(this.gameLoopId);
            }
            
            // Use location.href with timestamp to bypass any cache
            const url = window.location.href.split('?')[0] + '?t=' + Date.now();
            window.location.href = url;
        }
    }

    handleAnswerResult(isCorrect) {
        // Clear any active timer
        this.clearQuestionTimer();
        
        if (isCorrect) {
            this.correctAnswers++; // Count correct answers
            console.log(`✓ Correct answer! Total correct: ${this.correctAnswers}`);
        } else {
            this.incorrectAnswers++; // Count incorrect answers
            console.log(`✗ Wrong answer! Total incorrect: ${this.incorrectAnswers}`);
        }
        
        console.log(`Current score: ${this.correctAnswers} correct, ${this.incorrectAnswers} incorrect, Total questions so far: ${this.correctAnswers + this.incorrectAnswers}`);
        
        // Move to next question
        const hasMoreQuestions = this.questionManager.nextQuestion();
        
        if (!hasMoreQuestions) {
            console.log('Game completed - triggering victory sequence');
            this.gameWon();
            return;
        }
        
        // Continue running
        this.scrollManager.moveToNextBackground();
        this.gameState = 'ready';
        this.chestTriggered = false;
        this.updateQuestionCounter();
        
        // Restart running automatically without changing button text
        setTimeout(() => {
            if (this.gameState === 'ready') {
                this.isRunning = true;
                this.animationManager.startAnimation('character_run');
                this.scrollManager.startScrolling();
                this.gameState = 'running';
                // Button stays as "RESET" - don't change it
            }
        }, 1000);
    }

    gameLoop() {
        // Stop the entire game loop when in victory state
        if (this.gameState === 'victory') {
            return; // Don't continue any game processing
        }
        
        // Clear canvas
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Update animations
        this.animationManager.updateAnimations();
        
        // Update scrolling
        this.scrollManager.update();
        
        // Check for chest collision
        if (this.isRunning && !this.chestTriggered && this.scrollManager.isChestAtCharacter()) {
            this.triggerQuestion();
        }
        
        // Render game
        this.render();
        
        // Continue game loop only if not in victory state
        if (this.gameState !== 'victory') {
            requestAnimationFrame(() => this.gameLoop());
        }
    }

    // Timer methods for question timing
    startQuestionTimer() {
        this.timeRemaining = 12.3; // Reset timer
        this.timerStartTime = Date.now();
        
        // Reset timer expired flag in question manager
        if (this.questionManager) {
            this.questionManager.timeExpired = false;
        }
        
        this.questionTimer = setInterval(() => {
            const elapsed = (Date.now() - this.timerStartTime) / 1000;
            this.timeRemaining = Math.max(0, 12.3 - elapsed);
            
            // Update timer display
            this.updateTimerDisplay();
            
            // Time's up!
            if (this.timeRemaining <= 0) {
                console.log("Time's up! Marking as incorrect.");
                // Set expired flag to prevent further answers
                if (this.questionManager) {
                    this.questionManager.timeExpired = true;
                }
                this.handleAnswerResult(false); // Mark as incorrect
            }
        }, 50); // Update every 50ms for smooth countdown
    }

    clearQuestionTimer() {
        if (this.questionTimer) {
            clearInterval(this.questionTimer);
            this.questionTimer = null;
        }
    }

    updateTimerDisplay() {
        const timerElement = document.getElementById('questionTimer');
        if (timerElement) {
            timerElement.textContent = this.timeRemaining.toFixed(2);
            
            // Change color as time runs out (adjusted for 12.3 second timer)
            if (this.timeRemaining < 4) {
                timerElement.style.color = '#ff0000'; // Red
            } else if (this.timeRemaining < 6) {
                timerElement.style.color = '#ff8800'; // Orange
            } else {
                timerElement.style.color = '#ffffff'; // White
            }
        }
    }

    render() {
        // Don't render the normal game if we're in victory state
        if (this.gameState === 'victory') {
            return; // Let the ending sequence handle all drawing
        }
        
        const ctx = this.ctx;
        const canvasWidth = this.canvas.width;
        const canvasHeight = this.canvas.height;
        
        // Draw scrolling background
        this.scrollManager.drawScrollingBackground(ctx, canvasWidth, canvasHeight);
        
        // Draw static floor
        this.scrollManager.drawStaticFloor(ctx, canvasWidth, canvasHeight);
        
        // Draw chest
        this.drawChest(ctx);
        
        // Draw character
        this.drawCharacter(ctx);
        
        // Waves are only used on start screen, not in gameplay
    }

    drawCharacter(ctx) {
        let characterSprite;
        
        if (this.isRunning) {
            characterSprite = this.animationManager.getCurrentFrame('character_run');
        } else {
            characterSprite = this.assetLoader.getAsset('character_1');
        }
        
        if (characterSprite) {
            const spriteWidth = 64;
            const spriteHeight = 64;
            
            ctx.drawImage(
                characterSprite,
                this.characterX - spriteWidth / 2,
                this.characterY - spriteHeight / 2,
                spriteWidth,
                spriteHeight
            );
        }
    }

    drawChest(ctx) {
        const chestX = this.scrollManager.getChestScreenPosition();
        
        if (chestX > -100 && chestX < this.canvas.width + 100) {
            let chestSprite;
            
            if (this.chestTriggered) {
                chestSprite = this.animationManager.getCurrentFrame('chest_open');
            } else {
                chestSprite = this.assetLoader.getAsset('chest_closed');
            }
            
            if (chestSprite) {
                const chestWidth = 48;
                const chestHeight = 48;
                
                ctx.drawImage(
                    chestSprite,
                    chestX - chestWidth / 2,
                    this.chestY - chestHeight / 2,
                    chestWidth,
                    chestHeight
                );
            }
        }
    }

    drawWaves(ctx, canvasWidth, canvasHeight) {
        const wave = this.assetLoader.getAsset('wave');
        if (!wave) return;
        
        // Draw waves at the bottom
        const waveY = canvasHeight - 40;
        const waveWidth = wave.width || 64;
        const tilesNeeded = Math.ceil(canvasWidth / waveWidth) + 1;
        
        for (let i = 0; i < tilesNeeded; i++) {
            ctx.drawImage(
                wave,
                i * waveWidth,
                waveY,
                waveWidth,
                40
            );
        }
    }

    triggerQuestion() {
        this.chestTriggered = true;
        this.isRunning = false;
        this.gameState = 'question';
        
        // Don't change button text here - keep it as "RESET"
        
        this.animationManager.stopAnimation('character_run');
        this.animationManager.startAnimation('chest_open');
        this.scrollManager.stopScrolling();
        
        // Show question after chest opens
        setTimeout(() => {
            this.questionManager.showQuestion();
            this.startQuestionTimer(); // Start the 12.3 second timer
        }, 1000);
    }

    updateQuestionCounter() {
        const progress = this.questionManager.getProgress();
        const questionElement = document.getElementById('questionCount');
        questionElement.textContent = progress.current;
    }

    gameOver() {
        this.gameState = 'gameOver';
        this.isRunning = false;
        
        const gameOverScreen = document.getElementById('gameOverScreen');
        const finalScore = document.getElementById('finalScore');
        
        const progress = this.questionManager.getProgress();
        finalScore.textContent = `You answered ${this.correctAnswers} out of ${progress.total} questions correctly!`;
        
        gameOverScreen.classList.remove('hidden');
    }

    gameWon() {
        console.log('Victory achieved - starting ending sequence');
        this.gameState = 'victory';
        this.isRunning = false;
        
        // Start the ending sequence
        this.startEndingSequence();
    }

    startEndingSequence() {
        console.log('Initializing ending sequence');
        // Hide the question interface and game UI
        const questionInterface = document.getElementById('questionInterface');
        const controlsDiv = document.querySelector('.controls-bar');
        const gameStatsDiv = document.querySelector('.game-stats');
        
        if (questionInterface) {
            questionInterface.classList.add('hidden');
        }
        if (controlsDiv) {
            controlsDiv.style.display = 'none';
        }
        if (gameStatsDiv) {
            gameStatsDiv.style.display = 'none';
        }
        
        // Initialize ending sequence with score information
        const progress = this.questionManager.getProgress();
        this.endingSequence = new EndingSequence(this.canvas, this.ctx, this.assetLoader);
        this.endingSequence.start(this.correctAnswers, this.incorrectAnswers, progress.total);
    }

    restart() {
        // Force a complete page refresh with cache bypass
        console.log('Restart requested - forcing complete page refresh with cache bypass...');
        if (this.gameLoopId) {
            cancelAnimationFrame(this.gameLoopId);
        }
        const url = window.location.href.split('?')[0] + '?t=' + Date.now();
        window.location.href = url;
    }

}

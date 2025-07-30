// Main entry point - Initialize the game
document.addEventListener('DOMContentLoaded', () => {
    console.log('Walking the Lore Path: A Badgers Trivia - Loading...');
    
    // Initialize the music manager
    const musicManager = new MusicManager();
    window.musicManager = musicManager; // Make it globally accessible
    
    // Initialize the game engine
    const game = new GameEngine();
    
    // Set up music toggle button
    const musicButton = document.getElementById('musicButton');
    if (musicButton) {
        musicButton.addEventListener('click', () => {
            musicManager.toggleMusic();
            updateMusicButtonText();
        });
    }
    
    // Update music button text based on state
    function updateMusicButtonText() {
        if (musicButton) {
            if (musicManager.isPlaying) {
                musicButton.textContent = '♪ ON';
                musicButton.classList.remove('muted');
            } else {
                musicButton.textContent = '♪ OFF';
                musicButton.classList.add('muted');
            }
        }
    }
    
    // Start music when the game begins (user interaction required)
    const originalStartGame = game.startGame.bind(game);
    game.startGame = function() {
        originalStartGame();
        // Start menu music when user clicks start game (this counts as user interaction)
        setTimeout(() => {
            musicManager.startMenuMusic();
            updateMusicButtonText();
        }, 100);
    };
    
    // Switch to game music when running starts
    const originalToggleRunning = game.toggleRunning.bind(game);
    game.toggleRunning = function() {
        const wasReady = game.gameState === 'ready';
        originalToggleRunning();
        
        // If we just started running, switch to game music
        if (wasReady && game.gameState === 'running') {
            setTimeout(() => {
                musicManager.startGameMusic();
                updateMusicButtonText();
            }, 100);
        }
    };
    
    // Add some debugging info
    console.log('Game initialized! Controls:');
    console.log('- Click START button to begin, RESET to restart');
    console.log('- Click music button to toggle background music');
    console.log('- Answer questions when they appear (you have 12.3 seconds each)');
    console.log('- Complete all 40 randomly selected XRP trivia questions to win');
    
    // Handle window resize for responsive canvas
    function handleResize() {
        const canvas = document.getElementById('gameCanvas');
        const container = canvas.parentElement;
        
        // Keep original aspect ratio
        const aspectRatio = 800 / 480;
        const containerWidth = container.clientWidth;
        const containerHeight = container.clientHeight;
        
        let newWidth = containerWidth;
        let newHeight = newWidth / aspectRatio;
        
        if (newHeight > containerHeight) {
            newHeight = containerHeight;
            newWidth = newHeight * aspectRatio;
        }
        
        // Ensure integer scaling for pixel-perfect rendering
        const scale = Math.floor(Math.min(newWidth / 800, newHeight / 480));
        if (scale >= 1) {
            canvas.style.width = (800 * scale) + 'px';
            canvas.style.height = (480 * scale) + 'px';
        }
    }
    
    // Set up resize handler
    window.addEventListener('resize', handleResize);
    handleResize(); // Initial sizing
    
    // Remove loading indicator when game is ready
    const checkGameReady = () => {
        if (game.gameState === 'start') {
            // Game is ready, no loading indicator needed
        } else {
            setTimeout(checkGameReady, 100);
        }
    };
    checkGameReady();
});

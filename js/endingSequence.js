// Ending Sequence - Victory animation and ending screen
class EndingSequence {
    constructor(canvas, ctx, assetLoader) {
        this.canvas = canvas;
        this.ctx = ctx;
        this.assetLoader = assetLoader;
        
        this.characterX = 50; // Start from left side of bridge
        this.characterY = 260; // Position on bridge surface
        this.animationFrame = 0;
        this.walkingSpeed = 2;
        this.isWalking = false;
        this.animationRunning = false;
        this.victoryShown = false;
        this.victoryScreenActive = false;
        this.victoryRedrawInterval = null;
        this.correctAnswers = 0;
        this.incorrectAnswers = 0;
        this.totalQuestions = 0;
    }

    start(correctAnswers = 0, incorrectAnswers = 0, totalQuestions = 40) {
        this.correctAnswers = correctAnswers;
        this.incorrectAnswers = incorrectAnswers;
        this.totalQuestions = totalQuestions;
        this.characterX = 50;
        this.characterY = 260;
        this.isWalking = true;
        this.animationRunning = true;
        this.victoryShown = false;
        console.log('Starting victory ending sequence...');
        console.log(`Final Score: ${correctAnswers} correct, ${incorrectAnswers} incorrect out of ${totalQuestions} total`);
        
        // Backup timer to force victory message if animation doesn't trigger it
        setTimeout(() => {
            if (!this.victoryShown) {
                console.log('Debug: Backup timer triggered victory message');
                this.victoryShown = true;
                this.showVictoryMessage();
            }
        }, 4000); // Show victory after 4 seconds regardless
        
        this.animate();
    }

    animate() {
        if (!this.animationRunning) return;
        
        // Move character across bridge and into castle
        if (this.characterX < 420) { // Reduced trigger distance
            this.characterX += this.walkingSpeed;
            this.animationFrame++;
            this.draw(); // Only draw while walking
        } else {
            this.isWalking = false; // Stop walking when fully inside castle
            if (!this.victoryShown) {
                this.victoryShown = true;
                console.log('Debug: Character reached castle, triggering victory message');
                // Show victory message immediately
                this.showVictoryMessage();
                return; // Stop the animation loop here
            }
        }
        
        if (this.animationRunning) {
            requestAnimationFrame(() => this.animate());
        }
    }

    draw() {
        // Clear canvas
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Draw ending background (castle scene)
        const endingAsset = this.assetLoader.getAsset('castle');
        if (endingAsset) {
            // Scale the ending image to fit the canvas
            this.ctx.drawImage(
                endingAsset,
                0, 0, endingAsset.width, endingAsset.height,
                0, 0, this.canvas.width, this.canvas.height
            );
        } else {
            // Fallback background
            this.ctx.fillStyle = '#87CEEB';
            this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
            
            // Draw simple castle
            this.ctx.fillStyle = '#8B4513';
            this.ctx.fillRect(600, 200, 150, 200);
            this.ctx.fillStyle = '#654321';
            this.ctx.fillRect(650, 150, 50, 50);
            
            // Castle text
            this.ctx.fillStyle = '#000';
            this.ctx.font = '12px "Press Start 2P"';
            this.ctx.fillText('CASTLE', 620, 300);
        }
        
        // Draw character
        this.drawCharacter();
    }

    drawCharacter() {
        // Only draw character if he hasn't entered the castle yet
        if (this.characterX >= 420) {
            return; // Character has disappeared into the castle
        }
        
        let characterSprite;
        
        if (this.isWalking) {
            // Cycle through walking animation frames
            const frameIndex = Math.floor(this.animationFrame / 10) % 5 + 1;
            characterSprite = this.assetLoader.getAsset(`character_${frameIndex}`);
        } else {
            // Standing still
            characterSprite = this.assetLoader.getAsset('character_1');
        }
        
        if (characterSprite) {
            this.ctx.drawImage(
                characterSprite,
                this.characterX,
                this.characterY,
                48, 48
            );
        } else {
            // Fallback character
            this.ctx.fillStyle = '#8B4513';
            this.ctx.fillRect(this.characterX, this.characterY, 32, 32);
            this.ctx.fillStyle = '#000';
            this.ctx.font = '8px Arial';
            this.ctx.fillText('HERO', this.characterX + 2, this.characterY + 20);
        }
    }

    showVictoryMessage() {
        console.log('Displaying victory message');
        
        // Trigger victory music celebration
        if (window.musicManager) {
            window.musicManager.celebrateVictory();
        }
        
        // Stop the animation loop since we're showing the final message
        this.animationRunning = false;
        this.victoryScreenActive = true;
        
        // Draw the victory screen initially
        this.drawVictoryScreen();
        
        // Set up persistent redrawing to ensure victory screen stays visible
        this.victoryRedrawInterval = setInterval(() => {
            if (this.victoryScreenActive) {
                this.drawVictoryScreen();
            }
        }, 100); // Redraw every 100ms to ensure it stays visible
        
        // Show restart button after a delay
        setTimeout(() => {
            this.showRestartButton();
        }, 2000);
    }

    drawVictoryScreen() {
        // Clear canvas one final time and draw just the ending background
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        const endingAsset = this.assetLoader.getAsset('castle');
        if (endingAsset) {
            this.ctx.drawImage(
                endingAsset,
                0, 0, endingAsset.width, endingAsset.height,
                0, 0, this.canvas.width, this.canvas.height
            );
        } else {
            this.ctx.fillStyle = '#87CEEB';
            this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        }
        
        // Semi-transparent overlay
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Victory text
        this.ctx.fillStyle = '#FFD700';
        this.ctx.font = 'bold 24px Arial, sans-serif';
        this.ctx.textAlign = 'center';
        this.ctx.fillText('Game Complete!', this.canvas.width / 2, 140);
        
        // Score display
        this.ctx.font = 'bold 16px Arial, sans-serif';
        this.ctx.fillStyle = '#00FF00'; // Green for correct answers
        this.ctx.fillText(`Correct Answers: ${this.correctAnswers}`, this.canvas.width / 2, 170);
        
        this.ctx.fillStyle = '#FF6B6B'; // Red for incorrect answers  
        this.ctx.fillText(`Incorrect Answers: ${this.incorrectAnswers}`, this.canvas.width / 2, 195);
        
        this.ctx.fillStyle = '#FFD700'; // Gold for total
        this.ctx.fillText(`Total Questions: ${this.totalQuestions}`, this.canvas.width / 2, 220);
        
        // Additional messages based on score
        this.ctx.font = 'bold 14px Arial, sans-serif';
        this.ctx.fillStyle = '#FFFFFF';
        const percentage = (this.correctAnswers / this.totalQuestions) * 100;
        if (this.correctAnswers === this.totalQuestions) {
            this.ctx.fillText('Perfect Score! Outstanding!', this.canvas.width / 2, 250);
        } else if (percentage >= 70) {
            this.ctx.fillText(`Great job! ${percentage.toFixed(1)}% correct!`, this.canvas.width / 2, 250);
        } else if (percentage >= 50) {
            this.ctx.fillText(`Good effort! ${percentage.toFixed(1)}% correct!`, this.canvas.width / 2, 250);
        } else {
            this.ctx.fillText(`Keep trying! ${percentage.toFixed(1)}% correct!`, this.canvas.width / 2, 250);
        }
        
        this.ctx.font = 'bold 12px Arial, sans-serif';
        this.ctx.fillText('The badger has reached the castle', this.canvas.width / 2, 280);
        this.ctx.fillText('and completed the journey!', this.canvas.width / 2, 300);
        
        this.ctx.textAlign = 'left';
        console.log('Victory screen rendered and will persist');
    }

    showRestartButton() {
        console.log('Debug: showRestartButton() called');
        
        // Create a restart button overlay
        const restartDiv = document.createElement('div');
        restartDiv.id = 'victoryRestart';
        restartDiv.style.cssText = `
            position: fixed;
            bottom: 100px;
            left: 50%;
            transform: translateX(-50%);
            z-index: 1000;
        `;
        
        const restartButton = document.createElement('button');
        restartButton.textContent = 'PLAY AGAIN';
        restartButton.className = 'pixel-button';
        restartButton.style.cssText = `
            background: #4CAF50;
            color: white;
            border: 3px solid #45a049;
            padding: 15px 30px;
            font-family: 'Press Start 2P', Arial, sans-serif;
            font-size: 14px;
            cursor: pointer;
            border-radius: 0;
            text-shadow: 2px 2px 0px #000;
            box-shadow: 4px 4px 0px #333;
            transition: all 0.1s;
        `;
        
        restartButton.onmouseover = () => {
            restartButton.style.background = '#45a049';
            restartButton.style.transform = 'translate(-2px, -2px)';
            restartButton.style.boxShadow = '6px 6px 0px #333';
        };
        
        restartButton.onmouseout = () => {
            restartButton.style.background = '#4CAF50';
            restartButton.style.transform = 'translate(0px, 0px)';
            restartButton.style.boxShadow = '4px 4px 0px #333';
        };
        
        restartButton.onclick = () => {
            console.log('Debug: Restart button clicked');
            this.restart();
        };
        
        restartDiv.appendChild(restartButton);
        document.body.appendChild(restartDiv);
        console.log('Debug: Restart button added to DOM');
    }

    restart() {
        console.log('Restarting game');
        
        // Stop victory screen redrawing
        this.victoryScreenActive = false;
        if (this.victoryRedrawInterval) {
            clearInterval(this.victoryRedrawInterval);
            this.victoryRedrawInterval = null;
        }
        
        // Remove the restart button
        const restartDiv = document.getElementById('victoryRestart');
        if (restartDiv) {
            restartDiv.remove();
        }
        
        // Show the game UI again
        const controlsDiv = document.querySelector('.controls-bar');
        const gameStatsDiv = document.querySelector('.game-stats');
        
        if (controlsDiv) {
            controlsDiv.style.display = 'flex';
        }
        if (gameStatsDiv) {
            gameStatsDiv.style.display = 'flex';
        }
        
        // Restart the game
        if (window.gameEngine) {
            window.gameEngine.restart();
        }
    }
}

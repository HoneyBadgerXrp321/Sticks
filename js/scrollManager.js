// Scroll Manager - Handles background scrolling and parallax effects
class ScrollManager {
    constructor(assetLoader) {
        this.assetLoader = assetLoader;
        this.backgroundOffset = 0;
        this.scrollSpeed = 2; // pixels per frame
        this.currentSkyIndex = 0;
        this.skyWidth = 800; // Assuming sky images are 800px wide
        this.isScrolling = false;
        this.chestPosition = 600; // Chest appears at this X position
        this.chestOffset = 0;
    }

    startScrolling() {
        this.isScrolling = true;
    }

    stopScrolling() {
        this.isScrolling = false;
    }

    update() {
        if (!this.isScrolling) return;

        // Update background offset
        this.backgroundOffset += this.scrollSpeed;
        this.chestOffset += this.scrollSpeed;

        // Check if we need to cycle to next sky background
        if (this.backgroundOffset >= this.skyWidth) {
            this.backgroundOffset = 0;
            this.currentSkyIndex = (this.currentSkyIndex + 1) % 4; // Cycle through Sky 1-4
        }
    }

    getCurrentSky() {
        const skyName = `sky_${this.currentSkyIndex + 1}`;
        return this.assetLoader.getAsset(skyName);
    }

    getNextSky() {
        const nextIndex = (this.currentSkyIndex + 1) % 4;
        const skyName = `sky_${nextIndex + 1}`;
        return this.assetLoader.getAsset(skyName);
    }

    drawScrollingBackground(ctx, canvasWidth, canvasHeight) {
        const currentSky = this.getCurrentSky();
        const nextSky = this.getNextSky();

        if (!currentSky || !nextSky) return;

        // Draw current sky to fill entire canvas
        ctx.drawImage(
            currentSky,
            -this.backgroundOffset,
            0,
            this.skyWidth,
            canvasHeight  // Fill full canvas height
        );

        // Draw next sky for seamless scrolling
        ctx.drawImage(
            nextSky,
            this.skyWidth - this.backgroundOffset,
            0,
            this.skyWidth,
            canvasHeight  // Fill full canvas height
        );
    }

    drawStaticFloor(ctx, canvasWidth, canvasHeight) {
        // Draw ripple waves underneath the dock
        this.drawRippleWaves(ctx, canvasWidth, canvasHeight);
        
        // Draw wooden dock/platform
        this.drawPixelDock(ctx, canvasWidth, canvasHeight);
    }

    drawRippleWaves(ctx, canvasWidth, canvasHeight) {
        const rippleWave = this.assetLoader.getAsset('ripplewave');
        
        if (!rippleWave) {
            console.log('Ripple wave asset missing - drawing fallback waves');
            // Fallback to simple blue waves if asset missing
            ctx.fillStyle = '#3B82F6';
            ctx.fillRect(0, canvasHeight - 100, canvasWidth, 100);
            return;
        }

        const waveWidth = rippleWave.width;
        const waveHeight = rippleWave.height;
        
        // Scale the wave to fit under the dock properly
        const targetWaveHeight = 100; // Height of water area under dock
        const waveY = canvasHeight - targetWaveHeight; // Start waves at bottom of canvas
        const scale = targetWaveHeight / waveHeight; // Scale to fit height
        const scaledWaveWidth = waveWidth * scale;
        
        const tilesNeeded = Math.ceil(canvasWidth / scaledWaveWidth) + 2;

        // Add animated scrolling to the waves
        const time = Date.now() * 0.001;
        const scrollOffset = (time * 30) % scaledWaveWidth;

        console.log('Drawing ripplewave.png - Original:', waveWidth, 'x', waveHeight, 'Scaled:', scaledWaveWidth, 'x', targetWaveHeight, 'at Y:', waveY);

        // Draw the ripple waves tiled and scaled across the width
        for (let i = 0; i < tilesNeeded; i++) {
            ctx.drawImage(
                rippleWave,
                0, 0, waveWidth, waveHeight, // Source: full image
                (i * scaledWaveWidth) - scrollOffset, waveY, scaledWaveWidth, targetWaveHeight // Destination: scaled and positioned
            );
        }
    }

    drawPixelDock(ctx, canvasWidth, canvasHeight) {
        const dockHeight = 30; // Made taller
        const dockY = canvasHeight - 110; // Position dock above the waves (waves take 100px)
        
        // Dock base - brown wooden color
        ctx.fillStyle = '#8B4513';
        ctx.fillRect(0, dockY, canvasWidth, dockHeight);
        
        // Dock planks - horizontal lines
        ctx.fillStyle = '#654321';
        for (let y = dockY; y < dockY + dockHeight; y += 6) {
            ctx.fillRect(0, y, canvasWidth, 2);
        }
        
        // Dock posts/supports - vertical pillars going into water
        ctx.fillStyle = '#5D4037';
        for (let x = 60; x < canvasWidth; x += 120) {
            // Post going down into water
            ctx.fillRect(x, dockY + dockHeight, 12, 50);
            
            // Post caps
            ctx.fillStyle = '#6D4C41';
            ctx.fillRect(x - 2, dockY + dockHeight, 16, 6);
            ctx.fillStyle = '#5D4037';
        }
        
        // Dock edge highlight for 8-bit effect
        ctx.fillStyle = '#A0522D';
        ctx.fillRect(0, dockY, canvasWidth, 3);
    }

    getChestScreenPosition() {
        // Calculate where the chest appears on screen
        return this.chestPosition - this.chestOffset;
    }

    isChestAtCharacter() {
        // Check if chest has reached the character position (center of screen)
        const chestScreenPos = this.getChestScreenPosition();
        return chestScreenPos <= 400 && chestScreenPos >= 350; // Character is at x=375
    }

    resetChestPosition() {
        // Reset chest for next question
        this.chestOffset = 0;
    }

    moveToNextBackground() {
        // Force move to next sky background
        this.currentSkyIndex = (this.currentSkyIndex + 1) % 4;
        this.backgroundOffset = 0;
        this.resetChestPosition();
    }
}

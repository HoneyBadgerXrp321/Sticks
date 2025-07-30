// Animation Manager - Handles all sprite animations
class AnimationManager {
    constructor(assetLoader) {
        this.assetLoader = assetLoader;
        this.animations = {};
    }

    createAnimation(name, frames, duration = 500) {
        this.animations[name] = {
            frames: frames,
            currentFrame: 0,
            duration: duration,
            timePerFrame: duration / frames.length,
            lastUpdate: 0,
            playing: false
        };
    }

    setupCharacterAnimation() {
        // Character running animation (frames 1-5)
        const characterFrames = [];
        for (let i = 1; i <= 5; i++) {
            characterFrames.push(`character_${i}`);
        }
        this.createAnimation('character_run', characterFrames, 800); // 800ms for full cycle
    }

    setupChestAnimation() {
        // Chest opening animation
        const chestFrames = ['chest_closed', 'chest_opening', 'chest_opened'];
        this.createAnimation('chest_open', chestFrames, 1000); // 1 second to open
    }

    startAnimation(name) {
        if (this.animations[name]) {
            this.animations[name].playing = true;
            this.animations[name].currentFrame = 0;
            this.animations[name].lastUpdate = Date.now();
        }
    }

    stopAnimation(name) {
        if (this.animations[name]) {
            this.animations[name].playing = false;
        }
    }

    updateAnimations() {
        const currentTime = Date.now();
        
        for (const [name, anim] of Object.entries(this.animations)) {
            if (!anim.playing) continue;

            const elapsed = currentTime - anim.lastUpdate;
            
            if (elapsed >= anim.timePerFrame) {
                anim.currentFrame = (anim.currentFrame + 1) % anim.frames.length;
                anim.lastUpdate = currentTime;
            }
        }
    }

    getCurrentFrame(animationName) {
        const anim = this.animations[animationName];
        if (!anim) return null;
        
        const frameName = anim.frames[anim.currentFrame];
        return this.assetLoader.getAsset(frameName);
    }

    isAnimationComplete(animationName) {
        const anim = this.animations[animationName];
        if (!anim || !anim.playing) return false;
        
        // For chest opening, check if we're on the last frame
        if (animationName === 'chest_open') {
            return anim.currentFrame === anim.frames.length - 1;
        }
        
        return false;
    }

    setAnimationFrame(animationName, frameIndex) {
        const anim = this.animations[animationName];
        if (anim && frameIndex >= 0 && frameIndex < anim.frames.length) {
            anim.currentFrame = frameIndex;
        }
    }
}

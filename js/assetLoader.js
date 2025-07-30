// Asset Loader - Handles loading all game sprites and images
class AssetLoader {
    constructor() {
        this.assets = {};
        this.loadPromises = [];
        this.totalAssets = 0;
        this.loadedAssets = 0;
    }

    loadImage(path, name) {
        const promise = new Promise((resolve, reject) => {
            const img = new Image();
            img.onload = () => {
                this.assets[name] = img;
                this.loadedAssets++;
                console.log(`Loaded: ${name} (${this.loadedAssets}/${this.totalAssets})`);
                resolve(img);
            };
            img.onerror = () => {
                console.error(`Failed to load: ${path}`);
                // Create a placeholder colored rectangle
                const canvas = document.createElement('canvas');
                const ctx = canvas.getContext('2d');
                canvas.width = 64;
                canvas.height = 64;
                ctx.fillStyle = '#ff00ff'; // Magenta placeholder
                ctx.fillRect(0, 0, 64, 64);
                ctx.fillStyle = '#000';
                ctx.font = '8px Arial';
                ctx.fillText('MISSING', 10, 32);
                this.assets[name] = canvas;
                this.loadedAssets++;
                resolve(canvas);
            };
            img.src = path;
        });
        
        this.loadPromises.push(promise);
        this.totalAssets++;
        return promise;
    }

    async loadAllAssets() {
        console.log('Loading game assets...');
        
        // Character animation frames (1-5)
        for (let i = 1; i <= 5; i++) {
            this.loadImage(`assets/characters/${i}.png`, `character_${i}`);
        }

        // Background skies (1-4)
        for (let i = 1; i <= 4; i++) {
            this.loadImage(`assets/backgrounds/Sky_${i}.png`, `sky_${i}`);
        }

        // Environment assets
        this.loadImage('assets/environment/floor.png', 'floor');
        this.loadImage('assets/environment/wave.png', 'wave');
        this.loadImage('assets/environment/ripplewave.png', 'ripplewave');

        // Chest sprites
        this.loadImage('assets/chests/Closed_Chest.png', 'chest_closed');
        this.loadImage('assets/chests/Opening_Chest.png', 'chest_opening');
        this.loadImage('assets/chests/Opened_Chest.png', 'chest_opened');

        // UI elements
        this.loadImage('assets/ui/question.png', 'question_bar');

        // End game asset
        this.loadImage('assets/ui/end.png', 'castle');

        // Wait for all assets to load
        await Promise.all(this.loadPromises);
        console.log('All assets loaded successfully!');
        return this.assets;
    }

    getAsset(name) {
        return this.assets[name];
    }

    getProgress() {
        return this.totalAssets > 0 ? this.loadedAssets / this.totalAssets : 0;
    }
}

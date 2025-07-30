// Music Manager - Handles background music with looping between tracks
class MusicManager {
    constructor() {
        this.tracks = [
            'music/Legend of Zelda Ocarina of Time_ Gerudo Valley 8-bit.mp3',
            'music/Super Castlevania IV - 8-bit Simon\'s Theme on Famitracker.mp3'
        ];
        this.currentTrackIndex = 0;
        this.currentAudio = null;
        this.isPlaying = false;
        this.volume = 0.3; // Default volume (30%)
        this.fadeInterval = null;
        this.gameLoopMode = false; // Track if we're in game loop mode or single track mode
        
        console.log('Music Manager initialized with tracks:', this.tracks);
    }

    // Initialize and start playing music
    startMusic() {
        if (this.isPlaying) return;
        
        this.playCurrentTrack();
        this.isPlaying = true;
        console.log('Music started');
    }

    // Play a specific track (0 = Zelda, 1 = Castlevania)
    playSpecificTrack(trackIndex, loop = false) {
        if (trackIndex < 0 || trackIndex >= this.tracks.length) return;
        
        this.currentTrackIndex = trackIndex;
        this.gameLoopMode = loop;
        this.playCurrentTrack();
        this.isPlaying = true;
        console.log(`Playing specific track: ${this.tracks[trackIndex]}, Loop mode: ${loop}`);
    }

    // Start game music (loops between both tracks)
    startGameMusic() {
        this.gameLoopMode = true;
        this.currentTrackIndex = 0; // Start with Zelda track
        this.startMusic();
    }

    // Start menu music (Castlevania track only, looping)
    startMenuMusic() {
        this.playSpecificTrack(1, false); // Castlevania track, no auto-switch
    }

    // Stop all music
    stopMusic() {
        if (this.currentAudio) {
            this.currentAudio.pause();
            this.currentAudio.currentTime = 0;
        }
        this.isPlaying = false;
        console.log('Music stopped');
    }

    // Pause music
    pauseMusic() {
        if (this.currentAudio && this.isPlaying) {
            this.currentAudio.pause();
            this.isPlaying = false;
            console.log('Music paused');
        }
    }

    // Resume music
    resumeMusic() {
        if (this.currentAudio && !this.isPlaying) {
            this.currentAudio.play().catch(error => {
                console.log('Error resuming music:', error);
            });
            this.isPlaying = true;
            console.log('Music resumed');
        }
    }

    // Play the current track
    playCurrentTrack() {
        // Stop current audio if playing
        if (this.currentAudio) {
            this.currentAudio.pause();
            this.currentAudio.currentTime = 0;
        }

        // Create new audio element
        this.currentAudio = new Audio(this.tracks[this.currentTrackIndex]);
        this.currentAudio.volume = this.volume;
        
        // Set up event listeners
        this.currentAudio.addEventListener('ended', () => {
            if (this.gameLoopMode) {
                this.playNextTrack();
            } else {
                // For menu music, just restart the same track
                this.playCurrentTrack();
            }
        });

        this.currentAudio.addEventListener('error', (error) => {
            console.error('Error loading music track:', this.tracks[this.currentTrackIndex], error);
            this.playNextTrack(); // Try next track if current fails
        });

        // Start playing
        this.currentAudio.play().catch(error => {
            console.log('Error playing music (user interaction may be required):', error);
        });

        console.log('Now playing:', this.tracks[this.currentTrackIndex]);
    }

    // Move to next track and play it
    playNextTrack() {
        this.currentTrackIndex = (this.currentTrackIndex + 1) % this.tracks.length;
        console.log('Switching to next track:', this.tracks[this.currentTrackIndex]);
        this.playCurrentTrack();
    }

    // Set volume (0.0 to 1.0)
    setVolume(volume) {
        this.volume = Math.max(0, Math.min(1, volume));
        if (this.currentAudio) {
            this.currentAudio.volume = this.volume;
        }
        console.log('Volume set to:', this.volume);
    }

    // Get current volume
    getVolume() {
        return this.volume;
    }

    // Fade in music
    fadeIn(duration = 2000) {
        if (!this.currentAudio) return;

        this.currentAudio.volume = 0;
        const targetVolume = this.volume;
        const steps = 50;
        const stepSize = targetVolume / steps;
        const stepDuration = duration / steps;

        let currentStep = 0;
        this.fadeInterval = setInterval(() => {
            if (currentStep >= steps) {
                this.currentAudio.volume = targetVolume;
                clearInterval(this.fadeInterval);
                return;
            }

            this.currentAudio.volume = stepSize * currentStep;
            currentStep++;
        }, stepDuration);
    }

    // Fade out music
    fadeOut(duration = 2000) {
        if (!this.currentAudio) return;

        const startVolume = this.currentAudio.volume;
        const steps = 50;
        const stepSize = startVolume / steps;
        const stepDuration = duration / steps;

        let currentStep = 0;
        this.fadeInterval = setInterval(() => {
            if (currentStep >= steps) {
                this.currentAudio.volume = 0;
                this.pauseMusic();
                clearInterval(this.fadeInterval);
                return;
            }

            this.currentAudio.volume = startVolume - (stepSize * currentStep);
            currentStep++;
        }, stepDuration);
    }

    // Get current track info
    getCurrentTrackInfo() {
        return {
            index: this.currentTrackIndex,
            name: this.tracks[this.currentTrackIndex].split('/').pop().replace('.mp3', ''),
            isPlaying: this.isPlaying
        };
    }

    // Toggle music on/off
    toggleMusic() {
        if (this.isPlaying) {
            this.pauseMusic();
        } else {
            if (this.currentAudio) {
                this.resumeMusic();
            } else {
                this.startMusic();
            }
        }
    }

    // Special victory celebration - increase volume temporarily
    celebrateVictory() {
        if (this.currentAudio && this.isPlaying) {
            const originalVolume = this.volume;
            this.setVolume(Math.min(1.0, this.volume * 1.5)); // Increase volume by 50%
            
            // Return to normal volume after 5 seconds
            setTimeout(() => {
                this.setVolume(originalVolume);
            }, 5000);
            
            console.log('Victory celebration! Music volume increased temporarily');
        }
    }
}

class SoundManager {
    private static instance: SoundManager;
    private sounds: Map<string, HTMLAudioElement>;
    private isMuted: boolean;
    private isBackground: boolean;

    private constructor() {
        this.sounds = new Map();
        this.isMuted = false;
        this.isBackground = false;
        this.loadSounds();
        this.setupVisibilityHandlers();
    }

    public static getInstance(): SoundManager {
        if (!SoundManager.instance) {
            SoundManager.instance = new SoundManager();
        }
        return SoundManager.instance;
    }

    private loadSounds() {
        const soundFiles = {
            click: '/sounds/click.mp3',
            success: '/sounds/success.mp3',
            fail: '/sounds/fail.mp3',
            levelUp: '/sounds/level-up.mp3',
            background: '/sounds/background.mp3',
        };

        Object.entries(soundFiles).forEach(([key, path]) => {
            const audio = new Audio(path);
            audio.preload = 'auto';
            if (key === 'background') {
                audio.loop = true;
            }
            this.sounds.set(key, audio);
        });
    }

    private setupVisibilityHandlers() {
        // 앱이 백그라운드로 가거나 화면이 꺼질 때
        const handleVisibilityChange = () => {
            this.isBackground = document.hidden;
            if (this.isBackground) {
                this.pauseAll();
            } else {
                this.resumeAll();
            }
        };

        // 앱이 포그라운드로 돌아올 때
        const handleFocus = () => {
            if (!this.isBackground) {
                this.resumeAll();
            }
        };

        document.addEventListener('visibilitychange', handleVisibilityChange);
        window.addEventListener('focus', handleFocus);
    }

    private pauseAll() {
        this.sounds.forEach((sound) => {
            if (!sound.paused) {
                sound.pause();
            }
        });
    }

    private resumeAll() {
        if (this.isMuted) return;

        this.sounds.forEach((sound) => {
            if (sound.paused) {
                sound.play().catch((error) => console.log('Sound resume failed:', error));
            }
        });
    }

    public play(soundName: string) {
        if (this.isMuted || this.isBackground) return;

        const sound = this.sounds.get(soundName);
        if (sound) {
            sound.currentTime = 0;
            sound.play().catch((error) => console.log('Sound play failed:', error));
        }
    }

    public toggleMute() {
        this.isMuted = !this.isMuted;
        this.sounds.forEach((sound) => {
            sound.muted = this.isMuted;
        });
        return this.isMuted;
    }

    public setVolume(volume: number) {
        this.sounds.forEach((sound) => {
            sound.volume = Math.max(0, Math.min(1, volume));
        });
    }

    public stop(soundName: string) {
        const sound = this.sounds.get(soundName);
        if (sound) {
            sound.pause();
            sound.currentTime = 0;
        }
    }

    public stopAll() {
        this.sounds.forEach((sound) => {
            sound.pause();
            sound.currentTime = 0;
        });
    }
}

export default SoundManager;

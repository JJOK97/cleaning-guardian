class SoundManager {
    private static instance: SoundManager;
    private sounds: Map<string, HTMLAudioElement>;
    private isMuted: boolean;

    private constructor() {
        this.sounds = new Map();
        this.isMuted = false;
        this.loadSounds();
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
            this.sounds.set(key, audio);
        });
    }

    public play(soundName: string) {
        if (this.isMuted) return;

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
}

export const soundManager = SoundManager.getInstance();

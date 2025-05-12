class VibrationManager {
    private static instance: VibrationManager;
    private isEnabled: boolean;

    private constructor() {
        this.isEnabled = 'vibrate' in navigator;
    }

    public static getInstance(): VibrationManager {
        if (!VibrationManager.instance) {
            VibrationManager.instance = new VibrationManager();
        }
        return VibrationManager.instance;
    }

    public vibrate(pattern: number | number[]) {
        if (!this.isEnabled) return;

        try {
            navigator.vibrate(pattern);
        } catch (error) {
            console.log('Vibration failed:', error);
        }
    }

    public success() {
        this.vibrate([50, 50, 50]);
    }

    public error() {
        this.vibrate([100, 50, 100]);
    }

    public click() {
        this.vibrate(20);
    }

    public levelUp() {
        this.vibrate([50, 100, 50, 100]);
    }
}

export const vibrationManager = VibrationManager.getInstance();

const Storage = {
    KEYS: { BEST_TIME: 'tilt_best_time', AUTOSAVE: 'tilt_autosave' },

    getBestTime() {
        const t = localStorage.getItem(this.KEYS.BEST_TIME);
        return t ? parseFloat(t) : null;
    },

    saveBestTime(time) {
        const current = this.getBestTime();
        if (!current || time < current) {
            localStorage.setItem(this.KEYS.BEST_TIME, time.toFixed(2));
            return true;
        }
        return false;
    },

    saveProgress(data) {
        localStorage.setItem(this.KEYS.AUTOSAVE, JSON.stringify(data));
    },

    loadProgress() {
        const d = localStorage.getItem(this.KEYS.AUTOSAVE);
        return d ? JSON.parse(d) : null;
    },

    clearProgress() {
        localStorage.removeItem(this.KEYS.AUTOSAVE);
    }
};

export interface StorageItem<T> {
  value: T;
  timestamp: number;
  version?: string;
}

class LocalStorageManager {
  private prefix = 'guitar-tool-station-';
  private version = '1.0.0';

  set<T>(key: string, value: T): void {
    try {
      const item: StorageItem<T> = {
        value,
        timestamp: Date.now(),
        version: this.version
      };
      localStorage.setItem(this.prefix + key, JSON.stringify(item));
    } catch (error) {
      console.warn('Failed to save to localStorage:', error);
    }
  }

  get<T>(key: string, defaultValue?: T): T | undefined {
    try {
      const item = localStorage.getItem(this.prefix + key);
      if (!item) return defaultValue;

      const parsed: StorageItem<T> = JSON.parse(item);
      
      // Check if data is from current version
      if (parsed.version !== this.version) {
        this.remove(key);
        return defaultValue;
      }

      return parsed.value;
    } catch (error) {
      console.warn('Failed to read from localStorage:', error);
      return defaultValue;
    }
  }

  remove(key: string): void {
    try {
      localStorage.removeItem(this.prefix + key);
    } catch (error) {
      console.warn('Failed to remove from localStorage:', error);
    }
  }

  clear(): void {
    try {
      const keys = Object.keys(localStorage);
      keys.forEach(key => {
        if (key.startsWith(this.prefix)) {
          localStorage.removeItem(key);
        }
      });
    } catch (error) {
      console.warn('Failed to clear localStorage:', error);
    }
  }

  // Get all keys with our prefix
  getKeys(): string[] {
    try {
      const keys = Object.keys(localStorage);
      return keys
        .filter(key => key.startsWith(this.prefix))
        .map(key => key.replace(this.prefix, ''));
    } catch (error) {
      console.warn('Failed to get keys from localStorage:', error);
      return [];
    }
  }
}

export const storage = new LocalStorageManager();

// Specific storage helpers
export const saveUserSettings = (settings: any) => {
  storage.set('userSettings', settings);
};

export const getUserSettings = () => {
  return storage.get('userSettings', {
    theme: 'dark',
    defaultTuning: 'Standard',
    metronomeVolume: 0.5,
    tunerSensitivity: -50
  });
};

export const savePracticeSessions = (sessions: any[]) => {
  storage.set('practiceSessions', sessions);
};

export const getPracticeSessions = () => {
  return storage.get('practiceSessions', []);
};

export const saveEarTrainingProgress = (progress: any) => {
  storage.set('earTrainingProgress', progress);
};

export const getEarTrainingProgress = () => {
  return storage.get('earTrainingProgress', {
    totalQuestions: 0,
    correctAnswers: 0,
    streaks: [],
    lastSession: null
  });
};
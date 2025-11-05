// services/BiometricService.js
import ReactNativeBiometrics from 'react-native-biometrics';
import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEYS = {
  FAILED_ATTEMPTS: 'failed_attempts',
  LOCKOUT_UNTIL: 'lockout_until',
  BIOMETRIC_ENABLED: 'biometric_enabled',
};

class BiometricService {
  constructor() {
    this.rnBiometrics = new ReactNativeBiometrics();
  }

  // Check if biometric sensor is available
  async isSensorAvailable() {
    try {
      const { available, biometryType } = await this.rnBiometrics.isSensorAvailable();
      
      return {
        available,
        biometryType, // 'TouchID', 'FaceID', 'Biometrics'
      };
    } catch (error) {
      console.error('Biometric sensor check failed:', error);
      return { available: false, biometryType: null };
    }
  }

  // Check if device is currently locked out
  async isLockedOut() {
    try {
      const lockoutUntil = await AsyncStorage.getItem(STORAGE_KEYS.LOCKOUT_UNTIL);
      
      if (lockoutUntil) {
        const lockTime = parseInt(lockoutUntil, 10);
        const currentTime = Date.now();
        
        if (currentTime < lockTime) {
          return {
            locked: true,
            remainingTime: Math.ceil((lockTime - currentTime) / 1000 / 60), // minutes
          };
        } else {
          // Lockout period over, reset counters
          await this.resetFailedAttempts();
          return { locked: false, remainingTime: 0 };
        }
      }
      
      return { locked: false, remainingTime: 0 };
    } catch (error) {
      console.error('Lockout check failed:', error);
      return { locked: false, remainingTime: 0 };
    }
  }

  // Get current failed attempts count
  async getFailedAttempts() {
    try {
      const attempts = await AsyncStorage.getItem(STORAGE_KEYS.FAILED_ATTEMPTS);
      return parseInt(attempts || '0', 10);
    } catch (error) {
      return 0;
    }
  }

  // Increment failed attempts and handle lockout
  async recordFailedAttempt() {
    try {
      const currentAttempts = await this.getFailedAttempts();
      const newAttempts = currentAttempts + 1;
      
      await AsyncStorage.setItem(STORAGE_KEYS.FAILED_ATTEMPTS, newAttempts.toString());
      
      if (newAttempts >= 5) {
        // Lock for 30 minutes
        const lockoutTime = Date.now() + (30 * 60 * 1000);
        await AsyncStorage.setItem(STORAGE_KEYS.LOCKOUT_UNTIL, lockoutTime.toString());
        
        return {
          locked: true,
          attempts: newAttempts,
          lockoutDuration: 30,
        };
      }
      
      return {
        locked: false,
        attempts: newAttempts,
        lockoutDuration: 0,
      };
    } catch (error) {
      console.error('Failed to record attempt:', error);
      return { locked: false, attempts: 0, lockoutDuration: 0 };
    }
  }

  // Reset failed attempts (on successful login)
  async resetFailedAttempts() {
    try {
      await AsyncStorage.multiRemove([STORAGE_KEYS.FAILED_ATTEMPTS, STORAGE_KEYS.LOCKOUT_UNTIL]);
    } catch (error) {
      console.error('Failed to reset attempts:', error);
    }
  }

  // Create biometric keys (for first-time setup)
  async createKeys() {
    try {
      const { publicKey } = await this.rnBiometrics.createKeys();
      return { success: true, publicKey };
    } catch (error) {
      console.error('Key creation failed:', error);
      return { success: false, error };
    }
  }

  // Biometric authentication
  async authenticate(promptMessage = 'Authenticate to continue') {
    try {
      const lockoutStatus = await this.isLockedOut();
      if (lockoutStatus.locked) {
        throw new Error(`Account locked. Try again in ${lockoutStatus.remainingTime} minutes.`);
      }

      const result = await this.rnBiometrics.createSignature({
        promptMessage,
        payload: 'auth_payload',
      });
      
      if (result.success) {
        await this.resetFailedAttempts();
        return { success: true };
      } else {
        const failedStatus = await this.recordFailedAttempt();
        return { 
          success: false, 
          error: 'Authentication failed',
          lockoutStatus: failedStatus 
        };
      }
    } catch (error) {
      const failedStatus = await this.recordFailedAttempt();
      return { 
        success: false, 
        error: error.message,
        lockoutStatus: failedStatus 
      };
    }
  }

  // Check if biometric is enabled by user
  async isBiometricEnabled() {
    try {
      const enabled = await AsyncStorage.getItem(STORAGE_KEYS.BIOMETRIC_ENABLED);
      return enabled === 'true';
    } catch (error) {
      return false;
    }
  }

  // Enable/disable biometric
  async setBiometricEnabled(enabled) {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.BIOMETRIC_ENABLED, enabled.toString());
      
      if (enabled) {
        await this.createKeys();
      }
      
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  // Delete biometric keys
  async deleteKeys() {
    try {
      await this.rnBiometrics.deleteKeys();
      await AsyncStorage.setItem(STORAGE_KEYS.BIOMETRIC_ENABLED, 'false');
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }
}

export default new BiometricService();
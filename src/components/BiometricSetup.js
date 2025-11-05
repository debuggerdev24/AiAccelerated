// components/BiometricSetup.js
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Switch,
  Alert,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import BiometricService from '../services/BiometricService';

const BiometricSetup = () => {
  const [biometricEnabled, setBiometricEnabled] = useState(false);
  const [isAvailable, setIsAvailable] = useState(false);
  const [biometryType, setBiometryType] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    initializeBiometric();
  }, []);

  const initializeBiometric = async () => {
    try {
      setLoading(true);
      
      // Check biometric availability
      const { available, biometryType } = await BiometricService.isSensorAvailable();
      setIsAvailable(available);
      setBiometryType(biometryType);
      
      // Check if already enabled
      const enabled = await BiometricService.isBiometricEnabled();
      setBiometricEnabled(enabled);
    } catch (error) {
      console.error('Initialization failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleBiometricToggle = async (enabled) => {
    try {
      setLoading(true);
      
      if (enabled) {
        // Enable biometric - this will trigger key creation and authentication
        const result = await BiometricService.setBiometricEnabled(true);
        
        if (result.success) {
          setBiometricEnabled(true);
          Alert.alert('Success', 'Biometric authentication enabled successfully!');
        } else {
          Alert.alert('Error', 'Failed to enable biometric authentication');
          setBiometricEnabled(false);
        }
      } else {
        // Disable biometric
        await BiometricService.setBiometricEnabled(false);
        setBiometricEnabled(false);
        Alert.alert('Success', 'Biometric authentication disabled');
      }
    } catch (error) {
      console.error('Toggle failed:', error);
      Alert.alert('Error', 'Failed to update biometric settings');
      setBiometricEnabled(!enabled);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" />
        <Text>Checking biometric capabilities...</Text>
      </View>
    );
  }

  if (!isAvailable) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>
          Biometric authentication is not available on this device
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.settingRow}>
        <Text style={styles.settingText}>
          Enable {biometryType} Authentication
        </Text>
        <Switch
          value={biometricEnabled}
          onValueChange={handleBiometricToggle}
          disabled={loading}
        />
      </View>
      <Text style={styles.helpText}>
        Use {biometryType} to quickly unlock the app
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    margin: 16,
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  settingText: {
    fontSize: 16,
    fontWeight: '500',
  },
  helpText: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  errorText: {
    fontSize: 14,
    color: '#d32f2f',
    textAlign: 'center',
  },
});

export default BiometricSetup;
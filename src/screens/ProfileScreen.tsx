import React, { FC, useEffect, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  ImageBackground,
  StatusBar,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAuth } from '../context/AuthContext';
import theme from '../theme';

// ---- Types ----
interface User {
  email: string;
  firstName: string;
  lastName: string;
  phoneNumber?: string;
  loginTime?: string;
}

type ScreenType = 'login' | 'register' | 'profile';

interface AuthContextType {
  currentUser: User | null;
  navigateTo: (screen: ScreenType) => void;
  setIsLoggedIn: (value: boolean) => void;
  setCurrentScreen: (screen: ScreenType) => void;
}

// ---- Component ----
const ProfileScreen: FC = () => {
  const { currentUser, navigateTo, setIsLoggedIn, setCurrentScreen, setThemeMode, themeMode  } =
    useAuth() as AuthContextType;

  const [loading, setLoading] = useState<boolean>(true);
  const [isLoggingOut, setIsLoggingOut] = useState<boolean>(false);

  // ---- Simulate initial loading ----
  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  // ---- Logout handler ----
  const handleLogout = async (): Promise<void> => {
    if (isLoggingOut) return;
    setLoading(true);
    setIsLoggingOut(true);

    setTimeout(async () => {
      setLoading(false);
      navigateTo('login');
      setCurrentScreen('login');
      setIsLoggedIn(false);
      await AsyncStorage.removeItem('isLoggedIn');
    }, 2000);
  };




  // ---- Go to Login ----
  const handleGoToLogin = (): void => {
    navigateTo('login');
  };

  // ---- Reset logout state on unmount ----
  useEffect(() => {
    return () => {
      setIsLoggingOut(false);
    };
  }, []);

  // ---- Loading state ----
  if (loading) {
    return (
      <ImageBackground
        source={{
          uri: 'https://images.unsplash.com/photo-1558591710-4b4a1ae0f04d?auto=format&fit=crop&w=1000&q=80',
        }}
        style={styles.backgroundImage}
        blurRadius={2}
      >
        <StatusBar barStyle="light-content" />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#fff" />
          <Text style={styles.loadingText}>Loading your profile...</Text>
        </View>
      </ImageBackground>
    );
  }

  // ---- Handle no current user ----
  if (!currentUser) {
    return (
      <ImageBackground
        source={{
          uri: 'https://images.unsplash.com/photo-1558591710-4b4a1ae0f04d?auto=format&fit=crop&w=1000&q=80',
        }}
        style={styles.backgroundImage}
        blurRadius={2}
      >
        <StatusBar barStyle="light-content" />
        <View style={styles.center}>
          <View style={styles.errorCard}>
            <Text style={styles.errorTitle}>Session Expired</Text>
            <Text style={styles.errorMessage}>No user found. Please log in again.</Text>
            <TouchableOpacity style={styles.loginButton} onPress={handleGoToLogin}>
              <Text style={styles.loginButtonText}>Go to Login</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ImageBackground>
    );
  }

  // ---- Main UI ----
  return (
    <ImageBackground
      source={{
        uri: 'https://images.unsplash.com/photo-1558591710-4b4a1ae0f04d?auto=format&fit=crop&w=1000&q=80',
      }}
      style={styles.backgroundImage}
      blurRadius={3}
    >
      <StatusBar barStyle="light-content" />
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.welcomeText}>Hello,</Text>
          <Text style={styles.userName}>{currentUser.firstName}!</Text>
        </View>

        {/* Profile Card */}
        <View style={[styles.profileCard, {backgroundColor: themeMode === 'light' ? theme.lightColors.button : theme.darkColors.button}]}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle}>Profile Information</Text>
          </View>

          <View style={styles.infoSection}>
            <ProfileRow label="Email Address" value={currentUser.email} />
            <ProfileRow label="First Name" value={currentUser.firstName} />
            <ProfileRow label="Last Name" value={currentUser.lastName} />
            <ProfileRow label="Phone Number" value={currentUser.phoneNumber ?? 'N/A'} />
            <ProfileRow
              label="Last Login"
              value={
                currentUser.loginTime
                  ? new Date(currentUser.loginTime).toLocaleString()
                  : 'Just now'
              }
            />
          </View>
        </View>

        {/* Logout Button */}
        <TouchableOpacity
          style={[styles.logoutButton, isLoggingOut && styles.logoutButtonDisabled]}
          onPress={handleLogout}
          disabled={isLoggingOut}
        >
          <Text style={styles.logoutText}>
            {isLoggingOut ? 'Signing Out...' : 'Sign Out'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.logoutButton, isLoggingOut && styles.logoutButtonDisabled]}
          onPress={() => setThemeMode(themeMode === 'light' ? 'dark' : 'light')}
          disabled={isLoggingOut}
        >
          <Text style={styles.logoutText}>
            Change Theme
          </Text>
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
};

// ---- Reusable Profile Row ----
interface ProfileRowProps {
  label: string;
  value: string;
}

const ProfileRow: FC<ProfileRowProps> = ({ label, value }) => (
  <>
    <View style={styles.infoRow}>
      <Text style={styles.infoLabel}>{label}</Text>
      <Text style={styles.infoValue}>{value}</Text>
    </View>
    <View style={styles.divider} />
  </>
);

// ---- Styles ----
const styles = StyleSheet.create({
  backgroundImage: { flex: 1, width: '100%', height: '100%' },
  container: {
    flex: 1,
    padding: 25,
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  loadingText: {
    color: '#fff',
    fontSize: 16,
    marginTop: 15,
    fontWeight: '500',
  },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  header: { marginBottom: 40, paddingHorizontal: 10 },
  welcomeText: { fontSize: 28, fontWeight: '300', color: '#fff', textAlign: 'left' },
  userName: {
    fontSize: 36,
    fontWeight: '700',
    color: '#fff',
    textAlign: 'left',
    marginTop: 5,
  },
  profileCard: {
    borderRadius: 20,
    marginBottom: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 10,
    overflow: 'hidden',
  },
  cardHeader: {
    backgroundColor: '#2c3e50',
    paddingVertical: 18,
    paddingHorizontal: 20,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#fff',
    textAlign: 'center',
  },
  infoSection: { padding: 5 },
  infoRow: { paddingVertical: 12, paddingHorizontal: 20 },
  infoLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#7f8c8d',
    marginBottom: 4,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  infoValue: { fontSize: 16, color: '#2c3e50', fontWeight: '500' },
  divider: { height: 1, backgroundColor: 'rgba(52, 73, 94, 0.1)', marginHorizontal: 20 },
  logoutButton: {
    backgroundColor: 'rgba(231, 76, 60, 0.9)',
    paddingVertical: 16,
    borderRadius: 15,
    marginHorizontal: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
    marginTop:20
  },
  logoutButtonDisabled: { backgroundColor: 'rgba(189, 195, 199, 0.9)' },
  logoutText: {
    color: '#fff',
    fontSize: 17,
    textAlign: 'center',
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  errorCard: {
    backgroundColor: 'rgba(255,255,255,0.95)',
    borderRadius: 20,
    padding: 30,
    margin: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 10,
  },
  errorTitle: { fontSize: 22, fontWeight: '700', color: '#e74c3c', marginBottom: 10 },
  errorMessage: {
    fontSize: 16,
    color: '#2c3e50',
    textAlign: 'center',
    marginBottom: 25,
    lineHeight: 22,
  },
  loginButton: {
    backgroundColor: '#3498db',
    paddingVertical: 14,
    paddingHorizontal: 40,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  loginButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
});

export default ProfileScreen;

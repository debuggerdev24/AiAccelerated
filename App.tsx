
import React, { useState, FC } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { AuthProvider, useAuth } from './src/context/AuthContext';
import SplashScreen from './src/screens/SplashScreen';
import RegisterScreen from './src/screens/RegistrationScreen';
import ProfileScreen from './src/screens/ProfileScreen';
import LoginScreen from './src/screens/LoginScreen';
import { ThemeProvider } from './src/context/ThemeContext';

// Define the expected values for currentScreen
type ScreenType = 'login' | 'register' | 'profile';

// ---- AppContent Component ----
const AppContent: FC = () => {
  const { currentScreen, loading } = useAuth() as {
    currentScreen: ScreenType;
    loading: boolean;
  };

  const [showSplash, setShowSplash] = useState<boolean>(true);

  const handleSplashFinish = (): void => setShowSplash(false);

  if (showSplash) {
    return <SplashScreen onFinish={handleSplashFinish} />;
  }

  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  switch (currentScreen) {
    case 'register':
      return <RegisterScreen />;
    case 'profile':
      return <ProfileScreen />;
    case 'login':
    default:
      return <LoginScreen />;
  }
};

// ---- Styles ----
const styles = {
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
} as const;

// ---- Main App ----
const App: FC = () => (
  <AuthProvider>
    <AppContent />
  </AuthProvider>
);

export default App;

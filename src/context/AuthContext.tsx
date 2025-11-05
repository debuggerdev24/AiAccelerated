// src/context/AuthContext.js
import React, { createContext, useState, useContext, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [currentScreen, setCurrentScreen] = useState('login');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  console.log('AuthContext - isLoggedIn:', isLoggedIn);
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check if user is already logged in on app start
  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      const loggedIn = await AsyncStorage.getItem('isLoggedIn');
      const user = await AsyncStorage.getItem('currentUser');
      
      if (loggedIn === 'true' && user) {
        setIsLoggedIn(true);
        setCurrentUser(JSON.parse(user));
        setCurrentScreen('profile');
      }
    } catch (error) {
      console.error('Error checking auth status:', error);
    } finally {
      setLoading(false);
    }
  };

  const login = async (userData) => {
    try {
      const userWithLoginTime = {
        ...userData,
        loginTime: new Date().toISOString()
      };
      
      await AsyncStorage.setItem('isLoggedIn', 'true');
      await AsyncStorage.setItem('currentUser', JSON.stringify(userWithLoginTime));
      
      setIsLoggedIn(true);
      setCurrentUser(userWithLoginTime);
      setCurrentScreen('profile');
    } catch (error) {
      console.error('Error during login:', error);
      throw error;
    }
  };

  const register = async (userData) => {
    try {
      // In a real app, you would send this to your backend
      // For now, we'll just simulate successful registration
      console.log('Registering user:', userData);
      setCurrentUser(userData);
      
      // After registration, show success message and navigate to login
      setTimeout(() => {
        setCurrentScreen('login');
      }, 1500);
      
      return { success: true };
    } catch (error) {
      console.error('Error during registration:', error);
      throw error;
    }
  };

  const logout = async () => {
    console.log('Logging out user:', currentUser);
    try {
      await AsyncStorage.removeItem('isLoggedIn');
      await AsyncStorage.removeItem('currentUser');
      
      setIsLoggedIn(false);
      setCurrentUser(null);
      setCurrentScreen('login');
    } catch (error) {
      console.error('Error during logout:', error);
      throw error;
    }
  };

  const navigateTo = (screen) => {
    setCurrentScreen(screen);
  };

  const value = {
    // State
    currentScreen,
    isLoggedIn,
    currentUser,
    loading,
    
    // Actions
    login,
    register,
    logout,
    navigateTo,
    setCurrentScreen,
      setIsLoggedIn,
  setCurrentUser,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
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
  const [themeMode, setThemeMode] = useState('light');

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
    themeMode,
    
    // Actions
    login,
    register,
    logout,
    navigateTo,
    setCurrentScreen,
      setIsLoggedIn,
  setCurrentUser,
  setThemeMode
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

// // src/context/AuthContext.js
// import React, { createContext, useState, useContext, useEffect } from 'react';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import { ThemeProvider } from './ThemeContext';
// import { Appearance } from 'react-native';
// import theme from '../theme';

// const AuthContext = createContext();

// type ThemeType = 'light' | 'dark';

// export const AuthProvider = ({ children }) => {
//   const [currentScreen, setCurrentScreen] = useState('login');
//   const [isLoggedIn, setIsLoggedIn] = useState(false);
//   const [currentUser, setCurrentUser] = useState(null);
//   const [loading, setLoading] = useState(true);
//     const colorScheme = Appearance.getColorScheme();
//     const [themeMode, setThemeMode] = useState<ThemeType>(colorScheme === 'dark' ? 'dark' : 'light');
//     console.log('Current theme mode:', themeMode);

//   console.log('AuthContext - isLoggedIn:', isLoggedIn);

//     useEffect(() => {
//       const listener = ({ colorScheme }: { colorScheme: ThemeType }) => {
//         setThemeMode(colorScheme);
//       };
//       const subscription = Appearance.addChangeListener(listener);
//       return () => subscription.remove();
//     }, []);
  
//     const toggleTheme = () => {
//       setThemeMode(prev => (prev === 'light' ? 'dark' : 'light'));
//     };
  
//     const colors = themeMode === 'dark' ? theme.darkColors : theme.lightColors;

//   // ---- Check login state on app start ----
//   useEffect(() => {
//     checkAuthStatus();
//   }, []);

//   const checkAuthStatus = async () => {
//     try {
//       const loggedIn = await AsyncStorage.getItem('isLoggedIn');
//       const user = await AsyncStorage.getItem('currentUser');

//       if (loggedIn === 'true' && user) {
//         setIsLoggedIn(true);
//         setCurrentUser(JSON.parse(user));
//         setCurrentScreen('profile');
//       }
//     } catch (error) {
//       console.error('Error checking auth status:', error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const login = async (userData) => {
//     try {
//       const userWithLoginTime = {
//         ...userData,
//         loginTime: new Date().toISOString(),
//       };

//       await AsyncStorage.setItem('isLoggedIn', 'true');
//       await AsyncStorage.setItem('currentUser', JSON.stringify(userWithLoginTime));

//       setIsLoggedIn(true);
//       setCurrentUser(userWithLoginTime);
//       setCurrentScreen('profile');
//     } catch (error) {
//       console.error('Error during login:', error);
//       throw error;
//     }
//   };

//   const register = async (userData) => {
//     try {
//       console.log('Registering user:', userData);
//       setCurrentUser(userData);

//       // Navigate to login after a short delay
//       setTimeout(() => {
//         setCurrentScreen('login');
//       }, 1500);

//       return { success: true };
//     } catch (error) {
//       console.error('Error during registration:', error);
//       throw error;
//     }
//   };

//   const logout = async () => {
//     console.log('Logging out user:', currentUser);
//     try {
//       await AsyncStorage.removeItem('isLoggedIn');
//       await AsyncStorage.removeItem('currentUser');

//       setIsLoggedIn(false);
//       setCurrentUser(null);
//       setCurrentScreen('login');
//     } catch (error) {
//       console.error('Error during logout:', error);
//       throw error;
//     }
//   };

//   const navigateTo = (screen) => {
//     setCurrentScreen(screen);
//   };

//   const value = {
//     // State
//     currentScreen,
//     isLoggedIn,
//     currentUser,
//     loading,

//     // Actions
//     login,
//     register,
//     logout,
//     navigateTo,
//     setCurrentScreen,
//     setIsLoggedIn,
//     setCurrentUser,
//     toggleTheme
//   };

//   // ✅ Wrap AuthContext with ThemeProvider
//   return (
//       <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
//   );
// };

// export const useAuth = () => {
//   const context = useContext(AuthContext);
//   if (!context) {
//     throw new Error('useAuth must be used within an AuthProvider');
//   }
//   return context;
// };

// // src/context/AuthContext.js
// import React, { createContext, useState, useContext, useEffect } from 'react';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import { Appearance } from 'react-native';
// import theme from '../theme';

// const AuthContext = createContext();

// export const AuthProvider = ({ children }) => {
//   const [currentScreen, setCurrentScreen] = useState('login');
//   const [isLoggedIn, setIsLoggedIn] = useState(false);
//   const [currentUser, setCurrentUser] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [themeMode, setThemeMode] = useState('light');
//   console.log('Current theme mode:', themeMode);

//   console.log('AuthContext - isLoggedIn:', isLoggedIn);

//   // Initialize theme
//   useEffect(() => {
//     const colorScheme = Appearance.getColorScheme();
//     setThemeMode(colorScheme === 'dark' ? 'dark' : 'light');
    
//     const listener = ({ colorScheme }) => {
//       setThemeMode(colorScheme);
//     };
    
//     const subscription = Appearance.addChangeListener(listener);
//     return () => subscription.remove();
//   }, []);

//   // Check login state on app start
//   useEffect(() => {
//     checkAuthStatus();
//   }, []);

//   const checkAuthStatus = async () => {
//     try {
//       const [loggedIn, user] = await Promise.all([
//         AsyncStorage.getItem('isLoggedIn'),
//         AsyncStorage.getItem('currentUser')
//       ]);

//       if (loggedIn === 'true' && user) {
//         setIsLoggedIn(true);
//         setCurrentUser(JSON.parse(user));
//         setCurrentScreen('profile');
//       }
//     } catch (error) {
//       console.error('Error checking auth status:', error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const login = async (userData) => {
//     try {
//       const userWithLoginTime = {
//         ...userData,
//         loginTime: new Date().toISOString(),
//       };
//       console.log('Login attempt with user data:', userWithLoginTime);

//       await Promise.all([
//         AsyncStorage.setItem('isLoggedIn', 'true'),
//         AsyncStorage.setItem('currentUser', JSON.stringify(userWithLoginTime))
//       ]);

//       setIsLoggedIn(true);
//       setCurrentUser(userWithLoginTime);
//       setCurrentScreen('profile');
//     } catch (error) {
//       console.error('Error during login:', error);
//       throw error;
//     }
//   };

//   const register = async (userData) => {
//     try {
//       console.log('Registering user:', userData);
      
//       // Simulate API call
//       await new Promise(resolve => setTimeout(resolve, 1000));
      
//       // After registration, show success message and navigate to login
//       setTimeout(() => {
//         setCurrentScreen('login');
//       }, 1500);

//       return { success: true };
//     } catch (error) {
//       console.error('Error during registration:', error);
//       throw error;
//     }
//   };

//   const logout = async () => {
//     console.log('Logging out user:', currentUser);
//     try {
//       await Promise.all([
//         AsyncStorage.removeItem('isLoggedIn'),
//         AsyncStorage.removeItem('currentUser')
//       ]);

//       setIsLoggedIn(false);
//       setCurrentUser(null);
//       setCurrentScreen('login');
//     } catch (error) {
//       console.error('Error during logout:', error);
//       throw error;
//     }
//   };

//   const navigateTo = (screen) => {
//     setCurrentScreen(screen);
//   };

//   const toggleTheme = () => {
//     setThemeMode(prev => (prev === 'light' ? 'dark' : 'light'));
//   };

//   const colors = themeMode === 'dark' ? theme.darkColors : theme.lightColors;

//   const value = {
//     // State
//     currentScreen,
//     isLoggedIn,
//     currentUser,
//     loading,
//     themeMode,
//     colors,

//     // Actions
//     login,
//     register,
//     logout,
//     navigateTo,
//     setCurrentScreen,
//     setIsLoggedIn,
//     setCurrentUser,
//     toggleTheme,
//     setThemeMode,
//   };

//   return (
//     <AuthContext.Provider value={value}>
//       {children}
//     </AuthContext.Provider>
//   );
// };

// export const useAuth = () => {
//   const context = useContext(AuthContext);
//   if (!context) {
//     throw new Error('useAuth must be used within an AuthProvider');
//   }
//   return context;
// };
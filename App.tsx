// import React, { useState } from 'react';
// import { AuthProvider, useAuth } from './src/context/AuthContext';
// // import LoginScreen from './src/examples/LoginScreen';
// // import ProfileScreen from './src/examples/ProfileScreen';
// import { View, ActivityIndicator } from 'react-native';
// import RegisterScreen from './src/screens/RegistrationScreen';
// // import FormUsageExample from './src/examples/FormUsageExample';
// import SplashScreen from './src/screens/SplashScreen';
// import ProfileScreen from './src/screens/ProfileScreen';
// import LoginScreen from './src/screens/LoginScreen';

// // Main component that handles screen routing
// const AppContent = () => {
//   const { currentScreen, loading } = useAuth();
//   console.log('Current Screen:', currentScreen);
//   const [showSplash, setShowSplash] = useState(true);

//   const handleSplashFinish = () => setShowSplash(false);


//   if (showSplash) {
//     return <SplashScreen onFinish={handleSplashFinish} />;
//   }


//   if (loading) {
//     return (
//       <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
//         <ActivityIndicator size="large" color="#0000ff" />
//       </View>
//     );
//   }

//   // Conditional rendering based on currentScreen
//   switch (currentScreen) {
//     case 'register':
//       return <RegisterScreen />;
//     case 'profile':
//       return <ProfileScreen />;
//     case 'login':
//     default:
//       return <LoginScreen />;
//   }
// };

// // Main App component
// export default function App() {
//   return (
//     <AuthProvider>
//       <AppContent />
//     </AuthProvider>
//   );
// }

import React, { useState, FC } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { AuthProvider, useAuth } from './src/context/AuthContext';
import SplashScreen from './src/screens/SplashScreen';
import RegisterScreen from './src/screens/RegistrationScreen';
import ProfileScreen from './src/screens/ProfileScreen';
import LoginScreen from './src/screens/LoginScreen';

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

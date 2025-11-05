import React, { FC, useRef, useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  TextInput,
  TouchableOpacity,
  Animated,
  ImageBackground,
  StyleSheet,
  Alert,
} from 'react-native';
import { Formik, FormikHelpers } from 'formik';
import * as Yup from 'yup';
import { useAuth } from '../context/AuthContext';
import theme from '../theme';
import * as Keychain from 'react-native-keychain';

// ---- Types ----
interface User {
  email: string;
  firstName: string;
  lastName: string;
  phoneNumber?: string;
  password: string;
  confirmPassword?: string;
}

type ScreenType = 'login' | 'register' | 'profile';

interface AuthContextType {
  login: (userData: User) => Promise<void>;
  navigateTo: (screen: ScreenType) => void;
  currentUser: User | null;
}

interface LoginFormValues {
  email: string;
  password: string;
}

// ---- Validation ----
const loginValidationSchema = Yup.object().shape({
  email: Yup.string()
    .required('This field is required.')
    .matches(/^[A-Za-z0-9._%+-]+@gmail\.com$/, 'Only Gmail addresses are allowed'),
  password: Yup.string()
    .required('This field is required.')
    .min(8, 'Password must be at least 8 characters'),
});

// ---- Component ----
const LoginScreen: FC = () => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const { login, navigateTo, currentUser, themeMode } = useAuth() as AuthContextType;
  const [loginError, setLoginError] = useState<string>('');
   const [biometricAvailable, setBiometricAvailable] = useState(false);
  const [lockedOut, setLockedOut] = useState(false);
    const [attempts, setAttempts] = useState(0);
    const [loginAttempts, setLoginAttempts] = useState(0);
    console.log('LoginScreen - loginAttempts:', loginAttempts);

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 700,
      useNativeDriver: true,
    }).start();
  }, [fadeAnim]);

const storeCredentials = async (currentUser : any) => {
    console.log('⚡ Storing credentials for:', email);
    try {
        await Keychain.setGenericPassword(email, password, {
            accessControl: Keychain.ACCESS_CONTROL.BIOMETRY_ANY,
            accessible: Keychain.ACCESSIBLE.WHEN_UNLOCKED,
            securityLevel: Keychain.SECURITY_LEVEL.SECURE_HARDWARE,
        });
        console.log('✅ Credentials securely stored');
        
    } catch (e) {
        console.log('❌ Failed to store credentials:', e);
    }
};


    const handleBiometricLogin = async (currentUser : any) => {
        if (lockedOut) {
            Alert.alert('Locked Out', 'Please try again later.');
            return;
        }

        try {
            const credentials = await Keychain.getGenericPassword({
                authenticationPrompt: {
                    title: 'Login with Fingerprint',
                    subtitle: 'Authenticate to unlock your account',
                    description: 'Use your fingerprint to log in securely.',
                },
            });

            if (credentials) {
                console.log('✅ Auth success:', credentials);
                Alert.alert('Success', 'Welcome back!');
                const userData: User = {
                email: currentUser.email,
                firstName: currentUser.firstName,
                lastName: currentUser.lastName,
                phoneNumber: currentUser.phoneNumber,
                password: currentUser.password,
                confirmPassword: currentUser.confirmPassword,
            };
        await login(userData);
                // Optionally auto-login user:
                // await login({ email: credentials.username, password: credentials.password });
            } else {
                Alert.alert('Cancelled', 'Fingerprint login was cancelled.');
            }
        } catch (err: any) {
            console.log('Biometric error:', err);
            setAttempts(prev => {
                const next = prev + 1;
                if (next >= 5) setLockedOut(true);
                return next;
            });
        }
    };

    const handleLogin = async (
        values: LoginFormValues,
        { resetForm }: FormikHelpers<LoginFormValues>,
    ): Promise<void> => {
        console.log('Login attempt with values:', values);

        try {
            setLoginError('');

            if (!currentUser) {
                setLoginError('No registered user found. Please register first.');
                return;
            }

            const emailMatch =
                values.email.trim().toLowerCase() === currentUser.email.trim().toLowerCase();
            const passwordMatch = values.password.trim() === currentUser.password.trim();

            if (!emailMatch || !passwordMatch) {
                // Increase failed attempts
                setLoginAttempts(prev => {
                    console.log('Previous failed attempts:', prev);
                    const next = prev + 1;
                    console.log(`❌ Failed attempt: ${next}`);

                    if (next >= 5) {
            storeCredentials(currentUser);

                        console.log('🚫 User locked out after 5 failed login attempts.');
                        setLoginError('Too many failed attempts. Please try again later.');
                    } else {
                        setLoginError('Invalid email or password. Please try again.');
                    }

                    return next;
                });
                return;
            }

            // If login success, reset attempts
            setLoginAttempts(0);

            const userData: User = {
                email: currentUser.email,
                firstName: currentUser.firstName,
                lastName: currentUser.lastName,
                phoneNumber: currentUser.phoneNumber,
                password: currentUser.password,
                confirmPassword: currentUser.confirmPassword,
            };

            await login(userData);
            resetForm();
            setLoginError('');
        } catch (error) {
            console.error('Login error:', error);
            setLoginError('Something went wrong. Please try again.');
        }
    };


  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <View style={styles.flex}>
        <ImageBackground
          source={require('../assets/image/logo.png')}
          style={[styles.background, {backgroundColor: themeMode === 'light' ? theme.lightColors.background : theme.darkColors.background}]}
          imageStyle={[styles.backgroundImage, {opacity: themeMode === 'light' ? 0.15 : 0.55}]}
        >
          <ScrollView
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
          >
            <Animated.View
              style={[
                styles.formContainer,
                {
                     backgroundColor: themeMode === 'light' ? 'rgba(122, 117, 117, 0.18)' : 'rgba(15, 14, 14, 0.17)',
                  transform: [
                    {
                      translateY: fadeAnim.interpolate({
                        inputRange: [0, 1],
                        outputRange: [40, 0],
                      }),
                    },
                  ],
                },
              ]}
            >
              <Text style={[styles.title, {color: themeMode === 'light' ? theme.lightColors.textPrimary : theme.darkColors.textPrimary }]}>Login</Text>

              <Formik
                initialValues={{ email: '', password: '' }}
                validationSchema={loginValidationSchema}
                onSubmit={handleLogin}
              >
                {({
                  handleChange,
                  handleBlur,
                  handleSubmit,
                  values,
                  errors,
                  touched,
                  isSubmitting,
                }) => (
                  <>
                    <AnimatedInput
                      label="Email address"
                      field="email"
                      value={values.email}
                      handleChange={handleChange}
                      handleBlur={handleBlur}
                      errors={errors}
                      touched={touched}
                      keyboardType="email-address"
                    />

                    <AnimatedInput
                      label="Password"
                      field="password"
                      value={values.password}
                      handleChange={handleChange}
                      handleBlur={handleBlur}
                      errors={errors}
                      touched={touched}
                      secureTextEntry
                    />

                    {loginError !== '' && (
                      <Text style={styles.loginErrorText}>{loginError}</Text>
                    )}

                    <TouchableOpacity
                      onPress={() => loginAttempts >= 5 ? handleBiometricLogin(currentUser) : handleSubmit()}
                      style={[styles.button, isSubmitting && styles.buttonDisabled]}
                      disabled={isSubmitting}
                    >
                      <Text style={[styles.buttonText, {color: themeMode === 'light' ? theme.lightColors.textOnPrimary : theme.darkColors.textOnPrimary}]}>
                        {isSubmitting ? 'Logging in...' : 'Login'}
                      </Text>
                    </TouchableOpacity>

                    <View style={styles.registerContainer}>
                      <Text style={[styles.registerText, {color : themeMode === 'light' ? theme.lightColors.textPrimary : theme.darkColors.textPrimary }]}>Don't have an account? </Text>
                      <TouchableOpacity onPress={() => navigateTo('register')}>
                        <Text style={styles.registerLink}>Register here</Text>
                      </TouchableOpacity>
                    </View>
                  </>
                )}
              </Formik>
            </Animated.View>
          </ScrollView>
        </ImageBackground>
      </View>
    </KeyboardAvoidingView>
  );
};

// ---- AnimatedInput Component ----
interface AnimatedInputProps {
  label: string;
  field: keyof LoginFormValues;
  value: string;
  handleChange: (field: string) => (value: string) => void;
  handleBlur: (field: string) => (e: any) => void;
  errors: Partial<Record<keyof LoginFormValues, string>>;
  touched: Partial<Record<keyof LoginFormValues, boolean>>;
  keyboardType?: 'default' | 'email-address';
  secureTextEntry?: boolean;
  themeMode?: 'light' | 'dark';
}

const AnimatedInput: FC<AnimatedInputProps> = ({
  label,
  field,
  value,
  handleChange,
  handleBlur,
  errors,
  touched,
  keyboardType,
  secureTextEntry = false,
  themeMode
}) => {
  const borderAnim = useRef(new Animated.Value(0)).current;

  const handleFocus = (): void => {
    Animated.timing(borderAnim, {
      toValue: 1,
      duration: 200,
      useNativeDriver: false,
    }).start();
  };

  const handleEndEditing = (): void => {
    Animated.timing(borderAnim, {
      toValue: 0,
      duration: 200,
      useNativeDriver: false,
    }).start();
  };

  const borderColor = borderAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['#555', '#007BFF'],
  });

  const labelColorlight = borderAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['#ddd', '#007BFF'],
  });

    const labelColorDark = borderAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['black', '#007BFF'],
  });

  return (
    <Animated.View style={styles.animatedInputWrapper}>
      <Animated.Text style={[styles.label, { color: themeMode !== 'light' ? labelColorlight : labelColorDark }]}>
        {label}
      </Animated.Text>
      <Animated.View style={[styles.inputContainer, { borderColor }]}>
        <TextInput
          placeholder={`Enter ${label.toLowerCase()}`}
          placeholderTextColor="#999"
          value={value}
          secureTextEntry={secureTextEntry}
          onChangeText={handleChange(field)}
          onBlur={(e) => {
            handleBlur(field)(e);
            handleEndEditing();
          }}
          onFocus={handleFocus}
          keyboardType={keyboardType}
          autoCapitalize="none"
          style={[
            styles.input,
            touched[field] && errors[field] ? styles.inputError : null,
          ]}
        />
      </Animated.View>
      {touched[field] && errors[field] && (
        <Text style={styles.error}>{errors[field]}</Text>
      )}
    </Animated.View>
  );
};

// ---- Styles ----
const styles = StyleSheet.create({
  flex: { flex: 1 },
  background: { flex: 1, justifyContent: 'center', width: '100%', height: '100%', },
  backgroundImage: { resizeMode: 'contain', alignSelf: 'center',  },
  scrollContent: {
    padding: 20,
    flex: 1,
    justifyContent: 'center',
    width: '100%',
    height: '100%',
  },
  formContainer: {
    borderRadius: 15,
    width: '100%',
    padding: 20,
    alignSelf: 'stretch',
    paddingVertical: 30,
    backgroundColor: 'rgba(30, 30, 30, 0.35)',
  },
  title: {
    fontSize: 26,
    fontWeight: '700',
    marginBottom: 30,
    textAlign: 'center',
    color: '#fff',
    letterSpacing: 0.5,
  },
  animatedInputWrapper: { marginBottom: 18 },
  label: { fontSize: 15, fontWeight: '600', marginBottom: 6, color: '#ddd' },
  inputContainer: {
    borderWidth: 1.5,
    borderRadius: 10,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  input: { height: 48, paddingHorizontal: 14, fontSize: 15, color: '#000' },
  inputError: { borderColor: '#ff4444' },
  error: { color: '#ff6b6b', fontSize: 13, marginTop: 5, marginLeft: 4 },
  button: {
    backgroundColor: '#007BFF',
    paddingVertical: 15,
    borderRadius: 10,
    marginTop: 20,
    shadowColor: '#007BFF',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  buttonDisabled: { backgroundColor: '#555', opacity: 0.7 },
  buttonText: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: '700',
    fontSize: 17,
    letterSpacing: 0.5,
  },
  loginErrorText: {
    color: '#ff4d4d',
    fontSize: 14,
    textAlign: 'center',
    marginTop: 10,
    fontWeight: '500',
  },
  registerContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 20,
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.1)',
  },
  registerText: { color: 'white', fontSize: 14 },
  registerLink: { color: '#007BFF', fontSize: 14, fontWeight: 'bold' },
});

export default LoginScreen;

// import React, { FC, useRef, useEffect, useState, memo } from 'react';
// import {
//   View,
//   Text,
//   ScrollView,
//   KeyboardAvoidingView,
//   Platform,
//   TextInput,
//   TouchableOpacity,
//   Alert,
//   Animated,
//   ImageBackground,
//   StyleSheet,
// } from 'react-native';
// import { Formik, FormikHelpers } from 'formik';
// import * as Yup from 'yup';
// import { useAuth } from '../context/AuthContext';

// // ---- Types ----
// interface User {
//   firstName: string;
//   lastName: string;
//   email: string;
//   phoneNumber: string;
//   password: string;
//   confirmPassword: string;
// }

// type ScreenType = 'login' | 'register' | 'profile';

// interface AuthContextType {
//   register: (userData: User) => Promise<void>;
//   navigateTo: (screen: ScreenType) => void;
//   users: User[];
// }

// // ---- Validation ----
// const baseValidationSchema = Yup.object().shape({
//   firstName: Yup.string().required('This field is required.'),
//   lastName: Yup.string().required('This field is required.'),
//   email: Yup.string()
//     .required('This field is required.')
//     .matches(/^[A-Za-z0-9._%+-]+@gmail\.com$/, 'Only Gmail addresses are allowed'),
//   phoneNumber: Yup.string()
//     .required('This field is required.')
//     .matches(/^[0-9]{10}$/, 'Phone number must be 10 digits'),
//   password: Yup.string()
//     .required('This field is required.')
//     .min(8, 'Password must be at least 8 characters'),
//   confirmPassword: Yup.string()
//     .required('This field is required.')
//     .oneOf([Yup.ref('password')], 'Passwords must match'),
// });

// // ---- Main Component ----
// const RegisterScreen: FC = () => {
//   const fadeAnim = useRef(new Animated.Value(0)).current;
//   const { register, navigateTo, users = [] } = useAuth() as AuthContextType;

//   const [existingEmails, setExistingEmails] = useState<Set<string>>(new Set());
//   const [existingPhones, setExistingPhones] = useState<Set<string>>(new Set());

//   useEffect(() => {
//     Animated.timing(fadeAnim, {
//       toValue: 1,
//       duration: 700,
//       useNativeDriver: true,
//     }).start();
//   }, [fadeAnim]);

//   // Build sets of existing users for validation
// useEffect(() => {
//     if (!Array.isArray(users)) return;

//     // Create arrays of normalized emails & phones
//     const newEmails = users
//         .map(u => u?.email?.toLowerCase().trim())
//         .filter(Boolean)
//         .sort();

//     const newPhones = users
//         .map(u => u?.phoneNumber?.trim())
//         .filter(Boolean)
//         .sort();

//     // Convert to strings for easy equality check
//     const emailsKey = JSON.stringify(newEmails);
//     const phonesKey = JSON.stringify(newPhones);

//     setExistingEmails(prev => {
//         const prevKey = JSON.stringify([...prev].sort());
//         if (prevKey !== emailsKey) return new Set(newEmails);
//         return prev;
//     });

//     setExistingPhones(prev => {
//         const prevKey = JSON.stringify([...prev].sort());
//         if (prevKey !== phonesKey) return new Set(newPhones);
//         return prev;
//     });
// }, [JSON.stringify(users)]);


//   // Dynamic validation schema with uniqueness
//   const enhancedValidationSchema = baseValidationSchema.shape({
//     email: Yup.string()
//       .required('This field is required.')
//       .matches(/^[A-Za-z0-9._%+-]+@gmail\.com$/, 'Only Gmail addresses are allowed')
//       .test(
//         'email-unique',
//         'Email already exists. Please use a different email.',
//         (value) => (value ? !existingEmails.has(value.toLowerCase().trim()) : true),
//       ),
//     phoneNumber: Yup.string()
//       .required('This field is required.')
//       .matches(/^[0-9]{10}$/, 'Phone number must be 10 digits')
//       .test(
//         'phone-unique',
//         'Phone number already exists. Please use a different phone number.',
//         (value) => (value ? !existingPhones.has(value.trim()) : true),
//       ),
//   });

//   const handleRegister = async (
//     values: User,
//     { resetForm }: FormikHelpers<User>,
//   ): Promise<void> => {
//     try {
//       if (existingEmails.has(values.email.toLowerCase().trim())) {
//         Alert.alert('Registration Failed', 'Email already registered. Please use a different email.');
//         return;
//       }

//       if (existingPhones.has(values.phoneNumber.trim())) {
//         Alert.alert('Registration Failed', 'Phone number already registered. Please use a different number.');
//         return;
//       }

//       await register(values);
//       Alert.alert('Success', 'Registration successful! Please login.');
//       resetForm();
//     } catch (error) {
//       console.error('Registration error:', error);
//       Alert.alert('Error', 'Registration failed. Please try again.');
//     }
//   };

//   return (
//     <KeyboardAvoidingView
//       style={styles.flex}
//       behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
//     >
//       <View style={styles.flex}>
//         <ImageBackground
//           source={require('../assets/image/logo.png')}
//           style={styles.background}
//           imageStyle={styles.backgroundImage}
//         >
//           <ScrollView
//             contentContainerStyle={styles.scrollContent}
//             showsVerticalScrollIndicator={false}
//           >
//             <Animated.View
//               style={[
//                 styles.formContainer,
//                 {
//                   transform: [
//                     {
//                       translateY: fadeAnim.interpolate({
//                         inputRange: [0, 1],
//                         outputRange: [40, 0],
//                       }),
//                     },
//                   ],
//                 },
//               ]}
//             >
//               <Text style={styles.title}>Create Account</Text>
//               <Text style={styles.subtitle}>Join us today</Text>

//               <Formik
//                 initialValues={{
//                   firstName: '',
//                   lastName: '',
//                   email: '',
//                   phoneNumber: '',
//                   password: '',
//                   confirmPassword: '',
//                 }}
//                 validationSchema={enhancedValidationSchema}
//                 onSubmit={handleRegister}
//                 validateOnChange
//                 validateOnBlur
//               >
//                 {({
//                   handleChange,
//                   handleBlur,
//                   handleSubmit,
//                   values,
//                   errors,
//                   touched,
//                   isSubmitting,
//                   isValid,
//                   dirty,
//                 }) => (
//                   <>
//                     <View style={styles.row}>
//                       <View style={styles.halfInput}>
//                         <AnimatedInput
//                           label="First Name"
//                           field="firstName"
//                           value={values.firstName}
//                           handleChange={handleChange}
//                           handleBlur={handleBlur}
//                           errors={errors}
//                           touched={touched}
//                         />
//                       </View>
//                       <View style={styles.halfInput}>
//                         <AnimatedInput
//                           label="Last Name"
//                           field="lastName"
//                           value={values.lastName}
//                           handleChange={handleChange}
//                           handleBlur={handleBlur}
//                           errors={errors}
//                           touched={touched}
//                         />
//                       </View>
//                     </View>

//                     <AnimatedInput
//                       label="Email address"
//                       field="email"
//                       value={values.email}
//                       handleChange={handleChange}
//                       handleBlur={handleBlur}
//                       errors={errors}
//                       touched={touched}
//                       keyboardType="email-address"
//                       autoCapitalize="none"
//                     />

//                     <AnimatedInput
//                       label="Phone Number"
//                       field="phoneNumber"
//                       value={values.phoneNumber}
//                       handleChange={handleChange}
//                       handleBlur={handleBlur}
//                       errors={errors}
//                       touched={touched}
//                       keyboardType="phone-pad"
//                     />

//                     <AnimatedInput
//                       label="Password"
//                       field="password"
//                       value={values.password}
//                       handleChange={handleChange}
//                       handleBlur={handleBlur}
//                       errors={errors}
//                       touched={touched}
//                       secureTextEntry
//                     />

//                     <AnimatedInput
//                       label="Confirm Password"
//                       field="confirmPassword"
//                       value={values.confirmPassword}
//                       handleChange={handleChange}
//                       handleBlur={handleBlur}
//                       errors={errors}
//                       touched={touched}
//                       secureTextEntry
//                     />

//                     <TouchableOpacity
//                       onPress={handleSubmit as any}
//                       style={[
//                         styles.button,
//                         (isSubmitting || !isValid || !dirty) && styles.buttonDisabled,
//                       ]}
//                       disabled={isSubmitting || !isValid || !dirty}
//                     >
//                       <Text style={styles.buttonText}>
//                         {isSubmitting ? 'Creating Account...' : 'Create Account'}
//                       </Text>
//                     </TouchableOpacity>

//                     <View style={styles.loginContainer}>
//                       <Text style={styles.loginText}>Already have an account? </Text>
//                       <TouchableOpacity onPress={() => navigateTo('login')}>
//                         <Text style={styles.loginLink}>Sign In</Text>
//                       </TouchableOpacity>
//                     </View>
//                   </>
//                 )}
//               </Formik>
//             </Animated.View>
//           </ScrollView>
//         </ImageBackground>
//       </View>
//     </KeyboardAvoidingView>
//   );
// };

// // ---- AnimatedInput ----
// interface AnimatedInputProps {
//   label: string;
//   field: keyof User;
//   value: string;
//   handleChange: (field: string) => (value: string) => void;
//   handleBlur: (field: string) => (e: any) => void;
//   errors: Partial<Record<keyof User, string>>;
//   touched: Partial<Record<keyof User, boolean>>;
//   keyboardType?: 'default' | 'email-address' | 'phone-pad';
//   secureTextEntry?: boolean;
//   autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';
// }

// const AnimatedInput: FC<AnimatedInputProps> = memo(
//   ({
//     label,
//     field,
//     value,
//     handleChange,
//     handleBlur,
//     errors,
//     touched,
//     keyboardType,
//     secureTextEntry = false,
//     autoCapitalize = 'sentences',
//   }) => {
//     const borderAnim = useRef(new Animated.Value(0)).current;

//     const handleFocus = () => {
//       Animated.timing(borderAnim, {
//         toValue: 1,
//         duration: 200,
//         useNativeDriver: false,
//       }).start();
//     };

//     const handleEndEditing = () => {
//       Animated.timing(borderAnim, {
//         toValue: 0,
//         duration: 200,
//         useNativeDriver: false,
//       }).start();
//     };

//     const borderColor = borderAnim.interpolate({
//       inputRange: [0, 1],
//       outputRange: ['#555', '#007BFF'],
//     });

//     const labelColor = borderAnim.interpolate({
//       inputRange: [0, 1],
//       outputRange: ['#ddd', '#007BFF'],
//     });

//     return (
//       <Animated.View style={styles.inputWrapper}>
//         <Animated.Text style={[styles.label, { color: labelColor }]}>
//           {label}
//         </Animated.Text>
//         <Animated.View style={[styles.inputContainer, { borderColor }]}>
//           <TextInput
//             placeholder={`Enter ${label.toLowerCase()}`}
//             placeholderTextColor="#999"
//             value={value}
//             secureTextEntry={secureTextEntry}
//             onChangeText={handleChange(field)}
//             onBlur={(e) => {
//               handleBlur(field)(e);
//               handleEndEditing();
//             }}
//             onFocus={handleFocus}
//             keyboardType={keyboardType}
//             autoCapitalize={autoCapitalize}
//             style={[
//               styles.input,
//               touched[field] && errors[field] ? styles.inputError : null,
//             ]}
//           />
//         </Animated.View>
//         {touched[field] && errors[field] && (
//           <Text style={styles.error}>{errors[field]}</Text>
//         )}
//       </Animated.View>
//     );
//   },
// );

// // ---- Styles ----
// const styles = StyleSheet.create({
//   flex: { flex: 1 },
//   background: { flex: 1, justifyContent: 'center', width: '100%', height: '100%' },
//   backgroundImage: { resizeMode: 'contain', alignSelf: 'center', opacity: 0.15 },
//   scrollContent: { padding: 20, flex: 1, justifyContent: 'center' },
//   formContainer: {
//     borderRadius: 15,
//     width: '100%',
//     padding: 20,
//     alignSelf: 'stretch',
//     paddingVertical: 30,
//     backgroundColor: 'rgba(30, 30, 30, 0.45)',
//   },
//   title: { fontSize: 28, fontWeight: '700', textAlign: 'center', marginBottom: 8, color: '#fff' },
//   subtitle: { fontSize: 16, textAlign: 'center', marginBottom: 30, color: 'white' },
//   row: { flexDirection: 'row', justifyContent: 'space-between' },
//   halfInput: { width: '48%' },
//   inputWrapper: { marginBottom: 18 },
//   label: { fontSize: 15, fontWeight: '600', marginBottom: 6, color: '#ddd' },
//   inputContainer: {
//     borderWidth: 1.5,
//     borderRadius: 10,
//     backgroundColor: '#fff',
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.1,
//     shadowRadius: 4,
//     elevation: 3,
//   },
//   input: { height: 48, paddingHorizontal: 14, fontSize: 15, color: '#000' },
//   inputError: { borderColor: '#ff4444' },
//   error: { color: '#ff6b6b', fontSize: 13, marginTop: 5, marginLeft: 4 },
//   button: {
//     backgroundColor: '#007BFF',
//     paddingVertical: 15,
//     borderRadius: 10,
//     marginTop: 20,
//     shadowColor: '#007BFF',
//     shadowOffset: { width: 0, height: 4 },
//     shadowOpacity: 0.3,
//     shadowRadius: 8,
//     elevation: 5,
//   },
//   buttonDisabled: { backgroundColor: '#007BFF', opacity: 0.7 },
//   buttonText: {
//     color: '#fff',
//     textAlign: 'center',
//     fontWeight: '700',
//     fontSize: 17,
//     letterSpacing: 0.5,
//   },
//   loginContainer: {
//     flexDirection: 'row',
//     justifyContent: 'center',
//     marginTop: 20,
//     paddingTop: 20,
//     borderTopWidth: 1,
//     borderTopColor: 'rgba(255, 255, 255, 0.1)',
//   },
//   loginText: { color: 'white', fontSize: 14 },
//   loginLink: { color: '#3a628fff', fontSize: 15, fontWeight: '800' },
// });

// export default RegisterScreen;


import React, { FC, useRef, useEffect, useState, memo } from 'react';
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
import { useTheme } from '../theme/useTheme';
import theme from '../theme';

// ---- Types ----
interface User {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  password: string;
  confirmPassword: string;
}

type ScreenType = 'login' | 'register' | 'profile';

interface AuthContextType {
  register: (userData: User) => Promise<void>;
  navigateTo: (screen: ScreenType) => void;
  users: User[];
}

// ---- Validation ----
const baseValidationSchema = Yup.object().shape({
  firstName: Yup.string().required('This field is required.'),
  lastName: Yup.string().required('This field is required.'),
  email: Yup.string()
    .required('This field is required.')
    .matches(/^[A-Za-z0-9._%+-]+@gmail\.com$/, 'Only Gmail addresses are allowed'),
  phoneNumber: Yup.string()
    .required('This field is required.')
    .matches(/^[0-9]{10}$/, 'Phone number must be 10 digits'),
  password: Yup.string()
    .required('This field is required.')
    .min(8, 'Password must be at least 8 characters'),
  confirmPassword: Yup.string()
    .required('This field is required.')
    .oneOf([Yup.ref('password')], 'Passwords must match'),
});

// ---- Main Component ----
const RegisterScreen: FC = () => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const { register, navigateTo, users = [] } = useAuth() as AuthContextType;
  const { colors, spacing, typography, themeMode } = useTheme();

  const [existingEmails, setExistingEmails] = useState<Set<string>>(new Set());
  const [existingPhones, setExistingPhones] = useState<Set<string>>(new Set());

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 700,
      useNativeDriver: true,
    }).start();
  }, [fadeAnim]);

  useEffect(() => {
    if (!Array.isArray(users)) return;

    const newEmails = users
      .map((u) => u?.email?.toLowerCase().trim())
      .filter(Boolean)
      .sort();

    const newPhones = users
      .map((u) => u?.phoneNumber?.trim())
      .filter(Boolean)
      .sort();

    const emailsKey = JSON.stringify(newEmails);
    const phonesKey = JSON.stringify(newPhones);

    setExistingEmails((prev) => {
      const prevKey = JSON.stringify([...prev].sort());
      if (prevKey !== emailsKey) return new Set(newEmails);
      return prev;
    });

    setExistingPhones((prev) => {
      const prevKey = JSON.stringify([...prev].sort());
      if (prevKey !== phonesKey) return new Set(newPhones);
      return prev;
    });
  }, [JSON.stringify(users)]);

  const enhancedValidationSchema = baseValidationSchema.shape({
    email: Yup.string()
      .required('This field is required.')
      .matches(/^[A-Za-z0-9._%+-]+@gmail\.com$/, 'Only Gmail addresses are allowed')
      .test(
        'email-unique',
        'Email already exists. Please use a different email.',
        (value) => (value ? !existingEmails.has(value.toLowerCase().trim()) : true),
      ),
    phoneNumber: Yup.string()
      .required('This field is required.')
      .matches(/^[0-9]{10}$/, 'Phone number must be 10 digits')
      .test(
        'phone-unique',
        'Phone number already exists. Please use a different number.',
        (value) => (value ? !existingPhones.has(value.trim()) : true),
      ),
  });

  const handleRegister = async (
    values: User,
    { resetForm }: FormikHelpers<User>,
  ): Promise<void> => {
    try {
      await register(values);
      Alert.alert('Success', 'Registration successful! Please login.');
      resetForm();
    } catch (error) {
      Alert.alert('Error', 'Registration failed. Please try again.');
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: colors.background }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ImageBackground
        source={require('../assets/image/logo.png')}
        style={[styles.background, {backgroundColor: themeMode !== 'light' ? theme.lightColors.background : theme.darkColors.background}]}
        imageStyle={{ resizeMode: 'contain', alignSelf: 'center', opacity: themeMode !== 'light' ? 0.15 : 0.55 }}
      >
        <ScrollView
          contentContainerStyle={{
            padding: spacing.lg,
            flexGrow: 1,
            justifyContent: 'center',
          }}
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
            <Text
              style={[
                typography.title,
                { color: themeMode !== 'light' ? theme.lightColors.textPrimary : theme.darkColors.textPrimary, textAlign: 'center', marginBottom: spacing.sm },
              ]}
            >
              Create Account
            </Text>

            <Text
              style={[
                typography.caption,
                { color: themeMode !== 'light' ? theme.lightColors.textPrimary : theme.darkColors.textPrimary, textAlign: 'center', marginBottom: spacing.lg },
              ]}
            >
              Join us today
            </Text>

            <Formik
              initialValues={{
                firstName: '',
                lastName: '',
                email: '',
                phoneNumber: '',
                password: '',
                confirmPassword: '',
              }}
              validationSchema={enhancedValidationSchema}
              onSubmit={handleRegister}
            >
              {({
                handleChange,
                handleBlur,
                handleSubmit,
                values,
                errors,
                touched,
                isSubmitting,
                isValid,
                dirty,
              }) => (
                <>
                  <View style={styles.row}>
                    <View style={styles.halfInput}>
                      <AnimatedInput
                        label="First Name"
                        field="firstName"
                        value={values.firstName}
                        handleChange={handleChange}
                        handleBlur={handleBlur}
                        errors={errors}
                        touched={touched}
                      />
                    </View>
                    <View style={styles.halfInput}>
                      <AnimatedInput
                        label="Last Name"
                        field="lastName"
                        value={values.lastName}
                        handleChange={handleChange}
                        handleBlur={handleBlur}
                        errors={errors}
                        touched={touched}
                      />
                    </View>
                  </View>

                  <AnimatedInput
                    label="Email"
                    field="email"
                    value={values.email}
                    handleChange={handleChange}
                    handleBlur={handleBlur}
                    errors={errors}
                    touched={touched}
                    keyboardType="email-address"
                    autoCapitalize="none"
                  />

                  <AnimatedInput
                    label="Phone Number"
                    field="phoneNumber"
                    value={values.phoneNumber}
                    handleChange={handleChange}
                    handleBlur={handleBlur}
                    errors={errors}
                    touched={touched}
                    keyboardType="phone-pad"
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

                  <AnimatedInput
                    label="Confirm Password"
                    field="confirmPassword"
                    value={values.confirmPassword}
                    handleChange={handleChange}
                    handleBlur={handleBlur}
                    errors={errors}
                    touched={touched}
                    secureTextEntry
                  />

                  <TouchableOpacity
                    onPress={handleSubmit as any}
                    style={[
                      styles.button,
                      {
                        backgroundColor: colors.primary,
                        opacity: isSubmitting || !isValid || !dirty ? 0.6 : 1,
                      },
                    ]}
                    disabled={isSubmitting || !isValid || !dirty}
                  >
                    <Text style={[styles.buttonText, { color: themeMode === 'light' ? '#fff' : '#000' }]}>
                      {isSubmitting ? 'Creating Account...' : 'Create Account'}
                    </Text>
                  </TouchableOpacity>

                  <View style={styles.loginContainer}>
                    <Text style={[styles.loginText, { color: colors.textSecondary }]}>
                      Already have an account?{' '}
                    </Text>
                    <TouchableOpacity onPress={() => navigateTo('login')}>
                      <Text style={[styles.loginLink, { color: colors.primary }]}>
                        Sign In
                      </Text>
                    </TouchableOpacity>
                  </View>
                </>
              )}
            </Formik>
          </Animated.View>
        </ScrollView>
      </ImageBackground>
    </KeyboardAvoidingView>
  );
};

// ---- AnimatedInput ----
interface AnimatedInputProps {
  label: string;
  field: keyof User;
  value: string;
  handleChange: (field: string) => (value: string) => void;
  handleBlur: (field: string) => (e: any) => void;
  errors: Partial<Record<keyof User, string>>;
  touched: Partial<Record<keyof User, boolean>>;
  keyboardType?: 'default' | 'email-address' | 'phone-pad';
  secureTextEntry?: boolean;
  autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';
  themeMode: 'light' | 'dark';
}

const AnimatedInput: FC<AnimatedInputProps> = memo(
  ({
    label,
    field,
    value,
    handleChange,
    handleBlur,
    errors,
    touched,
    keyboardType,
    secureTextEntry = false,
    autoCapitalize = 'sentences',
    themeMode
  }) => {
    const { colors } = useTheme();
    const borderAnim = useRef(new Animated.Value(0)).current;

    const handleFocus = () => {
      Animated.timing(borderAnim, {
        toValue: 1,
        duration: 200,
        useNativeDriver: false,
      }).start();
    };

    const handleEndEditing = () => {
      Animated.timing(borderAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: false,
      }).start();
    };

    const borderColor = borderAnim.interpolate({
      inputRange: [0, 1],
      outputRange: [colors.border, colors.primary],
    });

  const labelColorlight = borderAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['#ddd', '#007BFF'],
  });

        const labelColorDark = borderAnim.interpolate({
      inputRange: [0, 1],
      outputRange: ['black', colors.primary],
    });

    return (
      <Animated.View style={{ marginBottom: 16 }}>
        <Animated.Text style={{ color: themeMode === 'light' ? labelColorlight : labelColorDark, fontWeight: '600', marginBottom: 6 }}>
          {label}
        </Animated.Text>
        <Animated.View
          style={{
            borderWidth: 1.5,
            borderRadius: 10,
            borderColor,
            backgroundColor:
              colors.background === '#FFFFFF' ? '#F9F9F9' : 'rgba(255,255,255,0.1)',
          }}
        >
          <TextInput
            placeholder={`Enter ${label.toLowerCase()}`}
            placeholderTextColor={colors.textSecondary}
            value={value}
            secureTextEntry={secureTextEntry}
            onChangeText={handleChange(field)}
            onBlur={(e) => {
              handleBlur(field)(e);
              handleEndEditing();
            }}
            onFocus={handleFocus}
            keyboardType={keyboardType}
            autoCapitalize={autoCapitalize}
            style={{
              height: 48,
              paddingHorizontal: 14,
              fontSize: 15,
              color: colors.textPrimary,
            }}
          />
        </Animated.View>
        {touched[field] && errors[field] && (
          <Text style={{ color: colors.error, fontSize: 13, marginTop: 5 }}>
            {errors[field]}
          </Text>
        )}
      </Animated.View>
    );
  },
);

// ---- Styles ----
const styles = StyleSheet.create({
  background: { flex: 1, justifyContent: 'center', width: '100%', height: '100%' },
  formContainer: {
    borderRadius: 15,
    width: '100%',
    padding: 20,
    alignSelf: 'stretch',
    paddingVertical: 30,
  },
  row: { flexDirection: 'row', justifyContent: 'space-between' },
  halfInput: { width: '48%' },
  button: {
    paddingVertical: 15,
    borderRadius: 10,
    marginTop: 20,
  },
  buttonText: { textAlign: 'center', fontWeight: '700', fontSize: 17 },
  loginContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 20,
    paddingTop: 20,
  },
  loginText: { fontSize: 14 },
  loginLink: { fontSize: 15, fontWeight: '700' },
});

export default RegisterScreen;

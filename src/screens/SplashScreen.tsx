// src/components/SplashScreen.js
import React, { useEffect, useRef } from 'react';
import { View, Image, Animated, Easing, StyleSheet, Text } from 'react-native';

const SplashScreen = ({ onFinish }) => {
  // Animation values for different elements
  const scaleAnim = useRef(new Animated.Value(0)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const bgColorAnim = useRef(new Animated.Value(0)).current;
  
  // Loading dots animations
  const dot1Anim = useRef(new Animated.Value(0)).current;
  const dot2Anim = useRef(new Animated.Value(0)).current;
  const dot3Anim = useRef(new Animated.Value(0)).current;
  const loadingOpacityAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    // Background color interpolation
    const bgInterpolate = bgColorAnim.interpolate({
      inputRange: [0, 1],
      outputRange: ['#000000', '#1a1a2e']
    });

    // Run animations in sequence
    Animated.sequence([
      // Stage 1: Background transition
      Animated.timing(bgColorAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: false,
      }),
      
      // Stage 2: Show loading dots with bouncing animation
      Animated.parallel([
        // Dot 1
        Animated.sequence([
          Animated.timing(dot1Anim, {
            toValue: 1,
            duration: 400,
            easing: Easing.out(Easing.cubic),
            useNativeDriver: true,
          }),
          Animated.timing(dot1Anim, {
            toValue: 0,
            duration: 400,
            easing: Easing.in(Easing.cubic),
            useNativeDriver: true,
          }),
        ]),
        // Dot 2 with delay
        Animated.sequence([
          Animated.delay(200),
          Animated.timing(dot2Anim, {
            toValue: 1,
            duration: 400,
            easing: Easing.out(Easing.cubic),
            useNativeDriver: true,
          }),
          Animated.timing(dot2Anim, {
            toValue: 0,
            duration: 400,
            easing: Easing.in(Easing.cubic),
            useNativeDriver: true,
          }),
        ]),
        // Dot 3 with delay
        Animated.sequence([
          Animated.delay(400),
          Animated.timing(dot3Anim, {
            toValue: 1,
            duration: 400,
            easing: Easing.out(Easing.cubic),
            useNativeDriver: true,
          }),
          Animated.timing(dot3Anim, {
            toValue: 0,
            duration: 400,
            easing: Easing.in(Easing.cubic),
            useNativeDriver: true,
          }),
        ]),
      ]),
      
      // Repeat the dots animation once more
      Animated.parallel([
        Animated.sequence([
          Animated.timing(dot1Anim, {
            toValue: 1,
            duration: 400,
            easing: Easing.out(Easing.cubic),
            useNativeDriver: true,
          }),
          Animated.timing(dot1Anim, {
            toValue: 0,
            duration: 400,
            easing: Easing.in(Easing.cubic),
            useNativeDriver: true,
          }),
        ]),
        Animated.sequence([
          Animated.delay(200),
          Animated.timing(dot2Anim, {
            toValue: 1,
            duration: 400,
            easing: Easing.out(Easing.cubic),
            useNativeDriver: true,
          }),
          Animated.timing(dot2Anim, {
            toValue: 0,
            duration: 400,
            easing: Easing.in(Easing.cubic),
            useNativeDriver: true,
          }),
        ]),
        Animated.sequence([
          Animated.delay(400),
          Animated.timing(dot3Anim, {
            toValue: 1,
            duration: 400,
            easing: Easing.out(Easing.cubic),
            useNativeDriver: true,
          }),
          Animated.timing(dot3Anim, {
            toValue: 0,
            duration: 400,
            easing: Easing.in(Easing.cubic),
            useNativeDriver: true,
          }),
        ]),
      ]),

      // Stage 3: Fade out loading dots and reveal logo
      Animated.parallel([
        // Fade out loading dots
        Animated.timing(loadingOpacityAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
        // Reveal logo with animations
        Animated.parallel([
          Animated.timing(scaleAnim, {
            toValue: 1,
            duration: 800,
            easing: Easing.out(Easing.exp),
            useNativeDriver: true,
          }),
          Animated.timing(opacityAnim, {
            toValue: 1,
            duration: 600,
            useNativeDriver: true,
          }),
          Animated.timing(rotateAnim, {
            toValue: 1,
            duration: 1000,
            easing: Easing.out(Easing.cubic),
            useNativeDriver: true,
          }),
          Animated.timing(slideAnim, {
            toValue: 0,
            duration: 800,
            easing: Easing.out(Easing.back(1.5)),
            useNativeDriver: true,
          }),
        ]),
      ]),

      // Stage 4: Final pulse effect on logo
      Animated.sequence([
        Animated.timing(scaleAnim, {
          toValue: 1.1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
      ]),
    ]).start(() => {
      // Wait before finishing splash
      setTimeout(onFinish, 1000);
    });
  }, []);

  // Interpolations
  const rotateInterpolate = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['-15deg', '0deg']
  });

  const bgInterpolate = bgColorAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['#c7bbbbff', '#8a8a96ff']
  });

  // Dot animations - scale up and down
  const dot1Scale = dot1Anim.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 1.5]
  });

  const dot2Scale = dot2Anim.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 1.5]
  });

  const dot3Scale = dot3Anim.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 1.5]
  });

  const dot1Opacity = dot1Anim.interpolate({
    inputRange: [0, 1],
    outputRange: [0.5, 1]
  });

  const dot2Opacity = dot2Anim.interpolate({
    inputRange: [0, 1],
    outputRange: [0.5, 1]
  });

  const dot3Opacity = dot3Anim.interpolate({
    inputRange: [0, 1],
    outputRange: [0.5, 1]
  });

  return (
    <Animated.View style={[styles.container, { backgroundColor: bgInterpolate }]}>
      {/* Animated background elements */}
      <View style={styles.backgroundElements}>
        <View style={[styles.circle, styles.circle1]} />
        <View style={[styles.circle, styles.circle2]} />
        <View style={[styles.circle, styles.circle3]} />
      </View>
      
      {/* Loading Dots - shown first */}
      <Animated.View 
        style={[
          styles.loadingSection,
          { opacity: loadingOpacityAnim }
        ]}
      >
        {/* <Text style={styles.loadingText}>Loading</Text> */}
        {/* <View style={styles.loadingContainer}>
          <Animated.View style={[
            styles.dot, 
            styles.dot1, 
            { 
              transform: [{ scale: dot1Scale }],
              opacity: dot1Opacity 
            }
          ]} />
          <Animated.View style={[
            styles.dot, 
            styles.dot2, 
            { 
              transform: [{ scale: dot2Scale }],
              opacity: dot2Opacity 
            }
          ]} />
          <Animated.View style={[
            styles.dot, 
            styles.dot3, 
            { 
              transform: [{ scale: dot3Scale }],
              opacity: dot3Opacity 
            }
          ]} />
        </View> */}
      </Animated.View>

      {/* Logo and App Name - revealed after loading */}
      <Animated.View
        style={[
          styles.logoContainer,
          {
            opacity: opacityAnim,
            transform: [
              { scale: scaleAnim },
              { rotate: rotateInterpolate },
              { translateY: slideAnim }
            ],
          },
        ]}
      >
        <Image
          source={require('../assets/image/logo.png')}
          style={styles.logo}
          resizeMode="contain"
        />
        
        <Animated.Text style={[styles.appName, { opacity: opacityAnim }]}>
          AI Accelerated
        </Animated.Text>
      </Animated.View>
      
      {/* Footer text */}
      <Animated.Text style={[styles.footerText, { opacity: opacityAnim }]}>
        Welcome to amazing experience
      </Animated.Text>
      <View style={styles.loadingContainer}>
          <Animated.View style={[
            styles.dot, 
            styles.dot1, 
            { 
              transform: [{ scale: dot1Scale }],
              opacity: dot1Opacity 
            }
          ]} />
          <Animated.View style={[
            styles.dot, 
            styles.dot2, 
            { 
              transform: [{ scale: dot2Scale }],
              opacity: dot2Opacity 
            }
          ]} />
          <Animated.View style={[
            styles.dot, 
            styles.dot3, 
            { 
              transform: [{ scale: dot3Scale }],
              opacity: dot3Opacity 
            }
          ]} />
        </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000',
  },
  backgroundElements: {
    position: 'absolute',
    width: '100%',
    height: '100%',
  },
  circle: {
    position: 'absolute',
    borderRadius: 100,
    opacity: 0.1,
  },
  circle1: {
    width: 200,
    height: 200,
    backgroundColor: '#4f8ef7',
    top: '20%',
    left: '10%',
  },
  circle2: {
    width: 150,
    height: 150,
    backgroundColor: '#ff6b6b',
    bottom: '25%',
    right: '15%',
  },
  circle3: {
    width: 100,
    height: 100,
    backgroundColor: '#51cf66',
    top: '60%',
    left: '20%',
  },
  loadingSection: {
    alignItems: 'center',
    position: 'absolute',
    top: '50%',
    transform: [{ translateY: -50 }],
  },
  loadingText: {
    fontSize: 18,
    color: 'rgba(255,255,255,0.8)',
    marginBottom: 20,
    fontWeight: '300',
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginHorizontal: 6,
  },
  dot1: {
    backgroundColor: '#4f8ef7',
  },
  dot2: {
    backgroundColor: '#ff6b6b',
  },
  dot3: {
    backgroundColor: '#51cf66',
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 30,
  },
  logo: {
    width: 140,
    height: 140,
    marginBottom: 20,
  },
  appName: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#ffffff',
    marginTop: 10,
    letterSpacing: 1,
  },
  footerText: {
    position: 'absolute',
    bottom: 60,
    fontSize: 14,
    color: 'rgba(255,255,255,0.7)',
    textAlign: 'center',
  },
});

export default SplashScreen;
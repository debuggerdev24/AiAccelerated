// theme/index.ts
export const lightColors = {
  primary: '#007AFF',
  primaryDark: '#0056CC',
  textPrimary: '#1C1C1E',
  textSecondary: '#8E8E93',
  background: '#FFFFFF',
  border: '#C6C6C8',
  error: '#FF3B30',
  button : 'white'
};

export const darkColors = {
  primary: '#0A84FF',
  primaryDark: '#0056CC',
  textPrimary: '#FFFFFF',
  textSecondary: '#C7C7CC',
  background: '#000000',
  border: '#3A3A3C',
  error: '#FF453A',
  button : 'black'
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
};

export const typography = {
  title: { fontSize: 28, fontWeight: 'bold', lineHeight: 34 },
  heading: { fontSize: 22, fontWeight: '600', lineHeight: 28 },
  subheading: { fontSize: 17, fontWeight: '600', lineHeight: 22 },
  body: { fontSize: 17, fontWeight: '400', lineHeight: 22 },
  caption: { fontSize: 14, fontWeight: '400', lineHeight: 18 },
  small: { fontSize: 12, fontWeight: '400', lineHeight: 16 },
};

export default {
  lightColors,
  darkColors,
  spacing,
  typography,
};

// theme/index.ts
export const colors = {
  // Primary
  primary: '#007AFF',
  primaryDark: '#0056CC',
  primaryLight: '#4DA3FF',
  
  // Text
  textPrimary: '#1C1C1E',
  textSecondary: '#8E8E93',
  textTertiary: '#C7C7CC',
  
  // Background
  background: '#FFFFFF',
  backgroundDisabled: '#F2F2F7',
  
  // Border
  border: '#C6C6C8',
  borderLight: '#E5E5EA',
  
  // Status
  error: '#FF3B30',
  errorLight: '#FFE5E5',
  errorDark: '#D70015',
  
  warning: '#FF9500',
  warningLight: '#FFF2E0',
  warningDark: '#CC7700',
  
  success: '#34C759',
  successLight: '#E0F8E5',
  successDark: '#1E7E34',
  
  info: '#5AC8FA',
  infoLight: '#E0F7FF',
  infoDark: '#0077CC',
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
};

export const typography = {
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    lineHeight: 34,
  },
  heading: {
    fontSize: 22,
    fontWeight: '600',
    lineHeight: 28,
  },
  subheading: {
    fontSize: 17,
    fontWeight: '600',
    lineHeight: 22,
  },
  body: {
    fontSize: 17,
    fontWeight: '400',
    lineHeight: 22,
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
    lineHeight: 20,
  },
  caption: {
    fontSize: 14,
    fontWeight: '400',
    lineHeight: 18,
  },
  small: {
    fontSize: 12,
    fontWeight: '400',
    lineHeight: 16,
  },
};

export default {
  colors,
  spacing,
  typography,
};
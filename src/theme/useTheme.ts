// theme/useTheme.ts
import { useColorScheme } from 'react-native';
import theme from './index';

export const useTheme = () => {
  const scheme = useColorScheme(); // returns 'light' or 'dark'
  const colors = scheme === 'dark' ? theme.darkColors : theme.lightColors;
  return {
    colors,
    spacing: theme.spacing,
    typography: theme.typography,
    scheme,
  };
};

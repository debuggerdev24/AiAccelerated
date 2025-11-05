// components/forms/ValidationMessage.tsx
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  AccessibilityInfo,
} from 'react-native';
import { colors, spacing, typography } from '../../theme';

export interface ValidationMessageProps {
  message: string;
  type?: 'error' | 'warning' | 'success' | 'info';
  visible?: boolean;
  accessibilityLiveRegion?: 'none' | 'polite' | 'assertive';
}

const ValidationMessage: React.FC<ValidationMessageProps> = ({
  message,
  type = 'error',
  visible = true,
  accessibilityLiveRegion = 'polite',
}) => {
  if (!visible || !message) {
    return null;
  }

  // Announce to screen readers when error appears
  React.useEffect(() => {
    if (message && type === 'error') {
      AccessibilityInfo.announceForAccessibility(message);
    }
  }, [message, type]);

  const getIcon = () => {
    switch (type) {
      case 'success':
        return '✅';
      case 'warning':
        return '⚠️';
      case 'info':
        return 'ℹ️';
      case 'error':
      default:
        return '❌';
    }
  };

  const getStyles = () => {
    switch (type) {
      case 'success':
        return [styles.container, styles.successContainer];
      case 'warning':
        return [styles.container, styles.warningContainer];
      case 'info':
        return [styles.container, styles.infoContainer];
      case 'error':
      default:
        return [styles.container, styles.errorContainer];
    }
  };

  return (
    <View 
      style={getStyles()}
      accessible
      accessibilityLiveRegion={accessibilityLiveRegion}
      accessibilityRole={type === 'error' ? 'alert' : 'text'}
    >
      <Text style={styles.icon}>{getIcon()}</Text>
      <Text style={[
        styles.message,
        type === 'error' && styles.errorText,
        type === 'success' && styles.successText,
        type === 'warning' && styles.warningText,
        type === 'info' && styles.infoText,
      ]}>
        {message}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    padding: spacing.md,
    borderRadius: 6,
    marginVertical: spacing.xs,
  },
  errorContainer: {
    backgroundColor: colors.errorLight,
    borderLeftWidth: 4,
    borderLeftColor: colors.error,
  },
  warningContainer: {
    backgroundColor: colors.warningLight,
    borderLeftWidth: 4,
    borderLeftColor: colors.warning,
  },
  successContainer: {
    backgroundColor: colors.successLight,
    borderLeftWidth: 4,
    borderLeftColor: colors.success,
  },
  infoContainer: {
    backgroundColor: colors.infoLight,
    borderLeftWidth: 4,
    borderLeftColor: colors.info,
  },
  icon: {
    marginRight: spacing.sm,
    fontSize: 16,
  },
  message: {
    ...typography.caption,
    flex: 1,
    lineHeight: 18,
  },
  errorText: {
    color: colors.errorDark,
  },
  warningText: {
    color: colors.warningDark,
  },
  successText: {
    color: colors.successDark,
  },
  infoText: {
    color: colors.infoDark,
  },
});

export default ValidationMessage;
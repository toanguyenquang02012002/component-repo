import React, { useEffect, useRef } from 'react';
import { Animated, StyleProp, StyleSheet, ViewStyle } from 'react-native';

interface FloatingFieldProps {
  children: React.ReactNode;
  label: string;
  value?: unknown;
  focused?: boolean;
  disabled?: boolean;
  error?: string | boolean;
  style?: StyleProp<ViewStyle>;
  activeColor?: string;
  backgroundColor?: string;
}

const checkHasValue = (value: unknown): boolean => {
  if (Array.isArray(value)) {
    return value.length > 0;
  }

  if (value === undefined || value === null) {
    return false;
  }

  if (typeof value === 'string') {
    return value.trim().length > 0;
  }

  return true;
};

export function FloatingField({
  children,
  label,
  value,
  focused = false,
  disabled = false,
  error,
  style,
  activeColor = '#2563EB',
  backgroundColor = '#FFFFFF',
}: FloatingFieldProps): React.ReactElement {
  const hasValue = checkHasValue(value);
  const shouldFloat = focused || hasValue;

  const animation = useRef(new Animated.Value(shouldFloat ? 1 : 0)).current;

  useEffect(() => {
    Animated.timing(animation, {
      toValue: shouldFloat ? 1 : 0,
      duration: 180,
      useNativeDriver: false,
    }).start();
  }, [animation, shouldFloat]);

  // const borderColor = error ? '#DC2626' : focused ? activeColor : '#CBD5E1';
  const borderColor = error ? '#DC2626' : '#CBD5E1';

  return (
    <Animated.View
      style={[
        styles.container,
        {
          backgroundColor,
          borderColor,
        },
        disabled && styles.disabled,
        style,
      ]}
    >
      <Animated.Text
        pointerEvents="none"
        style={[
          styles.label,
          {
            backgroundColor: animation.interpolate({
              inputRange: [0, 1],
              outputRange: ['rgba(255,255,255,0)', backgroundColor],
            }),
            color: animation.interpolate({
              inputRange: [0, 1],
              outputRange: ['#94A3B8', error ? '#DC2626' : '#64748B'],
            }),
            fontSize: animation.interpolate({
              inputRange: [0, 1],
              outputRange: [15, 12],
            }),
            top: animation.interpolate({
              inputRange: [0, 1],
              outputRange: [17, -9],
            }),
          },
        ]}
      >
        {label}
      </Animated.Text>

      {children}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 10,
    borderWidth: 1,
    justifyContent: 'center',
    minHeight: 56,
    position: 'relative',
    width: '100%',
  },
  label: {
    left: 12,
    paddingHorizontal: 5,
    position: 'absolute',
    zIndex: 2,
  },
  disabled: {
    backgroundColor: '#F1F5F9',
    opacity: 0.7,
  },
});

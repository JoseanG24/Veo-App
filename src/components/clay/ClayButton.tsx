import React, { useRef } from 'react';
import { TouchableOpacity, Text, StyleSheet, Animated, ViewStyle, TextStyle } from 'react-native';
import { Clay, Fonts } from '@/constants/theme';

interface ClayButtonProps {
  label: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'ghost' | 'orange' | 'purple';
  style?: ViewStyle;
  labelStyle?: TextStyle;
  icon?: React.ReactNode;
  fullWidth?: boolean;
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
}

const BG: Record<string, string> = {
  primary:   Clay.colors.primary,
  secondary: Clay.colors.card,
  ghost:     'transparent',
  orange:    Clay.colors.accentOrange,
  purple:    Clay.colors.accentPurple,
};

const LABEL_COLOR: Record<string, string> = {
  primary:   Clay.colors.textOnDark,
  secondary: Clay.colors.primary,
  ghost:     Clay.colors.primary,
  orange:    Clay.colors.textOnDark,
  purple:    Clay.colors.textOnDark,
};

// Darker bottom edge creates the clay 3-D raised look
const BOTTOM_EDGE: Record<string, string> = {
  primary:   '#073B1E',
  secondary: '#C0AE96',
  ghost:     'transparent',
  orange:    '#9E3E0E',
  purple:    '#3D2482',
};

const PADDING: Record<string, { vertical: number; horizontal: number }> = {
  sm: { vertical: 10, horizontal: 20 },
  md: { vertical: 14, horizontal: 28 },
  lg: { vertical: 18, horizontal: 36 },
};

export function ClayButton({
  label, onPress, variant = 'primary', style, labelStyle, icon,
  fullWidth, size = 'md', disabled,
}: ClayButtonProps) {
  const scale = useRef(new Animated.Value(1)).current;
  const shadowAnim = useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    Animated.parallel([
      Animated.spring(scale, { toValue: 0.96, useNativeDriver: true, speed: 50 }),
      Animated.spring(shadowAnim, { toValue: 0, useNativeDriver: true, speed: 50 }),
    ]).start();
  };

  const handlePressOut = () => {
    Animated.parallel([
      Animated.spring(scale, { toValue: 1, useNativeDriver: true, speed: 25 }),
      Animated.spring(shadowAnim, { toValue: 1, useNativeDriver: true, speed: 25 }),
    ]).start();
  };

  const pad = PADDING[size];

  const borderStyle = variant === 'ghost' ? {} : variant === 'secondary' ? {
    borderTopWidth: Clay.border,
    borderLeftWidth: Clay.border,
    borderRightWidth: Clay.border,
    borderTopColor: Clay.colors.border,
    borderLeftColor: Clay.colors.border,
    borderRightColor: Clay.colors.border,
    borderBottomWidth: Clay.border + 2.5,
    borderBottomColor: BOTTOM_EDGE.secondary,
  } : {
    borderBottomWidth: 5,
    borderBottomColor: BOTTOM_EDGE[variant],
  };

  return (
    <Animated.View style={[
      fullWidth && styles.full,
      { transform: [{ scale }] },
    ]}>
      <TouchableOpacity
        style={[
          styles.btn,
          variant !== 'ghost' && Clay.shadow.sm,
          {
            backgroundColor: BG[variant],
            paddingVertical: pad.vertical,
            paddingHorizontal: pad.horizontal,
            opacity: disabled ? 0.5 : 1,
          },
          borderStyle,
          fullWidth && styles.full,
          style,
        ]}
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        activeOpacity={0.95}
        disabled={disabled}
      >
        {icon}
        <Text style={[styles.label, { color: LABEL_COLOR[variant], fontFamily: Fonts?.rounded }, labelStyle]}>
          {label}
        </Text>
      </TouchableOpacity>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  btn: {
    borderRadius: Clay.radius.pill,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  label: {
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 0.2,
  },
  full: {
    width: '100%',
  },
});

import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { Clay } from '@/constants/theme';

interface ClayCardProps {
  children: React.ReactNode;
  style?: ViewStyle | ViewStyle[];
  dark?: boolean;
  color?: string;
  padding?: number;
  noBorder?: boolean;
}

export function ClayCard({ children, style, dark, color, padding = 20, noBorder }: ClayCardProps) {
  return (
    <View
      style={[
        styles.card,
        Clay.shadow.card,
        {
          backgroundColor: dark ? Clay.colors.darkCard : (color ?? Clay.colors.card),
          borderColor: dark ? Clay.colors.borderDark : Clay.colors.border,
          borderWidth: noBorder ? 0 : Clay.border,
          padding,
        },
        style,
      ]}
    >
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: Clay.radius.md,
    overflow: 'hidden',
  },
});

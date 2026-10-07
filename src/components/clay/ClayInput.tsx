import React, { useState } from 'react';
import { View, TextInput, Text, StyleSheet, KeyboardTypeOptions, ViewStyle } from 'react-native';
import { Clay, Fonts } from '@/constants/theme';

interface ClayInputProps {
  label?: string;
  placeholder?: string;
  value: string;
  onChangeText: (text: string) => void;
  keyboardType?: KeyboardTypeOptions;
  secureTextEntry?: boolean;
  multiline?: boolean;
  style?: ViewStyle;
  prefix?: string;
  badge?: string;
  fontSize?: number;
  onFocus?: () => void;
  onBlur?: () => void;
  autoFocus?: boolean;
  textAlign?: 'left' | 'center' | 'right';
  numberOfLines?: number;
}

export function ClayInput({
  label, placeholder, value, onChangeText,
  keyboardType = 'default', secureTextEntry, multiline,
  style, prefix, badge, fontSize = 17,
  onFocus, onBlur, autoFocus, textAlign = 'left', numberOfLines,
}: ClayInputProps) {
  const [focused, setFocused] = useState(false);

  return (
    <View style={[styles.container, style]}>
      {(label || badge) && (
        <View style={styles.labelRow}>
          {label && <Text style={styles.label}>{label}</Text>}
          {badge && (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{badge}</Text>
            </View>
          )}
        </View>
      )}
      <View
        style={[
          styles.inputWrap,
          Clay.shadow.sm,
          focused && styles.inputFocused,
        ]}
      >
        {prefix && <Text style={styles.prefix}>{prefix}</Text>}
        <TextInput
          style={[
            styles.input,
            { fontSize, fontFamily: Fonts?.sans, textAlign },
          ]}
          placeholder={placeholder}
          placeholderTextColor={Clay.colors.placeholder}
          value={value}
          onChangeText={onChangeText}
          keyboardType={keyboardType}
          secureTextEntry={secureTextEntry}
          multiline={multiline}
          numberOfLines={numberOfLines}
          autoFocus={autoFocus}
          onFocus={() => { setFocused(true); onFocus?.(); }}
          onBlur={() => { setFocused(false); onBlur?.(); }}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 8,
  },
  labelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: Clay.colors.textSecondary,
    letterSpacing: 0.3,
  },
  badge: {
    backgroundColor: Clay.colors.primaryBg,
    borderRadius: Clay.radius.pill,
    paddingHorizontal: 10,
    paddingVertical: 3,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '600',
    color: Clay.colors.primaryMed,
  },
  inputWrap: {
    backgroundColor: Clay.colors.card,
    borderRadius: Clay.radius.sm,
    borderWidth: Clay.border,
    borderColor: Clay.colors.border,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  inputFocused: {
    borderColor: Clay.colors.primary,
  },
  prefix: {
    fontSize: 17,
    fontWeight: '600',
    color: Clay.colors.textSecondary,
    marginRight: 6,
  },
  input: {
    flex: 1,
    color: Clay.colors.textPrimary,
    padding: 0,
    margin: 0,
  },
});

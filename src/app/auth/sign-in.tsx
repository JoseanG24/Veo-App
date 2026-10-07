import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TextInput,
  TouchableOpacity, KeyboardAvoidingView, Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Clay, Fonts } from '@/constants/theme';
import { ClayButton } from '@/components/clay/ClayButton';
import { ClayCard } from '@/components/clay/ClayCard';

export default function SignInScreen() {
  const [phone, setPhone] = useState('');
  const [pin, setPin] = useState('');

  function handleSignIn() {
    router.replace('/(tabs)');
  }

  function handleGoSignUp() {
    router.push('/auth/sign-up');
  }

  function handleGoOnboarding() {
    router.push('/onboarding/salary');
  }

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled" keyboardDismissMode="on-drag">
          {/* Logo */}
          <View style={styles.logoBlock}>
            <View style={styles.logoBubble}>
              <Text style={styles.logoV}>v</Text>
            </View>
            <Text style={styles.logoName}>veo</Text>
            <Text style={styles.logoTagline}>Tu plan de ahorro, claro.</Text>
          </View>

          {/* Card */}
          <ClayCard style={styles.card}>
            <Text style={styles.cardTitle}>Bienvenido de vuelta</Text>
            <Text style={styles.cardSubtitle}>
              Ingresa con tu número de teléfono
            </Text>

            <View style={styles.fields}>
              {/* Phone */}
              <View style={styles.fieldGroup}>
                <Text style={styles.fieldLabel}>Número de teléfono</Text>
                <View style={styles.phoneRow}>
                  <View style={styles.prefixBox}>
                    <Text style={styles.prefixText}>🇬🇹 +502</Text>
                  </View>
                  <View style={styles.phoneInputWrap}>
                    <TextInput
                      value={phone}
                      onChangeText={setPhone}
                      placeholder="0000-0000"
                      placeholderTextColor={Clay.colors.placeholder}
                      keyboardType="phone-pad"
                      maxLength={9}
                      style={styles.phoneInput}
                    />
                  </View>
                </View>
              </View>

              {/* PIN */}
              <View style={styles.fieldGroup}>
                <View style={styles.fieldLabelRow}>
                  <Text style={styles.fieldLabel}>PIN o contraseña</Text>
                  <TouchableOpacity>
                    <Text style={styles.forgotText}>¿Olvidaste tu PIN?</Text>
                  </TouchableOpacity>
                </View>
                <View style={styles.pinInputWrap}>
                  <TextInput
                    value={pin}
                    onChangeText={setPin}
                    placeholder="••••••"
                    placeholderTextColor={Clay.colors.placeholder}
                    secureTextEntry
                    keyboardType="numeric"
                    maxLength={6}
                    style={[styles.phoneInput, { fontSize: 22, letterSpacing: 6 }]}
                  />
                </View>
              </View>
            </View>

            <ClayButton
              label="Ingresar →"
              onPress={handleSignIn}
              fullWidth
              size="lg"
              disabled={phone.length < 8 || pin.length < 4}
            />
          </ClayCard>

          {/* Divider */}
          <View style={styles.dividerRow}>
            <View style={styles.divider} />
            <Text style={styles.dividerText}>o</Text>
            <View style={styles.divider} />
          </View>

          {/* Sign up link */}
          <View style={styles.bottomLinks}>
            <Text style={styles.noAccountText}>¿No tienes cuenta?</Text>
            <TouchableOpacity onPress={handleGoSignUp}>
              <Text style={styles.linkText}>Crear cuenta gratis</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity onPress={handleGoOnboarding} style={styles.onboardingLink}>
            <Text style={styles.onboardingText}>
              ← Volver al onboarding
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: Clay.colors.background,
  },
  scroll: {
    paddingHorizontal: 24,
    paddingVertical: 32,
    gap: 24,
    alignItems: 'center',
  },
  logoBlock: {
    alignItems: 'center',
    gap: 10,
  },
  logoBubble: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: Clay.colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    ...Clay.shadow.card,
    borderWidth: 3,
    borderColor: Clay.colors.primaryLight,
  },
  logoV: {
    fontSize: 40,
    fontWeight: '800',
    color: Clay.colors.textOnDark,
    fontFamily: Fonts?.rounded,
  },
  logoName: {
    fontSize: 32,
    fontWeight: '800',
    color: Clay.colors.primary,
    fontFamily: Fonts?.rounded,
    letterSpacing: -1,
  },
  logoTagline: {
    fontSize: 15,
    color: Clay.colors.textSecondary,
    fontWeight: '500',
  },
  card: {
    width: '100%',
    gap: 20,
  },
  cardTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: Clay.colors.textPrimary,
    fontFamily: Fonts?.rounded,
  },
  cardSubtitle: {
    fontSize: 14,
    color: Clay.colors.textSecondary,
    marginTop: -10,
  },
  fields: {
    gap: 16,
  },
  fieldGroup: {
    gap: 8,
  },
  fieldLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: Clay.colors.textSecondary,
    letterSpacing: 0.3,
  },
  fieldLabelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  forgotText: {
    fontSize: 12,
    color: Clay.colors.primaryMed,
    fontWeight: '600',
  },
  phoneRow: {
    flexDirection: 'row',
    gap: 8,
  },
  prefixBox: {
    backgroundColor: Clay.colors.background,
    borderRadius: Clay.radius.sm,
    borderWidth: Clay.border,
    borderColor: Clay.colors.border,
    paddingHorizontal: 12,
    justifyContent: 'center',
    ...Clay.shadow.sm,
  },
  prefixText: {
    fontSize: 13,
    fontWeight: '600',
    color: Clay.colors.textPrimary,
  },
  phoneInputWrap: {
    flex: 1,
    backgroundColor: Clay.colors.card,
    borderRadius: Clay.radius.sm,
    borderWidth: Clay.border,
    borderColor: Clay.colors.border,
    paddingHorizontal: 14,
    ...Clay.shadow.sm,
  },
  phoneInput: {
    fontSize: 17,
    color: Clay.colors.textPrimary,
    paddingVertical: 14,
    fontFamily: Fonts?.sans,
  },
  pinInputWrap: {
    backgroundColor: Clay.colors.card,
    borderRadius: Clay.radius.sm,
    borderWidth: Clay.border,
    borderColor: Clay.colors.border,
    paddingHorizontal: 14,
    ...Clay.shadow.sm,
  },
  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    width: '100%',
  },
  divider: {
    flex: 1,
    height: 1,
    backgroundColor: Clay.colors.border,
  },
  dividerText: {
    fontSize: 13,
    color: Clay.colors.textSecondary,
    fontWeight: '600',
  },
  bottomLinks: {
    alignItems: 'center',
    gap: 8,
  },
  noAccountText: {
    fontSize: 14,
    color: Clay.colors.textSecondary,
  },
  linkText: {
    fontSize: 16,
    fontWeight: '700',
    color: Clay.colors.primary,
    textDecorationLine: 'underline',
  },
  onboardingLink: {
    paddingVertical: 8,
  },
  onboardingText: {
    fontSize: 13,
    color: Clay.colors.textSecondary,
  },
});

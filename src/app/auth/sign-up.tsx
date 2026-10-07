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

export default function SignUpScreen() {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [step, setStep] = useState<'form' | 'otp'>('form');

  function handleSendCode() {
    if (name.trim().length > 0 && phone.length >= 8) {
      setStep('otp');
    }
  }

  function handleCreateAccount() {
    router.replace('/(tabs)');
  }

  function handleGoSignIn() {
    router.push('/auth/sign-in');
  }

  const otpComplete = otp.every(c => c.length === 1);

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled" keyboardDismissMode="on-drag">
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
              <Text style={styles.backArrow}>←</Text>
            </TouchableOpacity>
          </View>

          {/* Logo + title */}
          <View style={styles.logoBlock}>
            <View style={styles.logoBubble}>
              <Text style={styles.logoV}>v</Text>
            </View>
            <Text style={styles.title}>Crear tu cuenta</Text>
            <Text style={styles.subtitle}>
              Gratis por 30 días, sin tarjeta de crédito.
            </Text>
          </View>

          {step === 'form' ? (
            <ClayCard style={styles.card}>
              {/* Benefits */}
              <View style={styles.benefits}>
                {['Dashboard con tu meta', 'Planificador de salario', 'Perspectiva antes de comprar'].map(b => (
                  <View key={b} style={styles.benefitRow}>
                    <View style={styles.benefitCheck}>
                      <Text style={styles.checkMark}>✓</Text>
                    </View>
                    <Text style={styles.benefitText}>{b}</Text>
                  </View>
                ))}
              </View>

              <View style={styles.dividerLine} />

              {/* Name */}
              <View style={styles.fieldGroup}>
                <Text style={styles.fieldLabel}>Tu nombre</Text>
                <View style={styles.inputWrap}>
                  <TextInput
                    value={name}
                    onChangeText={setName}
                    placeholder="Andrés García"
                    placeholderTextColor={Clay.colors.placeholder}
                    style={styles.input}
                    autoCapitalize="words"
                  />
                </View>
              </View>

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
                      style={styles.input}
                    />
                  </View>
                </View>
              </View>

              <ClayButton
                label="Enviar código →"
                onPress={handleSendCode}
                fullWidth
                size="lg"
                disabled={name.trim().length === 0 || phone.length < 8}
              />

              <Text style={styles.termsText}>
                Al crear tu cuenta aceptas los{' '}
                <Text style={styles.termsLink}>Términos de uso</Text> y la{' '}
                <Text style={styles.termsLink}>Política de privacidad</Text>.
              </Text>
            </ClayCard>
          ) : (
            <ClayCard style={styles.card}>
              <View style={styles.otpHeader}>
                <View style={styles.otpIcon}>
                  <Text style={styles.otpIconText}>SMS</Text>
                </View>
                <Text style={styles.otpTitle}>
                  Código enviado a +502 {phone}
                </Text>
                <Text style={styles.otpSubtitle}>
                  Ingresa el código de 6 dígitos
                </Text>
              </View>

              <View style={styles.otpRow}>
                {otp.map((v, i) => (
                  <View key={i} style={[styles.otpBox, v && styles.otpBoxFilled]}>
                    <TextInput
                      value={v}
                      onChangeText={t => {
                        const next = [...otp];
                        next[i] = t;
                        setOtp(next);
                      }}
                      keyboardType="numeric"
                      maxLength={1}
                      textAlign="center"
                      style={styles.otpInput}
                    />
                  </View>
                ))}
              </View>

              <ClayButton
                label={`Crear cuenta — Hola, ${name.split(' ')[0]}`}
                onPress={handleCreateAccount}
                fullWidth
                size="lg"
                disabled={!otpComplete}
              />

              <TouchableOpacity style={styles.resendBtn}>
                <Text style={styles.resendText}>¿No llegó? Reenviar código</Text>
              </TouchableOpacity>
            </ClayCard>
          )}

          {/* Sign in link */}
          <View style={styles.signinRow}>
            <Text style={styles.signinText}>¿Ya tienes cuenta?</Text>
            <TouchableOpacity onPress={handleGoSignIn}>
              <Text style={styles.signinLink}>Ingresar</Text>
            </TouchableOpacity>
          </View>
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
    paddingBottom: 40,
    gap: 24,
  },
  header: {
    paddingTop: 8,
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Clay.colors.card,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: Clay.border,
    borderColor: Clay.colors.border,
  },
  backArrow: {
    fontSize: 18,
    color: Clay.colors.textPrimary,
    fontWeight: '700',
  },
  logoBlock: {
    alignItems: 'center',
    gap: 10,
  },
  logoBubble: {
    width: 68,
    height: 68,
    borderRadius: 34,
    backgroundColor: Clay.colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    ...Clay.shadow.card,
    borderWidth: 3,
    borderColor: Clay.colors.primaryLight,
  },
  logoV: {
    fontSize: 34,
    fontWeight: '800',
    color: Clay.colors.textOnDark,
    fontFamily: Fonts?.rounded,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: Clay.colors.textPrimary,
    fontFamily: Fonts?.rounded,
  },
  subtitle: {
    fontSize: 14,
    color: Clay.colors.textSecondary,
    textAlign: 'center',
  },
  card: {
    gap: 16,
  },
  benefits: {
    gap: 10,
  },
  benefitRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  benefitCheck: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: Clay.colors.primaryBg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkMark: {
    fontSize: 12,
    fontWeight: '700',
    color: Clay.colors.primary,
  },
  benefitText: {
    fontSize: 14,
    fontWeight: '500',
    color: Clay.colors.textPrimary,
  },
  dividerLine: {
    height: 1,
    backgroundColor: Clay.colors.border,
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
  inputWrap: {
    backgroundColor: Clay.colors.card,
    borderRadius: Clay.radius.sm,
    borderWidth: Clay.border,
    borderColor: Clay.colors.border,
    paddingHorizontal: 14,
    ...Clay.shadow.sm,
  },
  input: {
    fontSize: 17,
    color: Clay.colors.textPrimary,
    paddingVertical: 14,
    fontFamily: Fonts?.sans,
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
  termsText: {
    fontSize: 12,
    color: Clay.colors.textSecondary,
    textAlign: 'center',
    lineHeight: 18,
  },
  termsLink: {
    color: Clay.colors.primaryMed,
    fontWeight: '600',
  },
  otpHeader: {
    alignItems: 'center',
    gap: 8,
  },
  otpIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: Clay.colors.primaryBg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  otpIconText: {
    fontSize: 11,
    fontWeight: '800',
    color: Clay.colors.primaryMed,
    letterSpacing: 0.5,
  },
  otpTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: Clay.colors.textPrimary,
    textAlign: 'center',
  },
  otpSubtitle: {
    fontSize: 13,
    color: Clay.colors.textSecondary,
    textAlign: 'center',
  },
  otpRow: {
    flexDirection: 'row',
    gap: 8,
    justifyContent: 'center',
  },
  otpBox: {
    width: 46,
    height: 56,
    backgroundColor: Clay.colors.background,
    borderRadius: Clay.radius.sm,
    borderWidth: Clay.border,
    borderColor: Clay.colors.border,
    ...Clay.shadow.sm,
  },
  otpBoxFilled: {
    borderColor: Clay.colors.primaryLight,
    backgroundColor: Clay.colors.primaryBg,
  },
  otpInput: {
    flex: 1,
    textAlign: 'center',
    fontSize: 22,
    fontWeight: '700',
    color: Clay.colors.textPrimary,
  },
  resendBtn: {
    alignItems: 'center',
    paddingVertical: 8,
  },
  resendText: {
    fontSize: 14,
    color: Clay.colors.primaryMed,
    fontWeight: '600',
    textDecorationLine: 'underline',
  },
  signinRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 6,
  },
  signinText: {
    fontSize: 14,
    color: Clay.colors.textSecondary,
  },
  signinLink: {
    fontSize: 14,
    fontWeight: '700',
    color: Clay.colors.primary,
    textDecorationLine: 'underline',
  },
});

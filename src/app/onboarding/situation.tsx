import React, { useState } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, ScrollView,
  KeyboardAvoidingView, Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Clay, Fonts } from '@/constants/theme';
import { ClayButton } from '@/components/clay/ClayButton';
import { ClayInput } from '@/components/clay/ClayInput';

function ProgressDots({ current, total }: { current: number; total: number }) {
  return (
    <View style={styles.dots}>
      {Array.from({ length: total }).map((_, i) => (
        <View
          key={i}
          style={[styles.dot, i < current && styles.dotActive]}
        />
      ))}
    </View>
  );
}

export default function SituationScreen() {
  const [savings, setSavings] = useState('');
  const [debt, setDebt] = useState('');

  function handleContinue() {
    router.push('/onboarding/goal');
  }

  function handleSkip() {
    setSavings('');
    setDebt('');
    router.push('/onboarding/goal');
  }

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.scroll}
          keyboardDismissMode="on-drag"
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Back + progress */}
          <View style={styles.topRow}>
            <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
              <Text style={styles.backArrow}>←</Text>
            </TouchableOpacity>
            <ProgressDots current={2} total={4} />
            <View style={{ width: 40 }} />
          </View>

          {/* Title */}
          <View style={styles.titleBlock}>
            <Text style={styles.title}>Tu situación{'\n'}actual</Text>
            <Text style={styles.subtitle}>
              Cuéntanos dónde partes. Si lo dejas vacío, asumimos Q0 en ambos.
            </Text>
          </View>

          {/* Inputs */}
          <View style={styles.inputsBlock}>
            <View style={styles.infoCard}>
              <View style={styles.infoIconWrap}>
                <Text style={styles.infoIconLetter}>A</Text>
              </View>
              <View style={styles.infoContent}>
                <View style={styles.infoLabelRow}>
                  <Text style={styles.infoLabel}>¿Cuánto tienes ahorrado?</Text>
                  <View style={styles.optBadge}>
                    <Text style={styles.optText}>Opcional</Text>
                  </View>
                </View>
                <ClayInput
                  placeholder="Q0"
                  value={savings}
                  onChangeText={setSavings}
                  keyboardType="numeric"
                  prefix="Q"
                  fontSize={18}
                />
                {savings !== '' && (
                  <Text style={styles.hint}>
                    Tu meta arrancará desde Q{Number(savings).toLocaleString('es-GT')}
                  </Text>
                )}
              </View>
            </View>

            <View style={styles.infoCard}>
              <View style={[styles.infoIconWrap, { backgroundColor: '#FFE5DC' }]}>
                <Text style={[styles.infoIconLetter, { color: '#B85420' }]}>D</Text>
              </View>
              <View style={styles.infoContent}>
                <View style={styles.infoLabelRow}>
                  <Text style={styles.infoLabel}>¿Cuánto debes en total?</Text>
                  <View style={styles.optBadge}>
                    <Text style={styles.optText}>Opcional</Text>
                  </View>
                </View>
                <ClayInput
                  placeholder="Q0"
                  value={debt}
                  onChangeText={setDebt}
                  keyboardType="numeric"
                  prefix="Q"
                  fontSize={18}
                />
              </View>
            </View>
          </View>

          <View style={styles.bottom}>
            <ClayButton
              label="Continuar →"
              onPress={handleContinue}
              fullWidth
              size="lg"
            />
            <TouchableOpacity onPress={handleSkip} style={styles.skipBtn}>
              <Text style={styles.skipText}>Dejarlo en Q0 por ahora</Text>
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
    paddingBottom: 32,
    gap: 28,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
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
  dots: {
    flexDirection: 'row',
    gap: 6,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Clay.colors.border,
  },
  dotActive: {
    backgroundColor: Clay.colors.primary,
    width: 24,
  },
  titleBlock: {
    gap: 10,
  },
  title: {
    fontSize: 32,
    fontWeight: '800',
    color: Clay.colors.textPrimary,
    fontFamily: Fonts?.rounded,
    lineHeight: 40,
  },
  subtitle: {
    fontSize: 15,
    color: Clay.colors.textSecondary,
    lineHeight: 22,
  },
  inputsBlock: {
    gap: 16,
  },
  infoCard: {
    flexDirection: 'row',
    gap: 14,
    backgroundColor: Clay.colors.card,
    borderRadius: Clay.radius.md,
    borderWidth: Clay.border,
    borderColor: Clay.colors.border,
    padding: 18,
    ...Clay.shadow.sm,
  },
  infoIconWrap: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Clay.colors.primaryBg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  infoIconLetter: {
    fontSize: 18,
    fontWeight: '800',
    color: Clay.colors.primaryMed,
    fontFamily: Fonts?.rounded,
  },
  infoContent: {
    flex: 1,
    gap: 10,
  },
  infoLabelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    gap: 6,
  },
  infoLabel: {
    fontSize: 14,
    fontWeight: '700',
    color: Clay.colors.textPrimary,
    flex: 1,
  },
  optBadge: {
    backgroundColor: '#F0ECE4',
    borderRadius: Clay.radius.pill,
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderWidth: 1.5,
    borderColor: '#C4B89A',
  },
  optText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#7A6855',
  },
  hint: {
    fontSize: 12,
    color: Clay.colors.primaryMed,
    fontWeight: '600',
  },
  bottom: {
    gap: 12,
  },
  skipBtn: {
    alignItems: 'center',
    paddingVertical: 12,
  },
  skipText: {
    fontSize: 14,
    color: Clay.colors.textSecondary,
    fontWeight: '600',
    textDecorationLine: 'underline',
  },
});

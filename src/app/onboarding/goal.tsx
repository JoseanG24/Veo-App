import React, { useState } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, ScrollView,
  KeyboardAvoidingView, Platform, TextInput,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Clay, Fonts } from '@/constants/theme';
import { ClayButton } from '@/components/clay/ClayButton';

const SUGGESTIONS = [
  'Fondo de emergencia Q10,000',
  'Viaje internacional Q8,000',
  'Computadora nueva Q7,000',
  'Invertir en negocio Q20,000',
  'Auto o moto Q12,000',
];

function ProgressDots({ current, total }: { current: number; total: number }) {
  return (
    <View style={styles.dots}>
      {Array.from({ length: total }).map((_, i) => (
        <View key={i} style={[styles.dot, i < current && styles.dotActive]} />
      ))}
    </View>
  );
}

export default function GoalScreen() {
  const [goal, setGoal] = useState('');
  const placeholder = 'Ej: Quiero ahorrar para un viaje a México, necesito Q8,000.';

  function handleContinue() {
    router.push('/onboarding/plan');
  }

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={20}
      >
        <View style={styles.container}>
          {/* Top nav */}
          <View style={styles.topRow}>
            <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
              <Text style={styles.backArrow}>←</Text>
            </TouchableOpacity>
            <ProgressDots current={3} total={4} />
            <View style={{ width: 40 }} />
          </View>

          {/* Title */}
          <View style={styles.titleBlock}>
            <Text style={styles.tag}>TU META</Text>
            <Text style={styles.title}>¿Qué quieres{'\n'}lograr?</Text>
            <Text style={styles.subtitle}>
              Escríbelo como si se lo contaras a un amigo.
            </Text>
          </View>

          {/* Main text input — flex:1 absorbs all remaining vertical space */}
          <View style={[styles.inputWrap, goal.length > 0 && styles.inputWrapActive]}>
            <TextInput
              value={goal}
              onChangeText={setGoal}
              placeholder={placeholder}
              placeholderTextColor={Clay.colors.placeholder}
              multiline
              style={styles.goalInput}
              textAlignVertical="top"
            />
          </View>

          {/* Suggestions — horizontal scroll, single row */}
          <View style={styles.suggestionsBlock}>
            <Text style={styles.suggestionsTitle}>O elige una idea</Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              style={styles.suggestionsScroll}
              contentContainerStyle={styles.suggestionsScrollContent}
              keyboardShouldPersistTaps="handled"
            >
              {SUGGESTIONS.map(s => (
                <TouchableOpacity
                  key={s}
                  style={[styles.suggChip, goal === s && styles.suggChipActive]}
                  onPress={() => setGoal(s)}
                  activeOpacity={0.8}
                >
                  <Text style={[styles.suggText, goal === s && styles.suggTextActive]}>
                    {s}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>

          {/* CTA */}
          <ClayButton
            label="Ver mi plan →"
            onPress={handleContinue}
            fullWidth
            size="lg"
            disabled={goal.trim().length === 0}
          />
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: Clay.colors.background,
  },
  container: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 8,
    paddingBottom: 20,
    gap: 16,
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
    gap: 6,
  },
  tag: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1.5,
    color: Clay.colors.primaryMed,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: Clay.colors.textPrimary,
    fontFamily: Fonts?.rounded,
    lineHeight: 36,
  },
  subtitle: {
    fontSize: 14,
    color: Clay.colors.textSecondary,
    lineHeight: 20,
  },
  inputWrap: {
    flex: 1,
    backgroundColor: Clay.colors.card,
    borderRadius: Clay.radius.md,
    borderWidth: Clay.border,
    borderColor: Clay.colors.border,
    padding: 16,
    ...Clay.shadow.sm,
  },
  inputWrapActive: {
    borderColor: Clay.colors.primaryLight,
  },
  goalInput: {
    flex: 1,
    fontSize: 17,
    color: Clay.colors.textPrimary,
    fontFamily: Fonts?.sans,
    lineHeight: 26,
  },
  suggestionsBlock: {
    gap: 10,
  },
  suggestionsTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: Clay.colors.textSecondary,
  },
  suggestionsScroll: {
    flexGrow: 0,
    marginHorizontal: -24,
  },
  suggestionsScrollContent: {
    paddingHorizontal: 24,
    gap: 8,
  },
  suggChip: {
    backgroundColor: Clay.colors.card,
    borderRadius: Clay.radius.pill,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderWidth: Clay.border,
    borderColor: Clay.colors.border,
  },
  suggChipActive: {
    backgroundColor: Clay.colors.primary,
    borderColor: Clay.colors.primary,
  },
  suggText: {
    fontSize: 13,
    fontWeight: '600',
    color: Clay.colors.textSecondary,
  },
  suggTextActive: {
    color: Clay.colors.textOnDark,
  },
});

import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  TextInput, KeyboardAvoidingView, Platform, Animated,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Clay, Fonts } from '@/constants/theme';
import { ClayCard } from '@/components/clay/ClayCard';
import { ClayButton } from '@/components/clay/ClayButton';

const SALARY = 7500;
const HOURLY = SALARY / (4 * 5 * 8);
const GOAL_REMAINING = 10500;

function calcMetrics(amount: number, rate: number) {
  const pctSalary = (amount / SALARY) * 100;
  const daysSalary = amount / (SALARY / 30);
  const hoursSalary = amount / HOURLY;
  const goalDelay = amount > 0 ? Math.ceil(amount / 800) : 0;
  const totalWithInterest = rate > 0
    ? amount * (1 + (rate / 100) / 12) * 12
    : 0;
  const interestCost = totalWithInterest - amount;
  return { pctSalary, daysSalary, hoursSalary, goalDelay, interestCost };
}

export default function PerspectiveScreen() {
  const [amount, setAmount] = useState('');
  const [rate, setRate] = useState('');
  const [showRate, setShowRate] = useState(false);
  const [hasResult, setHasResult] = useState(false);

  const numAmount = Number(amount.replace(/,/g, '')) || 0;
  const numRate = Number(rate) || 0;
  const metrics = calcMetrics(numAmount, numRate);

  function handleCalc() {
    if (numAmount > 0) setHasResult(true);
  }

  function handleReset() {
    setAmount('');
    setRate('');
    setHasResult(false);
    setShowRate(false);
  }

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.scroll}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          keyboardDismissMode="on-drag"
        >
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.title}>Perspectiva</Text>
            <View style={styles.tagWrap}>
              <Text style={styles.tag}>¿Vale la pena?</Text>
            </View>
          </View>

          <Text style={styles.desc}>
            Escribe cuánto cuesta algo que estás considerando comprar. Veo te muestra qué significa ese gasto en tu realidad.
          </Text>

          {/* Input card */}
          <ClayCard style={styles.inputCard}>
            <Text style={styles.inputLabel}>¿Cuánto cuesta?</Text>
            <View style={styles.amountRow}>
              <View style={styles.currencyBadge}>
                <Text style={styles.currencyText}>Q</Text>
              </View>
              <View style={styles.amountInputWrap}>
                <TextInput
                  value={amount}
                  onChangeText={setAmount}
                  placeholder="3,500"
                  placeholderTextColor={Clay.colors.placeholder}
                  keyboardType="numeric"
                  style={styles.amountInput}
                />
              </View>
            </View>

            {/* Rate toggle */}
            <TouchableOpacity
              style={styles.rateToggle}
              onPress={() => setShowRate(!showRate)}
            >
              <Text style={styles.rateToggleText}>
                {showRate ? '▲' : '▼'} ¿Lo financias a cuotas?
              </Text>
            </TouchableOpacity>

            {showRate && (
              <View style={styles.rateRow}>
                <View style={styles.rateInputWrap}>
                  <TextInput
                    value={rate}
                    onChangeText={setRate}
                    placeholder="24"
                    placeholderTextColor={Clay.colors.placeholder}
                    keyboardType="numeric"
                    style={styles.rateInput}
                  />
                </View>
                <Text style={styles.rateLabel}>% anual de interés</Text>
              </View>
            )}

            <ClayButton
              label={hasResult ? 'Recalcular' : 'Ver perspectiva →'}
              onPress={handleCalc}
              fullWidth
              disabled={numAmount === 0}
            />
          </ClayCard>

          {hasResult && (
            <>
              {/* Item being analyzed */}
              <View style={styles.analyzeLabel}>
                <Text style={styles.analyzeLabelText}>
                  Análisis de{' '}
                  <Text style={styles.analyzeLabelAmount}>
                    Q{numAmount.toLocaleString('es-GT')}
                  </Text>
                </Text>
              </View>

              {/* 2×2 grid */}
              <View style={styles.metricsGrid}>
                <MetricCard
                  label="De tu salario mensual"
                  value={`${metrics.pctSalary.toFixed(0)}%`}
                  detail={`Q${SALARY.toLocaleString()} al mes`}
                  color="#E8F5E9"
                  highlight={metrics.pctSalary > 30}
                />
                <MetricCard
                  label="Días de trabajo"
                  value={metrics.daysSalary >= 1
                    ? `${metrics.daysSalary.toFixed(1)} días`
                    : `${Math.round(metrics.hoursSalary)} horas`
                  }
                  detail={`Q${HOURLY.toFixed(0)}/hora`}
                  color="#E3F2FD"
                />
                <MetricCard
                  label="Retraso en tu meta"
                  value={metrics.goalDelay > 0 ? `${metrics.goalDelay} mes${metrics.goalDelay !== 1 ? 'es' : ''}` : 'Sin impacto'}
                  detail="si lo sacás del ahorro"
                  color="#FFF3E0"
                  highlight={metrics.goalDelay > 2}
                />
                <MetricCard
                  label="Costo en intereses"
                  value={numRate > 0 ? `Q${metrics.interestCost.toFixed(0)}` : '—'}
                  detail={numRate > 0 ? `total: Q${(numAmount + metrics.interestCost).toFixed(0)}` : 'Agregá la tasa de interés'}
                  color="#FCE4EC"
                  onPress={() => setShowRate(true)}
                />
              </View>

              {/* Neutral disclaimer */}
              <View style={styles.disclaimer}>
                <Text style={styles.disclaimerText}>
                  Veo informa. No dice si comprar o no. No hay "eso es mucho" ni de aprobación — solo números en contexto.
                </Text>
              </View>

              <TouchableOpacity onPress={handleReset} style={styles.resetBtn}>
                <Text style={styles.resetText}>Analizar otro monto</Text>
              </TouchableOpacity>
            </>
          )}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

function MetricCard({
  label, value, detail, color, highlight, onPress,
}: {
  label: string; value: string; detail: string;
  color: string; highlight?: boolean; onPress?: () => void;
}) {
  return (
    <TouchableOpacity
      style={[
        styles.metricCard,
        { backgroundColor: color },
        highlight && styles.metricCardHighlight,
      ]}
      onPress={onPress}
      activeOpacity={onPress ? 0.8 : 1}
    >
      <Text style={styles.metricValue}>{value}</Text>
      <Text style={styles.metricLabel}>{label}</Text>
      <Text style={styles.metricDetail}>{detail}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: Clay.colors.background,
  },
  scroll: {
    paddingHorizontal: 20,
    paddingBottom: 32,
    gap: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingTop: 12,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: Clay.colors.textPrimary,
    fontFamily: Fonts?.rounded,
  },
  tagWrap: {
    backgroundColor: Clay.colors.accentOrange + '22',
    borderRadius: Clay.radius.pill,
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderWidth: 1.5,
    borderColor: Clay.colors.accentOrange + '55',
  },
  tag: {
    fontSize: 12,
    fontWeight: '700',
    color: Clay.colors.accentOrange,
  },
  desc: {
    fontSize: 14,
    color: Clay.colors.textSecondary,
    lineHeight: 22,
  },
  inputCard: {
    gap: 14,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '700',
    color: Clay.colors.textPrimary,
  },
  amountRow: {
    flexDirection: 'row',
    gap: 10,
    alignItems: 'center',
  },
  currencyBadge: {
    width: 48,
    height: 56,
    backgroundColor: Clay.colors.primaryBg,
    borderRadius: Clay.radius.sm,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: Clay.border,
    borderColor: Clay.colors.border,
  },
  currencyText: {
    fontSize: 22,
    fontWeight: '800',
    color: Clay.colors.primary,
    fontFamily: Fonts?.rounded,
  },
  amountInputWrap: {
    flex: 1,
    backgroundColor: Clay.colors.card,
    borderRadius: Clay.radius.sm,
    borderWidth: Clay.border,
    borderColor: Clay.colors.border,
    paddingHorizontal: 14,
    ...Clay.shadow.sm,
  },
  amountInput: {
    fontSize: 28,
    fontWeight: '800',
    color: Clay.colors.textPrimary,
    paddingVertical: 12,
    fontFamily: Fonts?.rounded,
  },
  rateToggle: {
    alignSelf: 'flex-start',
    paddingVertical: 6,
  },
  rateToggleText: {
    fontSize: 13,
    color: Clay.colors.primaryMed,
    fontWeight: '600',
  },
  rateRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  rateInputWrap: {
    width: 80,
    backgroundColor: Clay.colors.card,
    borderRadius: Clay.radius.sm,
    borderWidth: Clay.border,
    borderColor: Clay.colors.border,
    paddingHorizontal: 12,
    ...Clay.shadow.sm,
  },
  rateInput: {
    fontSize: 20,
    fontWeight: '700',
    color: Clay.colors.textPrimary,
    paddingVertical: 12,
    fontFamily: Fonts?.rounded,
  },
  rateLabel: {
    fontSize: 14,
    color: Clay.colors.textSecondary,
    fontWeight: '500',
    flex: 1,
  },
  analyzeLabel: {
    paddingHorizontal: 4,
  },
  analyzeLabelText: {
    fontSize: 16,
    fontWeight: '600',
    color: Clay.colors.textSecondary,
  },
  analyzeLabelAmount: {
    color: Clay.colors.textPrimary,
    fontWeight: '800',
    fontFamily: Fonts?.rounded,
  },
  metricsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  metricCard: {
    width: '47%',
    borderRadius: Clay.radius.md,
    padding: 16,
    gap: 6,
    borderWidth: Clay.border,
    borderColor: 'rgba(0,0,0,0.06)',
    ...Clay.shadow.sm,
  },
  metricCardHighlight: {
    borderColor: Clay.colors.accentOrange,
    borderWidth: 2,
  },
  metricValue: {
    fontSize: 24,
    fontWeight: '800',
    color: Clay.colors.textPrimary,
    fontFamily: Fonts?.rounded,
  },
  metricLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: Clay.colors.textPrimary,
    lineHeight: 16,
  },
  metricDetail: {
    fontSize: 11,
    color: Clay.colors.textSecondary,
    lineHeight: 15,
  },
  disclaimer: {
    backgroundColor: Clay.colors.card,
    borderRadius: Clay.radius.sm,
    padding: 14,
    borderWidth: Clay.border,
    borderColor: Clay.colors.border,
    borderLeftWidth: 4,
    borderLeftColor: Clay.colors.textSecondary,
  },
  disclaimerText: {
    fontSize: 13,
    color: Clay.colors.textSecondary,
    lineHeight: 20,
    fontStyle: 'italic',
  },
  resetBtn: {
    alignItems: 'center',
    paddingVertical: 12,
  },
  resetText: {
    fontSize: 14,
    color: Clay.colors.primaryMed,
    fontWeight: '600',
    textDecorationLine: 'underline',
  },
});

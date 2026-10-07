import React, { useState } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Clay, Fonts } from '@/constants/theme';
import { ClayButton } from '@/components/clay/ClayButton';

type Period = 'mensual' | 'quincenal';

const QUICK_AMOUNTS = [3000, 5000, 7500, 10000, 15000];

function formatQ(amount: number) {
  return `Q${amount.toLocaleString('es-GT')}`;
}

export default function SalaryScreen() {
  const [amount, setAmount] = useState('');
  const [period, setPeriod] = useState<Period>('mensual');

  const displayValue = amount ? formatQ(Number(amount)) : 'Q0';

  function handleKey(key: string) {
    if (key === '⌫') {
      setAmount(prev => prev.slice(0, -1));
    } else {
      setAmount(prev => {
        const next = prev + key;
        return Number(next) > 999999 ? prev : next;
      });
    }
  }

  function handleContinue() {
    router.push('/onboarding/situation');
  }

  const keys = ['1','2','3','4','5','6','7','8','9','','0','⌫'];

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.logoRow}>
            <View style={styles.logoDot} />
            <Text style={styles.logoText}>veo</Text>
          </View>
          <Text style={styles.progress}>1 de 4</Text>
        </View>

        {/* Title */}
        <View style={styles.titleBlock}>
          <Text style={styles.title}>¿Cuánto ganas?</Text>
          <Text style={styles.subtitle}>Tu salario mensual o quincenal</Text>
        </View>

        {/* Period toggle */}
        <View style={styles.toggleRow}>
          {(['mensual', 'quincenal'] as Period[]).map(p => (
            <TouchableOpacity
              key={p}
              style={[styles.pill, period === p && styles.pillActive]}
              onPress={() => setPeriod(p)}
              activeOpacity={0.8}
            >
              <Text style={[styles.pillText, period === p && styles.pillTextActive]}>
                {p.charAt(0).toUpperCase() + p.slice(1)}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Amount display — flex:1 absorbs all remaining space, keeps numpad pinned below */}
        <View style={styles.amountBlock}>
          <Text style={styles.amountText}>{displayValue}</Text>
          <Text style={styles.amountLabel}>al {period}</Text>
        </View>

        {/* Quick amounts */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.quickRow}
          contentContainerStyle={styles.quickRowContent}
        >
          {QUICK_AMOUNTS.map(q => (
            <TouchableOpacity
              key={q}
              style={[styles.quickPill, amount === String(q) && styles.quickPillActive]}
              onPress={() => setAmount(String(q))}
              activeOpacity={0.8}
            >
              <Text style={[styles.quickText, amount === String(q) && styles.quickTextActive]}>
                {formatQ(q)}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Numpad */}
        <View style={styles.numpad}>
          {keys.map((k, i) => (
            <TouchableOpacity
              key={i}
              style={[styles.numKey, k === '' && styles.numKeyHidden]}
              onPress={() => k && handleKey(k)}
              activeOpacity={0.7}
              disabled={k === ''}
            >
              <Text style={[styles.numText, k === '⌫' && styles.backspaceText]}>{k}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* CTA */}
        <ClayButton
          label="Continuar →"
          onPress={handleContinue}
          fullWidth
          size="lg"
          disabled={!amount || amount === '0'}
        />
      </View>
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
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  logoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  logoDot: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: Clay.colors.primary,
  },
  logoText: {
    fontSize: 20,
    fontWeight: '800',
    color: Clay.colors.primary,
    fontFamily: Fonts?.rounded,
  },
  progress: {
    fontSize: 13,
    color: Clay.colors.textSecondary,
    fontWeight: '600',
  },
  titleBlock: {
    gap: 4,
    marginTop: 14,
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
  },
  toggleRow: {
    flexDirection: 'row',
    gap: 10,
    backgroundColor: Clay.colors.card,
    padding: 4,
    borderRadius: Clay.radius.pill,
    borderWidth: Clay.border,
    borderColor: Clay.colors.border,
    alignSelf: 'flex-start',
    marginTop: 12,
  },
  pill: {
    paddingHorizontal: 18,
    paddingVertical: 7,
    borderRadius: Clay.radius.pill,
  },
  pillActive: {
    backgroundColor: Clay.colors.primary,
  },
  pillText: {
    fontSize: 13,
    fontWeight: '600',
    color: Clay.colors.textSecondary,
  },
  pillTextActive: {
    color: Clay.colors.textOnDark,
  },
  // flex:1 + justifyContent:center makes this section expand to fill whatever
  // vertical space is left between the toggle and the quick pills
  amountBlock: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 2,
  },
  amountText: {
    fontSize: 52,
    fontWeight: '800',
    color: Clay.colors.textPrimary,
    fontFamily: Fonts?.rounded,
  },
  amountLabel: {
    fontSize: 15,
    color: Clay.colors.textSecondary,
  },
  quickRow: {
    flexGrow: 0,
    marginHorizontal: -24,
    marginBottom: 12,
  },
  quickRowContent: {
    paddingHorizontal: 24,
  },
  quickPill: {
    backgroundColor: Clay.colors.card,
    borderRadius: Clay.radius.pill,
    paddingHorizontal: 14,
    paddingVertical: 7,
    marginRight: 8,
    borderWidth: Clay.border,
    borderColor: Clay.colors.border,
  },
  quickPillActive: {
    backgroundColor: Clay.colors.primaryBg,
    borderColor: Clay.colors.primaryLight,
  },
  quickText: {
    fontSize: 13,
    fontWeight: '600',
    color: Clay.colors.textSecondary,
  },
  quickTextActive: {
    color: Clay.colors.primary,
  },
  numpad: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 12,
  },
  numKey: {
    width: '30%',
    paddingVertical: 13,
    backgroundColor: Clay.colors.card,
    borderRadius: Clay.radius.md,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: Clay.border,
    borderColor: Clay.colors.border,
    ...Clay.shadow.sm,
  },
  numKeyHidden: {
    backgroundColor: 'transparent',
    borderWidth: 0,
    shadowOpacity: 0,
    elevation: 0,
  },
  numText: {
    fontSize: 22,
    fontWeight: '700',
    color: Clay.colors.textPrimary,
    fontFamily: Fonts?.rounded,
  },
  backspaceText: {
    fontSize: 18,
    color: Clay.colors.textSecondary,
  },
});

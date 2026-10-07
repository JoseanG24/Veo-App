import React from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Clay, Fonts } from '@/constants/theme';
import { ClayCard } from '@/components/clay/ClayCard';

const GOAL_TOTAL = 15000;
const SAVED = 4500;
const PROGRESS = SAVED / GOAL_TOTAL;
const MONTHS_LEFT = 13;
const SALARY = 7500;

const CATEGORIES = [
  { label: 'Vivienda',   pct: 0.30, color: '#4361EE' },
  { label: 'Comida',     pct: 0.20, color: '#F77F00' },
  { label: 'Transporte', pct: 0.10, color: '#2EC4B6' },
  { label: 'Deudas',     pct: 0.15, color: '#E63946' },
  { label: 'Meta',       pct: 0.20, color: '#52B788' },
  { label: 'Emergencia', pct: 0.05, color: '#FFB703' },
];

export default function DashboardScreen() {
  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
      >
        {/* Greeting */}
        <View style={styles.greeting}>
          <View style={styles.greetingLeft}>
            <Text style={styles.greetingSmall}>Buenos días,</Text>
            <Text style={styles.greetingName}>Andrés</Text>
          </View>
          <View style={styles.avatar}>
            <Text style={styles.avatarLetter}>A</Text>
          </View>
        </View>

        {/* Goal card */}
        <ClayCard style={styles.goalCard}>
          <View style={styles.goalTop}>
            <Text style={styles.goalTag}>TU META</Text>
            <View style={styles.monthsPill}>
              <Text style={styles.monthsPillNum}>{MONTHS_LEFT}</Text>
              <Text style={styles.monthsPillLabel}> meses</Text>
            </View>
          </View>

          <Text style={styles.goalName}>Mi primera meta{'\n'}Q{GOAL_TOTAL.toLocaleString('es-GT')}</Text>

          {/* Progress bar */}
          <View style={styles.progressTrack}>
            <View style={[styles.progressFill, { width: `${PROGRESS * 100}%` }]} />
          </View>
          <Text style={styles.progressLabel}>{Math.round(PROGRESS * 100)}% completado</Text>

          <View style={styles.goalBottom}>
            <View>
              <Text style={styles.savedAmount}>Q{SAVED.toLocaleString('es-GT')}</Text>
              <Text style={styles.savedLabel}>ahorrado de Q{GOAL_TOTAL.toLocaleString('es-GT')}</Text>
            </View>
            <TouchableOpacity style={styles.monthlyPill}>
              <Text style={styles.monthlyPillText}>Q800/mes</Text>
            </TouchableOpacity>
          </View>
        </ClayCard>

        {/* Budget breakdown card */}
        <ClayCard style={styles.budgetCard} padding={18}>
          <View style={styles.budgetTop}>
            <Text style={styles.budgetTitle}>Tu presupuesto</Text>
            <Text style={styles.budgetSalary}>Q{SALARY.toLocaleString('es-GT')}/mes</Text>
          </View>

          {/* Stacked bar */}
          <View style={styles.budgetBar}>
            {CATEGORIES.map(cat => (
              <View
                key={cat.label}
                style={[styles.budgetBarChunk, { flex: cat.pct, backgroundColor: cat.color }]}
              />
            ))}
          </View>

          {/* Category rows */}
          <View style={styles.budgetRows}>
            {CATEGORIES.map(cat => (
              <View key={cat.label} style={styles.budgetRow}>
                <View style={[styles.budgetDot, { backgroundColor: cat.color }]} />
                <Text style={styles.budgetRowLabel}>{cat.label}</Text>
                <Text style={styles.budgetRowPct}>{Math.round(cat.pct * 100)}%</Text>
                <Text style={styles.budgetRowAmount}>Q{Math.round(cat.pct * SALARY).toLocaleString()}</Text>
              </View>
            ))}
          </View>
        </ClayCard>

        {/* Quick actions */}
        <View style={styles.quickActions}>
          <QuickCard
            label={'Planifi-\ncador'}
            symbol="="
            color={Clay.colors.primary}
            onPress={() => router.push('/(tabs)/planner')}
          />
          <QuickCard
            label={'Perspec-\ntiva'}
            symbol="%"
            color={Clay.colors.accentOrange}
            onPress={() => router.push('/(tabs)/perspective')}
          />
          <QuickCard
            label={'Situación'}
            symbol="$"
            color={Clay.colors.accentPurple}
            onPress={() => router.push('/(tabs)/situation')}
          />
        </View>

        {/* Month review banner */}
        <View style={styles.monthBanner}>
          <View style={styles.monthBannerText}>
            <Text style={styles.monthBannerTitle}>Revisa tu mes</Text>
            <Text style={styles.monthBannerSub}>
              Así te fue vs. lo que planeabas
            </Text>
          </View>
          <TouchableOpacity style={styles.monthBannerBtn}>
            <Text style={styles.monthBannerBtnText}>Ver →</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function QuickCard({
  label, symbol, color, onPress,
}: { label: string; symbol: string; color: string; onPress: () => void }) {
  return (
    <TouchableOpacity
      style={[styles.quickCard, { backgroundColor: color }]}
      onPress={onPress}
      activeOpacity={0.85}
    >
      <View style={styles.quickSymbolWrap}>
        <Text style={styles.quickSymbol}>{symbol}</Text>
      </View>
      <Text style={styles.quickLabel}>{label}</Text>
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
    paddingBottom: 24,
    gap: 16,
  },
  greeting: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 12,
  },
  greetingLeft: {
    gap: 2,
  },
  greetingSmall: {
    fontSize: 14,
    color: Clay.colors.textSecondary,
    fontWeight: '500',
  },
  greetingName: {
    fontSize: 30,
    fontWeight: '800',
    color: Clay.colors.textPrimary,
    fontFamily: Fonts?.rounded,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Clay.colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2.5,
    borderColor: Clay.colors.primaryLight,
    ...Clay.shadow.sm,
  },
  avatarLetter: {
    fontSize: 18,
    fontWeight: '800',
    color: Clay.colors.textOnDark,
    fontFamily: Fonts?.rounded,
  },
  goalCard: {
    gap: 12,
  },
  goalTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  goalTag: {
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 1.5,
    color: Clay.colors.textSecondary,
  },
  monthsPill: {
    backgroundColor: '#FEF3C7',
    borderRadius: Clay.radius.pill,
    paddingHorizontal: 12,
    paddingVertical: 5,
    flexDirection: 'row',
    alignItems: 'baseline',
    borderWidth: Clay.border,
    borderColor: '#F59E0B55',
  },
  monthsPillNum: {
    fontSize: 16,
    fontWeight: '800',
    color: '#92400E',
    fontFamily: Fonts?.rounded,
  },
  monthsPillLabel: {
    fontSize: 11,
    color: '#B45309',
    fontWeight: '600',
  },
  goalName: {
    fontSize: 22,
    fontWeight: '800',
    color: Clay.colors.textPrimary,
    fontFamily: Fonts?.rounded,
    lineHeight: 28,
  },
  progressTrack: {
    height: 10,
    backgroundColor: Clay.colors.primaryBg,
    borderRadius: 5,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: Clay.colors.border,
  },
  progressFill: {
    height: '100%',
    backgroundColor: Clay.colors.primaryLight,
    borderRadius: 5,
  },
  progressLabel: {
    fontSize: 12,
    color: Clay.colors.textSecondary,
    fontWeight: '600',
    alignSelf: 'flex-end',
  },
  goalBottom: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 4,
  },
  savedAmount: {
    fontSize: 32,
    fontWeight: '800',
    color: Clay.colors.textPrimary,
    fontFamily: Fonts?.rounded,
  },
  savedLabel: {
    fontSize: 13,
    color: Clay.colors.textSecondary,
  },
  monthlyPill: {
    backgroundColor: Clay.colors.primary,
    borderRadius: Clay.radius.pill,
    paddingHorizontal: 20,
    paddingVertical: 12,
    ...Clay.shadow.sm,
  },
  monthlyPillText: {
    fontSize: 15,
    fontWeight: '700',
    color: Clay.colors.textOnDark,
    fontFamily: Fonts?.rounded,
  },
  // Budget breakdown card
  budgetCard: {
    gap: 14,
  },
  budgetTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  budgetTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: Clay.colors.textPrimary,
    fontFamily: Fonts?.rounded,
  },
  budgetSalary: {
    fontSize: 14,
    fontWeight: '700',
    color: Clay.colors.primaryMed,
  },
  budgetBar: {
    flexDirection: 'row',
    height: 14,
    borderRadius: 7,
    overflow: 'hidden',
    gap: 2,
  },
  budgetBarChunk: {
    borderRadius: 4,
  },
  budgetRows: {
    gap: 8,
    marginTop: 2,
  },
  budgetRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  budgetDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  budgetRowLabel: {
    flex: 1,
    fontSize: 13,
    fontWeight: '600',
    color: Clay.colors.textPrimary,
  },
  budgetRowPct: {
    fontSize: 12,
    color: Clay.colors.textSecondary,
    fontWeight: '600',
    width: 36,
    textAlign: 'right',
  },
  budgetRowAmount: {
    fontSize: 13,
    fontWeight: '700',
    color: Clay.colors.textPrimary,
    fontFamily: Fonts?.rounded,
    width: 64,
    textAlign: 'right',
  },
  quickActions: {
    flexDirection: 'row',
    gap: 12,
  },
  quickCard: {
    flex: 1,
    borderRadius: Clay.radius.md,
    padding: 14,
    gap: 10,
    alignItems: 'center',
    borderWidth: Clay.border,
    borderColor: 'rgba(255,255,255,0.25)',
    ...Clay.shadow.card,
    minHeight: 100,
    justifyContent: 'center',
  },
  quickSymbolWrap: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  quickSymbol: {
    fontSize: 18,
    color: Clay.colors.textOnDark,
    fontWeight: '800',
  },
  quickLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: Clay.colors.textOnDark,
    textAlign: 'center',
    lineHeight: 16,
  },
  monthBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: Clay.colors.card,
    borderRadius: Clay.radius.md,
    padding: 16,
    borderWidth: Clay.border,
    borderColor: Clay.colors.border,
    borderLeftWidth: 4,
    borderLeftColor: Clay.colors.primaryLight,
    ...Clay.shadow.sm,
  },
  monthBannerText: {
    flex: 1,
    gap: 3,
  },
  monthBannerTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: Clay.colors.textPrimary,
  },
  monthBannerSub: {
    fontSize: 12,
    color: Clay.colors.textSecondary,
  },
  monthBannerBtn: {
    backgroundColor: Clay.colors.background,
    borderRadius: Clay.radius.pill,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderWidth: Clay.border,
    borderColor: Clay.colors.border,
  },
  monthBannerBtnText: {
    fontSize: 13,
    fontWeight: '700',
    color: Clay.colors.primary,
  },
});

import React, { useState, useRef, useEffect } from 'react';
import {
  View, Text, StyleSheet, ScrollView, Animated,
  LayoutChangeEvent, TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { GestureDetector, Gesture } from 'react-native-gesture-handler';
import { runOnJS } from 'react-native-reanimated';
import { Clay, Fonts } from '@/constants/theme';
import { ClayCard } from '@/components/clay/ClayCard';
import { ClayButton } from '@/components/clay/ClayButton';

const SALARY = 7500;

interface Category {
  label: string;
  pct: number;
  color: string;
  maxPct: number;
}

const INITIAL_CATEGORIES: Category[] = [
  { label: 'Vivienda',   pct: 0.30, color: '#4361EE', maxPct: 0.40 },
  { label: 'Comida',     pct: 0.20, color: '#F77F00', maxPct: 0.30 },
  { label: 'Transporte', pct: 0.10, color: '#2EC4B6', maxPct: 0.20 },
  { label: 'Deudas',     pct: 0.15, color: '#E63946', maxPct: 0.30 },
  { label: 'Emergencia', pct: 0.05, color: '#FFB703', maxPct: 0.15 },
  { label: 'Meta',       pct: 0.20, color: '#52B788', maxPct: 0.50 },
];

const INITIAL_PCTS: Record<string, number> = Object.fromEntries(
  INITIAL_CATEGORIES.map(c => [c.label, c.pct])
);

function clamp(v: number, lo: number, hi: number) {
  return Math.min(Math.max(v, lo), hi);
}

function CategorySlider({
  cat, onChangePct, resetTrigger,
}: { cat: Category; onChangePct: (pct: number) => void; resetTrigger: number }) {
  const trackWidth = useRef(0);
  const pctRef = useRef(cat.pct);
  const slideX = useRef(new Animated.Value(0)).current;
  const [pct, setPct] = useState(cat.pct);
  const prevResetTrigger = useRef(resetTrigger);

  function onTrackLayout(e: LayoutChangeEvent) {
    const w = e.nativeEvent.layout.width;
    trackWidth.current = w;
    slideX.setValue(pctRef.current * w);
  }

  function updateSlider(x: number) {
    const clamped = clamp(x, 0, trackWidth.current);
    slideX.setValue(clamped);
    const np = trackWidth.current > 0 ? clamped / trackWidth.current : 0;
    pctRef.current = np;
    setPct(np);
    onChangePct(np);
  }

  // Animates thumb back to initial value when reset is triggered
  useEffect(() => {
    if (prevResetTrigger.current === resetTrigger) return;
    prevResetTrigger.current = resetTrigger;
    const initial = INITIAL_PCTS[cat.label] ?? cat.pct;
    pctRef.current = initial;
    setPct(initial);
    if (trackWidth.current > 0) {
      Animated.spring(slideX, {
        toValue: initial * trackWidth.current,
        useNativeDriver: false,
        friction: 8,
        tension: 80,
      }).start();
    }
  }, [resetTrigger]);

  const panGesture = Gesture.Pan()
    .activeOffsetX([-5, 5])
    .failOffsetY([-15, 15])
    .onBegin((e) => { runOnJS(updateSlider)(e.x); })
    .onChange((e) => { runOnJS(updateSlider)(e.x); });

  const amount = Math.round(pct * SALARY);
  const isOver = pct > cat.maxPct;

  return (
    <View style={styles.catRow}>
      <View style={styles.catHeader}>
        <View style={styles.catLeft}>
          <View style={[styles.catInitialWrap, { backgroundColor: cat.color + '22' }]}>
            <Text style={[styles.catInitial, { color: cat.color }]}>
              {cat.label[0]}
            </Text>
          </View>
          <Text style={styles.catLabel}>{cat.label}</Text>
        </View>
        <View style={styles.catRight}>
          <Text style={[styles.catAmount, isOver && { color: Clay.colors.error }]}>
            Q{amount.toLocaleString('es-GT')}
          </Text>
          <Text style={[styles.catPct, isOver && { color: Clay.colors.error }]}>
            {Math.round(pct * 100)}%
          </Text>
        </View>
      </View>

      <GestureDetector gesture={panGesture}>
        <View style={styles.sliderTrack} onLayout={onTrackLayout}>
          <View style={styles.sliderTrackBar} pointerEvents="none" />
          <Animated.View
            style={[
              styles.sliderFill,
              { width: slideX, backgroundColor: isOver ? Clay.colors.error : cat.color },
            ]}
            pointerEvents="none"
          />
          <Animated.View
            style={[
              styles.sliderThumb,
              { transform: [{ translateX: slideX }], borderColor: isOver ? Clay.colors.error : cat.color },
            ]}
            pointerEvents="none"
          />
        </View>
      </GestureDetector>

      {/* Always rendered — single line, prevents layout shift on limit crossing */}
      <Text style={[styles.catLimit, isOver && styles.catLimitOver]}>
        {isOver
          ? `Superas el máximo recomendado (${Math.round(cat.maxPct * 100)}%)`
          : `Máx. recomendado: ${Math.round(cat.maxPct * 100)}%`
        }
      </Text>
    </View>
  );
}

export default function PlannerScreen() {
  const [categories, setCategories] = useState(INITIAL_CATEGORIES);
  const [resetTrigger, setResetTrigger] = useState(0);
  const [feedbackVisible, setFeedbackVisible] = useState(false);
  const feedbackTimer = useRef<ReturnType<typeof setTimeout>>();

  useEffect(() => {
    return () => { if (feedbackTimer.current) clearTimeout(feedbackTimer.current); };
  }, []);

  const totalPct = categories.reduce((s, c) => s + c.pct, 0);
  const remaining = Math.round((1 - totalPct) * SALARY);
  const goalMonths = Math.ceil(
    (15000 - 4500) / Math.max(categories.find(c => c.label === 'Meta')!.pct * SALARY, 1)
  );

  function updateCategory(index: number, pct: number) {
    setCategories(prev => {
      const next = [...prev];
      next[index] = { ...next[index], pct };
      return next;
    });
  }

  function handleReset() {
    setCategories(INITIAL_CATEGORIES);
    setResetTrigger(t => t + 1);
    setFeedbackVisible(true);
    if (feedbackTimer.current) clearTimeout(feedbackTimer.current);
    feedbackTimer.current = setTimeout(() => setFeedbackVisible(false), 2000);
  }

  const isExact = Math.abs(totalPct - 1) <= 0.01;
  const isOver = totalPct > 1.01;
  const isUnder = totalPct < 0.99;

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Planificador</Text>
          <ClayCard padding={12} style={styles.salaryChip}>
            <Text style={styles.salaryLabel}>Q{SALARY.toLocaleString('es-GT')}</Text>
            <Text style={styles.salarySubLabel}>/mes</Text>
          </ClayCard>
        </View>

        {/* Budget allocation widget */}
        <View style={[styles.allocationWidget, isOver && styles.allocationWidgetOver]}>
          <View style={styles.allocationTop}>
            <View style={styles.allocationLeft}>
              <Text style={styles.allocationTitle}>Presupuesto asignado</Text>
              {/* Single element with ternary — no layout shift from appearing/disappearing */}
              <Text style={[
                styles.allocationStatus,
                isOver ? { color: Clay.colors.error } : isExact ? { color: Clay.colors.primary } : null,
              ]}>
                {isExact
                  ? 'Todo tu salario está distribuido'
                  : isUnder
                    ? `Faltan Q${Math.abs(remaining).toLocaleString()} por asignar`
                    : `Excedes tu salario en Q${Math.abs(remaining).toLocaleString()}`
                }
              </Text>
            </View>
            <Text style={[styles.allocationPct, isOver && { color: Clay.colors.error }]}>
              {Math.round(totalPct * 100)}%
            </Text>
          </View>

          <View style={styles.allocationBarTrack}>
            <View
              style={[
                styles.allocationBarFill,
                {
                  width: `${Math.min(totalPct * 100, 100)}%` as any,
                  backgroundColor: isOver ? Clay.colors.error : Clay.colors.primary,
                },
              ]}
            />
          </View>

          {/* minHeight reserves space for the shortest message — prevents shrink-jump */}
          <View style={[
            styles.allocationHint,
            isOver ? styles.allocationHintOver : isExact ? styles.allocationHintSuccess : null,
          ]}>
            <Text style={[
              styles.allocationHintText,
              isOver ? { color: '#C62828' } : isExact ? { color: Clay.colors.primary } : null,
            ]}>
              {isExact
                ? 'Tu presupuesto está completo. Cada quetzal tiene un destino en tu plan.'
                : isUnder
                  ? `Q${Math.abs(remaining).toLocaleString()} sin asignar. Súmalos a una categoría, como ahorro extra o gasto discrecional.`
                  : `Excedes en Q${Math.abs(remaining).toLocaleString()}. Baja alguna categoría hasta que el total llegue al 100%.`
              }
            </Text>
          </View>
        </View>

        {/* Impact card */}
        <ClayCard dark style={styles.impactCard} padding={16}>
          <Text style={styles.impactLabel}>IMPACTO EN TU META</Text>
          <View style={styles.impactRow}>
            <View style={styles.impactStat}>
              <Text style={styles.impactValue}>
                Q{Math.round(categories.find(c => c.label === 'Meta')!.pct * SALARY).toLocaleString()}
              </Text>
              <Text style={styles.impactSubLabel}>al mes para meta</Text>
            </View>
            <View style={styles.impactDivider} />
            <View style={styles.impactStat}>
              <Text style={styles.impactValue}>{goalMonths}</Text>
              <Text style={styles.impactSubLabel}>meses hasta lograrlo</Text>
            </View>
          </View>
        </ClayCard>

        {/* Category sliders */}
        <ClayCard style={styles.slidersCard}>
          <View style={styles.slidersTitleArea}>
            <View style={styles.slidersTitleRow}>
              <Text style={styles.slidersTitle}>Distribuye tu salario</Text>
              <TouchableOpacity onPress={handleReset} style={styles.resetBtn} activeOpacity={0.7}>
                <Text style={styles.resetBtnText}>Restablecer</Text>
              </TouchableOpacity>
            </View>
            {/* Fixed-height row — opacity swap prevents any layout shift */}
            <Text style={[styles.feedbackText, { opacity: feedbackVisible ? 1 : 0 }]}>
              Valores restaurados
            </Text>
          </View>

          {categories.map((cat, i) => (
            <CategorySlider
              key={cat.label}
              cat={cat}
              onChangePct={pct => updateCategory(i, pct)}
              resetTrigger={resetTrigger}
            />
          ))}
        </ClayCard>

        {/* Add custom */}
        <TouchableOpacity style={styles.addCategoryBtn}>
          <Text style={styles.addCategoryText}>+ Agregar categoría personalizada</Text>
        </TouchableOpacity>

        <ClayButton
          label="Guardar distribución"
          onPress={() => {}}
          fullWidth
          size="lg"
        />
      </ScrollView>
    </SafeAreaView>
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
    justifyContent: 'space-between',
    paddingTop: 12,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: Clay.colors.textPrimary,
    fontFamily: Fonts?.rounded,
  },
  salaryChip: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 3,
  },
  salaryLabel: {
    fontSize: 18,
    fontWeight: '800',
    color: Clay.colors.primary,
    fontFamily: Fonts?.rounded,
  },
  salarySubLabel: {
    fontSize: 13,
    color: Clay.colors.textSecondary,
    fontWeight: '600',
  },
  allocationWidget: {
    backgroundColor: Clay.colors.card,
    borderRadius: Clay.radius.md,
    padding: 16,
    borderWidth: Clay.border,
    borderColor: Clay.colors.border,
    gap: 12,
    ...Clay.shadow.sm,
  },
  allocationWidgetOver: {
    borderColor: '#FFCDD2',
    backgroundColor: '#FFF8F8',
  },
  allocationTop: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: 12,
  },
  allocationLeft: {
    flex: 1,
    gap: 2,
  },
  allocationTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: Clay.colors.textPrimary,
  },
  allocationStatus: {
    fontSize: 13,
    fontWeight: '600',
    color: Clay.colors.textSecondary,
  },
  allocationPct: {
    fontSize: 28,
    fontWeight: '800',
    color: Clay.colors.primary,
    fontFamily: Fonts?.rounded,
  },
  allocationBarTrack: {
    height: 10,
    backgroundColor: '#EDE8E1',
    borderRadius: 5,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: Clay.colors.border,
  },
  allocationBarFill: {
    height: '100%',
    borderRadius: 5,
  },
  allocationHint: {
    backgroundColor: '#F5F0EA',
    borderRadius: Clay.radius.sm,
    padding: 12,
    borderWidth: 1,
    borderColor: Clay.colors.border,
    minHeight: 68,
  },
  allocationHintOver: {
    backgroundColor: '#FFEBEE',
    borderColor: '#FFCDD2',
  },
  allocationHintSuccess: {
    backgroundColor: '#DCF0E0',
    borderColor: '#A5D6A7',
  },
  allocationHintText: {
    fontSize: 13,
    color: Clay.colors.textSecondary,
    lineHeight: 20,
  },
  impactCard: {
    gap: 10,
  },
  impactLabel: {
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 1.5,
    color: 'rgba(255,255,255,0.6)',
  },
  impactRow: {
    flexDirection: 'row',
    gap: 20,
  },
  impactStat: {
    flex: 1,
    gap: 3,
  },
  impactValue: {
    fontSize: 26,
    fontWeight: '800',
    color: Clay.colors.textOnDark,
    fontFamily: Fonts?.rounded,
  },
  impactSubLabel: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.6)',
  },
  impactDivider: {
    width: 1,
    backgroundColor: 'rgba(255,255,255,0.2)',
  },
  slidersCard: {
    gap: 20,
  },
  slidersTitleArea: {
    gap: 4,
  },
  slidersTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  slidersTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: Clay.colors.textPrimary,
  },
  resetBtn: {
    paddingHorizontal: 12,
    paddingVertical: 5,
    backgroundColor: Clay.colors.background,
    borderRadius: Clay.radius.pill,
    borderWidth: 1,
    borderColor: Clay.colors.border,
  },
  resetBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: Clay.colors.textSecondary,
  },
  feedbackText: {
    fontSize: 12,
    color: Clay.colors.primary,
    fontWeight: '600',
  },
  catRow: {
    gap: 6,
  },
  catHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  catLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  catInitialWrap: {
    width: 34,
    height: 34,
    borderRadius: 17,
    alignItems: 'center',
    justifyContent: 'center',
  },
  catInitial: {
    fontSize: 14,
    fontWeight: '800',
    fontFamily: Fonts?.rounded,
  },
  catLabel: {
    fontSize: 15,
    fontWeight: '700',
    color: Clay.colors.textPrimary,
  },
  catRight: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 6,
  },
  catAmount: {
    fontSize: 16,
    fontWeight: '700',
    color: Clay.colors.textPrimary,
    fontFamily: Fonts?.rounded,
  },
  catPct: {
    fontSize: 12,
    color: Clay.colors.textSecondary,
    fontWeight: '600',
  },
  sliderTrack: {
    height: 44,
    justifyContent: 'center',
    overflow: 'visible',
  },
  sliderTrackBar: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 17,
    height: 10,
    backgroundColor: '#EDE8E1',
    borderRadius: 5,
    borderWidth: 1,
    borderColor: Clay.colors.border,
  },
  sliderFill: {
    position: 'absolute',
    left: 0,
    top: 17,
    height: 10,
    borderRadius: 5,
  },
  sliderThumb: {
    position: 'absolute',
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: Clay.colors.card,
    top: 9,
    marginLeft: -13,
    borderWidth: 3,
    ...Clay.shadow.sm,
  },
  catLimit: {
    fontSize: 11,
    color: Clay.colors.textSecondary,
    fontWeight: '500',
  },
  catLimitOver: {
    color: '#E65100',
    fontWeight: '700',
  },
  addCategoryBtn: {
    borderRadius: Clay.radius.md,
    padding: 16,
    borderWidth: Clay.border,
    borderColor: Clay.colors.border,
    borderStyle: 'dashed',
    alignItems: 'center',
  },
  addCategoryText: {
    fontSize: 14,
    fontWeight: '600',
    color: Clay.colors.textSecondary,
  },
});

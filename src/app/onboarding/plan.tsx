import React, { useState, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Animated,
  GestureResponderEvent,
  LayoutChangeEvent,
  TextInput,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import { Clay, Fonts } from "@/constants/theme";
import { ClayCard } from "@/components/clay/ClayCard";
import { ClayButton } from "@/components/clay/ClayButton";

const MIN_MONTHLY = 200;
const MAX_MONTHLY = 3000;
const GOAL_AMOUNT = 15000;
const SAVINGS = 4500;

function clamp(val: number, min: number, max: number) {
  return Math.min(Math.max(val, min), max);
}

function calcMonths(monthly: number) {
  return Math.ceil((GOAL_AMOUNT - SAVINGS) / monthly);
}

function ProgressDots({ current, total }: { current: number; total: number }) {
  return (
    <View style={styles.dots}>
      {Array.from({ length: total }).map((_, i) => (
        <View key={i} style={[styles.dot, i < current && styles.dotActive]} />
      ))}
    </View>
  );
}

export default function PlanScreen() {
  const [monthly, setMonthly] = useState(800);
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [otpSent, setOtpSent] = useState(false);

  // Slider: measured track width + current percentage (0–1)
  const trackWidth = useRef(0);
  const pctRef = useRef((monthly - MIN_MONTHLY) / (MAX_MONTHLY - MIN_MONTHLY));
  const sliderX = useRef(new Animated.Value(0)).current;

  const months = calcMonths(monthly);

  function onTrackLayout(e: LayoutChangeEvent) {
    const w = e.nativeEvent.layout.width;
    trackWidth.current = w;
    sliderX.setValue(pctRef.current * w);
  }

  const sliderHandlers = {
    onStartShouldSetResponder: () => true,
    onMoveShouldSetResponder: () => true,
    onResponderTerminationRequest: () => false,
    onResponderGrant: (e: GestureResponderEvent) => {
      const x = clamp(e.nativeEvent.locationX, 0, trackWidth.current);
      sliderX.setValue(x);
      const p = trackWidth.current > 0 ? x / trackWidth.current : 0;
      pctRef.current = p;
      setMonthly(Math.round(MIN_MONTHLY + p * (MAX_MONTHLY - MIN_MONTHLY)));
    },
    onResponderMove: (e: GestureResponderEvent) => {
      const x = clamp(e.nativeEvent.locationX, 0, trackWidth.current);
      sliderX.setValue(x);
      const p = trackWidth.current > 0 ? x / trackWidth.current : 0;
      pctRef.current = p;
      setMonthly(Math.round(MIN_MONTHLY + p * (MAX_MONTHLY - MIN_MONTHLY)));
    },
    onResponderRelease: () => {},
  };

  function handleSendOtp() {
    if (phone.length >= 8) setOtpSent(true);
  }

  function handleOtpChange(index: number, val: string) {
    const next = [...otp];
    next[index] = val;
    setOtp(next);
  }

  function handleConfirm() {
    router.replace("/(tabs)");
  }

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.scroll}
          keyboardDismissMode="on-drag"
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Top nav */}
          <View style={styles.topRow}>
            <TouchableOpacity
              onPress={() => router.back()}
              style={styles.backBtn}
            >
              <Text style={styles.backArrow}>←</Text>
            </TouchableOpacity>
            <ProgressDots current={4} total={4} />
            <View style={{ width: 40 }} />
          </View>

          {/* Plan hero */}
          <ClayCard dark style={styles.heroCard}>
            <Text style={styles.heroLabel}>TU PLAN</Text>
            <View style={styles.heroAmountRow}>
              <Text
                style={styles.heroAmount}
                numberOfLines={1}
                adjustsFontSizeToFit
                minimumFontScale={0.7}
              >
                Q{monthly.toLocaleString("es-GT")}
              </Text>
              <Text style={styles.heroAmountSub}>/mes</Text>
            </View>
            <Text style={styles.heroDuration}>
              en {months} meses alcanzas tu meta
            </Text>

            <View style={styles.heroRow}>
              <View style={styles.heroStat}>
                <Text style={styles.heroStatValue}>
                  Q{SAVINGS.toLocaleString()}
                </Text>
                <Text style={styles.heroStatLabel}>ya ahorrado</Text>
              </View>
              <View style={styles.heroDivider} />
              <View style={styles.heroStat}>
                <Text style={styles.heroStatValue}>
                  Q{(GOAL_AMOUNT - SAVINGS).toLocaleString()}
                </Text>
                <Text style={styles.heroStatLabel}>restante</Text>
              </View>
            </View>
          </ClayCard>

          {/* Slider */}
          <ClayCard style={styles.sliderCard}>
            <Text style={styles.sliderTitle}>Ajusta cuánto ahorrar</Text>
            <View style={styles.sliderLabels}>
              <Text style={styles.sliderMin}>Q{MIN_MONTHLY}/mes</Text>
              <Text style={styles.sliderMax}>Q{MAX_MONTHLY}/mes</Text>
            </View>

            <View
              style={styles.sliderTrack}
              onLayout={onTrackLayout}
              {...sliderHandlers}
            >
              <View style={styles.sliderTrackBar} pointerEvents="none" />
              <Animated.View
                style={[styles.sliderFill, { width: sliderX }]}
                pointerEvents="none"
              />
              <Animated.View
                style={[
                  styles.sliderThumb,
                  { transform: [{ translateX: sliderX }] },
                ]}
                pointerEvents="none"
              />
            </View>

            <Text style={styles.sliderHint}>
              Toca o desliza para ajustar el monto mensual
            </Text>
          </ClayCard>

          {/* Register section */}
          <ClayCard style={styles.registerCard}>
            <View style={styles.registerHeader}>
              <View style={styles.registerTitleBlock}>
                <View style={styles.registerTitleRow}>
                  <Text style={styles.registerTitle}>Guarda tu plan</Text>
                  <View style={styles.registerBadge}>
                    <Text style={styles.registerBadgeText}>Gratis</Text>
                  </View>
                </View>
                <Text style={styles.registerSubtitle}>
                  Solo tu número, sin contraseña
                </Text>
              </View>
            </View>

            <View style={styles.registerDivider} />

            <View style={styles.phoneRow}>
              <View style={styles.prefixBox}>
                <Text style={styles.prefixText}>🇬🇹 +502</Text>
              </View>
              <View style={styles.phoneInputWrap}>
                <TextInput
                  style={styles.phoneInput}
                  placeholder="0000-0000"
                  placeholderTextColor={Clay.colors.placeholder}
                  value={phone}
                  onChangeText={setPhone}
                  keyboardType="phone-pad"
                  maxLength={9}
                />
              </View>
            </View>

            {!otpSent ? (
              <ClayButton
                label="Enviar código →"
                onPress={handleSendOtp}
                fullWidth
                variant="secondary"
                disabled={phone.length < 8}
              />
            ) : (
              <View style={styles.otpBlock}>
                <Text style={styles.otpLabel}>
                  Ingresa el código que te enviamos
                </Text>
                <View style={styles.otpRow}>
                  {otp.map((v, i) => (
                    <View key={i} style={styles.otpBox}>
                      <TextInput
                        style={styles.otpInput}
                        value={v}
                        onChangeText={(t) => handleOtpChange(i, t)}
                        keyboardType="numeric"
                        maxLength={1}
                        textAlign="center"
                      />
                    </View>
                  ))}
                </View>
              </View>
            )}
          </ClayCard>
        </ScrollView>

        {/* Sticky CTA — always visible, never buried under content */}
        <View style={styles.ctaBar}>
          <ClayButton
            label="Confirmar y empezar"
            onPress={handleConfirm}
            fullWidth
            size="lg"
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
  scroll: {
    paddingHorizontal: 24,
    paddingBottom: 16,
    gap: 20,
  },
  ctaBar: {
    paddingHorizontal: 24,
    paddingTop: 12,
    paddingBottom: 20,
    backgroundColor: Clay.colors.background,
    borderTopWidth: 1,
    borderTopColor: Clay.colors.border,
  },
  topRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingTop: 8,
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Clay.colors.card,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: Clay.border,
    borderColor: Clay.colors.border,
  },
  backArrow: {
    fontSize: 18,
    color: Clay.colors.textPrimary,
    fontWeight: "700",
  },
  dots: {
    flexDirection: "row",
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
  heroCard: {
    gap: 12,
  },
  heroLabel: {
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 1.5,
    color: "rgba(255,255,255,0.6)",
  },
  heroAmountRow: {
    flexDirection: "row",
    alignItems: "baseline",
    gap: 4,
  },
  heroAmount: {
    fontSize: 64,
    fontWeight: "800",
    color: Clay.colors.textOnDark,
    fontFamily: Fonts?.rounded,
  },
  heroAmountSub: {
    fontSize: 28,
    fontWeight: "600",
    color: "rgba(255,255,255,0.7)",
  },
  heroDuration: {
    fontSize: 16,
    color: "rgba(255,255,255,0.8)",
    fontWeight: "500",
  },
  heroRow: {
    flexDirection: "row",
    marginTop: 8,
    gap: 20,
    backgroundColor: "rgba(255,255,255,0.12)",
    borderRadius: Clay.radius.sm,
    padding: 14,
  },
  heroStat: {
    flex: 1,
    gap: 3,
  },
  heroStatValue: {
    fontSize: 18,
    fontWeight: "700",
    color: Clay.colors.textOnDark,
    fontFamily: Fonts?.rounded,
  },
  heroStatLabel: {
    fontSize: 12,
    color: "rgba(255,255,255,0.6)",
  },
  heroDivider: {
    width: 1,
    backgroundColor: "rgba(255,255,255,0.2)",
  },
  sliderCard: {
    gap: 14,
  },
  sliderTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: Clay.colors.textPrimary,
  },
  sliderLabels: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  sliderMin: {
    fontSize: 13,
    color: Clay.colors.textSecondary,
    fontWeight: "600",
  },
  sliderMax: {
    fontSize: 13,
    color: Clay.colors.textSecondary,
    fontWeight: "600",
  },
  sliderTrack: {
    height: 44,
    justifyContent: "center",
    overflow: "visible",
  },
  sliderTrackBar: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 16,
    height: 12,
    backgroundColor: "#EDE8E1",
    borderRadius: 6,
    borderWidth: 1,
    borderColor: Clay.colors.border,
  },
  sliderFill: {
    position: "absolute",
    left: 0,
    top: 16,
    height: 12,
    backgroundColor: Clay.colors.primaryLight,
    borderRadius: 6,
  },
  sliderThumb: {
    position: "absolute",
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Clay.colors.primary,
    top: 6,
    marginLeft: -16,
    borderWidth: 4,
    borderColor: Clay.colors.card,
    ...Clay.shadow.card,
  },
  sliderHint: {
    fontSize: 12,
    color: Clay.colors.textSecondary,
    textAlign: "center",
  },
  registerCard: {
    gap: 16,
  },
  registerHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
  },
  registerIconWrap: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#EDE9FE",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: Clay.border,
    borderColor: "#C4B5FD",
    flexShrink: 0,
  },
  registerIconText: {
    fontSize: 22,
  },
  registerTitleBlock: {
    flex: 1,
    gap: 3,
  },
  registerTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    flexWrap: "wrap",
  },
  registerTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: Clay.colors.textPrimary,
    fontFamily: Fonts?.rounded,
  },
  registerBadge: {
    backgroundColor: "#EDE9FE",
    borderRadius: Clay.radius.pill,
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderWidth: 1.5,
    borderColor: "#C4B5FD",
  },
  registerBadgeText: {
    fontSize: 11,
    fontWeight: "700",
    color: "#6D28D9",
  },
  registerSubtitle: {
    fontSize: 13,
    color: Clay.colors.textSecondary,
    lineHeight: 18,
  },
  registerDivider: {
    height: 1,
    backgroundColor: Clay.colors.border,
    marginHorizontal: -20,
  },
  phoneRow: {
    flexDirection: "row",
    gap: 10,
  },
  prefixBox: {
    backgroundColor: Clay.colors.card,
    borderRadius: Clay.radius.sm,
    borderWidth: Clay.border,
    borderColor: Clay.colors.border,
    paddingHorizontal: 14,
    justifyContent: "center",
    ...Clay.shadow.sm,
  },
  prefixText: {
    fontSize: 15,
    fontWeight: "600",
    color: Clay.colors.textPrimary,
  },
  phoneInputWrap: {
    flex: 1,
    backgroundColor: Clay.colors.card,
    borderRadius: Clay.radius.sm,
    borderWidth: Clay.border,
    borderColor: Clay.colors.border,
    paddingHorizontal: 16,
    justifyContent: "center",
    ...Clay.shadow.sm,
  },
  phoneInput: {
    fontSize: 18,
    color: Clay.colors.textPrimary,
    fontFamily: Fonts?.sans,
    paddingVertical: 14,
  },
  otpBlock: {
    gap: 12,
  },
  otpLabel: {
    fontSize: 14,
    color: Clay.colors.textSecondary,
    fontWeight: "600",
  },
  otpRow: {
    flexDirection: "row",
    gap: 8,
    justifyContent: "center",
  },
  otpBox: {
    width: 44,
    height: 54,
    backgroundColor: Clay.colors.card,
    borderRadius: Clay.radius.sm,
    borderWidth: Clay.border,
    borderColor: Clay.colors.border,
    ...Clay.shadow.sm,
  },
  otpInput: {
    flex: 1,
    textAlign: "center",
    fontSize: 22,
    fontWeight: "700",
    color: Clay.colors.textPrimary,
  },
});

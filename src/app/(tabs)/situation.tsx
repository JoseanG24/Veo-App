import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity, Modal,
  TextInput, KeyboardAvoidingView, Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Clay, Fonts } from '@/constants/theme';
import { ClayCard } from '@/components/clay/ClayCard';
import { ClayButton } from '@/components/clay/ClayButton';

interface Saving {
  id: string;
  label: string;
  amount: number;
  where: string;
  rate?: number;
}

interface Debt {
  id: string;
  label: string;
  total: number;
  monthly: number;
  rate: number;
  months: number;
}

const INITIAL_SAVINGS: Saving[] = [
  { id: '1', label: 'Para la moto', amount: 4500, where: 'Bantrab', rate: 0 },
  { id: '2', label: 'Fondo general', amount: 1200, where: 'Efectivo', rate: 0 },
];

const INITIAL_DEBTS: Debt[] = [
  { id: '1', label: 'Tarjeta de crédito', total: 3500, monthly: 400, rate: 36, months: 10 },
];

export default function SituationScreen() {
  const [savings, setSavings] = useState<Saving[]>(INITIAL_SAVINGS);
  const [debts, setDebts] = useState<Debt[]>(INITIAL_DEBTS);
  const [modal, setModal] = useState<'saving' | 'debt' | null>(null);

  // New saving form
  const [newSavLabel, setNewSavLabel] = useState('');
  const [newSavAmount, setNewSavAmount] = useState('');
  const [newSavWhere, setNewSavWhere] = useState('');

  // New debt form
  const [newDebtLabel, setNewDebtLabel] = useState('');
  const [newDebtTotal, setNewDebtTotal] = useState('');
  const [newDebtMonthly, setNewDebtMonthly] = useState('');
  const [newDebtRate, setNewDebtRate] = useState('');
  const [newDebtMonths, setNewDebtMonths] = useState('');

  const totalSavings = savings.reduce((s, sv) => s + sv.amount, 0);
  const totalDebt = debts.reduce((s, d) => s + d.total, 0);
  const totalDebtMonthly = debts.reduce((s, d) => s + d.monthly, 0);
  const netWorth = totalSavings - totalDebt;

  function addSaving() {
    if (!newSavLabel || !newSavAmount) return;
    setSavings(prev => [
      ...prev,
      { id: Date.now().toString(), label: newSavLabel, amount: Number(newSavAmount), where: newSavWhere || 'Sin especificar', rate: 0 },
    ]);
    setNewSavLabel(''); setNewSavAmount(''); setNewSavWhere('');
    setModal(null);
  }

  function addDebt() {
    if (!newDebtLabel || !newDebtTotal) return;
    setDebts(prev => [
      ...prev,
      { id: Date.now().toString(), label: newDebtLabel, total: Number(newDebtTotal), monthly: Number(newDebtMonthly) || 0, rate: Number(newDebtRate) || 0, months: Number(newDebtMonths) || 0 },
    ]);
    setNewDebtLabel(''); setNewDebtTotal(''); setNewDebtMonthly('');
    setNewDebtRate(''); setNewDebtMonths('');
    setModal(null);
  }

  function removeSaving(id: string) {
    setSavings(prev => prev.filter(s => s.id !== id));
  }

  function removeDebt(id: string) {
    setDebts(prev => prev.filter(d => d.id !== id));
  }

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Mi situación</Text>
        </View>

        {/* Net summary */}
        <ClayCard dark style={styles.summaryCard} padding={18}>
          <Text style={styles.summaryLabel}>PATRIMONIO NETO</Text>
          <Text style={[styles.summaryValue, netWorth < 0 && { color: '#FF8A80' }]}>
            {netWorth < 0 ? '-' : ''}Q{Math.abs(netWorth).toLocaleString('es-GT')}
          </Text>
          <View style={styles.summaryRow}>
            <View style={styles.summaryStat}>
              <Text style={styles.summaryStatVal}>Q{totalSavings.toLocaleString()}</Text>
              <Text style={styles.summaryStatLabel}>ahorros</Text>
            </View>
            <View style={styles.summaryDivider} />
            <View style={styles.summaryStat}>
              <Text style={[styles.summaryStatVal, { color: '#FF8A80' }]}>
                Q{totalDebt.toLocaleString()}
              </Text>
              <Text style={styles.summaryStatLabel}>deudas</Text>
            </View>
          </View>
        </ClayCard>

        {/* SAVINGS section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <View style={styles.sectionTitleRow}>
              <View style={[styles.sectionAccent, { backgroundColor: Clay.colors.primaryLight }]} />
              <Text style={styles.sectionTitle}>Ahorros</Text>
            </View>
            <TouchableOpacity
              style={styles.addBtn}
              onPress={() => setModal('saving')}
            >
              <Text style={styles.addBtnText}>+ Agregar</Text>
            </TouchableOpacity>
          </View>

          {savings.map(sv => (
            <ClayCard key={sv.id} style={styles.itemCard} padding={14}>
              <View style={styles.itemRow}>
                <View style={styles.itemLeft}>
                  <Text style={styles.itemLabel}>{sv.label}</Text>
                  <Text style={styles.itemWhere}>{sv.where}</Text>
                </View>
                <View style={styles.itemRight}>
                  <Text style={styles.itemAmount}>Q{sv.amount.toLocaleString('es-GT')}</Text>
                  <TouchableOpacity onPress={() => removeSaving(sv.id)}>
                    <Text style={styles.deleteText}>Eliminar</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </ClayCard>
          ))}

          {savings.length === 0 && (
            <TouchableOpacity
              style={styles.emptyCard}
              onPress={() => setModal('saving')}
            >
              <Text style={styles.emptyText}>+ Agregar primer ahorro</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* DEBTS section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <View style={styles.sectionTitleRow}>
              <View style={[styles.sectionAccent, { backgroundColor: Clay.colors.error }]} />
              <Text style={styles.sectionTitle}>Deudas</Text>
            </View>
            <TouchableOpacity
              style={styles.addBtn}
              onPress={() => setModal('debt')}
            >
              <Text style={styles.addBtnText}>+ Agregar</Text>
            </TouchableOpacity>
          </View>

          {debts.map(d => {
            const totalWithInterest = d.rate > 0
              ? d.total * (1 + (d.rate / 100) / 12 * d.months)
              : d.total;
            const interestCost = totalWithInterest - d.total;
            return (
              <ClayCard key={d.id} style={styles.itemCard} padding={14}>
                <View style={styles.itemRow}>
                  <View style={styles.itemLeft}>
                    <Text style={styles.itemLabel}>{d.label}</Text>
                    <Text style={styles.itemWhere}>
                      Q{d.monthly.toLocaleString()}/mes · {d.rate}% anual
                    </Text>
                  </View>
                  <View style={styles.itemRight}>
                    <Text style={[styles.itemAmount, { color: Clay.colors.error }]}>
                      Q{d.total.toLocaleString('es-GT')}
                    </Text>
                    <TouchableOpacity onPress={() => removeDebt(d.id)}>
                      <Text style={styles.deleteText}>Eliminar</Text>
                    </TouchableOpacity>
                  </View>
                </View>
                {d.rate > 0 && (
                  <View style={styles.interestBadge}>
                    <Text style={styles.interestText}>
                      Pagas Q{interestCost.toFixed(0)} de intereses en {d.months} meses
                    </Text>
                  </View>
                )}
              </ClayCard>
            );
          })}

          {debts.length === 0 && (
            <TouchableOpacity
              style={styles.emptyCard}
              onPress={() => setModal('debt')}
            >
              <Text style={styles.emptyText}>+ Agregar primera deuda</Text>
            </TouchableOpacity>
          )}
        </View>

        <Text style={styles.updateNote}>
          Actualiza estos datos manualmente cuando tu situación cambie.
        </Text>
      </ScrollView>

      {/* Add Saving Modal */}
      <Modal visible={modal === 'saving'} transparent animationType="slide">
        <KeyboardAvoidingView style={styles.modalOverlay} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
          <ClayCard style={styles.modalCard}>
            <Text style={styles.modalTitle}>Agregar ahorro</Text>
            <ModalField label="Nombre" value={newSavLabel} onChangeText={setNewSavLabel} placeholder="Para la moto" />
            <ModalField label="Monto (Q)" value={newSavAmount} onChangeText={setNewSavAmount} placeholder="4,500" keyboardType="numeric" />
            <ModalField label="Dónde está guardado" value={newSavWhere} onChangeText={setNewSavWhere} placeholder="Bantrab, Efectivo..." />
            <View style={styles.modalButtons}>
              <ClayButton label="Cancelar" onPress={() => setModal(null)} variant="secondary" />
              <ClayButton label="Guardar" onPress={addSaving} />
            </View>
          </ClayCard>
        </KeyboardAvoidingView>
      </Modal>

      {/* Add Debt Modal */}
      <Modal visible={modal === 'debt'} transparent animationType="slide">
        <KeyboardAvoidingView style={styles.modalOverlay} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
          <ClayCard style={styles.modalCard}>
            <Text style={styles.modalTitle}>Agregar deuda</Text>
            <ModalField label="Nombre" value={newDebtLabel} onChangeText={setNewDebtLabel} placeholder="Tarjeta de crédito" />
            <ModalField label="Monto total (Q)" value={newDebtTotal} onChangeText={setNewDebtTotal} placeholder="3,500" keyboardType="numeric" />
            <ModalField label="Cuota mensual (Q)" value={newDebtMonthly} onChangeText={setNewDebtMonthly} placeholder="400" keyboardType="numeric" />
            <ModalField label="Tasa de interés (% anual)" value={newDebtRate} onChangeText={setNewDebtRate} placeholder="36" keyboardType="numeric" />
            <ModalField label="Meses restantes" value={newDebtMonths} onChangeText={setNewDebtMonths} placeholder="10" keyboardType="numeric" />
            <View style={styles.modalButtons}>
              <ClayButton label="Cancelar" onPress={() => setModal(null)} variant="secondary" />
              <ClayButton label="Guardar" onPress={addDebt} />
            </View>
          </ClayCard>
        </KeyboardAvoidingView>
      </Modal>
    </SafeAreaView>
  );
}

function ModalField({ label, value, onChangeText, placeholder, keyboardType }: {
  label: string; value: string; onChangeText: (t: string) => void;
  placeholder: string; keyboardType?: any;
}) {
  return (
    <View style={styles.modalField}>
      <Text style={styles.modalFieldLabel}>{label}</Text>
      <View style={styles.modalInputWrap}>
        <TextInput
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={Clay.colors.placeholder}
          keyboardType={keyboardType}
          style={styles.modalInput}
        />
      </View>
    </View>
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
    paddingTop: 12,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: Clay.colors.textPrimary,
    fontFamily: Fonts?.rounded,
  },
  summaryCard: {
    gap: 10,
  },
  summaryLabel: {
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 1.5,
    color: 'rgba(255,255,255,0.6)',
  },
  summaryValue: {
    fontSize: 40,
    fontWeight: '800',
    color: Clay.colors.textOnDark,
    fontFamily: Fonts?.rounded,
  },
  summaryRow: {
    flexDirection: 'row',
    gap: 20,
    backgroundColor: 'rgba(255,255,255,0.10)',
    borderRadius: Clay.radius.sm,
    padding: 12,
  },
  summaryStat: {
    flex: 1,
    gap: 3,
  },
  summaryStatVal: {
    fontSize: 18,
    fontWeight: '700',
    color: Clay.colors.textOnDark,
    fontFamily: Fonts?.rounded,
  },
  summaryStatLabel: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.6)',
  },
  summaryDivider: {
    width: 1,
    backgroundColor: 'rgba(255,255,255,0.2)',
  },
  section: {
    gap: 10,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  sectionTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  sectionAccent: {
    width: 4,
    height: 22,
    borderRadius: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: Clay.colors.textPrimary,
    fontFamily: Fonts?.rounded,
  },
  addBtn: {
    backgroundColor: Clay.colors.primaryBg,
    borderRadius: Clay.radius.pill,
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderWidth: Clay.border,
    borderColor: Clay.colors.border,
  },
  addBtnText: {
    fontSize: 13,
    fontWeight: '700',
    color: Clay.colors.primary,
  },
  itemCard: {
    gap: 8,
  },
  itemRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  itemLeft: {
    flex: 1,
    gap: 3,
  },
  itemLabel: {
    fontSize: 15,
    fontWeight: '700',
    color: Clay.colors.textPrimary,
  },
  itemWhere: {
    fontSize: 12,
    color: Clay.colors.textSecondary,
  },
  itemRight: {
    alignItems: 'flex-end',
    gap: 4,
  },
  itemAmount: {
    fontSize: 18,
    fontWeight: '800',
    color: Clay.colors.primary,
    fontFamily: Fonts?.rounded,
  },
  deleteText: {
    fontSize: 11,
    color: Clay.colors.error,
    fontWeight: '600',
  },
  interestBadge: {
    backgroundColor: '#FFEBEE',
    borderRadius: Clay.radius.sm,
    padding: 8,
    borderWidth: 1,
    borderColor: '#FFCDD2',
  },
  interestText: {
    fontSize: 12,
    color: '#C62828',
    fontWeight: '600',
  },
  emptyCard: {
    borderRadius: Clay.radius.md,
    padding: 20,
    borderWidth: Clay.border,
    borderColor: Clay.colors.border,
    borderStyle: 'dashed',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 14,
    fontWeight: '600',
    color: Clay.colors.textSecondary,
  },
  updateNote: {
    fontSize: 12,
    color: Clay.colors.textSecondary,
    textAlign: 'center',
    fontStyle: 'italic',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'flex-end',
  },
  modalCard: {
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
    borderTopLeftRadius: Clay.radius.lg,
    borderTopRightRadius: Clay.radius.lg,
    gap: 14,
    paddingBottom: 32,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: Clay.colors.textPrimary,
    fontFamily: Fonts?.rounded,
  },
  modalField: {
    gap: 6,
  },
  modalFieldLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: Clay.colors.textSecondary,
  },
  modalInputWrap: {
    backgroundColor: Clay.colors.background,
    borderRadius: Clay.radius.sm,
    borderWidth: Clay.border,
    borderColor: Clay.colors.border,
    paddingHorizontal: 14,
  },
  modalInput: {
    fontSize: 17,
    color: Clay.colors.textPrimary,
    paddingVertical: 12,
    fontFamily: Fonts?.sans,
  },
  modalButtons: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 4,
  },
});

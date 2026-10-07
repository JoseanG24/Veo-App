import { Tabs } from 'expo-router';
import { StyleSheet, View, Text, Platform } from 'react-native';
import { Clay, Fonts } from '@/constants/theme';

function TabIcon({ symbol, focused }: { symbol: string; focused: boolean }) {
  return (
    <View style={[styles.iconWrap, focused && styles.iconWrapActive]}>
      <Text style={[styles.iconSymbol, focused && styles.iconSymbolActive]}>{symbol}</Text>
    </View>
  );
}

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: styles.tabBar,
        tabBarActiveTintColor: Clay.colors.primary,
        tabBarInactiveTintColor: Clay.colors.textSecondary,
        tabBarLabelStyle: styles.tabLabel,
        tabBarItemStyle: styles.tabItem,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Inicio',
          tabBarIcon: ({ focused }) => <TabIcon symbol="⌂" focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="planner"
        options={{
          title: 'Planificador',
          tabBarIcon: ({ focused }) => <TabIcon symbol="⊞" focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="perspective"
        options={{
          title: 'Perspectiva',
          tabBarIcon: ({ focused }) => <TabIcon symbol="◎" focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="situation"
        options={{
          title: 'Mi situación',
          tabBarIcon: ({ focused }) => <TabIcon symbol="≡" focused={focused} />,
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: Clay.colors.card,
    borderTopWidth: Clay.border,
    borderTopColor: Clay.colors.border,
    height: Platform.OS === 'ios' ? 88 : 68,
    paddingBottom: Platform.OS === 'ios' ? 28 : 8,
    paddingTop: 6,
    ...Platform.select({
      ios: {
        shadowColor: '#1C1917',
        shadowOpacity: 0.08,
        shadowRadius: 16,
        shadowOffset: { width: 0, height: -4 },
      },
      android: { elevation: 12 },
    }),
  },
  tabItem: {
    gap: 2,
  },
  tabLabel: {
    fontSize: 10,
    fontWeight: '600',
    fontFamily: Fonts?.sans,
    letterSpacing: 0.2,
  },
  iconWrap: {
    width: 52,
    height: 26,
    borderRadius: 13,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconWrapActive: {
    backgroundColor: Clay.colors.primaryBg,
  },
  iconSymbol: {
    fontSize: 17,
    color: Clay.colors.textSecondary,
  },
  iconSymbolActive: {
    color: Clay.colors.primary,
  },
});

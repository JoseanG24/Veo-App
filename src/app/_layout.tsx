import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Stack
        screenOptions={{
          headerShown: false,
          animation: 'slide_from_right',
          contentStyle: { backgroundColor: '#F2F7F3' },
        }}
      >
        <Stack.Screen name="index" />
        <Stack.Screen name="onboarding/salary" />
        <Stack.Screen name="onboarding/situation" />
        <Stack.Screen name="onboarding/goal" />
        <Stack.Screen name="onboarding/plan" options={{ gestureEnabled: false }} />
        <Stack.Screen name="auth/sign-in" />
        <Stack.Screen name="auth/sign-up" />
        <Stack.Screen name="(tabs)" options={{ animation: 'fade', gestureEnabled: false }} />
      </Stack>
    </GestureHandlerRootView>
  );
}

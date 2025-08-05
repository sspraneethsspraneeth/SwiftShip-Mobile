import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import Toast from 'react-native-toast-message';
import { StripeProvider } from '@stripe/stripe-react-native';
import 'react-native-reanimated';

export const unstable_settings = {
  initialRouteName: 'splash',
};

export default function RootLayout() {
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  if (!loaded) return null;

  return (
    <StripeProvider
      publishableKey="pk_test_51RjZbIB9Lmv7S8B7nNVdOTbSmmtccPUGwqWGYSMqEg6FTFOwrx1GElM6PpjH5VfPYpTu78hURsWriHWGoZuMsJcv00EwHyLbKv"
    >
      <ThemeProvider value={DefaultTheme}>
        <>
          <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="splash" />
            <Stack.Screen name="auth/onboarding" />
            <Stack.Screen name="auth/login" />
            <Stack.Screen name="auth/loginScreen" />
            <Stack.Screen name="auth/register" />
            <Stack.Screen name="auth/ForgetPass" />
            <Stack.Screen name="auth/Verification" />
            <Stack.Screen name="auth/SuccessModal" />
            <Stack.Screen name="profile/location" />
            <Stack.Screen name="dashboard/dashboard" />
            <Stack.Screen name="transactions/history" />
            <Stack.Screen name="notification/notification" />
            <Stack.Screen name="wallet/wallet" />
            <Stack.Screen name="order/make-order" />
            <Stack.Screen name="order/ReviewPayment" />
            <Stack.Screen name="wallet/topup" />
            <Stack.Screen name="wallet/payment" />
            <Stack.Screen name="wallet/pinverify" />
            <Stack.Screen name="dashboard/orders" />
            <Stack.Screen name="tracking/[id]" />
            <Stack.Screen name="dashboard/InboxScreen" />
          </Stack>

          <Toast />
          <StatusBar style="auto" />
        </>
      </ThemeProvider>
    </StripeProvider>
  );
}

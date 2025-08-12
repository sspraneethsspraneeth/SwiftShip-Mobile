import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import PrimaryButton from '../../components/PrimaryButton';
import { useStripe } from '@stripe/stripe-react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { BASE_URL } from '../../constants/api'; // ✅ Import from constants

const amounts = [10, 50, 100, 150, 200, 250, 300, 350, 450];

export default function TopUpWallet() {
  const router = useRouter();
  const [selectedAmount, setSelectedAmount] = useState(350);
  const [loading, setLoading] = useState(false);
  const { initPaymentSheet, presentPaymentSheet } = useStripe();

  const handleTopUp = async () => {
    try {
      setLoading(true);
      const token = await AsyncStorage.getItem('token');
      const userId = await AsyncStorage.getItem('userId');
      console.log('UserId from AsyncStorage:', userId);

      // 1️⃣ Create Payment Intent
      const res = await fetch(`${BASE_URL}/payment/create-payment-intent`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          amount: selectedAmount,
          userId,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Payment init failed');

      // 2️⃣ Init Stripe Payment Sheet
      const init = await initPaymentSheet({
        merchantDisplayName: 'My App',
        paymentIntentClientSecret: data.paymentIntent,
        customerEphemeralKeySecret: data.ephemeralKey,
        customerId: data.customer,
        defaultBillingDetails: { name: 'Wallet Top-Up' },
      });

      if (init.error) throw new Error(init.error.message);

      // 3️⃣ Present Payment Sheet
      const paymentResult = await presentPaymentSheet();
      if (paymentResult.error) {
        throw new Error(paymentResult.error.message);
      }

      // 4️⃣ On success → Update wallet in backend
      const walletRes = await fetch(`${BASE_URL}/wallet/transaction`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          userId,
          type: 'credit',
          amount: selectedAmount,
          description: 'Wallet Top-Up via Stripe',
        }),
      });

      if (!walletRes.ok) {
        const errData = await walletRes.json();
        throw new Error(errData.message || 'Failed to update wallet');
      }

      Alert.alert('✅ Success', `Wallet topped up with $${selectedAmount}`);

      // ✅ Redirect to /wallet/payment after success
      router.replace('/wallet/payment');
    } catch (err) {
      console.error(err);
      Alert.alert('Payment Error', err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.wrapper}>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()}>
            <Text style={styles.back}>{'←'}</Text>
          </TouchableOpacity>
          <Text style={styles.title}>Top Up Wallet</Text>
        </View>

        <Text style={styles.subtitle}>Select the amount of top up</Text>

        <View style={styles.amountCard}>
          <View style={styles.cardBgTopLeft} />
          <View style={styles.cardBgTopRight} />
          <Text style={styles.amountText}>${selectedAmount}</Text>
        </View>

        <View style={styles.grid}>
          {amounts.map((amount) => (
            <TouchableOpacity
              key={amount}
              style={[
                styles.amountButton,
                selectedAmount === amount && styles.activeAmountButton,
              ]}
              onPress={() => setSelectedAmount(amount)}
            >
              <Text
                style={[
                  styles.amountLabel,
                  selectedAmount === amount && styles.activeAmountLabel,
                ]}
              >
                ${amount}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={{ height: 100 }} />
      </ScrollView>

      <View style={styles.buttonWrapper}>
        <PrimaryButton
          title={loading ? 'Processing...' : 'Continue'}
          onPress={handleTopUp}
          disabled={loading}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: '#fff',
  },
  container: {
    padding: 20,
    paddingBottom: 160,
    top: 30,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  back: {
    fontSize: 24,
    marginRight: 10,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#39335E',
    textAlign: 'center',
    flex: 1,
    font: 'montserrat',
    fontWeight: 700,
    marginRight: 34,
  },
  subtitle: {
    fontSize: 14,
    color: '#888',
    textAlign: 'center',
    font: 'montserrat',
    fontWeight: 500,
    marginBottom: 20,
  },
  amountCard: {
    backgroundColor: '#2D2154',
    padding: 20,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
    width: '100%',
    height: 100,
    position: 'relative',
    overflow: 'hidden',
  },
  cardBgTopLeft: {
    position: 'absolute',
    top: 10,
    left: -30,
    width: 150,
    height: 150,
    borderRadius: 75,
    backgroundColor: '#5A46D6',
    opacity: 0.6,
  },
  cardBgTopRight: {
    position: 'absolute',
    top: -70,
    right: -20,
    width: 150,
    height: 150,
    borderRadius: 75,
    backgroundColor: '#5A46D6',
    opacity: 0.6,
  },
  amountText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    zIndex: 1,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  amountButton: {
    width: '30%',
    paddingVertical: 14,
    borderRadius: 10,
    backgroundColor: '#EDEDED',
    alignItems: 'center',
    marginBottom: 15,
  },
  amountLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#39335E',
  },
  activeAmountButton: {
    backgroundColor: '#7b61ff',
  },
  activeAmountLabel: {
    color: '#fff',
  },
  buttonWrapper: {
    position: 'absolute',
    bottom: 30,
    left: 20,
    right: 20,
    alignItems: 'center',
  },
  belowText: {
    marginTop: 8,
    fontSize: 12,
    color: '#999',
    textAlign: 'center',
  },
});

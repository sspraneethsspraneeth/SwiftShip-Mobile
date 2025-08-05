import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { useRouter } from 'expo-router';
import PrimaryButton from '../../components/PrimaryButton';

const amounts = [10, 50, 100, 150, 200, 250, 300, 350, 450];

export default function TopUpWallet() {
  const router = useRouter();
  const [selectedAmount, setSelectedAmount] = useState(350); // default

  return (
    <View style={styles.wrapper}>
      <ScrollView contentContainerStyle={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()}>
            <Text style={styles.back}>{'←'}</Text>
          </TouchableOpacity>
          <Text style={styles.title}>Top Up Wallet</Text>
        </View>

        {/* Subtitle */}
        <Text style={styles.subtitle}>Select the amount of top up</Text>

        {/* Selected Amount Card */}
        <View style={styles.amountCard}>
          <View style={styles.cardBgTopLeft} />
          <View style={styles.cardBgTopRight} />
          <Text style={styles.amountText}>${selectedAmount}</Text>
        </View>

        {/* Amount Grid */}
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

        {/* Spacer */}
        <View style={{ height: 100 }} />
      </ScrollView>

      {/* Continue Button + Below Text */}
      <View style={styles.buttonWrapper}>
        <PrimaryButton title="Continue" onPress={() => router.push('/wallet/payment')} />
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

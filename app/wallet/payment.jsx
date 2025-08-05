import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
} from 'react-native';
import { useRouter } from 'expo-router';
import PrimaryButton from '../../components/PrimaryButton';

const paymentMethods = [
  {
    label: 'Google Pay',
    icon: require('../../assets/icons/Google.png'),
  },
  {
    label: 'PayPal',
    icon: require('../../assets/icons/paypal.png'),
  },
  {
    label: 'Cash App',
    icon: require('../../assets/icons/cashapp.png'),
  },
  {
    label: 'Visa Debit Card',
    icon: require('../../assets/icons/mastercard.png'),
  },
];

export default function PaymentScreen() {
  const [selected, setSelected] = useState('Google Pay');
  const router = useRouter();

  return (
    <View style={styles.wrapper}>
      <ScrollView contentContainerStyle={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()}>
            <Text style={styles.back}>{'←'}</Text>
          </TouchableOpacity>
          <Text style={styles.title}>Payment Method</Text>
        </View>

        {/* Payment Options */}
        {paymentMethods.map((item, index) => (
          <TouchableOpacity
            key={index}
            style={styles.method}
            onPress={() => setSelected(item.label)}
          >
            <View style={styles.row}>
              <Image source={item.icon} style={styles.icon} />
              <Text style={styles.label}>{item.label}</Text>
            </View>
            <View
              style={[
                styles.radioOuter,
                selected === item.label && styles.radioOuterSelected,
              ]}
            >
              {selected === item.label && <View style={styles.radioInner} />}
            </View>
          </TouchableOpacity>
        ))}

        <View style={{ height: 100 }} />
      </ScrollView>

      {/* Continue Button */}
      <View style={styles.buttonWrapper}>
        <PrimaryButton title="Continue" onPress={() => router.push('/wallet/pinverify')} />
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
    marginBottom: 30,
  },
  back: {
    fontSize: 24,
    marginRight: 10,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#39335E',
    textAlign: 'center',
    flex: 1,
    marginRight: 34,
  },
  method: {
    flexDirection: 'row',
    backgroundColor: '#F6F6F6',
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 10,
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    width: 24,
    height: 24,
    marginRight: 12,
    resizeMode: 'contain',
  },
  label: {
    fontSize: 14,
    color: '#39335E',
    fontWeight: '600',
  },
  radioOuter: {
    width: 18,
    height: 18,
    borderRadius: 9,
    borderWidth: 2,
    borderColor: '#ccc',
    justifyContent: 'center',
    alignItems: 'center',
  },
  radioOuterSelected: {
    borderColor: '#7B61FF',
  },
  radioInner: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#7B61FF',
  },
  buttonWrapper: {
    position: 'absolute',
    bottom: 30,
    left: 20,
    right: 20,
  },
});

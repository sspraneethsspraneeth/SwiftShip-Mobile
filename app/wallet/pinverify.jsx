import React, { useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import PrimaryButton from '../../components/PrimaryButton';
import SuccessModal from '../auth/SuccessModal';

export default function PinVerify() {
  const router = useRouter();
  const [pin, setPin] = useState(['', '', '', '']);
  const inputRefs = useRef([]);
  const [modalVisible, setModalVisible] = useState(false);

  const handleChange = (text, index) => {
    const newPin = [...pin];
    if (/^\d$/.test(text)) {
      newPin[index] = text;
      setPin(newPin);
      if (index < 3) {
        inputRefs.current[index + 1].focus();
      }
    } else if (text === '') {
      newPin[index] = '';
      setPin(newPin);
    }
  };

  const handleKeyPress = (e, index) => {
    if (e.nativeEvent.key === 'Backspace' && pin[index] === '' && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

  const handleContinue = () => {
    const fullPin = pin.join('');
    if (fullPin.length === 4) {
      setModalVisible(true);
    } else {
      alert('Please enter a 4-digit PIN');
    }
  };

  const closeModal = () => {
    setModalVisible(false);
    router.replace('/dashboard/dashboard'); // ✅ Navigate to dashboard
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={styles.wrapper}
    >
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={styles.back}>{'←'}</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Top up Wallet</Text>
      </View>

      {/* Centered Content */}
      <View style={styles.centerContainer}>
        <Text style={styles.instruction}>Enter Your PIN To Confirm Top Up</Text>
        <View style={styles.pinContainer}>
          {pin.map((digit, index) => (
            <TextInput
              key={index}
              ref={(ref) => (inputRefs.current[index] = ref)}
              style={styles.input}
              keyboardType="numeric"
              maxLength={1}
              value={digit}
              onChangeText={(text) => handleChange(text, index)}
              onKeyPress={(e) => handleKeyPress(e, index)}
            />
          ))}
        </View>
      </View>

      {/* Continue Button */}
      <View style={styles.buttonWrapper}>
        <PrimaryButton title="Continue" onPress={handleContinue} />
      </View>

      {/* Success Modal */}
      <SuccessModal visible={modalVisible} onClose={closeModal} />
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
    paddingTop: 50,
    justifyContent: 'space-between',
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
    fontSize: 18,
    fontWeight: 'bold',
    color: '#39335E',
    textAlign: 'center',
    flex: 1,
    marginRight: 34,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  instruction: {
    fontSize: 14,
    color: '#39335E',
    marginBottom: 25,
    textAlign: 'center',
  },
  pinContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 15,
  },
  input: {
    width: 55,
    height: 55,
    backgroundColor: '#F0F0F0',
    borderRadius: 10,
    textAlign: 'center',
    fontSize: 24,
    fontWeight: 'bold',
    color: '#39335E',
  },
  buttonWrapper: {
    marginBottom: 30,
  },
});

import React, { useRef, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import Toast from 'react-native-toast-message';
import { BASE_URL } from '../../constants/api'; // Adjust the path as per file location


export default function Verification({ from = 'forgot', email, password, onClose, onContinue }) {
  const [code, setCode] = useState(['', '', '', '', '']);
  const [loading, setLoading] = useState(false);
  const inputsRef = useRef([]);

  const handleChange = (text, index) => {
    if (text.length > 1) return;

    const newCode = [...code];
    newCode[index] = text.toUpperCase();
    setCode(newCode);

    if (text && index < 4) {
      inputsRef.current[index + 1].focus();
    }
  };

  const handleKeyPress = (e, index) => {
    if (e.nativeEvent.key === 'Backspace' && code[index] === '') {
      if (index > 0) {
        inputsRef.current[index - 1].focus();
      }
    }
  };

  const handleSubmit = async () => {
    const fullCode = code.join('');

    if (fullCode.length !== 5) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Please enter the full 5-digit verification code.',
      });
      return;
    }

    setLoading(true);
    try {
      const endpoint = from === 'register' ? 'register' : 'verify-code';
      const payload = from === 'register'
        ? { email, password, code: fullCode }
        : { email, code: fullCode };

      const res = await fetch(`${BASE_URL}/${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (res.ok) {
        Toast.show({
          type: 'success',
          text1: from === 'register' ? 'Registered successfully!' : 'Code verified!',
        });
        setTimeout(() => {
          onClose?.();
          onContinue?.();
        }, 1000);
      } else {
        Toast.show({
          type: 'error',
          text1: 'Error',
          text2: data.message || 'Please try again.',
        });
      }
    } catch (err) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: err.message || 'Something went wrong.',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <View>
      <View style={styles.headerWrapper}>
        <TouchableOpacity onPress={onClose} style={styles.backBtn}>
          <Text style={styles.backArrow}>←</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Verification</Text>
      </View>

      <Text style={styles.subtitle}>
        Enter the 5-digit code that was sent to your email.
      </Text>

      <View style={styles.codeRow}>
        {code.map((digit, index) => (
          <TextInput
            key={index}
            ref={(ref) => (inputsRef.current[index] = ref)}
            style={styles.codeInput}
            keyboardType="default"
            autoCapitalize="characters"
            maxLength={1}
            value={digit}
            onChangeText={(text) => handleChange(text, index)}
            onKeyPress={(e) => handleKeyPress(e, index)}
          />
        ))}
      </View>

      <TouchableOpacity
        style={styles.continueButton}
        onPress={handleSubmit}
        disabled={loading}
      >
        <Text style={styles.continueText}>
          {loading ? (from === 'register' ? 'Registering...' : 'Verifying...') : 'Continue'}
        </Text>
      </TouchableOpacity>

      <Text style={styles.legalText}>
        By continuing, you agree to our{' '}
        <Text style={styles.link}>Terms</Text> and{' '}
        <Text style={styles.link}>Privacy Policy</Text>
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  headerWrapper: {
    position: 'relative',
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  backBtn: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    justifyContent: 'center',
    paddingHorizontal: 4,
  },
  backArrow: {
    fontSize: 22,
    color: '#333',
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: '#39335E',
    fontFamily: 'montserrat',
  },
  subtitle: {
    fontSize: 14,
    color: '#474747',
    fontFamily: 'montserrat',
    fontWeight: '400',
    lineHeight: 24,
    marginBottom: 24,
  },
  codeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  codeInput: {
    width: 60,
    height: 60,
    borderWidth: 1.5,
    borderColor: '#ccc',
    borderRadius: 12,
    textAlign: 'center',
    fontSize: 24,
    fontWeight: '600',
    color: '#39335E',
    fontFamily: 'montserrat',
  },
  continueButton: {
    backgroundColor: '#836EFE',
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 24,
  },
  continueText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 16,
    fontFamily: 'montserrat',
  },
  legalText: {
    fontSize: 12,
    textAlign: 'center',
    color: '#666',
    fontFamily: 'montserrat',
  },
  link: {
    color: '#836EFE',
    fontWeight: '700',
  },
});

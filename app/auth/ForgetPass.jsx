import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  Image,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import Toast from 'react-native-toast-message';
import { BASE_URL } from '../../constants/api'; // Adjust the path as per file location


export default function ForgetPass({
  initialEmail = '',
  onClose = () => {},
  onContinue = () => {},
}) {
  const [email, setEmail] = useState(initialEmail);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setEmail(initialEmail);
  }, [initialEmail]);

  const handleSendCode = async () => {
    if (!email) {
      Toast.show({
        type: 'error',
        text1: 'Missing Email',
        text2: 'Please enter your email address.',
      });
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`${BASE_URL}/request-code`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok) {
        Toast.show({
          type: 'success',
          text1: 'Verification Sent',
          text2: 'Code sent to your email.',
        });
        setTimeout(() => onContinue(email), 1000);
      } else {
        Toast.show({
          type: 'error',
          text1: 'Error',
          text2: data.message || 'Email not found.',
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
      <TouchableOpacity onPress={onClose}>
        <Text style={styles.backArrow}>←</Text>
      </TouchableOpacity>

      <Text style={styles.title}>Forget Password</Text>
      <Text style={styles.subtitle}>
        Don’t worry, it happens to the best of us. Enter your email address below and we'll help you reset your password.
      </Text>

      <View style={styles.inputWrapper}>
        <View style={styles.inputRow}>
          <Image source={require('../../assets/icons/email.png')} style={styles.inputIcon} />
          <TextInput
            placeholder="Email"
            style={styles.inputField}
            placeholderTextColor="#999"
            keyboardType="email-address"
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            editable={!loading}
          />
        </View>
      </View>

      <TouchableOpacity
        style={[styles.continueButton, loading && { opacity: 0.6 }]}
        onPress={handleSendCode}
        disabled={loading}
      >
        <Text style={styles.continueText}>
          {loading ? 'Sending Code...' : 'Continue'}
        </Text>
      </TouchableOpacity>

      <Text style={styles.legalText}>
        By continuing, you agree to Shopping{' '}
        <Text style={styles.link}>Conditions of Use</Text> and{' '}
        <Text style={styles.link}>Privacy Notice</Text>
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  backArrow: {
    fontSize: 22,
    color: '#333',
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    textAlign: 'center',
    color: '#39335E',
    marginBottom: 8,
    fontFamily: 'montserrat',
  },
  subtitle: {
    fontSize: 14,
    textAlign: 'left',
    color: '#474747',
    fontWeight: '400',
    fontFamily: 'montserrat',
    lineHeight: 24,
    marginBottom: 24,
  },
  inputWrapper: {
    backgroundColor: '#F6F6F6',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 4,
    marginBottom: 20,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  inputIcon: {
    width: 20,
    height: 20,
    resizeMode: 'contain',
    marginRight: 10,
  },
  inputField: {
    flex: 1,
    fontSize: 14,
    color: '#000',
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
    paddingHorizontal: 10,
    fontFamily: 'montserrat',
  },
  link: {
    color: '#836EFE',
    fontWeight: '700',
  },
});

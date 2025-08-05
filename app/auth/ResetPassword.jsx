import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Image,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import Toast from 'react-native-toast-message';
import SuccessModal from './SuccessModal';
import { BASE_URL } from '../../constants/api'; // Adjust the path as per file location


export default function ResetPassword({ email = '', onClose = () => {}, onSuccess = () => {} }) {
  const [newPass, setNewPass] = useState('');
  const [confirmPass, setConfirmPass] = useState('');
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const isStrongPassword = (pwd) =>
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/.test(pwd);

  const handleSubmit = async () => {
    if (!email) {
      Toast.show({ type: 'error', text1: 'Missing Email', text2: 'Email is required to reset password.' });
      return;
    }

    if (!newPass || !confirmPass) {
      Toast.show({ type: 'error', text1: 'Validation Error', text2: 'Please fill in all fields.' });
      return;
    }

    if (newPass !== confirmPass) {
      Toast.show({ type: 'error', text1: 'Validation Error', text2: 'Passwords do not match.' });
      return;
    }

    if (!isStrongPassword(newPass)) {
      Toast.show({
        type: 'error',
        text1: 'Weak Password',
        text2: 'Password must be at least 8 characters and include uppercase, lowercase, number, and special character.',
      });
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`${BASE_URL}/reset-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, newPassword: newPass }),
      });

      const data = await response.json();

      if (response.ok) {
        Toast.show({ type: 'success', text1: 'Success', text2: 'Password has been reset!' });
        setShowSuccessModal(true);
      } else {
        Toast.show({ type: 'error', text1: 'Error', text2: data.message || 'Failed to reset password.' });
      }
    } catch (err) {
      Toast.show({ type: 'error', text1: 'Error', text2: err.message || 'Something went wrong.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={onClose}>
        <Text style={styles.backArrow}>←</Text>
      </TouchableOpacity>

      <Text style={styles.title}>Reset Password</Text>
      <Text style={styles.subtitle}>
        Set the new password for your account to continue accessing your features.
      </Text>

      <View style={styles.inputWrapper}>
        <View style={styles.inputRow}>
          <Image source={require('../../assets/icons/lock.png')} style={styles.inputIcon} />
          <TextInput
            placeholder="New Password"
            secureTextEntry={!showNew}
            placeholderTextColor="#999"
            style={styles.inputField}
            value={newPass}
            onChangeText={setNewPass}
            editable={!loading}
          />
          <TouchableOpacity onPress={() => setShowNew(!showNew)}>
            <Image source={require('../../assets/icons/eye.png')} style={styles.eyeIcon} />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.inputWrapper}>
        <View style={styles.inputRow}>
          <Image source={require('../../assets/icons/lock.png')} style={styles.inputIcon} />
          <TextInput
            placeholder="Confirm Password"
            secureTextEntry={!showConfirm}
            placeholderTextColor="#999"
            style={styles.inputField}
            value={confirmPass}
            onChangeText={setConfirmPass}
            editable={!loading}
          />
          <TouchableOpacity onPress={() => setShowConfirm(!showConfirm)}>
            <Image source={require('../../assets/icons/eye.png')} style={styles.eyeIcon} />
          </TouchableOpacity>
        </View>
      </View>

      <TouchableOpacity
        onPress={handleSubmit}
        style={[styles.submitButton, loading && { opacity: 0.6 }]}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.submitText}>Save Password</Text>
        )}
      </TouchableOpacity>

      <Text style={styles.legalText}>
        By continuing, you agree to Shopping{' '}
        <Text style={styles.link}>Conditions of Use</Text> and{' '}
        <Text style={styles.link}>Privacy Notice</Text>.
      </Text>

      <SuccessModal
        visible={showSuccessModal}
        onClose={() => {
          setShowSuccessModal(false);
          onClose();
        }}
        onContinue={() => {
          setShowSuccessModal(false);
          onClose();
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 0,
  },
  backArrow: {
    fontSize: 22,
    color: '#333',
    marginBottom: 10,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: '#39335E',
    fontFamily: 'montserrat',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: '#474747',
    fontFamily: 'montserrat',
    lineHeight: 24,
    marginBottom: 24,
  },
  inputWrapper: {
    backgroundColor: '#F6F6F6',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 4,
    marginBottom: 16,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  inputIcon: {
    width: 20,
    height: 20,
    marginRight: 10,
  },
  inputField: {
    flex: 1,
    fontSize: 14,
    color: '#000',
    fontFamily: 'montserrat',
  },
  eyeIcon: {
    width: 20,
    height: 20,
  },
  submitButton: {
    backgroundColor: '#836EFE',
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 24,
  },
  submitText: {
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

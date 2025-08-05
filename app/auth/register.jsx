import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Image,
  TouchableOpacity,
  StyleSheet,
  Modal,
} from 'react-native';
import { useRouter } from 'expo-router';
import Toast from 'react-native-toast-message'; // ✅ Toast import
import Verification from './Verification';
import { BASE_URL } from '../../constants/api'; // Adjust the path as per file location


export default function RegisterScreen() {
  const router = useRouter();
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [agree, setAgree] = useState(false);
  const [showVerifyModal, setShowVerifyModal] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const isStrongPassword = (pwd) =>
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/.test(pwd);

  const handleRegister = async () => {
    if (!email || !password) {
      Toast.show({
        type: 'error',
        text1: 'Missing Fields',
        text2: 'Please enter both email and password.',
      });
      return;
    }

    if (!isValidEmail(email)) {
      Toast.show({
        type: 'error',
        text1: 'Invalid Email',
        text2: 'Please enter a valid email address.',
      });
      return;
    }

    if (!isStrongPassword(password)) {
      Toast.show({
        type: 'error',
        text1: 'Weak Password',
        text2:
          'Password must be at least 8 characters and include uppercase, lowercase, number, and special character.',
      });
      return;
    }

    if (!agree) {
      Toast.show({
        type: 'info',
        text1: 'Agreement Required',
        text2: 'You must agree to the public offer to continue.',
      });
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`${BASE_URL}/request-code`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, source: 'register' }),
      });

      const data = await response.json();

      if (data.message === 'User already exists') {
        Toast.show({
          type: 'error',
          text1: 'Account Exists',
          text2: 'Redirecting to login...',
        });
        setTimeout(() => router.replace('/auth/loginScreen'), 1500);
        return;
      }

      if (response.ok) {
        Toast.show({
          type: 'success',
          text1: 'Verification Code Sent',
          text2: 'Check your inbox to continue.',
        });
        setShowVerifyModal(true);
      } else {
        Toast.show({
          type: 'error',
          text1: 'Error',
          text2: data.message || 'Failed to send verification code.',
        });
      }
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Server Error',
        text2: error.message || 'Something went wrong.',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      {/* Back Arrow */}
      <View style={styles.top}>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={styles.backArrow}>←</Text>
        </TouchableOpacity>
      </View>

      {/* Logo */}
      <Image source={require('../../assets/images/logo.png')} style={styles.logo} />

      {/* Title & Subtitle */}
      <Text style={styles.title}>Create Your Account!</Text>
      <Text style={styles.subtitle}>
        Sign up now to gain access to member-only discounts and personalized recommendations tailored just for you.
      </Text>

      {/* Email Input */}
      <View style={styles.inputWrapper}>
        <View style={styles.inputRow}>
          <Image source={require('../../assets/icons/profile.png')} style={styles.inputIcon} />
          <TextInput
            placeholder="Email"
            style={styles.inputField}
            placeholderTextColor="#999"
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            keyboardType="email-address"
          />
        </View>
      </View>

      {/* Password Input */}
      <View style={styles.inputWrapper}>
        <View style={styles.inputRow}>
          <Image source={require('../../assets/icons/lock.png')} style={styles.inputIcon} />
          <TextInput
            placeholder="Password"
            secureTextEntry={!passwordVisible}
            style={styles.inputField}
            placeholderTextColor="#999"
            value={password}
            onChangeText={setPassword}
          />
          <TouchableOpacity onPress={() => setPasswordVisible(!passwordVisible)}>
            <Image source={require('../../assets/icons/eye.png')} style={styles.eyeIcon} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Terms Checkbox */}
      <View style={styles.termsRow}>
        <TouchableOpacity style={styles.checkbox} onPress={() => setAgree(!agree)}>
          {agree && <View style={styles.checkboxTick} />}
        </TouchableOpacity>
        <Text style={styles.termsText}>
          By clicking the <Text style={{ fontWeight: '700' }}>Register</Text> button, you agree to the public offer.
        </Text>
      </View>

      {/* Register Button */}
      <TouchableOpacity style={styles.loginButton} onPress={handleRegister} disabled={loading}>
        <Text style={styles.loginText}>{loading ? 'Sending...' : 'Register'}</Text>
      </TouchableOpacity>

      {/* Divider */}
      <View style={styles.divider}>
        <View style={styles.line} />
        <Text style={styles.or}>Or continue with</Text>
        <View style={styles.line} />
      </View>

      {/* Social Logins */}
      <View style={styles.socialGroup}>
        <TouchableOpacity style={styles.socialBtn}>
          <Image source={require('../../assets/icons/Apple.png')} style={styles.socialIcon} />
          <Text style={styles.socialText}>Continue With Apple</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.socialBtn}>
          <Image source={require('../../assets/icons/Google.png')} style={styles.socialIcon} />
          <Text style={styles.socialText}>Continue With Google</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.socialBtn}>
          <Image source={require('../../assets/icons/Facebook.png')} style={styles.socialIcon} />
          <Text style={styles.socialText}>Continue With Facebook</Text>
        </TouchableOpacity>
      </View>

      {/* Footer */}
      <View style={styles.footer}>
        <Text style={styles.footerText}>Already have an account?</Text>
        <TouchableOpacity onPress={() => router.push('/auth/loginScreen')}>
          <Text style={styles.link}> Log in</Text>
        </TouchableOpacity>
      </View>

      {/* Verification Modal */}
      <Modal transparent animationType="slide" visible={showVerifyModal}>
        <View style={modalStyles.overlay}>
          <View style={modalStyles.popupContainer}>
            <View style={modalStyles.grabber} />
            <Verification
              from="register"
              email={email}
              password={password}
              onClose={() => setShowVerifyModal(false)}
              onContinue={() => {
                setShowVerifyModal(false);
                router.replace({ pathname: '/profile/FillProfile', params: { email } });
}}
            />
          </View>
        </View>
      </Modal>

      {/* Toast component */}
      <Toast />
    </View>
  );
}


const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', paddingHorizontal: 24 },
  top: { height: 40, justifyContent: 'center', marginTop: 10 },
  backArrow: { fontSize: 22, color: '#333' },
  logo: { width: 80, height: 80, resizeMode: 'contain', alignSelf: 'center', marginVertical: 10 },
  title: {
    textAlign: 'center',
    fontSize: 22,
    fontWeight: '700',
    color: '#39335E',
    fontFamily: 'montserrat',
    marginBottom: 10,
  },
  subtitle: {
    textAlign: 'center',
    fontSize: 13,
    color: '#666',
    marginBottom: 16,
    fontFamily: 'montserrat',
  },
  inputWrapper: {
    backgroundColor: '#F6F6F6',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 4,
    marginBottom: 10,
    marginTop: 12,
  },
  inputRow: { flexDirection: 'row', alignItems: 'center' },
  inputIcon: { width: 20, height: 20, resizeMode: 'contain', marginRight: 10 },
  inputField: { flex: 1, fontSize: 14, color: '#000', fontFamily: 'montserrat' },
  eyeIcon: { width: 20, height: 20, resizeMode: 'contain', marginLeft: 10 },
  termsRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 16, gap: 8 },
  checkbox: {
    width: 12,
    height: 12,
    borderWidth: 2,
    borderColor: '#BABABA',
    borderRadius: 2,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 0,
    marginLeft:0,
  },
  checkboxTick: {
    width: 10,
    height: 10,
    backgroundColor: '#836EFE',
    borderRadius: 2,
  },
  termsText: { fontSize: 12, color: '#666', flex: 1, fontFamily: 'montserrat' },
  loginButton: {
    backgroundColor: '#836EFE',
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
  },
  loginText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 16,
    fontFamily: 'montserrat',
  },
  divider: { flexDirection: 'row', alignItems: 'center', marginVertical: 16 },
  line: { flex: 1, height: 1, backgroundColor: '#ccc' },
  or: { marginHorizontal: 10, fontSize: 12, color: '#666', fontFamily: 'montserrat' },
  socialGroup: { flexDirection: 'column', justifyContent: 'space-between' },
  socialBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F6F6F6',
    padding: 14,
    borderRadius: 8,
    marginBottom: 12,
  },
  socialIcon: { width: 20, height: 20, resizeMode: 'contain', marginRight: 12 },
  socialText: {
    fontSize: 14,
    flex: 1,
    fontWeight: '500',
    color: '#39335E',
    textAlign: 'center',
    fontFamily: 'montserrat',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    height: 50,
  },
  footerText: { fontSize: 13, color: '#727272', fontFamily: 'montserrat' },
  link: { color: '#836EFE', fontWeight: '700', fontFamily: 'montserrat' },
});

const modalStyles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  popupContainer: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingTop: 12,
    paddingBottom: 32,
    paddingHorizontal: 24,
  },
  grabber: {
    width: 40,
    height: 5,
    backgroundColor: '#ccc',
    borderRadius: 10,
    alignSelf: 'center',
    marginBottom: 12,
  },
});
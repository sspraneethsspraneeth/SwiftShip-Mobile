import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import {
  Image,
  Modal,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import Toast from 'react-native-toast-message'; // ✅ Toast import

import ForgetPass from './ForgetPass';
import ResetPassword from './ResetPassword';
import Verification from './Verification';
import { BASE_URL } from '../../constants/api';

export default function LoginScreen() {
  const router = useRouter();
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [showVerifyModal, setShowVerifyModal] = useState(false);
  const [showResetModal, setShowResetModal] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      Toast.show({
        type: 'error',
        text1: 'Validation Error',
        text2: 'Please enter both email and password.',
      });
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`${BASE_URL}/login`, {

        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        Toast.show({
          type: 'error',
          text1: 'Login Failed',
          text2: data.message || 'Invalid credentials',
        });
      } else {
        // ✅ Store token & email in AsyncStorage
  await AsyncStorage.setItem('token', data.token);
  await AsyncStorage.setItem('email', data.user.email);
  await AsyncStorage.setItem('customerId', data.user.customerId);
        Toast.show({
          type: 'success',
          text1: 'Login Successful',
          text2: 'Welcome back!',
        });
        router.replace('/dashboard/dashboard'); // Redirect to dashboard on successful login
      }
    } catch (err) {
      Toast.show({
        type: 'error',
        text1: 'Server Error',
        text2: err.message || 'An error occurred while logging in.',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleForgotContinue = (enteredEmail) => {
    setEmail(enteredEmail);
    setShowForgotModal(false);
    setShowVerifyModal(true);
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

      {/* Welcome */}
      <Text style={styles.title}>Welcome Back! 👋</Text>
      <Text style={styles.subtitle}>
        We're glad to see you again. Log in to access your account and explore our latest features.
      </Text>

      {/* Email */}
      <View style={styles.inputWrapper}>
        <View style={styles.inputRow}>
          <Image source={require('../../assets/icons/email.png')} style={styles.inputIcon} />
          <TextInput
            placeholder="Email"
            value={email}
            onChangeText={setEmail}
            style={styles.inputField}
            placeholderTextColor="#999"
            keyboardType="email-address"
            autoCapitalize="none"
          />
        </View>
      </View>

      {/* Password */}
      <View style={styles.inputWrapper}>
        <View style={styles.inputRow}>
          <Image source={require('../../assets/icons/lock.png')} style={styles.inputIcon} />
          <TextInput
            placeholder="Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry={!passwordVisible}
            style={styles.inputField}
            placeholderTextColor="#999"
          />
          <TouchableOpacity onPress={() => setPasswordVisible(!passwordVisible)}>
            <Image source={require('../../assets/icons/eye.png')} style={styles.eyeIcon} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Remember Me / Forgot */}
      <View style={styles.rememberRow}>
        <View style={styles.rememberMe}>
          <Switch
            value={rememberMe}
            onValueChange={setRememberMe}
            trackColor={{ false: '#ccc', true: '#836EFE' }}
            thumbColor="#fff"
          />
          <Text style={styles.rememberText}>Remember Me</Text>
        </View>
        <TouchableOpacity onPress={() => setShowForgotModal(true)}>
          <Text style={styles.forgot}>Forgot Password?</Text>
        </TouchableOpacity>
      </View>

      {/* Login Button */}
      <TouchableOpacity style={styles.loginButton} onPress={handleLogin} disabled={loading}>
        <Text style={styles.loginText}>{loading ? 'Logging in...' : 'Login'}</Text>
      </TouchableOpacity>

      {/* Divider */}
      <View style={styles.divider}>
        <View style={styles.line} />
        <Text style={styles.or}>Or continue with</Text>
        <View style={styles.line} />
      </View>

      {/* Social Buttons */}
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
        <Text style={styles.footerText}>
          Don't have an account?{' '}
          <Text style={styles.link} onPress={() => router.push('/auth/register')}>
            Sign up
          </Text>
        </Text>
      </View>

      {/* Forget Password Modal */}
      <Modal transparent animationType="slide" visible={showForgotModal}>
        <View style={modalStyles.overlay}>
          <View style={modalStyles.popupContainer}>
            <View style={modalStyles.grabber} />
            <ForgetPass
              initialEmail={email}
              onClose={() => setShowForgotModal(false)}
              onContinue={handleForgotContinue}
            />
          </View>
        </View>
      </Modal>

      {/* Verification Modal */}
      <Modal transparent animationType="slide" visible={showVerifyModal}>
        <View style={modalStyles.overlay}>
          <View style={modalStyles.popupContainer}>
            <View style={modalStyles.grabber} />
            <Verification
              from="forgot"
              email={email}
              onClose={() => setShowVerifyModal(false)}
              onContinue={() => {
                setShowVerifyModal(false);
                setTimeout(() => setShowResetModal(true), 300);
              }}
            />
          </View>
        </View>
      </Modal>

      {/* Reset Password Modal */}
      <Modal transparent animationType="slide" visible={showResetModal}>
        <View style={modalStyles.overlay}>
          <View style={modalStyles.popupContainer}>
            <View style={modalStyles.grabber} />
            <ResetPassword email={email} onClose={() => setShowResetModal(false)} />
          </View>
        </View>
      </Modal>

      {/* Toast Component Instance */}
      <Toast />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 24,
  },
  top: { height: 25, justifyContent: 'center' },
  backArrow: { top: 20, fontSize: 22, color: '#333' },
  logo: {
    width: 100,
    height: 100,
    resizeMode: 'contain',
    alignSelf: 'center',
    marginVertical: 10,
  },
  title: {
    textAlign: 'center',
    fontSize: 22,
    fontWeight: '700',
    color: '#39335E',
    marginBottom: 10,
  },
  subtitle: {
    textAlign: 'center',
    fontSize: 13,
    color: '#666',
    marginBottom: 16,
  },
  inputWrapper: {
    backgroundColor: '#F6F6F6',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 4,
    marginBottom: 10,
    marginTop: 12,
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
  },
  eyeIcon: {
    width: 20,
    height: 20,
    resizeMode: 'contain',
    marginLeft: 10,
  },
  rememberRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  rememberMe: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rememberText: {
    marginLeft: 8,
    fontSize: 13,
    color: '#666',
  },
  forgot: {
    fontSize: 13,
    color: '#666',
  },
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
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 16,
  },
  line: {
    flex: 1,
    height: 1,
    backgroundColor: '#ccc',
  },
  or: {
    marginHorizontal: 10,
    fontSize: 12,
    color: '#666',
  },
  socialGroup: {
    flexDirection: 'column',
  },
  socialBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F6F6F6',
    padding: 14,
    borderRadius: 8,
    marginBottom: 12,
  },
  socialIcon: {
    width: 20,
    height: 20,
    resizeMode: 'contain',
    marginRight: 12,
  },
  socialText: {
    fontSize: 14,
    flex: 1,
    fontWeight: '500',
    color: '#39335E',
    textAlign: 'center',
  },
  footer: {
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  footerText: {
    fontSize: 13,
    color: '#727272',
  },
  link: {
    color: '#836EFE',
    fontWeight: '700',
  },
});

const modalStyles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
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

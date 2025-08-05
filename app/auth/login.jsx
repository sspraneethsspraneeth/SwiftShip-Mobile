import React from 'react';
import {
  View,
  Text,
  Image,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  useWindowDimensions,
} from 'react-native';
import PrimaryButton from '../../components/PrimaryButton';
import { useRouter } from 'expo-router'; // ✅ IMPORT THIS
import { StatusBar } from 'expo-status-bar';

import FacebookIcon from '../../assets/icons/Facebook.png';
import GoogleIcon from '../../assets/icons/Google.png';
import AppleIcon from '../../assets/icons/Apple.png';

export default function Login() {
  const { width } = useWindowDimensions();
  const router = useRouter(); // ✅ INITIALIZE ROUTER

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <StatusBar style="dark" backgroundColor="#fff" />
      
      <Image source={require('../../assets/images/login1.png')} style={styles.img} />
      <Text style={styles.title}>Let’s You In</Text>

      <TouchableOpacity style={styles.socialBtn}>
        <View style={styles.iconWrapper}>
          <Image source={FacebookIcon} style={styles.icon} />
        </View>
        <Text style={styles.socialText}>Continue with Facebook</Text>
        <View style={styles.iconSpacer} />
      </TouchableOpacity>

      <TouchableOpacity style={styles.socialBtn}>
        <View style={styles.iconWrapper}>
          <Image source={GoogleIcon} style={styles.icon} />
        </View>
        <Text style={styles.socialText}>Continue with Google</Text>
        <View style={styles.iconSpacer} />
      </TouchableOpacity>

      <TouchableOpacity style={styles.socialBtn}>
        <View style={styles.iconWrapper}>
          <Image source={AppleIcon} style={styles.icon} />
        </View>
        <Text style={styles.socialText}>Continue with Apple</Text>
        <View style={styles.iconSpacer} />
      </TouchableOpacity>

      <View style={styles.divider}>
        <View style={styles.line} />
        <Text style={styles.or}>or</Text>
        <View style={styles.line} />
      </View>

      {/* ✅ Navigate to /auth/loginScreen when pressed */}
      <PrimaryButton title="Next" onPress={() => router.push('/auth/loginScreen')} />

      <Text style={styles.footer}>
        Don’t have an account? <Text style={styles.link} onPress={() => router.push('/auth/register')}>Sign up</Text>
      </Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#fff',
  },
  img: {
    width: '100%',
    resizeMode: 'contain',
    marginBottom: 30,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    marginBottom: 24,
    color: '#1e1e1e',
    fontFamily: 'montserrat',
  },
  socialBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginBottom: 12,
    backgroundColor: '#F6F6F6',
  },
  iconWrapper: {
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  icon: {
    width: 20,
    height: 20,
    resizeMode: 'contain',
  },
  iconSpacer: {
    width: 24,
  },
  socialText: {
    flex: 1,
    textAlign: 'center',
    color: '#39335E',
    fontSize: 14,
    fontWeight: '500',
    lineHeight: 26,
    fontFamily: 'montserrat',
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 20,
    width: '100%',
  },
  line: {
    flex: 1,
    height: 1,
    backgroundColor: '#ccc',
  },
  or: {
    marginHorizontal: 10,
    color: '#666',
    fontSize: 14,
  },
  footer: {
    marginTop: 16,
    fontSize: 12,
    fontWeight: 400,
    color: '#727272',
    fontFamily: 'montserrat',
  },
  link: {
    color: '#836EFE',
    fontWeight: '700',
  },
});


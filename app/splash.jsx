import { useEffect } from 'react';
import { View, Image, Text, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';

export default function Splash() {
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      router.replace('/auth/onboarding');
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <View style={styles.container}>
      <Image
        source={require('../assets/images/logo.png')}
        style={styles.image}
      />
      <Text style={styles.title}>Swift Ship</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#7b61ff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: 180,
    height: 180,
    resizeMode: 'contain',
  },
  title: {
    fontSize: 42,
    fontWeight: '800',
    color: '#fff',
    fontFamily: 'montserrat', // Optional: if you're using Montserrat
  },
});

import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Image,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LinearGradient } from 'expo-linear-gradient';
import BottomNav from '../../components/BottomNav';
import { BASE_URL } from '../../constants/api'; // Adjust the path as per file location

export default function Dashboard() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [wallet, setWallet] = useState(null);
  const [loading, setLoading] = useState(true);

  const [formInputs, setFormInputs] = useState({
    trackId: '',
  });

  // 🔹 Input fields definition
  const inputFields = [
    {
      key: 'trackId',
      placeholder: 'Track Id Number',
      leftIcon: require('../../assets/icons/search1.png'),
      rightIcon: require('../../assets/icons/sort.png'),
    },
  ];

  // 🔹 Services definition
  const services = [
    {
      icon: require('../../assets/icons/order.png'),
      label: 'Make Order',
      route: '/order/make-order',
    },
    {
      icon: require('../../assets/icons/price.png'),
      label: 'Prices',
      route: '/pricing/pricing',
    },
    {
      icon: require('../../assets/icons/help.png'),
      label: 'Help Center',
      route: '/help/help-center',
    },
    {
      icon: require('../../assets/icons/location.png'),
      label: 'Nearby Drop',
      route: '/drop/NearbyDrop',
    },
  ];

  useEffect(() => {
    const fetchUserAndWallet = async () => {
      const email = await AsyncStorage.getItem('email');
      const token = await AsyncStorage.getItem('token');

      if (!email || !token) {
        router.replace('/auth/login');
        return;
      }

      try {
        // Fetch user
        const res = await fetch(`${BASE_URL}/user?email=${email}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await res.json();

        if (res.ok) {
          setUser(data.user);

          // ✅ Save userId for later use in TopUpWallet
          await AsyncStorage.setItem('userId', data.user._id);
          const storedId = await AsyncStorage.getItem('userId');
          console.log('Stored userId in AsyncStorage:', storedId);

          // Fetch wallet
          const walletRes = await fetch(`${BASE_URL}/wallet/${data.user._id}`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          const walletData = await walletRes.json();
          if (walletRes.ok) {
            setWallet(walletData);
          } else {
            console.error('Wallet fetch error:', walletData.message);
          }
        } else {
          console.error('User fetch error:', data.message);
          router.replace('/auth/login');
        }
      } catch (err) {
        console.error('Error fetching user/wallet:', err);
        router.replace('/auth/login');
      } finally {
        setLoading(false);
      }
    };

    fetchUserAndWallet();
  }, []);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#6C63FF" />
      </View>
    );
  }

  return (
    <View style={styles.wrapper}>
      <ScrollView contentContainerStyle={styles.container}>
        {/* Header Row */}
        <View style={styles.header}>
          <Image
            source={
              user?.image
                ? { uri: user.image }
                : require('../../assets/icons/default-avatar.png')
            }
            style={styles.profilePic}
          />
          <View>
            <Text style={styles.greeting}>Good Morning! 👋🏻</Text>
            <Text style={styles.username}>{user?.fullName || 'User'}</Text>
          </View>
          <TouchableOpacity
            style={styles.bellWrapper}
            onPress={() => router.push('/notification/notification')}
          >
            <Image
              source={require('../../assets/icons/bell.png')}
              style={styles.notificationIcon}
            />
          </TouchableOpacity>
        </View>

        {/* Input Fields (map) */}
        {inputFields.map((field) => (
          <View key={field.key} style={styles.inputRow}>
            {field.leftIcon && (
              <TouchableOpacity>
                <Image source={field.leftIcon} style={styles.iconBtn} />
              </TouchableOpacity>
            )}

            <TextInput
              placeholder={field.placeholder}
              placeholderTextColor="#aaa"
              style={styles.trackInput}
              value={formInputs[field.key]}
              onChangeText={(text) =>
                setFormInputs((prev) => ({ ...prev, [field.key]: text }))
              }
            />

            {field.rightIcon && (
              <TouchableOpacity>
                <Image source={field.rightIcon} style={styles.iconBtn} />
              </TouchableOpacity>
            )}
          </View>
        ))}

        {/* Gradient Balance Card */}
        <TouchableOpacity
          onPress={() => router.push('/wallet/wallet')}
          activeOpacity={0.8}
        >
          <LinearGradient
            colors={['#9C2CF3', '#3A49F9']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.card}
          >
            <View style={styles.cardBgTopRight} />
            <View style={styles.cardBgBottomLeft} />
            <Text style={styles.cardLabel}>Current Balance</Text>
            <Text style={styles.cardAmount}>
              {wallet ? `₹${wallet.balance.toFixed(2)}` : '₹0.00'}
            </Text>
            <Image
              source={require('../../assets/icons/mastercard.png')}
              style={styles.cardLogo}
            />
            <View style={styles.cardFooter}>
              <Text style={styles.cardDetails}>5282 3456 7890 1289</Text>
              <Text style={styles.cardDetails}>09/25</Text>
            </View>
          </LinearGradient>
        </TouchableOpacity>

        {/* Services Grid (map) */}
        <View style={styles.services}>
          {services.map((item, index) => (
            <Service
              key={index}
              icon={item.icon}
              label={item.label}
              onPress={() => router.push(item.route)}
            />
          ))}
        </View>

        {/* Transaction History */}
        <View style={styles.transactionHeader}>
          <Text style={styles.transactionTitle}>Transaction History</Text>
          <TouchableOpacity onPress={() => router.push('/transaction/history')}>
            <Text style={styles.transactionLink}>See all</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      <BottomNav activeTab="Home" />
    </View>
  );
}

const Service = ({ icon, label, onPress }) => (
  <TouchableOpacity style={styles.serviceItem} onPress={onPress} activeOpacity={0.8}>
    <Image source={icon} style={styles.serviceIcon} />
    <Text style={styles.serviceLabel}>{label}</Text>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: '#fff',
    top: 3,
  },
  container: {
    padding: 20,
    paddingBottom: 100,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 30,
    marginBottom: 10,
  },
  profilePic: {
    width: 65,
    height: 65,
    borderRadius: 22.5,
    marginRight: 10,
    top: 5,
  },
  greeting: {
    fontSize: 12,
    color: '#727272',
    top: 5,
  },
  username: {
    fontSize: 22,
    fontWeight: '700',
    color: '#39335E',
    top: 8,
  },
  bellWrapper: {
    marginLeft: 'auto',
  },
  notificationIcon: {
    width: 20,
    height: 20,
    resizeMode: 'contain',
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f3f3f3',
    borderRadius: 10,
    paddingHorizontal: 12,
    height: 45,
    marginTop: 10,
  },
  trackInput: {
    flex: 1,
    fontSize: 14,
    color: '#000',
    marginHorizontal: 8,
  },
  iconBtn: {
    width: 20,
    height: 20,
    tintColor: '#888',
    resizeMode: 'contain',
  },
  card: {
    marginTop: 20,
    borderRadius: 20,
    padding: 20,
    position: 'relative',
    overflow: 'hidden',
  },
  cardBgTopRight: {
    position: 'absolute',
    top: -60,
    right: -20,
    width: 180,
    height: 180,
    backgroundColor: '#2D3EDC',
    borderRadius: 90,
    opacity: 0.4,
  },
  cardBgBottomLeft: {
    position: 'absolute',
    bottom: -90,
    left: -50,
    width: 200,
    height: 200,
    backgroundColor: '#2D3EDC',
    borderRadius: 100,
    opacity: 0.3,
  },
  cardLabel: {
    color: '#FFFFFFcc',
    fontWeight: '400',
    fontSize: 17,
    marginTop: 20,
  },
  cardAmount: {
    color: '#fff',
    fontSize: 34,
    fontWeight: 'bold',
    marginTop: 0,
  },
  cardLogo: {
    position: 'absolute',
    top: 45,
    right: 20,
    width: 56,
    height: 45,
    resizeMode: 'contain',
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 80,
  },
  cardDetails: {
    color: '#fff',
    fontSize: 17,
  },
  services: {
    marginTop: 30,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  serviceItem: {
    width: '48%',
    backgroundColor: '#f8f8f8',
    paddingVertical: 20,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 15,
  },
  serviceIcon: {
    width: 28,
    height: 28,
    marginBottom: 10,
    resizeMode: 'contain',
  },
  serviceLabel: {
    fontSize: 14,
    fontWeight: '600',
  },
  transactionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  transactionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  transactionLink: {
    fontSize: 14,
    color: '#6C63FF',
  },
});

import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';
import PrimaryButton from '../../components/PrimaryButton';
import { BASE_URL } from '../../constants/api';

// Map transaction types/status to icons
const iconMap = {
  Credit: require('../../assets/icons/price.png'),
  Debit: require('../../assets/icons/pay.png'),
  Wallet: require('../../assets/icons/eedit.png'),
  Order: require('../../assets/icons/box.png'), // Make sure this icon exists
};

// Get transaction title (order style like your history page)
const getTitleFromTransaction = (txn) => {
  if (txn.type === 'Order') {
    if (txn.status === 'Pending') return `Order ${txn.orderId || ''} Placed`;
    if (txn.status === 'Completed') return `Order ${txn.orderId || ''} Delivered`;
    if (txn.status === 'Cancelled') return `Order ${txn.orderId || ''} Cancelled`;
    return `Order ${txn.orderId || ''} Update`;
  }
  if (txn.status === 'Completed' && txn.type === 'Credit') return 'Payment Successful';
  if (txn.status === 'Failed') return 'Payment Reversed';
  if (txn.type === 'Credit' && txn.orderId) return 'New Order Made!';
  if (txn.type === 'Debit' && txn.method === 'Wallet') return 'Top Up Successful';
  if (txn.isWalletTopUp) return 'Top Up Successful';
  return 'Transaction Update';
};

// Get transaction description (order style like your history page)
const getDescriptionFromTransaction = (txn) => {
  if (txn.type === 'Order') return `Total ₹${txn.amount || txn.totalAmount || 0}`;
  if (txn.isWalletTopUp) return 'Your wallet has been credited';
  if (txn.type === 'Credit') return `Received ₹${txn.amount} via ${txn.method}`;
  return `Paid ₹${txn.amount} via ${txn.method}`;
};

// Format time ago
const getTimeAgo = (date) => {
  const now = new Date();
  const txnDate = new Date(date);
  const diffMs = now - txnDate;
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffMins < 60) return `${diffMins} min ago`;
  if (diffHours < 24) return `${diffHours} hours ago`;
  if (diffDays === 1) return '1 day ago';
  return `${diffDays} days ago`;
};

export default function Wallet() {
  const router = useRouter();
  const [wallet, setWallet] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWalletAndTransactions = async () => {
      try {
        const token = await AsyncStorage.getItem('token');
        const userId = await AsyncStorage.getItem('userId');
        const phone = await AsyncStorage.getItem('phone'); // Make sure phone is stored on login

        if (!token || !userId) {
          router.replace('/auth/login');
          return;
        }

        // Fetch normal transactions
        const txnRes = await fetch(`${BASE_URL}/transactions/all`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const txnData = await txnRes.json();

        // Fetch wallet details
        const walletRes = await fetch(`${BASE_URL}/wallet/${userId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const walletData = await walletRes.json();

        if (walletRes.ok) {
          setWallet(walletData);
        }

        // Convert wallet top-ups to same format
        let walletTxns = [];
        if (walletData?.transactions) {
          walletTxns = walletData.transactions.map((w) => ({
            ...w,
            type: 'Wallet',
            isWalletTopUp: true,
            icon: require('../../assets/icons/eedit.png'),
          }));
        }

        // Fetch orders by phone
        let orderTxns = [];
        if (phone) {
          const orderRes = await fetch(`${BASE_URL}/orders/by-phone/${phone}`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          const orderData = await orderRes.json();

          if (orderRes.ok && Array.isArray(orderData.orders)) {
            orderTxns = orderData.orders.map((o) => ({
              date: o.createdAt,
              type: 'Order',
              status: o.status || 'Pending',
              orderId: o.orderId,
              amount: o.totalAmount || 0,
              icon: iconMap.Order,
            }));
          }
        }

        // Merge & sort by date descending, take latest 4
        const merged = [...txnData, ...walletTxns, ...orderTxns]
          .sort((a, b) => new Date(b.date) - new Date(a.date))
          .slice(0, 4);

        setTransactions(merged);
      } catch (error) {
        console.error('Error fetching wallet data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchWalletAndTransactions();
  }, []);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#6C63FF" />
      </View>
    );
  }

  return (
    <View style={styles.wrapper}>
      <ScrollView contentContainerStyle={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()}>
            <Text style={styles.back}>{'←'}</Text>
          </TouchableOpacity>
          <Text style={styles.title}>My Wallet</Text>
        </View>

        {/* Balance Card */}
        <LinearGradient
          colors={['#9C2CF3', '#3A49F9']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.card}
        >
          <View style={styles.cardBgTopRight} />
          <View style={styles.cardBgBottomLeft} />

          <Text style={styles.cardLabel}>Current Balance</Text>

          <View style={styles.cardRow}>
            <Text style={styles.cardAmount}>
              {wallet ? `₹${wallet.balance.toFixed(2)}` : '₹0.00'}
            </Text>
            <Image
              source={require('../../assets/icons/mastercard.png')}
              style={styles.cardLogo}
            />
          </View>

          <View style={styles.cardFooter}>
            <Text style={styles.cardDetails}>5282 3456 7890 1289</Text>
            <Text style={styles .cardDetails}>09/25</Text>
          </View>
        </LinearGradient>

        {/* Transaction Header */}
        <View style={styles.transactionHeader}>
          <Text style={styles.transactionTitle}>Recent Transactions</Text>
          <TouchableOpacity onPress={() => router.push('/transaction/history')}>
            <Text style={styles.transactionLink}>See all</Text>
          </TouchableOpacity>
        </View>

        {/* Recent Transactions */}
        {transactions.map((item, index) => (
          <View key={index} style={styles.cardItem}>
            <View style={styles.iconWrapper}>
              <Image
                source={item.icon || iconMap[item.type] || require('../../assets/icons/pay.png')}
                style={styles.cardIcon}
              />
            </View>
            <View style={styles.cardText}>
              <Text style={styles.cardTitle}>{getTitleFromTransaction(item)}</Text>
              <Text style={styles.cardDesc}>{getDescriptionFromTransaction(item)}</Text>
            </View>
            <Text style={styles.cardTime}>{getTimeAgo(item.date)}</Text>
          </View>
        ))}

        <View style={{ height: 100 }} />
      </ScrollView>

      {/* Top-up Button */}
      <View style={styles.buttonContainer}>
        <PrimaryButton title="TopUp" onPress={() => router.push('/wallet/topup')} />
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
    paddingBottom: 140,
    top: 30,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  back: {
    fontSize: 24,
    marginRight: 10,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#39335E',
  },
  card: {
    borderRadius: 20,
    padding: 20,
    marginBottom: 25,
    overflow: 'hidden',
    position: 'relative',
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
    bottom: -130,
    left: -60,
    width: 200,
    height: 200,
    backgroundColor: '#2D3EDC',
    borderRadius: 100,
    opacity: 0.3,
  },
  cardLabel: {
    color: '#ffffffcc',
    fontSize: 14,
    marginBottom: 8,
  },
  cardRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  cardAmount: {
    color: '#fff',
    fontSize: 32,
    fontWeight: 'bold',
  },
  cardLogo: {
    width: 50,
    height: 40,
    resizeMode: 'contain',
    bottom: 20,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 30,
  },
  cardDetails: {
    color: '#fff',
    fontSize: 14,
  },
  transactionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  transactionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#39335E',
  },
  transactionLink: {
    fontSize: 14,
    color: '#6C63FF',
  },
  cardItem: {
    backgroundColor: '#FAFAFA',
    borderWidth: 1,
    borderColor: '#F0F0F0',
    borderRadius: 12,
    padding: 15,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  iconWrapper: {
    backgroundColor: '#E9E7FF',
    padding: 10,
    borderRadius: 10,
    marginRight: 10,
  },
  cardIcon: {
    width: 22,
    height: 22,
    resizeMode: 'contain',
  },
  cardText: {
    flex: 1,
  },
  cardTitle: {
    fontWeight: 'bold',
    fontSize: 14,
    color: '#39335E',
  },
  cardDesc: {
    fontSize: 12,
    color: '#888',
    marginTop: 2,
  },
  cardTime: {
    fontSize: 12,
    color: '#6C63FF',
  },
  buttonContainer: {
    position: 'absolute',
    bottom: 30,
    left: 20,
    right: 20,
  },
});

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
import AsyncStorage from '@react-native-async-storage/async-storage';
import BottomNav from '../../components/BottomNav';
import { BASE_URL } from '../../constants/api';

// Icons for each type
const iconMap = {
  Credit: require('../../assets/icons/price.png'),
  Debit: require('../../assets/icons/pay.png'),
  Wallet: require('../../assets/icons/eedit.png'),
  Order: require('../../assets/icons/eedit.png'), // new icon for orders
};

// Title mapping
const getTitleFromItem = (item) => {
  if (item.isOrder) {
    if (item.status === 'Pending') return 'Order Placed';
    if (item.status === 'Completed') return 'Order Delivered';
    if (item.status === 'Cancelled') return 'Order Cancelled';
    return 'Order Update';
  }
  if (item.status === 'Completed' && item.type === 'Credit') return 'Payment Successful';
  if (item.status === 'Failed') return 'Payment Reversed';
  if (item.type === 'Credit' && item.orderId) return 'New Order Made!';
  if (item.type === 'Debit' && item.method === 'Wallet') return 'Top Up Successful';
  if (item.isWalletTopUp) return 'Top Up Successful';
  return 'Transaction Update';
};

// Description mapping
// Description mapping
const getDescriptionFromItem = (item) => {
  if (item.isOrder) {
    return 'You have created a new shipping order';
  }
  if (item.isWalletTopUp) return 'Your wallet has been credited';
  if (item.type === 'Credit') return `Received ₹${item.amount} via ${item.method}`;
  return `Paid ₹${item.amount} via ${item.method}`;
};

// Relative time formatting
const getTimeAgo = (date) => {
  const now = new Date();
  const itemDate = new Date(date);
  const diffMs = now - itemDate;
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffMins < 60) return `${diffMins} min ago`;
  if (diffHours < 24) return `${diffHours} hours ago`;
  if (diffDays === 1) return '1 day ago';
  return `${diffDays} days ago`;
};

export default function TransactionHistory() {
  const router = useRouter();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = await AsyncStorage.getItem('token');
        const userId = await AsyncStorage.getItem('userId');

        if (!token || !userId) {
          router.replace('/auth/login');
          return;
        }

        // Fetch transactions
        const txnRes = await fetch(`${BASE_URL}/transactions/all`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const txnData = await txnRes.json();

        // Fetch wallet history
        const walletRes = await fetch(`${BASE_URL}/wallet/${userId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const walletData = await walletRes.json();
        let walletTxns = [];
        if (walletData?.transactions) {
          walletTxns = walletData.transactions.map((w) => ({
            ...w,
            type: 'Wallet',
            isWalletTopUp: true,
            icon: iconMap.Wallet,
          }));
        }

        // Fetch orders
        // Fetch orders
const orderRes = await fetch(`${BASE_URL}/orders`, {
  headers: { Authorization: `Bearer ${token}` },
});
const orderData = await orderRes.json();
let orders = [];
if (Array.isArray(orderData.orders)) {
  orders = orderData.orders.map((o) => ({
    ...o,
    isOrder: true,
    status: o.status || 'Pending',
    total: o.totalAmount || o.total || 0,
    date: o.createdAt || o.date || new Date(),
    icon: iconMap.Order,
  }));
}


        // Merge all data
        const merged = [...txnData, ...walletTxns, ...orders].sort(
          (a, b) => new Date(b.date) - new Date(a.date)
        );

        setItems(merged);
      } catch (err) {
        console.error('Error fetching history:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
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
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()}>
            <Text style={styles.back}>{'←'}</Text>
          </TouchableOpacity>
          <Text style={styles.title}>History</Text>
        </View>

        {/* Cards */}
        {items.map((item, index) => (
          <View key={index} style={styles.card}>
            <View style={styles.iconWrapper}>
              <Image
                source={item.icon || iconMap[item.type] || iconMap.Debit}
                style={styles.icon}
              />
            </View>
            <View style={styles.details}>
              <Text style={styles.name}>{getTitleFromItem(item)}</Text>
              <Text style={styles.desc}>{getDescriptionFromItem(item)}</Text>
            </View>
            <Text style={styles.time}>{getTimeAgo(item.date)}</Text>
          </View>
        ))}
      </ScrollView>

      <BottomNav />
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
    paddingBottom: 100,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  back: {
    fontSize: 24,
    marginRight: 10,
    color: '#6C63FF',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderColor: '#F0F0F0',
    borderWidth: 1,
    borderRadius: 15,
    padding: 15,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOpacity: 0.03,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 1,
  },
  iconWrapper: {
    backgroundColor: '#F0F0F0',
    borderRadius: 10,
    padding: 8,
    marginRight: 12,
  },
  icon: {
    width: 30,
    height: 30,
    resizeMode: 'contain',
  },
  details: {
    flex: 1,
  },
  name: {
    fontWeight: 'bold',
    fontSize: 15,
    color: '#333',
  },
  desc: {
    color: '#888',
    fontSize: 13,
    marginTop: 2,
  },
  time: {
    color: '#836EFE',
    fontSize: 12,
    marginLeft: 5,
    fontWeight: '600',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

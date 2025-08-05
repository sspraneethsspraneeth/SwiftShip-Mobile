import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { useRouter } from 'expo-router';
import BottomNav from '../../components/BottomNav';

const transactions = [
  { title: 'New Order Made!', time: '2 hours ago', icon: require('../../assets/icons/eedit.png') },
  { title: 'Payment Revers', time: '4 hours ago', icon: require('../../assets/icons/pay.png') },
  { title: 'Top Up Success-full', time: '6 hours ago', icon: require('../../assets/icons/eedit.png') },
  { title: 'Payment Successful', time: '1 day ago', icon: require('../../assets/icons/pay.png') },
  { title: 'Payment Revers', time: '1 day ago', icon: require('../../assets/icons/pay.png') },
  { title: 'New Order Placed', time: '2 days ago', icon: require('../../assets/icons/eedit.png') },
  { title: 'Payment Revers', time: '2 days ago', icon: require('../../assets/icons/pay.png') },
];

export default function TransactionHistory() {
  const router = useRouter();

  return (
    <View style={styles.wrapper}>
      <ScrollView contentContainerStyle={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()}>
            <Text style={styles.back}>{'←'}</Text>
          </TouchableOpacity>
          <Text style={styles.title}>Transaction History</Text>
        </View>

        {/* Transaction Cards */}
        {transactions.map((item, index) => (
          <View key={index} style={styles.card}>
            <View style={styles.iconWrapper}>
              <Image source={item.icon} style={styles.icon} />
            </View>
            <View style={styles.details}>
              <Text style={styles.name}>{item.title}</Text>
              <Text style={styles.desc}>You have created a new shipping order</Text>
            </View>
            <Text style={styles.time}>{item.time}</Text>
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
    fontWeight:600,
    
  },
});

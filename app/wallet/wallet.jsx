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
import { LinearGradient } from 'expo-linear-gradient'; // ✅ Imported for gradient
import PrimaryButton from '../../components/PrimaryButton';

const transactions = [
  {
    title: 'New Order Made!',
    time: '2 hours ago',
    icon: require('../../assets/icons/order.png'),
  },
  {
    title: 'Payment Revers',
    time: '4 hours ago',
    icon: require('../../assets/icons/price.png'),
  },
  {
    title: 'Top Up Success-full',
    time: '4 hours ago',
    icon: require('../../assets/icons/order.png'),
  },
  {
    title: 'Payment Successful',
    time: '4 hours ago',
    icon: require('../../assets/icons/price.png'),
  },
];

export default function Wallet() {
  const router = useRouter();

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

        {/* ✅ Gradient Balance Card */}
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
            <Text style={styles.cardAmount}>$5,750,20</Text>
            <Image
              source={require('../../assets/icons/mastercard.png')}
              style={styles.cardLogo}
            />
          </View>

          <View style={styles.cardFooter}>
            <Text style={styles.cardDetails}>5282 3456 7890 1289</Text>
            <Text style={styles.cardDetails}>09/25</Text>
          </View>
        </LinearGradient>

        {/* Transaction Header */}
        <View style={styles.transactionHeader}>
          <Text style={styles.transactionTitle}>Transaction History</Text>
          <TouchableOpacity onPress={() => router.push('/transaction/history')}>
            <Text style={styles.transactionLink}>See all</Text>
          </TouchableOpacity>
        </View>

        {/* Transaction Cards */}
        {transactions.map((item, index) => (
          <View key={index} style={styles.cardItem}>
            <View style={styles.iconWrapper}>
              <Image source={item.icon} style={styles.cardIcon} />
            </View>
            <View style={styles.cardText}>
              <Text style={styles.cardTitle}>{item.title}</Text>
              <Text style={styles.cardDesc}>You have created a new shipping order</Text>
            </View>
            <Text style={styles.cardTime}>{item.time}</Text>
          </View>
        ))}

        <View style={{ height: 100 }} />
      </ScrollView>

      {/* Primary Button only */}
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

  // ✅ Gradient card with overlay circles
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

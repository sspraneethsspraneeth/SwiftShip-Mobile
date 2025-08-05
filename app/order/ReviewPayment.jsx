import { Ionicons } from '@expo/vector-icons';
import { useStripe } from '@stripe/stripe-react-native';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import BottomNav from '../../components/BottomNav';
import Toast from 'react-native-toast-message';
import SuccessModal from '../auth/SuccessModal';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { BASE_URL } from '../../constants/api'; // Adjust the path as per file location


const ReviewPayment = () => {
  const [selectedMethod, setSelectedMethod] = useState('card');
  const [order, setOrder] = useState(null);
  const [totalAmount, setTotalAmount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [paymentSheetReady, setPaymentSheetReady] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [fullName, setFullName] = useState('');
  const [fromLocation, setFromLocation] = useState('');
  const router = useRouter();
  const { initPaymentSheet, presentPaymentSheet } = useStripe();

  useEffect(() => {
    const load = async () => {
      await getUserName();
      await fetchUserLocation();
      await fetchOrderDetails();
    };
    load();
  }, []);

  useEffect(() => {
    if (totalAmount > 0) {
      initializePaymentSheet();
    }
  }, [totalAmount]);

  const getUserName = async () => {
    try {
      const storedName = await AsyncStorage.getItem('fullName');
      if (storedName) {
        setFullName(storedName);
        console.log('✅ Loaded fullName:', storedName);
      } else {
        console.warn('⚠️ No name found in AsyncStorage');
      }
    } catch (err) {
      console.error('❌ Failed to load name:', err);
    }
  };

  const fetchUserLocation = async (email) => {
  try {
    const res = await fetch(`${BASE_URL}/user?email=${email}`);
    const data = await res.json();

    if (data?.location?.address) {
      setFromLocation(data.location.address);
      console.log('✅ User address loaded:', data.location.address);
    } else {
      console.warn('⚠️ No address found in user data');
    }
  } catch (err) {
    console.error('❌ Error fetching user:', err);
    Toast.show({
      type: 'error',
      text1: 'User Fetch Failed',
      text2: 'Could not load your profile',
    });
  }
};


  const fetchOrderDetails = async () => {
    try {
      const orderId = await AsyncStorage.getItem('currentOrderId');
      const res = await fetch(`${BASE_URL}/orders/${orderId}`);
      const data = await res.json();

      setOrder(data.order);
      const calculatedAmount = data.order.cost + 20 + 0.18 * data.order.cost;
      setTotalAmount(calculatedAmount.toFixed(0));
    } catch (err) {
      console.error('❌ Failed to fetch order:', err);
      Toast.show({
        type: 'error',
        text1: 'Order Load Failed',
        text2: 'Could not load your order details',
      });
    }
  };

  const fetchPaymentSheetParams = async () => {
    if (totalAmount <= 0) {
      throw new Error('Invalid totalAmount: ' + totalAmount);
    }

    const response = await fetch(`${BASE_URL}/payment/create-payment-intent`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ amount: totalAmount }),
    });

    const data = await response.json();
    return {
      paymentIntent: data.paymentIntent,
      ephemeralKey: data.ephemeralKey,
      customer: data.customer,
    };
  };

  const initializePaymentSheet = async () => {
    try {
      setLoading(true);
      const { paymentIntent, ephemeralKey, customer } = await fetchPaymentSheetParams();

      const { error } = await initPaymentSheet({
        merchantDisplayName: 'SwiftShip',
        customerId: customer,
        customerEphemeralKeySecret: ephemeralKey,
        paymentIntentClientSecret: paymentIntent,
        allowsDelayedPaymentMethods: true,
        defaultBillingDetails: {
          name: fullName || 'Customer',
        },
      });

      if (!error) {
        setPaymentSheetReady(true);
        console.log('✅ Payment sheet ready with name:', fullName);
      } else {
        Toast.show({
          type: 'error',
          text1: 'Init Error',
          text2: error.message,
        });
      }
    } catch (err) {
      Toast.show({
        type: 'error',
        text1: 'Payment Init Failed',
        text2: 'Something went wrong initializing payment sheet',
      });
    } finally {
      setLoading(false);
    }
  };

 const openPaymentSheet = async () => {
  const { error } = await presentPaymentSheet();

  const paymentData = {
    customer: fullName || 'Customer',
    type: 'Credit',
    amount: totalAmount,
    method:
      selectedMethod === 'upi'
        ? 'UPI'
        : selectedMethod === 'wallet'
        ? 'Wallet'
        : 'Card',
  };

  const orderId = await AsyncStorage.getItem('currentOrderId');

  if (error) {
    Toast.show({
      type: 'error',
      text1: 'Payment Failed or Cancelled',
      text2: error.message,
    });

    try {
      await fetch(`${BASE_URL}/transactions/create`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...paymentData, status: 'Failed', errorMessage: error.message }),
      });

      // ❌ Do not update to "Delivered" here
      await fetch(`${BASE_URL}/orders/${orderId}`, {
        method: 'DELETE',
      });

      await AsyncStorage.removeItem('currentOrderId');
      console.log('🗑️ Order deleted due to payment failure');
    } catch (err) {
      console.error('❌ Failed to handle payment failure:', err);
    }
  } else {
    setShowSuccessModal(true);
    try {
      await fetch(`${BASE_URL}/transactions/create`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...paymentData, status: 'Completed', orderId: order.orderId,  }),
      });

      // ✅ Move order status update here
      await fetch(`${BASE_URL}/orders/${orderId}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'Delivered' }), // Or "Paid"
      });

    } catch (err) {
      console.error('❌ Failed to save transaction or update order:', err);
    }
  }
};


  return (
    <View style={{ flex: 1, backgroundColor: '#F6F6F6' }}>
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#39335E" />
          <Text style={styles.title}>Review & Pay</Text>
        </TouchableOpacity>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Order Summary</Text>
          <View style={styles.row}><Text>From</Text><Text style={styles.boldText}>{fromLocation || 'N/A'}</Text></View>
          <View style={styles.row}><Text>To</Text><Text style={styles.boldText}>{order?.deliveryAddress || 'N/A'}</Text></View>
          <View style={styles.row}><Text>Package Type</Text><Text style={styles.boldText}>{order?.packageType || 'N/A'}</Text></View>
          <View style={styles.row}><Text>Weight</Text><Text style={styles.boldText}>{order?.weight} kg</Text></View>
          <View style={styles.row}><Text>Delivery Type</Text><Text style={styles.boldText}>{order?.deliveryType}</Text></View>
          <View style={styles.row}><Text>Pickup Date</Text><Text style={styles.boldText}>{order?.pickupDate}</Text></View>
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Cost Breakdown</Text>
          <View style={styles.row}><Text>Delivery Charge</Text><Text style={styles.boldText}>₹{order?.cost}</Text></View>
          <View style={styles.row}><Text>Insurance</Text><Text style={styles.boldText}>₹20</Text></View>
          <View style={styles.row}><Text>GST (18%)</Text><Text style={styles.boldText}>₹{order ? (0.18 * order.cost).toFixed(0) : '0'}</Text></View>
          <View style={styles.divider} />
          <View style={styles.row}>
            <Text style={styles.totalLabel}>Total Amount</Text>
            <Text style={styles.totalAmount}>₹{totalAmount}</Text>
          </View>
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Select Payment Method</Text>
          {['card', 'upi', 'wallet'].map((method) => (
            <TouchableOpacity
              key={method}
              style={styles.radioOption}
              onPress={() => setSelectedMethod(method)}
            >
              <View style={styles.radioCircle}>
                {selectedMethod === method && <View style={styles.radioDot} />}
              </View>
              <View>
                <Text style={styles.boldText}>
                  {method === 'card' ? '**** **** **** 1289' : method === 'upi' ? 'UPI Payment' : 'Wallet Balance'}
                </Text>
                <Text style={styles.subText}>
                  {method === 'card'
                    ? 'Expires 09/25'
                    : method === 'upi'
                    ? 'Pay via UPI apps'
                    : 'Available: ₹5,750.20'}
                </Text>
              </View>
            </TouchableOpacity>
          ))}
          <TouchableOpacity>
            <Text style={styles.addCard}>Add New Card</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.secureText}>Secure Payment · 256-bit SSL Encryption</Text>

        <TouchableOpacity
          style={styles.payButton}
          onPress={openPaymentSheet}
          disabled={!paymentSheetReady}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.payButtonText}>Pay ₹{totalAmount} Now</Text>
          )}
        </TouchableOpacity>
      </ScrollView>        

      <BottomNav activeTab="Home" />

      <SuccessModal
        visible={showSuccessModal}
        onClose={() => setShowSuccessModal(false)}
        onContinue={() => {
          setShowSuccessModal(false);
          router.push('/dashboard/dashboard');
        }}
      />
    </View>
  );
};

export default ReviewPayment;

// styles remain unchanged


const styles = StyleSheet.create({
  container: {
    padding: 20,
    paddingBottom: 80,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    textAlign: 'center',
    marginVertical: 20,
    color: '#39335E',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
    color: '#39335E',
  },
  card: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 20,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  boldText: {
    fontWeight: '600',
    color: '#39335E',
  },
  subText: {
    fontSize: 12,
    color: '#888',
  },
  totalLabel: {
    fontWeight: '600',
    color: '#39335E',
    fontSize: 15,
  },
  totalAmount: {
    fontSize: 16,
    fontWeight: '700',
    color: '#6C63FF',
  },
  divider: {
    height: 1,
    backgroundColor: '#E0E0E0',
    marginVertical: 8,
  },
  radioOption: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  radioCircle: {
    width: 18,
    height: 18,
    borderRadius: 9,
    borderWidth: 2,
    borderColor: '#6C63FF',
    marginRight: 12,
    marginTop: 4,
    justifyContent: 'center',
    alignItems: 'center',
  },
  radioDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#6C63FF',
  },
  addCard: {
    color: '#39335E',
    textAlign: 'center',
    fontWeight: '500',
    fontSize: 12,
    marginTop: 4,
  },
  secureText: {
    textAlign: 'center',
    fontSize: 12,
    color: '#888',
    marginBottom: 16,
  },
  payButton: {
    backgroundColor: '#6C63FF',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 20,
  },
  payButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

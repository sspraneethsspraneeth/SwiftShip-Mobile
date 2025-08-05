import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Modal,
  FlatList,
  Pressable,
  Alert,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useRouter } from 'expo-router';
import BottomNav from '../../components/BottomNav';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { BASE_URL } from '../../constants/api';

const PACKAGE_OPTIONS = ['Parcel', 'Document', 'Box', 'Envelope'];
const TIME_SLOTS = ['9:00 AM - 12:00', '12:00 PM - 3:00', '3:00 PM - 6:00', '6:00 PM - 9:00'];

export default function MakeOrder() {
  const router = useRouter();
  const [deliveryType, setDeliveryType] = useState('standard');
  const [packageType, setPackageType] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [date, setDate] = useState(null);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [timeSlot, setTimeSlot] = useState('');
  const [showTimeModal, setShowTimeModal] = useState(false);

  const [senderName, setSenderName] = useState('');
  const [senderPhone, setSenderPhone] = useState('');
  const [receiverName, setReceiverName] = useState('');
  const [receiverPhone, setReceiverPhone] = useState('');
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [weight, setWeight] = useState('');
  const [dimensions, setDimensions] = useState('');
  const [notes, setNotes] = useState('');

  useEffect(() => {
    const loadSenderInfo = async () => {
      const name = await AsyncStorage.getItem('fullName');
      const phone = await AsyncStorage.getItem('phone');
      if (name) setSenderName(name);
      if (phone) setSenderPhone(phone);
    };
    loadSenderInfo();
  }, []);

  useEffect(() => {
    const today = new Date();
    const newDate = new Date(today);
    if (deliveryType === 'express') {
      newDate.setDate(today.getDate() + 1);
    } else {
      newDate.setDate(today.getDate() + 3);
    }
    setDate(newDate);
  }, [deliveryType]);

  const handleOrderSubmit = async () => {
    if (!receiverName || !receiverPhone || !deliveryAddress || !packageType || !weight || !dimensions || !date || !timeSlot) {
      Alert.alert('Missing Fields', 'Please fill in all required fields.');
      return;
    }

    const orderData = {
      senderName,
      senderPhone,
      receiverName,
      receiverPhone,
      deliveryAddress,
      packageType,
      weight,
      dimensions,
      deliveryType,
      pickupDate: date.toISOString(),
      timeSlot,
      notes,
    };

    try {
      const res = await fetch(`${BASE_URL}/orders`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderData),
      });

      const data = await res.json();
      if (res.ok) {
        Alert.alert('Success', 'Order created successfully!');
        await AsyncStorage.setItem('currentOrderId', data.order._id);
        router.push('/order/ReviewPayment');
      } else {
        Alert.alert('Error', data.message || 'Something went wrong');
      }
    } catch (err) {
      console.error(err);
      Alert.alert('Error', 'Failed to connect to server');
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#F6F6F6' }}>
      <ScrollView
        style={{ backgroundColor: '#F6F6F6' }}
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.title}>Make Order</Text>

        {/* Sender Info */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Sender Information</Text>
          <View style={styles.row}>
            <TextInput style={styles.inputHalf} placeholder="Name" value={senderName} editable={false} />
            <TextInput style={styles.inputHalf} placeholder="Phone" value={senderPhone} editable={false} />
          </View>
        </View>

        {/* Receiver Info */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Receiver Information</Text>
          <Text style={styles.inputLabel}>Full Name</Text>
          <TextInput style={styles.input} placeholder="Full Name" value={receiverName} onChangeText={setReceiverName} />
          <Text style={styles.inputLabel}>Phone Number</Text>
          <TextInput style={styles.input} placeholder="Phone Number" value={receiverPhone} onChangeText={setReceiverPhone} keyboardType="phone-pad" />
          <Text style={styles.inputLabel}>Delivery Address</Text>
          <TextInput style={styles.input} placeholder="Delivery Address" value={deliveryAddress} onChangeText={setDeliveryAddress} multiline />
        </View>

        {/* Package Info */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Package Information</Text>
          <Text style={styles.inputLabel}>Package Type</Text>
          <TouchableOpacity onPress={() => setModalVisible(true)} style={[styles.input, styles.iconInput]}>
            <Text style={{ color: packageType ? '#000' : '#888' }}>{packageType || 'Select Package Type'}</Text>
            <Text style={{ fontSize: 16 }}>▼</Text>
          </TouchableOpacity>
          <View style={styles.row}>
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Weight</Text>
              <TextInput style={styles.inputHalf} placeholder="kg" value={weight} onChangeText={setWeight} keyboardType="numeric" />
            </View>
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Dimensions</Text>
              <TextInput
                style={styles.inputHalf}
                placeholder="cm³"
                value={dimensions}
                onChangeText={(text) => setDimensions(text.replace(/[^0-9]/g, ''))}
                keyboardType="numeric"
              />
            </View>
          </View>

          {/* Delivery Type Selection */}
          <Text style={[styles.sectionTitle, { marginTop: 10 }]}>Delivery Type</Text>
          <View style={styles.deliveryTypeRow}>
            <TouchableOpacity style={[styles.deliveryType, deliveryType === 'standard' && styles.activeDelivery]} onPress={() => setDeliveryType('standard')}>
              <View style={styles.dot} />
              <View>
                <Text style={styles.deliveryLabel}>Standard</Text>
                <Text style={styles.deliveryTime}>3 - 5 days</Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.deliveryType, deliveryType === 'express' && styles.activeDelivery]} onPress={() => setDeliveryType('express')}>
              <View style={styles.dot} />
              <View>
                <Text style={styles.deliveryLabel}>Express</Text>
                <Text style={styles.deliveryTime}>1 - 2 days</Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>

        {/* Pickup Schedule */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Pickup Schedule</Text>
          <View style={styles.row}>
            <View style={{ flex: 1, marginRight: 8 }}>
              <Text style={styles.inputLabel}>Date</Text>
              <TouchableOpacity style={[styles.input, styles.iconInput]} onPress={() => setShowDatePicker(true)}>
                <Text style={{ color: date ? '#000' : '#888' }}>{date ? date.toLocaleDateString() : 'dd/mm/yyyy'}</Text>
                <Ionicons name="calendar-outline" size={18} color="#888" />
              </TouchableOpacity>
              {showDatePicker && (
                <DateTimePicker
                  value={date || new Date()}
                  mode="date"
                  display="default"
                  onChange={(event, selectedDate) => {
                    setShowDatePicker(false);
                    if (selectedDate) setDate(selectedDate);
                  }}
                />
              )}
            </View>

            <View style={{ flex: 1 }}>
              <Text style={styles.inputLabel}>Time</Text>
              <TouchableOpacity style={[styles.input, styles.iconInput]} onPress={() => setShowTimeModal(true)}>
                <Text style={{ color: timeSlot ? '#000' : '#888' }}>{timeSlot || 'Select Time'}</Text>
                <Text style={{ fontSize: 16, color: '#888' }}>▼</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Notes */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Additional Notes (Optional)</Text>
          <TextInput style={[styles.input, { height: 80 }]} placeholder="Special instructions..." value={notes} onChangeText={setNotes} multiline />
        </View>

        {/* Submit Button */}
        <TouchableOpacity style={styles.button} onPress={handleOrderSubmit}>
          <Text style={styles.buttonText}>Proceed to Payment</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Package Modal */}
      <Modal visible={modalVisible} transparent animationType="slide">
        <Pressable style={styles.modalOverlay} onPress={() => setModalVisible(false)}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Select Package Type</Text>
            <FlatList
              data={PACKAGE_OPTIONS}
              keyExtractor={(item) => item}
              renderItem={({ item }) => (
                <TouchableOpacity onPress={() => { setPackageType(item); setModalVisible(false); }} style={styles.modalOption}>
                  <Text style={styles.modalText}>{item}</Text>
                </TouchableOpacity>
              )}
            />
          </View>
        </Pressable>
      </Modal>

      {/* Time Slot Modal */}
      <Modal visible={showTimeModal} transparent animationType="slide">
        <Pressable style={styles.modalOverlay} onPress={() => setShowTimeModal(false)}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Select Time Slot</Text>
            <FlatList
              data={TIME_SLOTS}
              keyExtractor={(item) => item}
              renderItem={({ item }) => (
                <TouchableOpacity onPress={() => { setTimeSlot(item); setShowTimeModal(false); }} style={styles.modalOption}>
                  <Text style={styles.modalText}>{item}</Text>
                </TouchableOpacity>
              )}
            />
          </View>
        </Pressable>
      </Modal>

      <BottomNav activeTab="Home" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    paddingBottom: 60,
    backgroundColor: '#F6F6F6',
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    textAlign: 'center',
    marginVertical: 20,
    color: '#39335E',
  },
  sectionTitle: {
    fontWeight: '500',
    fontSize: 16,
    marginBottom: 10,
    color: '#39335E',
  },
  inputLabel: {
    fontSize: 13,
    fontWeight: '500',
    marginBottom: 4,
    color: '#39335E',
  },
  input: {
    backgroundColor: '#f3f3f3',
    padding: 12,
    borderRadius: 10,
    marginBottom: 12,
    fontSize: 14,
    color: '#000',
  },
  iconInput: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  inputGroup: {
    flex: 1,
    marginRight: 8,
  },
  inputHalf: {
    flex: 1,
    backgroundColor: '#f3f3f3',
    padding: 12,
    borderRadius: 10,
    marginBottom: 12,
    fontSize: 14,
    marginRight: 8,
    color: '#000',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  deliveryTypeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 12,
  },
  deliveryType: {
    flex: 1,
    backgroundColor: '#f3f3f3',
    padding: 14,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 12,
  },
  activeDelivery: {
    borderWidth: 2,
    borderColor: '#6C63FF',
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#6C63FF',
    marginRight: 12,
  },
  deliveryLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#39335E',
  },
  deliveryTime: {
    fontSize: 12,
    color: '#888',
  },
  card: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#6C63FF',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 30,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  modalContent: {
    backgroundColor: '#fff',
    padding: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: 300,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
    color: '#39335E',
  },
  modalOption: {
    paddingVertical: 12,
  },
  modalText: {
    fontSize: 16,
    color: '#39335E',
  },
});

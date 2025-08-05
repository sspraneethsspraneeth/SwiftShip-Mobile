import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  ScrollView,
  StyleSheet,
} from 'react-native';
import { useRouter } from 'expo-router';
import BottomNav from '../../components/BottomNav';

export default function Pricing() {
  const router = useRouter();
  const [deliveryType, setDeliveryType] = useState('Standard');
  const [selectedRate, setSelectedRate] = useState('');

  const rateOptions = [
    {
      label: '0–1kg',
      std: '₹50',
      express: '₹100',
    },
    {
      label: '1–5kg',
      std: '₹150',
      express: '₹250',
      tag: 'Most Popular',
    },
    {
      label: '5kg+',
      std: '₹250',
      express: '₹400',
    },
  ];

  return (
    <View style={styles.wrapper}>
      <ScrollView contentContainerStyle={styles.scroll}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
  onPress={() => router.back()}
  style={{ position: 'absolute', left: 0 }}
>
  <Text style={styles.backArrow}>{'←'}</Text>
</TouchableOpacity>

          <Text style={styles.title}>Pricing</Text>
        </View>

        {/* Form Section */}
        <View style={styles.card}>
          <View style={styles.row}>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>From</Text>
              <TextInput
                style={styles.input}
                placeholder="From Location"
                placeholderTextColor="#999"
              />
            </View>
            <View style={[styles.inputGroup, { marginLeft: 10 }]}>
              <Text style={styles.label}>To</Text>
              <TextInput
                style={styles.input}
                placeholder="To Location"
                placeholderTextColor="#999"
              />
            </View>
          </View>

          <Text style={styles.label}>Weight (kg)</Text>
          <View style={styles.inputWithIcon}>
            <Image source={require('../../assets/icons/bag.png')} style={styles.inputIcon} />
            <TextInput
              style={styles.textInputWithIcon}
              placeholder="Enter weight"
              keyboardType="numeric"
              placeholderTextColor="#999"
            />
          </View>

          <Text style={styles.label}>Delivery Type</Text>
          <View style={styles.radioRow}>
            {['Standard', 'Express'].map((type) => (
              <TouchableOpacity
                key={type}
                style={[styles.radioBox]}
                onPress={() => setDeliveryType(type)}
              >
                <View
                  style={[
                    styles.radioOuter,
                    {
                      borderColor: deliveryType === type ? '#6C63FF' : '#888',
                    },
                  ]}
                >
                  {deliveryType === type && <View style={styles.radioInner} />}
                </View>
                <Text
                  style={[
                    styles.radioLabel,
                    deliveryType === type && styles.radioLabelActive,
                  ]}
                >
                  {type}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Offer Box */}
        <View style={styles.offerBox}>
          <Image source={require('../../assets/icons/star.png')} style={styles.offerIcon} />
          <View>
            <Text style={styles.offerTitle}>Special Offer!</Text>
            <Text style={styles.offerSubtitle}>Get 10% off on your first 3 orders</Text>
          </View>
        </View>

        {/* Rate Table */}
        <View style={styles.rateTable}>
          <Text style={styles.sectionTitle}>Rate Table</Text>
          {rateOptions.map((option, index) => (
  <TouchableOpacity
    key={index}
    onPress={() => setSelectedRate(option.label)}
    style={[
      styles.rateCard,
      selectedRate === option.label && styles.rateCardActive,
    ]}
  >
    <Image
      source={require('../../assets/icons/package.png')}
      style={styles.packageIcon}
    />
    <View style={styles.rateDetails}>
      <View style={styles.rowLabelColumn}>
  <Text style={styles.weightLabel}>{option.label}</Text>
  {option.tag && <Text style={styles.popular}>{option.tag}</Text>}
</View>

    </View>

    <View style={styles.ratePriceBlock}>
      <View style={styles.rateColumn}>
        <Text style={styles.rateLabel}>Standard</Text>
        <Text style={styles.rateValue}>{option.std}</Text>
      </View>
      <View style={styles.rateColumn}>
        <Text style={styles.rateLabel}>Express</Text>
        <Text style={[styles.rateValue, { color: '#6C63FF' }]}>
          {option.express}
        </Text>
      </View>
    </View>
  </TouchableOpacity>
))}

        </View>

        {/* Extra Charges */}
        <View style={styles.extraCharges}>
            <Text style={styles.sectionTitle}>Additional Charges</Text>
          <View style={styles.chargeRow}>
  <Text style={styles.chargeItem}>Insurance (Optional)</Text>
  <Text style={styles.chargeValue}>₹20</Text>
</View>
<View style={styles.chargeRow}>
  <Text style={styles.chargeItem}>GST (18%)</Text>
  <Text style={styles.chargeValue}>As applicable</Text>
</View>
<View style={styles.chargeRow}>
  <Text style={styles.chargeItem}>Fuel Surcharge</Text>
  <Text style={styles.chargeValue}>₹15</Text>
</View>

        </View>

        {/* Make Order Button */}
        <TouchableOpacity
          style={styles.orderBtn}
          onPress={() => router.push('/order/make-order')}
        >
          <Text style={styles.orderBtnText}>Make Order</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Bottom Navigation */}
      <BottomNav activeTab="Home" />
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: 40,
    
  },
  scroll: {
    padding: 20,
    paddingBottom: 80,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
     justifyContent: 'center', // center the title
  marginBottom: 16,
  position: 'relative',     // allow absolute positioning of back arrow
  },
  backArrow: {
    fontSize: 22,
    marginRight: 10,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#222',
    textAlign: 'center',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  inputGroup: {
    flex: 1,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 6,
    color: '#444',
  },
  input: {
    backgroundColor: '#f2f2f2',
    padding: 12,
    borderRadius: 10,
    marginBottom: 12,
    fontSize: 14,
  },
  inputWithIcon: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f2f2f2',
    paddingHorizontal: 10,
    borderRadius: 10,
    marginBottom: 12,
  },
  inputIcon: {
    width: 18,
    height: 18,
    marginRight: 8,
    tintColor: '#888',
  },
  textInputWithIcon: {
    flex: 1,
    paddingVertical: 10,
    fontSize: 14,
  },
  card: {
    backgroundColor: '#fafafa',
    padding: 16,
    borderRadius: 14,
    marginBottom: 20,
  },
  radioRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  radioBox: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderRadius: 10,
    marginHorizontal: 5,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ccc',
  },
  radioOuter: {
    width: 18,
    height: 18,
    borderRadius: 9,
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  radioInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#6C63FF',
  },
  radioLabel: {
    fontSize: 14,
    color: '#888',
  },
  radioLabelActive: {
    color: '#6C63FF',
    fontWeight: '600',
  },
  offerBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#8b75ff',
    padding: 14,
    borderRadius: 12,
    marginBottom: 20,
  },
  offerIcon: {
    width: 30,
    height: 30,
    tintColor: '#fff',
    marginRight: 10,
  },
  offerTitle: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
    bottom: 5,
  },
  offerSubtitle: {
    color: '#fff',
    fontSize: 12,
  },
  rateTable: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#333',
  },
  rateCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    padding: 14,
    borderRadius: 12,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: 'transparent',
    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
  },
  rateCardActive: {
    backgroundColor: '#ffffff',
    borderColor: '#836EFE',
  },
  packageIcon: {
    width: 40,
    height: 40,
    marginRight: 10,
  },
  rateDetails: {
    flex: 1,
  },
  rowLabel: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rowLabelColumn: {
  flexDirection: 'column',
},

  weightLabel: {
    fontWeight: '400',
    fontSize: 14,
    color: '#444',
    left: 4,
  },
  popular: {
    backgroundColor: '#ffffff',
    color: '#6C63FF',
    fontSize: 11,
    fontWeight: '400',
    marginLeft: 0,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  price: {
    color: '#666',
    fontSize: 13,
    marginTop: 2,
  },
  ratePriceBlock: {
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'flex-end',
},

  rateColumn: {
  alignItems: 'center',
  marginLeft: 16,
},
rateLabel: {
  fontSize: 12,
  color: '#888',
  fontWeight: '500',
},
rateValue: {
  fontSize: 14,
  fontWeight: '600',
  marginTop: 4,
  color: '#444',
},

  extraCharges: {
    marginBottom: 30,
  },
  chargeItem: {
    fontSize: 14,
    color: '#444',
    marginBottom: 8,
  },
  chargeValue: {
    fontWeight: '600',
    color: '#000',
    alignItems: 'flex-end',
  },
  chargeRow: {
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: 8,
},

  orderBtn: {
    backgroundColor: '#6C63FF',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 10,
  },
  orderBtnText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

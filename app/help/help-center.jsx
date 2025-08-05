import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Image,
} from 'react-native';
import { useRouter } from 'expo-router';
import BottomNav from '../../components/BottomNav';

export default function HelpCenter() {
  const router = useRouter();
  const [expanded, setExpanded] = useState(null);
  const complaintOptions = ['Late Delivery', 'Damaged Package', 'Wrong Address', 'Others'];
const [selectedComplaint, setSelectedComplaint] = useState('');
const [dropdownVisible, setDropdownVisible] = useState(false);

  
  const faqs = [
    'How to track my shipment',
    'How to cancel an order?',
    'What are the delivery charges?',
    'What if my package gets damaged?',
  ];

  const handleToggle = (index) => {
    setExpanded(expanded === index ? null : index);
  };

  return (
    <View style={styles.wrapper}>
      <ScrollView contentContainerStyle={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <Text style={styles.backArrow}>←</Text>
          </TouchableOpacity>
          <Text style={styles.title}>Help Center</Text>
        </View>

        {/* FAQs */}
        <Text style={styles.subheading}>Frequently Asked Questions</Text>
       {faqs.map((question, index) => (
  <View key={index} style={styles.accordion}>
    <TouchableOpacity
      onPress={() => handleToggle(index)}
      style={styles.accordionHeader}
    >
      <Text style={styles.accordionTitle}>{question}</Text>
      <Text style={styles.accordionArrow}>{expanded === index ? '⌃' : '⌄'}</Text>
    </TouchableOpacity>
    {expanded === index && (
      <Text style={styles.accordionBody}>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse sit amet.
      </Text>
    )}
  </View>
))}


        {/* Support Options */}
        <Text style={styles.subheading}>Contact Support</Text>

        <View style={styles.supportCard}>
          <Image
            source={require('../../assets/icons/livechat.png')}
            style={styles.supportIcon}
          />
          <View>
            <Text style={styles.supportTitle}>Live Chat</Text>
            <Text style={styles.supportSubtitle}>Avg. response time: 2 mins</Text>
          </View>
        </View>

        <View style={styles.supportCard}>
          <Image
            source={require('../../assets/icons/calll.png')}
            style={styles.supportIcon}
          />
          <View>
            <Text style={styles.supportTitle}>Call Us</Text>
            <Text style={styles.supportSubtitle}>Available 24/7</Text>
          </View>
        </View>

        <View style={styles.supportCard}>
          <Image
            source={require('../../assets/icons/mail.png')}
            style={styles.supportIcon}
          />
          <View>
            <Text style={styles.supportTitle}>Email US</Text>
            <Text style={styles.supportSubtitle}>Support@swiftship.com</Text>
          </View>
        </View>

        {/* Raise Complaint */}
        <Text style={styles.subheading}>Raise a Complaint</Text>
        <Text style={styles.sectionTitle}>Category</Text>
<TouchableOpacity
  style={styles.dropdown}
  onPress={() => setDropdownVisible(!dropdownVisible)}
  activeOpacity={0.8}
>
  <Text style={styles.dropdownText}>
    {selectedComplaint || 'Select Complaint type'}
  </Text>
  <Image
    source={require('../../assets/icons/arrow-down.png')}
    style={styles.dropdownArrow}
  />
</TouchableOpacity>

{dropdownVisible &&
  complaintOptions.map((option, idx) => (
    <TouchableOpacity
      key={idx}
      style={styles.dropdownItem}
      onPress={() => {
        setSelectedComplaint(option);
        setDropdownVisible(false);
      }}
    >
      <Text style={styles.dropdownItemText}>{option}</Text>
    </TouchableOpacity>
  ))}

        <Text style={styles.sectionTitle}>Order ID (Optional)</Text>
        <TextInput
          style={styles.input}
          placeholder="LP-12345"
          placeholderTextColor="#bbb"
        />
        <Text style={styles.sectionTitle}>Message</Text>
        <TextInput
          style={[styles.input, { height: 100 }]}
          placeholder="Describe your issue in detail..."
          placeholderTextColor="#bbb"
          multiline
        />
        <TouchableOpacity style={styles.submitBtn}>
          <Text style={styles.submitText}>Submit Complaint</Text>
        </TouchableOpacity>
      </ScrollView>
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
  container: {
    padding: 20,
    paddingBottom: 80,
  },
  header: {
    position: 'relative',
    alignItems: 'center',
    marginBottom: 20,
  },
  backButton: {
    position: 'absolute',
    left: 0,
    top: 2,
  },
  backArrow: {
    fontSize: 22,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: '#3A2F66',
  },
  subheading: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#3A2F66',
    marginBottom: 10,
    marginTop: 20,
  },
  accordion: {
    backgroundColor: '#ffffff',
    padding: 14,
    borderRadius: 10,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  accordionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#3A2F66',
  },
  accordionBody: {
    fontSize: 13,
    marginTop: 8,
    color: '#555',
  },
  accordionHeader: {
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'center',
},
accordionArrow: {
  fontSize: 16,
  color: '#3A2F66',
  fontWeight: '600',
},

  supportCard: {
    flexDirection: 'row',
    backgroundColor: '#ffffff',
    borderRadius: 10,
    padding: 12,
    alignItems: 'center',
    marginBottom: 12,
    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
  },
  supportIcon: {
    width: 40,
    height: 40,
    marginRight: 10,
    resizeMode: 'contain',
    
  },
  supportTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#3A2F66',
    bottom: 4,
  },
  supportSubtitle: {
    fontSize: 12,
    color: '#888',
  },
  dropdown: {
  backgroundColor: '#f1f1f1',
  padding: 12,
  borderRadius: 10,
  marginBottom: 10,
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'center',
},
dropdownText: {
  color: '#727272',
  fontSize: 14,
  fontWeight: '400',
},
dropdownArrow: {
  width: 10,
  height: 10,
  tintColor: '#888',
},
dropdownItem: {
  backgroundColor: '#f9f9f9',
  padding: 12,
  borderRadius: 10,
  marginBottom: 8,
  borderWidth: 1,
  borderColor: '#eee',
},
dropdownItemText: {
  fontSize: 14,
  color: '#333',
},

  input: {
    backgroundColor: '#f1f1f1',
    padding: 12,
    borderRadius: 10,
    marginBottom: 12,
    fontSize: 14,
    color: '#000',
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: '500',
    marginBottom: 12,
    color: '#39335E',
    fontFamily: 'Montserrat',
  },
  submitBtn: {
    backgroundColor: '#6C63FF',
    paddingVertical: 16,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 8,
  },
  submitText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Image,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Platform,
  Modal,
  Pressable,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { useRouter, useLocalSearchParams } from 'expo-router';
import DateTimePicker from '@react-native-community/datetimepicker';
import Toast from 'react-native-toast-message';
import { BASE_URL } from '../../constants/api'; // Adjust the path as per file location


export default function FillProfile() {
  const router = useRouter();
  const { email } = useLocalSearchParams();

  const [form, setForm] = useState({
    fullName: '',
    nickName: '',
    dob: '',
    email: email || '',
    phone: '',
    gender: '',
  });

  const [imageUri, setImageUri] = useState(null);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [genderModalVisible, setGenderModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const pickImage = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      alert('Permission to access gallery is required!');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
      base64: true,
    });

    if (!result.canceled) {
      const base64Img = `data:image/jpeg;base64,${result.assets[0].base64}`;
      setImageUri(base64Img);
    }
  };

  const handleDateChange = (event, date) => {
    setShowDatePicker(false);
    if (date) {
      setSelectedDate(date);
      const formatted = date.toISOString().split('T')[0];
      handleChange('dob', formatted);
    }
  };

  const handleSubmit = async () => {
  if (!form.fullName || !form.email || !form.phone || !form.gender || !form.dob) {
    Toast.show({
      type: 'error',
      text1: 'Missing Fields',
      text2: 'Please fill all required fields.',
    });
    return;
  }

  setLoading(true);

  try {
    const response = await fetch(`${BASE_URL}/profile/save`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: form.email,
        fullName: form.fullName,
        nickName: form.nickName,
        dob: form.dob,
        phone: form.phone,
        gender: form.gender,
        image: imageUri,
      }),
    });

    const contentType = response.headers.get('content-type');

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(errorText);
    }

    if (!contentType || !contentType.includes('application/json')) {
      throw new Error('Server did not return JSON');
    }

    const data = await response.json();

    Toast.show({
      type: 'success',
      text1: 'Profile Updated',
      text2: 'Your profile has been saved!',
    });
    router.push('/profile/location'); // Navigate to next step
  } catch (err) {
    console.error('Error saving profile:', err);
    Toast.show({
      type: 'error',
      text1: 'Server Error',
      text2: 'Failed to save profile. Check console for more.',
    });
  } finally {
    setLoading(false);
  }
};


  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 32 }}>
      <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
        <Text style={styles.backArrow}>←</Text>
      </TouchableOpacity>

      <Text style={styles.title}>Fill Your Profile</Text>

      <View style={styles.imageWrapper}>
        <Image
          source={
            imageUri ? { uri: imageUri } : require('../../assets/icons/default-avatar.png')
          }
          style={styles.profileImage}
        />
        <TouchableOpacity style={styles.editIconWrapper} onPress={pickImage}>
          <Image source={require('../../assets/icons/Vector.png')} style={styles.editIcon} />
        </TouchableOpacity>
      </View>

      <View style={styles.inputBox}>
        <TextInput
          placeholder="Full Name"
          style={styles.input}
          value={form.fullName}
          onChangeText={(text) => handleChange('fullName', text)}
        />
        <TextInput
          placeholder="Nick Name"
          style={styles.input}
          value={form.nickName}
          onChangeText={(text) => handleChange('nickName', text)}
        />
        <TouchableOpacity onPress={() => setShowDatePicker(true)} style={styles.inputWithIcon}>
          <TextInput
            placeholder="Date of Birth"
            style={styles.inputWithText}
            value={form.dob}
            editable={false}
            pointerEvents="none"
          />
          <Image source={require('../../assets/icons/Calender.png')} style={styles.iconRight} />
        </TouchableOpacity>
        <TextInput
          placeholder="Email"
          style={styles.input}
          keyboardType="email-address"
          value={form.email}
          onChangeText={(text) => handleChange('email', text)}
        />
        <TextInput
          placeholder="Phone Number"
          style={styles.input}
          keyboardType="phone-pad"
          value={form.phone}
          onChangeText={(text) => handleChange('phone', text)}
        />
        <TouchableOpacity onPress={() => setGenderModalVisible(true)} style={styles.inputWithIcon}>
          <Text style={[styles.inputWithText, { color: form.gender ? '#000' : '#999' }]}>
            {form.gender || 'Gender'}
          </Text>
          <Image source={require('../../assets/icons/arrow.png')} style={styles.iconRight} />
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.continueBtn} onPress={handleSubmit} disabled={loading}>
        <Text style={styles.continueText}>{loading ? 'Saving...' : 'Continue'}</Text>
      </TouchableOpacity>

      {showDatePicker && (
        <DateTimePicker
          value={selectedDate}
          mode="date"
          display={Platform.OS === 'ios' ? 'spinner' : 'default'}
          onChange={handleDateChange}
          maximumDate={new Date()}
        />
      )}

      <Modal
        animationType="slide"
        transparent={true}
        visible={genderModalVisible}
        onRequestClose={() => setGenderModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            {['Male', 'Female', 'Other'].map((gender) => (
              <Pressable
                key={gender}
                onPress={() => {
                  handleChange('gender', gender);
                  setGenderModalVisible(false);
                }}
                style={styles.modalOption}
              >
                <Text style={styles.modalText}>{gender}</Text>
              </Pressable>
            ))}
          </View>
        </View>
      </Modal>

      <Toast />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 24,
    paddingTop: 40,
    backgroundColor: '#fff',
    flex: 1,
  },
  backBtn: {
    marginBottom: 12,
  },
  backArrow: {
    fontSize: 22,
    color: '#000',
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    textAlign: 'center',
    color: '#39335E',
    marginBottom: 20,
  },
  imageWrapper: {
    alignItems: 'center',
    marginBottom: 20,
    position: 'relative',
  },
  profileImage: {
    width: 110,
    height: 110,
    borderRadius: 55,
    resizeMode: 'cover',
  },
  editIconWrapper: {
    position: 'absolute',
    bottom: 4,
    right: 110,
    backgroundColor: '#836EFE',
    borderRadius: 6,
    padding: 6,
  },
  editIcon: {
    width: 14,
    height: 14,
    tintColor: '#fff',
  },
  inputBox: {
    gap: 12,
  },
  input: {
    backgroundColor: '#F6F6F6',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 14,
    fontFamily: 'montserrat',
    color: '#000',
  },
  inputWithIcon: {
    backgroundColor: '#F6F6F6',
    borderRadius: 8,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },
  inputWithText: {
    flex: 1,
    paddingVertical: 14,
    fontSize: 14,
    fontFamily: 'montserrat',
  },
  iconRight: {
    width: 18,
    height: 18,
    tintColor: '#999',
  },
  continueBtn: {
    backgroundColor: '#836EFE',
    marginTop: 30,
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
  },
  continueText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
    fontFamily: 'montserrat',
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  modalContent: {
    backgroundColor: '#fff',
    padding: 20,
    borderTopRightRadius: 20,
    borderTopLeftRadius: 20,
  },
  modalOption: {
    paddingVertical: 14,
  },
  modalText: {
    fontSize: 16,
    fontFamily: 'montserrat',
    textAlign: 'center',
  },
});

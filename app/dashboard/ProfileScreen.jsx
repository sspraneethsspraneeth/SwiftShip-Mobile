import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Toast from 'react-native-toast-message';
import { useNavigation } from '@react-navigation/native';
import BottomNav from '../../components/BottomNav';
import { BASE_URL } from '../../constants/api';

export default function ProfileScreen() {
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState({
    fullName: '',
    email: '',
    phone: '',
    imageUri: null,
  });

  const navigation = useNavigation();

  useEffect(() => {
    const loadUser = async () => {
      const token = await AsyncStorage.getItem('token');
      const email = await AsyncStorage.getItem('email');

      try {
        const res = await fetch(`${BASE_URL}/user?email=${email}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();

        if (res.ok) {
          setProfile({
            fullName: data.user.fullName || '',
            email: data.user.email || '',
            phone: data.user.phone || '',
            imageUri: data.user.image || null,
          });

          await AsyncStorage.setItem('fullName', data.user.fullName || '');
          await AsyncStorage.setItem('phone', data.user.phone || '');
        } else {
          Toast.show({
            type: 'error',
            text1: 'Failed to load profile',
            text2: data.message || 'Unexpected error',
          });
        }
      } catch (err) {
        console.error('Fetch error:', err);
        Toast.show({
          type: 'error',
          text1: 'Server error',
          text2: 'Could not fetch profile data',
        });
      }
    };

    loadUser();
  }, []);

  const handleChange = (key, value) => {
    setProfile((prev) => ({ ...prev, [key]: value }));
  };

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      base64: true,
      quality: 1,
    });

    if (!result.canceled) {
      const base64Img = `data:image/jpeg;base64,${result.assets[0].base64}`;
      handleChange('imageUri', base64Img);
      Toast.show({ type: 'success', text1: 'Image selected successfully' });
    }
  };

  const saveProfile = async () => {
    const token = await AsyncStorage.getItem('token');
    try {
      const res = await fetch(`${BASE_URL}/profile/save`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(profile),
      });

      const data = await res.json();
      if (res.ok) {
        Toast.show({ type: 'success', text1: 'Profile updated successfully' });
        setIsEditing(false);
      } else {
        Toast.show({
          type: 'error',
          text1: 'Update failed',
          text2: data.message || '',
        });
      }
    } catch (err) {
      console.error('Update error:', err);
      Toast.show({
        type: 'error',
        text1: 'Server error',
        text2: 'Could not update profile',
      });
    }
  };

  const handleLogout = async () => {
    const token = await AsyncStorage.getItem('token');
    try {
      await fetch(`${BASE_URL}/logout`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
      });
    } catch (err) {
      console.error('Logout failed', err);
    }
    await AsyncStorage.multiRemove(['token', 'email']);
    Toast.show({ type: 'success', text1: 'Logged out successfully' });

    setTimeout(() => {
      navigation.reset({ index: 0, routes: [{ name: 'auth/login' }] });
    }, 1000);
  };

  /** ---------------------------
   * Dynamic Inputs for Editing
   * --------------------------- */
  const editableFields = [
    { key: 'fullName', placeholder: 'Full Name', editable: true },
    { key: 'email', placeholder: 'Email', editable: false },
    { key: 'phone', placeholder: 'Phone Number', editable: true },
  ];

 
  const menuItems = [
    { label: 'My Orders', icon: require('../../assets/icons/clipboard-text.png'), count: 2 },
    { label: 'Address', icon: require('../../assets/icons/location1.png') },
    { label: 'Payments Methods', icon: require('../../assets/icons/empty-wallet.png') },
    { label: 'Offers', icon: require('../../assets/icons/tag.png'), count: 2 },
    { label: 'Support', icon: require('../../assets/icons/phone-call.png') },
    { label: 'Logout', icon: require('../../assets/icons/lock.png'), onPress: handleLogout },
  ];

  return (
    <View style={{ flex: 1, backgroundColor: '#fff' }}>
      <ScrollView contentContainerStyle={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.backArrow}>←</Text>
          <Text style={styles.headerTitle}>Profile</Text>
          <TouchableOpacity>
            <Image source={require('../../assets/icons/search.png')} style={styles.searchIcon} />
          </TouchableOpacity>
        </View>

        {/* Avatar */}
        <View style={styles.avatarContainer}>
          <Image
            source={
              profile.imageUri
                ? { uri: profile.imageUri }
                : require('../../assets/icons/default-avatar.png')
            }
            style={styles.avatar}
          />
          <TouchableOpacity style={styles.editPic} onPress={pickImage}>
            <Image source={require('../../assets/icons/Vector.png')} style={styles.editIcon} />
          </TouchableOpacity>
        </View>

        {/* Info Card */}
        <View style={styles.infoCard}>
          <View style={{ flex: 1 }}>
            {isEditing ? (
              editableFields.map((field) => (
                <TextInput
                  key={field.key}
                  value={profile[field.key]}
                  onChangeText={(text) => handleChange(field.key, text)}
                  editable={field.editable}
                  placeholder={field.placeholder}
                  style={[
                    styles.input,
                    !field.editable && { backgroundColor: '#eee' },
                  ]}
                />
              ))
            ) : (
              <>
                <Text style={styles.name}>{profile.fullName}</Text>
                <Text style={styles.email}>{profile.email}</Text>
                <Text style={styles.phone}>{profile.phone}</Text>
              </>
            )}
          </View>
          <TouchableOpacity onPress={() => (isEditing ? saveProfile() : setIsEditing(true))}>
            <Text style={styles.editText}>{isEditing ? 'Save' : 'Edit'}</Text>
          </TouchableOpacity>
        </View>

        {/* Menu Items */}
        {menuItems.map((item, idx) => (
          <TouchableOpacity
            key={idx}
            style={styles.menuItem}
            onPress={item.onPress}
          >
            <View style={styles.menuLeft}>
              <Image source={item.icon} style={styles.menuIcon} />
              <Text style={styles.menuText}>{item.label}</Text>
            </View>
            {item.count && (
              <View style={styles.badge}>
                <Text style={styles.badgeText}>{item.count}</Text>
              </View>
            )}
          </TouchableOpacity>
        ))}
      </ScrollView>

      <BottomNav activeTab="Profile" />
      <Toast />
    </View>
  );
}

/** ---------------------------
 * Styles
 * --------------------------- */
const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    paddingTop: 50,
    paddingHorizontal: 24,
    paddingBottom: 100,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 30,
  },
  backArrow: { fontSize: 22, color: '#000' },
  headerTitle: { fontSize: 18, fontWeight: '700', color: '#39335E' },
  searchIcon: { width: 20, height: 20, tintColor: '#39335E' },

  avatarContainer: { alignItems: 'center', marginBottom: 12, position: 'relative' },
  avatar: { width: 90, height: 90, borderRadius: 45, resizeMode: 'cover' },
  editPic: {
    position: 'absolute',
    bottom: 0,
    right: 130,
    backgroundColor: '#6C63FF',
    borderRadius: 10,
    padding: 6,
  },
  editIcon: { width: 14, height: 14, tintColor: '#fff' },

  infoCard: {
    backgroundColor: '#F6F6F6',
    borderRadius: 16,
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 30,
  },
  name: { fontSize: 15, fontWeight: '700', color: '#39335E', bottom: 5 },
  email: { fontSize: 13, color: '#999', bottom: 5 },
  phone: { fontSize: 13, color: '#999' },
  editText: { color: '#6C63FF', fontWeight: '600', fontSize: 13 },
  input: {
    backgroundColor: '#fff',
    paddingVertical: 6,
    paddingHorizontal: 10,
    marginBottom: 6,
    borderRadius: 6,
    fontSize: 14,
    color: '#000',
  },

  menuItem: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 16 },
  menuLeft: { flexDirection: 'row', alignItems: 'center' },
  menuIcon: { width: 20, height: 20, marginRight: 16, tintColor: '#474D66' },
  menuText: { fontSize: 15, color: '#39335E' },
  badge: {
    backgroundColor: '#39335E',
    width: 20,
    height: 20,
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
  },
  badgeText: { color: '#fff', fontSize: 12, fontWeight: '600' },
});

import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Image,
  Dimensions,
  Alert,
} from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { BASE_URL } from '../../constants/api'; // Adjust the path as per file location

import AsyncStorage from '@react-native-async-storage/async-storage'; // Add at the top if not already


export default function LocationScreen() {
  const router = useRouter();
  const { email } = useLocalSearchParams();
  const mapRef = useRef(null); // ✅ Map reference

  const [locationName, setLocationName] = useState('');
  const [location, setLocation] = useState({
    latitude: 11.0168,
    longitude: 76.9558,
  });

  const handleSearch = async () => {
    if (!locationName) {
      Alert.alert('Enter a location name');
      return;
    }

    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(
          locationName
        )}&format=json&limit=1`
      );
      const data = await res.json();
      if (data.length === 0) {
        Alert.alert('No location found');
        return;
      }

      const { lat, lon } = data[0];
      const newLocation = {
        latitude: parseFloat(lat),
        longitude: parseFloat(lon),
      };
      setLocation(newLocation);

      // ✅ Auto-center the map
      mapRef.current?.animateToRegion(
        {
          ...newLocation,
          latitudeDelta: 0.05,
          longitudeDelta: 0.05,
        },
        1000
      );
    } catch (err) {
      Alert.alert('Failed to find location');
      console.error(err);
    }
  };

 const handleContinue = async () => {
  if (!locationName) {
    Alert.alert('Please search a location first');
    return;
  }

  try {
    const response = await fetch(`${BASE_URL}/profile/location`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ place: locationName }),
    });

    const data = await response.json();

    if (!response.ok) {
      Alert.alert(data.message || 'Failed to save location');
    } else {
      
      Alert.alert('Location saved');
      router.push('/auth/loginScreen');
    }
  } catch (err) {
    Alert.alert('Server error');
    console.error('Error saving location:', err);
  }
};


  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
        <Text style={styles.backArrow}>←</Text>
      </TouchableOpacity>

      <Text style={styles.title}>Pin Your Location</Text>

      <View style={styles.mapContainer}>
        <MapView
          ref={mapRef} // ✅ Attach ref
          style={styles.map}
          initialRegion={{
            ...location,
            latitudeDelta: 0.05,
            longitudeDelta: 0.05,
          }}
          region={{
            ...location,
            latitudeDelta: 0.05,
            longitudeDelta: 0.05,
          }}
        >
          <Marker
            coordinate={location}
            draggable
            onDragEnd={(e) => setLocation(e.nativeEvent.coordinate)}
          />
        </MapView>
      </View>

      <View style={styles.floatingCard}>
        <View style={styles.row}>
          <Image
            source={require('../../assets/icons/location.png')}
            style={styles.iconLocation}
          />
          <View>
            <Text style={styles.label}>Location</Text>
            <Text style={styles.locationText}>{locationName || 'Search a place'}</Text>
          </View>
        </View>

        <View style={styles.searchWrapper}>
          <Image
            source={require('../../assets/icons/search.png')}
            style={styles.iconSearch}
          />
          <TextInput
            placeholder="Search"
            placeholderTextColor="#999"
            style={styles.searchInput}
            value={locationName}
            onChangeText={setLocationName}
            onSubmitEditing={handleSearch}
          />
        </View>
      </View>

      <TouchableOpacity style={styles.continueBtn} onPress={handleContinue}>
        <Text style={styles.continueText}>Continue</Text>
      </TouchableOpacity>
    </View>
  );
}

const screenHeight = Dimensions.get('window').height;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  backBtn: {
    position: 'absolute',
    top: 50,
    left: 20,
    zIndex: 10,
    padding: 5,
    backgroundColor: 'transparent',
  },
  backArrow: { fontSize: 18, color: '#000' },
  title: {
    marginTop: 50,
    textAlign: 'center',
    fontSize: 18,
    fontWeight: '700',
    color: '#39335E',
  },
  mapContainer: {
    marginTop: 20,
    height: screenHeight * 0.8,
    overflow: 'hidden',
    borderRadius: 20,
    marginHorizontal: 20,
  },
  map: { flex: 1 },
  floatingCard: {
    position: 'absolute',
    top: screenHeight * 0.15,
    left: 30,
    right: 30,
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    zIndex: 5,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
    elevation: 6,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  iconLocation: {
    width: 20,
    height: 20,
    resizeMode: 'contain',
    tintColor: '#6C63FF',
    marginRight: 10,
  },
  label: { fontSize: 12, color: '#999' },
  locationText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6C63FF',
    marginTop: 2,
  },
  searchWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f2f2f2',
    borderRadius: 8,
    paddingHorizontal: 10,
  },
  iconSearch: {
    width: 18,
    height: 18,
    marginRight: 8,
    tintColor: '#999',
    resizeMode: 'contain',
  },
  searchInput: {
    flex: 1,
    paddingVertical: 10,
    fontSize: 14,
    color: '#000',
  },
  continueBtn: {
    position: 'absolute',
    bottom: 30,
    left: 20,
    right: 20,
    backgroundColor: '#836EFE',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    zIndex: 2,
  },
  continueText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 16,
  },
});

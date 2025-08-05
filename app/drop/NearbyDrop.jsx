import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Linking,
  ScrollView,
} from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import BottomNav from '../../components/BottomNav';

const dropPoints = [
  {
    id: 1,
    name: 'Downtown Hub',
    status: 'Open',
    rating: 4.5,
    address: '123 Main Street, Downtown',
    distance: '1.2 km',
    time: '9 AM - 9 PM',
    latitude: 11.0168,
    longitude: 76.9558,
    phone: 'tel:+911234567890',
  },
  {
    id: 2,
    name: 'Mall Plaza Centre',
    status: 'Open',
    rating: 4.8,
    address: '456 Shopping Ave, Central',
    distance: '2.5 km',
    time: '10 AM - 10 PM',
    latitude: 11.0175,
    longitude: 76.9575,
    phone: 'tel:+911234567891',
  },
  {
    id: 3,
    name: 'Airport Terminal',
    status: 'Closed',
    rating: 4.2,
    address: '789 Airport Road, Terminal 2',
    distance: '5.1 km',
    time: '6 AM - 11 PM',
    latitude: 11.0288,
    longitude: 76.9181,
    phone: 'tel:+911234567892',
  },
  {
    id: 4,
    name: 'University Campus',
    status: 'Open',
    rating: 4.6,
    address: '321 College Street, North',
    distance: '3.8 km',
    time: '8 AM - 6 PM',
    latitude: 11.0205,
    longitude: 76.9421,
    phone: 'tel:+911234567893',
  },
];

export default function NearbyDropPointsScreen() {
  const mapRef = useRef(null);
  const router = useRouter();
  const [selectedPoint, setSelectedPoint] = useState(null);
  const [selectedFilter, setSelectedFilter] = useState('All');

  const handleMarkerPress = (point) => {
    setSelectedPoint(point);
    mapRef.current?.animateToRegion(
      {
        latitude: point.latitude,
        longitude: point.longitude,
        latitudeDelta: 0.02,
        longitudeDelta: 0.02,
      },
      800
    );
  };

  const handleCall = (phone) => {
    Linking.openURL(phone);
  };

  const handleDirection = (point) => {
    const url = `https://www.google.com/maps/dir/?api=1&destination=${point.latitude},${point.longitude}`;
    Linking.openURL(url);
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
        <Ionicons name="arrow-back" size={24} color="#000" />
      </TouchableOpacity>

      <Text style={styles.header}>Nearby Drop Points</Text>

      {/* Tabs */}
      <View style={styles.tabSwitchContainer}>
        <TouchableOpacity style={[styles.tabButton, styles.activeTab]}>
          <Ionicons name="map" size={18} color="#fff" />
          <Text style={styles.activeTabText}>Map</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.tabButton, styles.inactiveTab]}>
          <Ionicons name="list" size={18} color="#836EFE" />
          <Text style={styles.inactiveTabText}>List</Text>
        </TouchableOpacity>
      </View>

      {/* Filter Buttons */}
      <View style={styles.filterRow}>
        {['All', 'Open Now', '< 5km'].map((filter) => (
          <TouchableOpacity
            key={filter}
            style={[
              styles.filterBtn,
              selectedFilter === filter && styles.filterBtnActive,
            ]}
            onPress={() => setSelectedFilter(filter)}
          >
            <Text
              style={[
                styles.filterText,
                selectedFilter === filter && styles.filterTextActive,
              ]}
            >
              {filter}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Map View */}
      <View style={styles.mapContainer}>
        <MapView
          ref={mapRef}
          style={styles.map}
          initialRegion={{
            latitude: 11.0168,
            longitude: 76.9558,
            latitudeDelta: 0.05,
            longitudeDelta: 0.05,
          }}
        >
          {dropPoints.map((point) => (
            <Marker
              key={point.id}
              coordinate={{
                latitude: point.latitude,
                longitude: point.longitude,
              }}
              title={point.name}
              pinColor={point.status === 'Open' ? 'green' : 'red'}
              onPress={() => handleMarkerPress(point)}
            />
          ))}
        </MapView>
      </View>

      {/* Drop Point Cards */}
      <ScrollView style={styles.cardScroll} contentContainerStyle={{ paddingBottom: 80 }}>
        {dropPoints.map((point) => (
          <View key={point.id} style={styles.card}>
           <View style={styles.cardHeader}>
            <Text style={styles.name}>{point.name}</Text>
            <Text style={[styles.status, point.status === 'Open' ? styles.open : styles.closed]}>
                {point.status}
            </Text>
           <View style={styles.ratingBox}>
    <Text style={styles.rating}>{point.rating}</Text>
    <Ionicons name="star" size={14} color="#F5A623" style={{ marginLeft: 2 }} />
  </View>
            </View>

            <View style={styles.infoRowWithPin}>
            <View style={styles.infoDetails}>
                <View style={styles.detailRow}>
                <Ionicons name="location-outline" size={16} color="#666" style={styles.iconSpacing} />
                <Text style={styles.address}>{point.address}</Text>
                </View>
                <View style={styles.detailRow}>
                <Ionicons name="navigate-outline" size={16} color="#666" style={styles.iconSpacing} />
                <Text style={styles.distance}>{point.distance} away</Text>
                </View>
                <View style={styles.detailRow}>
                <Ionicons name="time-outline" size={16} color="#666" style={styles.iconSpacing} />
                <Text style={styles.time}>{point.time}</Text>
                </View>
            </View>

            <View style={styles.pinBox}>
                <Ionicons name="location-outline" size={20} color="#836EFE" />
            </View>
            </View>
              <View style={styles.actions}>
              <View style={styles.actionBtns}>
                <TouchableOpacity style={styles.callBtn} onPress={() => handleCall(point.phone)}>
                  <Text>Call</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.directionBtn}
                  onPress={() => handleDirection(point)}
                >
                  <Text style={{ color: '#fff' }}>Direction</Text>
                </TouchableOpacity>
              </View>
              
            </View>
          </View>
        ))}
      </ScrollView>

      <BottomNav activeTab="Home" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  backBtn: {
    position: 'absolute',
    top: 50,
    left: 20,
    zIndex: 10,
  },
  header: {
    marginTop: 50,
    fontSize: 18,
    fontWeight: '700',
    textAlign: 'center',
    color: '#39335E',
  },
  tabSwitchContainer: {
    flexDirection: 'row',
    marginHorizontal: 20,
    marginTop: 20,
    gap: 10,
  },
  tabButton: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 10,
    borderRadius: 5,
  },
  activeTab: {
    backgroundColor: '#836EFE',
  },
  inactiveTab: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  activeTabText: {
    color: '#fff',
    fontWeight: '600',
    marginLeft: 6,
  },
  inactiveTabText: {
    color: '#836EFE',
    fontWeight: '600',
    marginLeft: 6,
  },
  filterRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: 20,
    marginVertical: 12,
    gap: 10,
  },
  filterBtn: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 8,
    backgroundColor: '#ffffff',
    borderColor: '#836EFE',
    borderWidth: 1,
    alignItems: 'center',
  },
  filterBtnActive: {
    backgroundColor: '#836EFE',
  },
  filterText: {
    fontSize: 13,
    fontWeight: '500',
    color: '#836EFE',
  },
  filterTextActive: {
    color: '#fff',
  },
  mapContainer: {
    height: 180,
    marginHorizontal: 16,
    borderRadius: 14,
    overflow: 'hidden',
  },
  map: { flex: 1 },
  cardScroll: {
    marginTop: 10,
    paddingHorizontal: 16,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 14,
    marginBottom: 15,
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
  },
  cardHeader: {
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'space-between',
  marginBottom: 6,
  flexWrap: 'wrap',
},

name: {
  fontWeight: 'bold',
  fontSize: 16,
  color: '#333',
  marginRight: 6,
},

ratingBox: {
  flexDirection: 'row',
  alignItems: 'center',
  marginLeft: 'auto',
},

rating: {
  fontWeight: '600',
  fontSize: 13,
  color: '#000',
},

  status: {
    fontSize: 12,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
    marginRight: 5,
   
  },
  open: {
    backgroundColor: '#D2F6DC',
    color: 'green',
  },
  closed: {
    backgroundColor: '#FDDCDC',
    color: 'red',
  },
 
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
  },
  iconSpacing: {
    marginRight: 6,
  },
  address: {
    color: '#666',
  },
  distance: {
    color: '#888',
    fontSize: 12,
  },
  time: {
    color: '#444',
    fontSize: 12,
    marginBottom: 8,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 12,
  },
  actionBtns: {
    flexDirection: 'row',
    gap: 10,
  },
  callBtn: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    paddingVertical: 6,
    paddingHorizontal: 14,
  },
  directionBtn: {
    backgroundColor: '#836EFE',
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 8,
  },
  pinBox: {
    backgroundColor: '#EFE9FF',
    padding: 10,
    borderRadius: 12,
  },
  infoRowWithPin: {
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'flex-start',
  marginTop: 6,
},
infoDetails: {
  flex: 1,
  gap: 2,
},

});

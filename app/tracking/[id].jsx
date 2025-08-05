import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Dimensions,
  ScrollView,
} from 'react-native';
import MapView, { Marker, Polyline } from 'react-native-maps';
import { useLocalSearchParams, useRouter } from 'expo-router';

const { height } = Dimensions.get('window');

export default function TrackingScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();

  const [showPopup, setShowPopup] = useState(false);

  const routeCoords = [
    { latitude: -6.2, longitude: 106.81 },
    { latitude: -6.22, longitude: 106.83 },
  ];

  return (
    <View style={styles.wrapper}>
      {/* Map View */}
      <MapView
        style={StyleSheet.absoluteFill}
        initialRegion={{
          latitude: -6.21,
          longitude: 106.82,
          latitudeDelta: 0.03,
          longitudeDelta: 0.03,
        }}
      >
        <Polyline
          coordinates={routeCoords}
          strokeColor="#6C63FF"
          strokeWidth={4}
          tappable={true}
          onPress={() => setShowPopup(true)}
        />
        <Marker coordinate={routeCoords[0]} title="Start" />
        <Marker coordinate={routeCoords[1]} title="Destination" pinColor="red" />
      </MapView>

      {/* Top Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Image
            source={require('../../assets/icons/back.png')}
            style={styles.backIcon}
          />
        </TouchableOpacity>
        <Text style={styles.title}>
          Tracking "<Text style={{ color: '#6C63FF' }}>{id}</Text>"
        </Text>
      </View>

      {/* Bottom Sheet */}
      {showPopup && (
        <View style={styles.bottomSheet}>
          <View style={styles.dragHandle} />

          <View style={styles.centerTextWrapper}>
            <Text style={styles.packageText}>Your package is in the Way</Text>
            <Text style={styles.etaText}>Arriving at pick up points in 3 mins</Text>
          </View>

          <View style={styles.driverInfo}>
            <Image
              source={require('../../assets/icons/default-avatar.png')}
              style={styles.avatar}
            />
            <View style={{ flex: 1 }}>
              <Text style={styles.driverName}>Brooklyn Simmons</Text>
              <Text style={styles.driverRating}>⭐ 4.7</Text>
            </View>
            <Image
              source={require('../../assets/icons/chat1.png')}
              style={styles.iconBtn}
            />
            <Image
              source={require('../../assets/icons/phone.png')}
              style={styles.iconBtn}
            />
          </View>

          <ScrollView style={{ maxHeight: 200 }}>
            {[1, 2, 3].map((_, i) => (
              <View key={i} style={styles.stopItem}>
                <View style={styles.dotColumn}>
                  <View style={styles.outerCircle}>
                    <View style={styles.innerCircle} />
                  </View>
                  {i !== 2 && <View style={styles.dottedLine} />}
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.locationText}>
                    9081 Lakewood Gardens Junction
                  </Text>
                  <Text style={styles.dateText}>December 22, 2024 | 09:44 am</Text>
                </View>
              </View>
            ))}
          </ScrollView>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    position: 'absolute',
    top: 40,
    left: 20,
    right: 20,
    zIndex: 10,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffffcc',
    padding: 10,
    borderRadius: 10,
  },
  backIcon: {
    width: 22,
    height: 22,
    marginRight: 10,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: '#39335E',
  },
  bottomSheet: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 20,
    backgroundColor: '#fff',
    borderTopLeftRadius: 50,
    borderTopRightRadius: 50,
    elevation: 10,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
    height:400,
    maxHeight:'90%',
  },
  dragHandle: {
    width: 40,
    height: 5,
    backgroundColor: '#ccc',
    borderRadius: 2.5,
    alignSelf: 'center',
    marginBottom: 10,
  },
  centerTextWrapper: {
    alignItems: 'center',
    marginBottom: 20,
  },
  packageText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#39335E',
    marginBottom: 6,
  },
  etaText: {
    fontSize: 13,
    color: '#999',
  },
  driverInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 18,
  },
  avatar: {
    width: 65,
    height: 65,
    borderRadius: 22,
    marginRight: 10,
  },
  driverName: {
    fontWeight: '600',
    color: '#39335E',
    fontSize: 15,
  },
  driverRating: {
    fontSize: 13,
    color: '#555',
  },
  iconBtn: {
    width: 20,
    height: 20,
    marginHorizontal: 8,
    tintColor: '#6C63FF',
  },
   stopItem: {
  flexDirection: 'row',
  alignItems: 'flex-start',
  marginBottom: 30, // gap between each stop
},
  dotColumn: {
  alignItems: 'center',
  width: 30,
  position: 'relative',
},
  outerCircle: {
    width: 26,
    height: 26,
    borderRadius: 15,
    borderWidth: 2,
    borderColor: '#6C63FF',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  innerCircle: {
    width: 13,
    height: 13,
    borderRadius: 10,
    backgroundColor: '#6C63FF',
  },
  
  dottedLine: {
  position: 'absolute',
  top: 24, // start exactly after the circle ends
  width: 2,
  height: 50, // match the marginBottom of stopItem
  backgroundColor: 'transparent',
  borderLeftWidth: 2,
  borderLeftColor: '#6C63FF',
  borderStyle: 'dotted',
  },
  locationText: {
    fontWeight: '600',
    fontSize: 16,
    color: '#39335E',
    left:10,
  },
  dateText: {
    fontSize: 14,
    color: '#727272',
    left:10,
  },
 


});

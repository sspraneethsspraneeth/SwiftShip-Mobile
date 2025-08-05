import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';

const { height } = Dimensions.get('window');

export default function CallScreen() {
  const { name } = useLocalSearchParams();
  const router = useRouter();

  const handleEndCall = () => {
    router.back();
  };

  return (
    <View style={styles.container}>
      <Image
        source={require('../../assets/icons/caller.png')} // Replace with your image path
        style={styles.backgroundImage}
      />

      <View style={styles.overlay}>
        <Text style={styles.nameText}>{name}</Text>

        <View style={styles.buttonsContainer}>
          <TouchableOpacity style={[styles.callButton, { backgroundColor: '#FF5B5B' }]} onPress={handleEndCall}>
            <Image source={require('../../assets/icons/close1.png')} style={styles.icon} />
          </TouchableOpacity>
          <TouchableOpacity style={[styles.callButton, { backgroundColor: '#34C759' }]}>
            <Image source={require('../../assets/icons/micc1.png')} style={styles.icon} />
          </TouchableOpacity>
          <TouchableOpacity style={[styles.callButton, { backgroundColor: '#FFA726' }]}>
            <Image source={require('../../assets/icons/Volume1.png')} style={styles.icon} />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'relative',
  },
  backgroundImage: {
    width: '100%',
    maxWidth:430,
    height: '100%',
    maxHeight:932,
    resizeMode: 'cover',
  },
  overlay: {
    position: 'absolute',
    bottom: 60,
    width: '100%',
    alignItems: 'center',
  },
  nameText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 30,
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 20,
  },
  callButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  icon: {
    width: 24,
    height: 24,
    tintColor: '#fff',
  },
});

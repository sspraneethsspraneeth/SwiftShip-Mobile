// app/notification/notification.jsx

import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image } from 'react-native';
import { useRouter } from 'expo-router';
import BottomNav from '../../components/BottomNav';

const notifications = [
  {
    title: 'Security Updates!',
    date: '20 Dec, 2024',
    time: '20:49 PM',
    icon: require('../../assets/icons/check.png'),
    bgColor: '#D6F5DD',
  },
  {
    title: 'Multiple Wallet Features!',
    date: '19 Dec, 2024',
    time: '18:27 PM',
    icon: require('../../assets/icons/wallet.png'),
    bgColor: '#FFD9E2',
  },
  {
    title: 'Order Has Updated',
    date: '19 Dec, 2024',
    time: '18:27 PM',
    icon: require('../../assets/icons/oorder.png'),
    bgColor: '#E5D9FF',
  },
  {
    title: 'NFT Imported',
    date: '17 Nov, 2024',
    time: '03:31 PM',
    icon: require('../../assets/icons/nft.png'),
    bgColor: '#D9E7FF',
  },
];

export default function NotificationPage() {
  const router = useRouter();

  return (
    <View style={styles.wrapper}>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
            <Text style={styles.back}>{'←'}</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Notifications</Text>
        </View>


        {notifications.map((item, index) => (
          <View
            key={index}
            style={[styles.card, { backgroundColor: '#F8F8F8', borderColor: '#F0F0F0' }]}
          >
            <View style={[styles.iconWrapper, { backgroundColor: item.bgColor }]}>
              <Image source={item.icon} style={styles.icon} />
            </View>
            <View style={styles.details}>
              <Text style={styles.name}>{item.title}</Text>
              <Text style={styles.desc}>{item.date} | {item.time}</Text>
            </View>
            <View style={styles.tag}>
              <Text style={styles.tagText}>New</Text>
            </View>
          </View>
        ))}
      </ScrollView>

      <BottomNav />
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: '#fff',
  },
  container: {
    padding: 20,
    paddingBottom: 100,
    top:30,
  },
 header: {
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'center',
  marginBottom: 20,
  position: 'relative',
},
back: {
  fontSize: 24,
  position: 'absolute',
  left: 0,
  top:-20,
},
title: {
  fontSize: 20,
  fontWeight: 'bold',
  color: '#39335E',
  textAlign: 'center',
  flex: 1,
},

  card: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderRadius: 12,
    marginBottom: 15,
    borderWidth: 1,
  },
  iconWrapper: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  icon: {
    width: 22,
    height: 22,
    resizeMode: 'contain',
  },
  details: {
    flex: 1,
  },
  name: {
    fontWeight: 'bold',
    fontSize: 15,
    color: '#39335E',
  },
  desc: {
    color: '#727272',
    fontSize: 12,
    marginTop: 2,
  },
  tag: {
    backgroundColor: '#1C1C1C',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  tagText: {
    color: '#fff',
    fontSize: 11,
  },
});

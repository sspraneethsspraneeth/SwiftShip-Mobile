import React from 'react';
import { View, Text, Image, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';

const chats = [
  { name: 'Brooklyn Simmons', type: 'Outgoing', date: 'Dec 20, 2023' },
  { name: 'Ralph Edwards', type: 'Outgoing', date: 'Dec 20, 2023' },
  { name: 'Marvin McKinney', type: 'Outgoing', date: 'Dec 20, 2023' },
  { name: 'Cameron Williamson', type: 'Outgoing', date: 'Dec 20, 2023' },
  { name: 'Jerome Bell', type: 'Outgoing', date: 'Dec 20, 2023' },
];

export default function CallInboxScreen() {
  const router = useRouter();

  const handleCall = (name) => {
    router.push({ pathname: '/inbox/CallScreen', params: { name } });
  };

  return (
    <ScrollView contentContainerStyle={styles.chatList}>
      {chats.map((chat, index) => (
        <View key={index} style={styles.chatCard}>
          <View>
            <Text style={styles.chatName}>{chat.name}</Text>
            <Text style={styles.chatInfo}>{chat.type} | {chat.date}</Text>
          </View>
          <TouchableOpacity onPress={() => handleCall(chat.name)}>
            <Image source={require('../../assets/icons/phone1.png')} style={styles.phoneIcon} />
          </TouchableOpacity>
        </View>
      ))}
      <View style={{ height: 100 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  chatList: {
    paddingHorizontal: 20,
    backgroundColor: '#F8F7FF',
  },
  chatCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  chatName: {
    fontWeight: '600',
    fontSize: 15,
    color: '#39335E',
  },
  chatInfo: {
    fontSize: 13,
    color: '#727272',
    marginTop: 2,
  },
  phoneIcon: {
    width: 18,
    height: 18,
    tintColor: '#6C63FF',
  },
});

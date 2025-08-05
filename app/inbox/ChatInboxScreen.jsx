import React from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { useRouter } from 'expo-router';

const chats = [
  {
    id: '1',
    name: 'Leslie Alexander',
    message: 'Hi, Good morning',
    time: '10:00',
    avatar: require('../../assets/icons/default-avatar.png'),
    unreadCount: 1,
  },
  {
    id: '2',
    name: 'Marvin McKinney',
    message: 'OMG, this is amazing',
    time: '10:00',
    avatar: require('../../assets/icons/default-avatar.png'),
    unreadCount: 0,
  },
  {
    id: '3',
    name: 'Eleanor Pena',
    message: 'I’ll be there in 2hr',
    time: '10:00',
    avatar: require('../../assets/icons/default-avatar.png'),
    unreadCount: 2,
  },
  {
    id: '4',
    name: 'Bessie Cooper',
    message: 'Wow',
    time: 'Yesterday',
    avatar: require('../../assets/icons/default-avatar.png'),
    unreadCount: 0,
  },
  {
    id: '5',
    name: 'Guy Hawkins',
    message: 'Perfect',
    time: '10:00',
    avatar: require('../../assets/icons/default-avatar.png'),
    unreadCount: 0,
  },
];

export default function ChatInboxScreen() {
  const router = useRouter();

  return (
    <ScrollView contentContainerStyle={styles.chatList}>
      {chats.map((chat) => (
        <TouchableOpacity
          key={chat.id}
          style={styles.chatCard}
          onPress={() =>
            router.push({
              pathname: '/inbox/ChatDetailScreen',
              params: { name: chat.name },
            })
          }
        >
          <Image source={chat.avatar} style={styles.avatar} />
          <View style={styles.chatDetails}>
            <Text style={styles.chatName}>{chat.name}</Text>
            <Text style={styles.chatMessage}>{chat.message}</Text>
          </View>
          <View style={styles.rightInfo}>
            <Text style={styles.timeText}>{chat.time}</Text>
            {chat.unreadCount > 0 && (
              <View style={styles.unreadBadge}>
                <Text style={styles.unreadText}>{chat.unreadCount}</Text>
              </View>
            )}
          </View>
        </TouchableOpacity>
      ))}
      <View style={{ height: 100 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  chatList: {
    paddingHorizontal: 20,
    backgroundColor: '#F8F7FF',
    paddingTop: 10,
  },
  chatCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 15,
    marginBottom: 16,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    marginRight: 12,
  },
  chatDetails: {
    flex: 1,
  },
  chatName: {
    fontSize: 15,
    fontWeight: '600',
    color: '#39335E',
  },
  chatMessage: {
    fontSize: 13,
    color: '#727272',
    marginTop: 2,
  },
  rightInfo: {
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  timeText: {
    fontSize: 12,
    color: '#727272',
    marginBottom: 6,
  },
  unreadBadge: {
    backgroundColor: '#6C63FF',
    borderRadius: 10,
    paddingHorizontal: 6,
    paddingVertical: 2,
    minWidth: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  unreadText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
});

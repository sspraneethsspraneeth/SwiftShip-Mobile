import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import BottomNav from '../../components/BottomNav';
import CallInboxScreen from '../inbox/CallInboxScreen';
import ChatInboxScreen from '../inbox/ChatInboxScreen';

export default function InboxScreen() {
  const [activeTab, setActiveTab] = useState('Call');

  // Define toggle buttons here instead of repeating JSX
  const tabs = [
    { key: 'Chat', label: 'Chats' },
    { key: 'Call', label: 'Call' },
  ];

  return (
    <View style={styles.wrapper}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity>
          <Image source={require('../../assets/icons/back.png')} style={styles.icon} />
        </TouchableOpacity>
        <Text style={styles.title}>Inbox</Text>
        <TouchableOpacity>
          <Image source={require('../../assets/icons/search2.png')} style={styles.icon} />
        </TouchableOpacity>
      </View>

      {/* Toggle Buttons */}
      <View style={styles.buttonRow}>
        {tabs.map(tab => (
          <TouchableOpacity
            key={tab.key}
            style={[styles.button, activeTab === tab.key && styles.activeButton]}
            onPress={() => setActiveTab(tab.key)}
          >
            <Text
              style={[styles.buttonText, activeTab === tab.key && styles.activeButtonText]}
            >
              {tab.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Conditional Content */}
      {activeTab === 'Call' ? <CallInboxScreen /> : <ChatInboxScreen />}

      {/* Bottom Nav */}
      <BottomNav activeTab="Inbox" />
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: { flex: 1, backgroundColor: '#fff' },
  header: {
    paddingHorizontal: 20,
    paddingTop: 70,
    paddingBottom: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  icon: {
    width: 20,
    height: 20,
    tintColor: '#39335E',
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: '#39335E',
    fontFamily: 'montserrat',
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    paddingHorizontal: 20,
    gap: 10,
    marginBottom: 20,
    marginTop: 20,
  },
  button: {
    flex: 1,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: '#6C63FF',
    borderRadius: 10,
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  activeButton: {
    backgroundColor: '#6C63FF',
  },
  buttonText: {
    color: '#6C63FF',
    fontWeight: '600',
    fontSize: 14,
  },
  activeButtonText: {
    color: '#fff',
  },
});

import React from 'react';
import { View, TouchableOpacity, Image, Text, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';

const BottomNav = ({ activeTab }) => {
  const router = useRouter();

  const tabs = [
    {
      label: 'Home',
      icon: require('../assets/icons/home.png'),
      route: '/dashboard/dashboard',
    },
    {
      label: 'My Orders',
      icon: require('../assets/icons/orders.png'),
      route: '/dashboard/orders',
    },
    {
      label: 'Inbox',
      icon: require('../assets/icons/chat.png'),
      route: '/dashboard/InboxScreen',
    },
    {
      label: 'Profile',
      icon: require('../assets/icons/menu.png'),
      route: '/dashboard/ProfileScreen',
    },
  ];

  return (
    <View style={styles.bottomNav}>
      {tabs.map((tab) => (
        <TouchableOpacity
          key={tab.label}
          style={styles.navItem}
          onPress={() => router.push(tab.route)}
        >
          <View
            style={[styles.inner, activeTab === tab.label && styles.innerActive]}
          >
            <Image
              source={tab.icon}
              style={[
                styles.navIcon,
                activeTab === tab.label && styles.activeNavIcon,
              ]}
            />
            <Text
              style={[
                styles.navLabel,
                activeTab === tab.label && styles.activeNavLabel,
              ]}
            >
              {tab.label}
            </Text>
          </View>
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  bottomNav: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 75,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingHorizontal: 10,
  },
  navItem: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  inner: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 10,
  },
  innerActive: {
    backgroundColor: '#6C63FF',
  },
  navIcon: {
    width: 24,
    height: 24,
    resizeMode: 'contain',
    tintColor: '#888',
  },
  activeNavIcon: {
    tintColor: '#fff',
  },
  navLabel: {
    fontSize: 11,
    color: '#888',
    marginTop: 4,
  },
  activeNavLabel: {
    color: '#fff',
    fontWeight: '600',
  },
});

export default BottomNav;

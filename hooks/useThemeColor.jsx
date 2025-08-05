import React from 'react';
import { Text, View, StyleSheet } from 'react-native';
import { useThemeColor } from '@/hooks/useThemeColor';

const ThemedTitle = () => {
  const textColor = useThemeColor({}, 'text');        // fallback to Colors.light.text or Colors.dark.text
  const backgroundColor = useThemeColor({}, 'background');  // fallback to Colors.light.background or Colors.dark.background

  return (
    <View style={[styles.container, { backgroundColor }]}>
      <Text style={[styles.title, { color: textColor }]}>
        Welcome to Themed App!
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
});

export default ThemedTitle;

import React from 'react';
import { View, Image, Text, StyleSheet, useWindowDimensions } from 'react-native';

export default function OnboardingSlide({ imageSource, text }) {
  const { width, height } = useWindowDimensions();

  return (
    <View style={[styles.container, { width, height }]}>
      <Image source={imageSource} style={styles.image} />
      <Text style={styles.text}>{text}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 24,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: '100%',
    resizeMode: 'contain',
  },
  text: {
    fontSize: 22,
    fontWeight: '700',
    textAlign: 'center',
    color: '#39335E',
    marginTop: 24,
    marginBottom: 28,
    lineHeight: 30,
    fontFamily: 'montserrat',
  },
});

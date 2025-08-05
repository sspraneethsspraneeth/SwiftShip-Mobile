import React from 'react';
import {
  View,
  Image,
  Text,
  StyleSheet,
  useWindowDimensions,
} from 'react-native';
import PrimaryButton from './PrimaryButton';

export default function OnboardingSlide({
  imageSource,
  text,
  currentIndex,
  totalSlides,
  onNext,
  isLast,
}) {
  const { width, height } = useWindowDimensions();

  return (
    <View style={[styles.container, { width, height }]}>
      <Image source={imageSource} style={styles.image} />

      <Text style={styles.text}>{text}</Text>

      <View style={styles.dotsContainer}>
        {Array.from({ length: totalSlides }).map((_, i) => (
          <View
            key={i}
            style={i === currentIndex ? styles.dotActive : styles.dot}
          />
        ))}
      </View>

      <PrimaryButton
        title={isLast ? 'Next' : 'Next'}
        onPress={onNext}
      />
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
    width:'100%',
    resizeMode: 'contain',
    marginBottom: 40,
    marginTop:159,
  },
  text: {
    fontSize: 22,
    fontWeight: '700',
    textAlign: 'center',
    color: '#39335E',
    marginBottom: 28,
    lineHeight: 30,
    fontFamily: 'montserrat',
  },
  dotsContainer: {
    flexDirection: 'row',
    marginBottom: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  dot: {
    width: 10,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#D9D9D9',
    marginHorizontal: 4,
  },
  dotActive: {
    width: 20,
    height: 8,
    borderRadius: 5,
    backgroundColor: '#FF9F1C',
    marginHorizontal: 4,
  },
});

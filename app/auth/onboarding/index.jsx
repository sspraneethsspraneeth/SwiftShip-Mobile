import React, { useRef, useState } from 'react';
import { FlatList, View, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import OnboardingSlide from '../../../components/OnboardingSlide';
import PrimaryButton from '../../../components/PrimaryButton';
import { slides } from '../../../constants/onboardingData';

export default function Onboarding() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const router = useRouter();
  const flatListRef = useRef();

  const handleNext = () => {
    if (currentIndex === slides.length - 1) {
      router.replace('/auth/login');
    } else {
      flatListRef.current.scrollToIndex({ index: currentIndex + 1 });
    }
  };

  const onViewableItemsChanged = useRef(({ viewableItems }) => {
    if (viewableItems.length > 0) {
      setCurrentIndex(viewableItems[0].index);
    }
  }).current;

 return (
  <View style={styles.container}>
    <StatusBar style="dark" backgroundColor="#fff" />

    {/* Slides */}
    <View style={styles.contentContainer}>
      <FlatList
        data={slides}
        ref={flatListRef}
        keyExtractor={(_, index) => index.toString()}
        renderItem={({ item }) => (
          <OnboardingSlide imageSource={item.imageSource} text={item.text} />
        )}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={{ viewAreaCoveragePercentThreshold: 50 }}
      />
    </View>

    {/* Footer (dots + button together) */}
    <View style={styles.footerContainer}>
      <View style={styles.dotsContainer}>
        {slides.map((_, i) => (
          <View
            key={i}
            style={i === currentIndex ? styles.dotActive : styles.dot}
          />
        ))}
      </View>

      <PrimaryButton
        title={currentIndex === slides.length - 1 ? 'Next' : 'Next'}
        onPress={handleNext}
      />
    </View>
  </View>
);

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  contentContainer: {
    flex: 1,
  },
  footerContainer: {
    position: 'absolute',
    bottom: 40,
    left: 24,
    right: 24,
    alignItems: 'center',
  },
  dotsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20, // ✅ dots above button
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


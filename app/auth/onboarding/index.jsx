import React, { useRef, useState } from 'react';
import { FlatList, View, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import OnboardingSlide from '../../../components/OnboardingSlide';
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
      
      <FlatList
        data={slides}
        ref={flatListRef}
        keyExtractor={(_, index) => index.toString()}
        renderItem={({ item, index }) => (
          <OnboardingSlide
            imageSource={item.imageSource}
            text={item.text}
            currentIndex={currentIndex}
            totalSlides={slides.length}
            onNext={handleNext}
            isLast={index === slides.length - 1}
          />
        )}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={{ viewAreaCoveragePercentThreshold: 50 }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});

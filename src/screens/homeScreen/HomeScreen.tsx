import { useEffect, useRef, useState } from 'react';
import {
  View,
  StyleSheet,
  Animated,
  RefreshControl,
  BackHandler,
  LayoutChangeEvent,
  ActivityIndicator,
  Text,
} from 'react-native';
import { moderateScale, verticalScale } from 'react-native-size-matters';
import ImageSlide from './ImageSlider';
import SportSlide from './SportSlide';
import BoxList from './BoxList';
import StatusComp from '../../components/StatusComp';
import { COLORS } from '../../constants/color';
import NetInfoComponent from '../../components/NetInfoComponent';
import { AppStackScreenProps } from '../../navigation/navigationTypes';
import Modal from 'react-native-modal';
import LottiLoader from '../../components/LottiLoader';

const HEADER_MAX_HEIGHT = verticalScale(180);
const HEADER_MIN_HEIGHT = 0;
const HEADER_SCROLL_DISTANCE = HEADER_MAX_HEIGHT;

const HomeScreen = ({
  navigation,
}: {
  navigation: AppStackScreenProps<'BoxDetails'>['navigation'];
}) => {
  const scrollY = useRef(new Animated.Value(0)).current;
  const boxListRef = useRef<{ handleRefresh: () => Promise<void> } | null>(
    null,
  );

  const [sportSectionHeight, setSportSectionHeight] = useState(140);
  const [selectedSport, setSelectedSport] = useState<number | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [sportLoading, setSportLoading] = useState<boolean>(true);
  const [boxDetailLoader, setBoxDetailLoader] = useState(false);

  useEffect(() => {
    const backAction = () => {
      BackHandler.exitApp();
      return true;
    };

    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction,
    );

    return () => backHandler.remove();
  }, []);

  const headerHeight = scrollY.interpolate({
    inputRange: [0, HEADER_SCROLL_DISTANCE],
    outputRange: [HEADER_MAX_HEIGHT, HEADER_MIN_HEIGHT],
    extrapolate: 'clamp',
  });

  const headerOpacity = scrollY.interpolate({
    inputRange: [0, HEADER_SCROLL_DISTANCE / 2, HEADER_SCROLL_DISTANCE],
    outputRange: [1, 0.5, 0],
    extrapolate: 'clamp',
  });

  const headerScale = scrollY.interpolate({
    inputRange: [0, HEADER_SCROLL_DISTANCE],
    outputRange: [1, 0.5],
    extrapolate: 'clamp',
  });

  const boxScale = scrollY.interpolate({
    inputRange: [0, HEADER_SCROLL_DISTANCE, HEADER_SCROLL_DISTANCE + 150],
    outputRange: [1, 0.97, 0.93],
    extrapolate: 'clamp',
  });

  const boxOpacity = scrollY.interpolate({
    inputRange: [0, HEADER_SCROLL_DISTANCE, HEADER_SCROLL_DISTANCE + 150],
    outputRange: [1, 0.95, 0.9],
    extrapolate: 'clamp',
  });

  const boxTranslateY = scrollY.interpolate({
    inputRange: [0, HEADER_SCROLL_DISTANCE, HEADER_SCROLL_DISTANCE + 150],
    outputRange: [0, -20, -40],
    extrapolate: 'clamp',
  });

  const handleSportLayout = (event: LayoutChangeEvent) => {
    const { height } = event.nativeEvent.layout;
    setSportSectionHeight(height);
  };

  const handleSportSelect = (sportId: number) => {
    setSelectedSport(prev => (prev === sportId ? null : sportId));
  };

  const handleRefresh = async () => {
    try {
      setRefreshing(true);
      if (boxListRef.current?.handleRefresh) {
        await boxListRef.current.handleRefresh();
      }
    } catch (error) {
      console.error('Error during refresh:', error);
    } finally {
      setRefreshing(false);
    }
  };

  return (
    <View style={styles.container}>
      <NetInfoComponent
        onReconnect={() => {
          console.log('Internet reconnected on HomeScreen');
        }}
      />
      <StatusComp />

      {/* HEADER */}
      <Animated.View
        style={[
          styles.header,
          {
            height: headerHeight,
            opacity: headerOpacity,
          },
        ]}
      >
        <Animated.View style={{ transform: [{ scale: headerScale }], flex: 1 }}>
          <ImageSlide />
        </Animated.View>
      </Animated.View>

      {/* SPORT SECTION */}
      <Animated.View
        style={[
          styles.fixedSportSection,
          {
            transform: [
              {
                translateY: scrollY.interpolate({
                  inputRange: [0, HEADER_SCROLL_DISTANCE],
                  outputRange: [HEADER_MAX_HEIGHT, HEADER_MIN_HEIGHT],
                  extrapolate: 'clamp',
                }),
              },
            ],
          },
        ]}
        onLayout={handleSportLayout}
      >
        <SportSlide
          SportLoading={sportLoading}
          setLoading={setSportLoading}
          navigation={navigation}
          onSportSelect={handleSportSelect}
          selectedSport={selectedSport}
        />
      </Animated.View>

      {/* BOX LIST */}
      <Animated.FlatList
        data={[{ key: 'boxlist' }]}
        keyExtractor={item => item.key}
        renderItem={() => (
          <Animated.View
            style={{
              transform: [{ scale: boxScale }, { translateY: boxTranslateY }],
              opacity: boxOpacity,
              alignSelf: 'center',
            }}
          >
            <BoxList
              SportLoading={sportLoading}
              setLoading={setSportLoading}
              boxDetailLoader={boxDetailLoader}
              setBoxDetailLoader={setBoxDetailLoader}
              navigation={navigation}
              ref={boxListRef}
              selectedSport={selectedSport}
            />
          </Animated.View>
        )}
        ListHeaderComponent={
          <View
            style={{
              height: HEADER_MAX_HEIGHT + sportSectionHeight,
            }}
          />
        }
        contentContainerStyle={styles.scrollContent}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: false },
        )}
        scrollEventThrottle={16}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            progressViewOffset={HEADER_MAX_HEIGHT + sportSectionHeight}
          />
        }
      />
      <Modal
        isVisible={sportLoading}
        statusBarTranslucent
        backdropOpacity={0.3} // transparent dark backdrop
        style={{ justifyContent: 'center', alignItems: 'center' }} // remove default margin
      >
        <View
          style={{
            width: moderateScale(150),
            height: moderateScale(100),
            borderRadius: moderateScale(30),
            // backgroundColor: COLORS.secondary,
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <LottiLoader />
        </View>
      </Modal>
    </View>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.secondary,
  },
  header: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    width: '100%',
    overflow: 'hidden',
    zIndex: 10,
  },
  fixedSportSection: {
    position: 'absolute',
    left: 0,
    right: 0,
    backgroundColor: COLORS.secondary,
    zIndex: 9,
    paddingHorizontal: moderateScale(15),
  },
  scrollContent: {
    paddingHorizontal: moderateScale(15),
    paddingBottom: 50,
  },
});

import React, { useState } from 'react';
import {
  ScrollView,
  FlatList,
  RefreshControl,
  StyleProp,
  ViewStyle,
  ListRenderItem,
} from 'react-native';

type WrapperType = 'list' | 'scroll';

interface PullToRefreshWrapperProps<T> {
  type?: WrapperType;
  onRefresh: () => Promise<void> | void;
  data?: T[];
  renderItem?: ListRenderItem<T>;
  keyExtractor?: (item: T, index: number) => string;
  contentContainerStyle?: StyleProp<ViewStyle>;
  children?: React.ReactNode;
}

const PullToRefreshWrapper = <T,>({
  type = 'list',
  onRefresh,
  data = [],
  renderItem,
  keyExtractor,
  contentContainerStyle,
  children,
}: PullToRefreshWrapperProps<T>) => {
  const [refreshing, setRefreshing] = useState<boolean>(false);

  const handleRefresh = async () => {
    try {
      setRefreshing(true);
      await onRefresh();
    } catch (err) {
      console.error('Error during refresh:', err);
    } finally {
      setRefreshing(false);
    }
  };

  if (type === 'list') {
    return (
      <FlatList
        data={data}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        contentContainerStyle={contentContainerStyle}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
        showsVerticalScrollIndicator={false}
      />
    );
  }

  return (
    <ScrollView
      contentContainerStyle={contentContainerStyle}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
      }
      showsVerticalScrollIndicator={false}
    >
      {children}
    </ScrollView>
  );
};

export default PullToRefreshWrapper;

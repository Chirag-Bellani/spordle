import React, { useContext } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import FastImage from 'react-native-fast-image';
import { NetInfoContext } from '../context/NetInfoContext';

/* =========================
   Types
========================= */

interface NetInfoContextType {
  isConnected: boolean;
  hasLostConnection: boolean;
  retryConnection: () => Promise<boolean>;
}

interface NetInfoComponentProps {
  onReconnect?: () => void;
}

/* =========================
   Component
========================= */

const NetInfoComponent: React.FC<NetInfoComponentProps> = ({ onReconnect }) => {
  const { isConnected, retryConnection } = useContext(
    NetInfoContext,
  ) as NetInfoContextType;

  if (isConnected) return null;

  const handleRefresh = async (): Promise<void> => {
    const ok = await retryConnection();
    if (ok && onReconnect) {
      onReconnect();
    }
  };

  return (
    <View style={styles.container}>
      {/* FAST IMAGE OFFLINE ILLUSTRATION */}
      <FastImage
        source={require('../assets/images/offline.png')}
        style={styles.offlineImage}
        resizeMode={FastImage.resizeMode.contain}
      />

      <View style={styles.contentContainer}>
        <Text style={styles.title}>No internet connection</Text>
        <Text style={styles.subtitle}>
          Check your connection and try again.
        </Text>

        <TouchableOpacity style={styles.refreshButton} onPress={handleRefresh}>
          <Text style={styles.refreshText}>Retry</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default NetInfoComponent;

/* =========================
   Styles
========================= */

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#f5f5f5',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 99999,
  },
  offlineImage: {
    width: 180,
    height: 180,
  },
  contentContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 30,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: '#000',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginBottom: 25,
    lineHeight: 20,
  },
  refreshButton: {
    paddingHorizontal: 38,
    paddingVertical: 11,
    borderRadius: 24,
    borderWidth: 2,
    borderColor: '#0A66C2',
    backgroundColor: 'transparent',
  },
  refreshText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#0A66C2',
  },
});

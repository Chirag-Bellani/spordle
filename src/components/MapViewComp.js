import { useEffect, useState } from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { WebView } from 'react-native-webview';
import Geolocation from 'react-native-geolocation-service';
import GetLocation from 'react-native-get-location';
import { moderateScale, scale } from 'react-native-size-matters';

export default function MapWebView({ destLat, destLng }) {
  const [coords, setCoords] = useState(null);

  const fetchCurrentLocation = async () => {
    try {
      Geolocation.getCurrentPosition(
        pos => {
          const { latitude, longitude } = pos.coords;
          setCoords({ latitude, longitude });
        },
        async () => {
          // fallback
          try {
            const loc = await GetLocation.getCurrentPosition({
              enableHighAccuracy: true,
              timeout: 15000,
            });
            setCoords({
              latitude: loc.latitude,
              longitude: loc.longitude,
            });
          } catch (err) {
            console.log('Fallback location error:', err);
          }
        },
        {
          enableHighAccuracy: true,
          timeout: 15000,
          maximumAge: 10000,
        },
      );
    } catch (err) {
      console.log('Error fetching location:', err);
    }
  };

  useEffect(() => {
    fetchCurrentLocation();
  }, []);

  if (!coords) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <Text style={{ fontWeight: '700', fontSize: scale(15) }}>
          Loading Map...
        </Text>
      </View>
    );
  }

  const html = `
<!DOCTYPE html>
<html>
<head>
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<link rel="stylesheet" href="https://unpkg.com/leaflet/dist/leaflet.css"/>
<script src="https://unpkg.com/leaflet/dist/leaflet.js"></script>
</head>
<body style="margin:0">
<div id="map" style="width:100vw;height:100vh"></div>

<script>
  var userLat = ${coords.latitude};
  var userLng = ${coords.longitude};
  var fixedLat = ${destLat};
  var fixedLng = ${destLng};

  var map = L.map('map').setView([userLat, userLng], 11);

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap'
  }).addTo(map);

  var blueIcon = L.icon({
    iconUrl: 'https://maps.gstatic.com/mapfiles/ms2/micons/blue-dot.png',
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32],
  });

  var redIcon = L.icon({
    iconUrl: 'https://maps.gstatic.com/mapfiles/ms2/micons/red-dot.png',
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32],
  });

  L.marker([userLat, userLng], { icon: blueIcon })
    .addTo(map)
    .bindPopup("User Location");

  L.marker([fixedLat, fixedLng], { icon: redIcon })
    .addTo(map)
    .bindPopup("Destination")
    .openPopup();
</script>

</body>
</html>
`;

  return (
    <View style={styles.container}>
      <WebView originWhitelist={['*']} source={{ html }} javaScriptEnabled />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { height: moderateScale(250) },
});

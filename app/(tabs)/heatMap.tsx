import React, { useEffect, useState } from "react";
import { ActivityIndicator, Alert, StyleSheet, View } from "react-native";
import MapView from "react-native-maps";
import { getUserLocation } from "../../utils/getUserLocation";

export default function HeatMap() {
  const [coords, setCoords] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);

  useEffect(() => {
    getUserLocation()
      .then((location) => setCoords(location))
      .catch((error) => {
        console.warn(error);
        Alert.alert("Location Error", "Unable to retrieve your location.");
      });
  }, []);

  if (!coords) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#233D91" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        initialRegion={{
          latitude: coords.latitude,
          longitude: coords.longitude,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        }}
        showsUserLocation={true}
      ></MapView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    width: "100%",
    height: "100%",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

import React, { useContext } from "react";
import { ActivityIndicator, StyleSheet, View } from "react-native";
import MapView from "react-native-maps";
import { LocationContext } from "../../context/LocationContext";

export default function HeatMap() {
  const { coords, loading } = useContext(LocationContext);

  if (loading || !coords) {
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
      />
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

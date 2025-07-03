import React, { useContext } from "react";
import {
  ActivityIndicator,
  Alert,
  Button,
  StyleSheet,
  View,
} from "react-native";
import MapView, { Marker, Polyline } from "react-native-maps";
import { LocationContext } from "../../context/LocationContext";

export default function HeatMap() {
  const {
    coords,
    loading,
    suggestedShelters,
    getDirectionsToShelter,
    pathCoords,
    resetRoute,
  } = useContext(LocationContext);

  const handleFindShelter = async () => {
    if (!coords || suggestedShelters.length === 0) {
      Alert.alert("No shelter found", "Please try again later.");
      return;
    }

    // You can replace this logic with a smarter one (nearest shelter based on distance)
    const nearest = suggestedShelters[0];
    await getDirectionsToShelter(nearest);
  };

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
        showsUserLocation
      >
        {/* 🔷 Show Shelters */}
        {suggestedShelters.map((shelter, index) => (
          <Marker
            key={index}
            coordinate={{
              latitude: shelter.latitude,
              longitude: shelter.longitude,
            }}
            title={shelter.name}
            description={shelter.address}
            pinColor="blue"
          />
        ))}

        {/* 🔶 Show Path */}
        {pathCoords.length > 0 && (
          <Polyline
            coordinates={pathCoords}
            strokeColor="#33d1ff"
            strokeWidth={4}
          />
        )}
      </MapView>

      {/* 🔘 Button to fetch route */}
      <View style={styles.buttonGroup}>
        <Button title="Find Nearest Shelter" onPress={handleFindShelter} />
        <View style={{ marginTop: 10 }} />
        <Button title="Reset Path" color="#888" onPress={resetRoute} />
      </View>
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
  buttonGroup: {
    position: "absolute",
    bottom: 40,
    left: 20,
    right: 20,
    alignItems: "center",
  },
});

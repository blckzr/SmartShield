import { FontAwesome5 } from "@expo/vector-icons";
import React, { useContext } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { LocationContext } from "../../context/LocationContext";

export default function ShelterFinder() {
  const { suggestedShelters, getDirectionsToShelter, loading } =
    useContext(LocationContext);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>NEAREST COOLING SHELTERS</Text>

      {loading ? (
        <Text style={{ textAlign: "center", marginTop: 20 }}>Loading...</Text>
      ) : (
        <ScrollView contentContainerStyle={styles.scrollContent}>
          {suggestedShelters.length === 0 ? (
            <Text style={{ textAlign: "center", marginTop: 20 }}>
              No shelters found nearby.
            </Text>
          ) : (
            suggestedShelters.map((shelter, index) => (
              <View key={index} style={styles.cardBlue}>
                <Text style={styles.cardTitle}>{shelter.name}</Text>
                <Text style={styles.subtext}>{shelter.address}</Text>

                <TouchableOpacity
                  style={styles.routeButton}
                  onPress={() => getDirectionsToShelter(shelter)}
                >
                  <FontAwesome5 name="location-arrow" size={14} color="white" />
                  <Text style={styles.routeText}>Track Route</Text>
                </TouchableOpacity>
              </View>
            ))
          )}
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 50,
    paddingHorizontal: 20,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
    color: "#1e2a78",
    marginBottom: 20,
  },
  scrollContent: {
    paddingBottom: 40,
  },
  cardBlue: {
    backgroundColor: "#4c6ef5",
    padding: 16,
    borderRadius: 12,
    marginBottom: 15,
  },
  cardTitle: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
    marginBottom: 4,
  },
  subtext: {
    color: "white",
    fontSize: 14,
    marginBottom: 12,
  },
  routeButton: {
    backgroundColor: "#2ecc71",
    paddingVertical: 10,
    borderRadius: 6,
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
    gap: 8,
  },
  routeText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 14,
  },
});

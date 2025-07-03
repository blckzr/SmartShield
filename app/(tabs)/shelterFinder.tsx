import { BASE_URL } from "@/utils/config";
import { FontAwesome5 } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useContext, useEffect, useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { LocationContext } from "../../context/LocationContext";

export default function ShelterFinder() {
  const { suggestedShelters, getDirectionsToShelter, loading, coords } =
    useContext(LocationContext);

  const [shelterInfo, setShelterInfo] = useState<{
    [index: number]: { distance: number; duration: number };
  }>({});

  const router = useRouter();

  const handleTrackRoute = async (shelter: any, index: number) => {
    await getDirectionsToShelter(shelter);
    router.push("/(tabs)/heatMap");
  };

  const fetchDistanceAndDuration = async (shelter: any, index: number) => {
    if (!coords) return;

    try {
      const response = await fetch(`${BASE_URL}/process_shelter_direction`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          startpoint: coords,
          endpoint: {
            latitude: shelter.latitude,
            longitude: shelter.longitude,
          },
        }),
      });

      const data = await response.json();

      setShelterInfo((prev) => ({
        ...prev,
        [index]: {
          distance: data.distance_meters,
          duration: data.duration_seconds,
        },
      }));
    } catch (error) {
      console.error("Failed to fetch distance/duration:", error);
    }
  };

  useEffect(() => {
    suggestedShelters.forEach((shelter, index) => {
      fetchDistanceAndDuration(shelter, index);
    });
  }, [suggestedShelters]);

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
            suggestedShelters.map((shelter, index) => {
              const info = shelterInfo[index];
              const distanceText = info
                ? `${(info.distance / 1000).toFixed(2)} km`
                : "Loading...";
              const durationText = info
                ? `${Math.round(info.duration / 60)} min`
                : "Loading...";

              return (
                <View key={index} style={styles.cardBlue}>
                  <Text style={styles.cardTitle}>{shelter.name}</Text>
                  <Text style={styles.subtext}>{shelter.address}</Text>
                  <Text style={styles.subtext}>Distance: {distanceText}</Text>
                  <Text style={styles.subtext}>
                    Estimated Time: {durationText}
                  </Text>

                  <TouchableOpacity
                    style={styles.routeButton}
                    onPress={() => handleTrackRoute(shelter, index)}
                  >
                    <FontAwesome5
                      name="location-arrow"
                      size={14}
                      color="white"
                    />
                    <Text style={styles.routeText}>Track Route</Text>
                  </TouchableOpacity>
                </View>
              );
            })
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
    marginBottom: 4,
  },
  routeButton: {
    backgroundColor: "#2ecc71",
    paddingVertical: 10,
    borderRadius: 6,
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
    gap: 8,
    marginTop: 10,
  },
  routeText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 14,
  },
});

import axios from "axios";
import * as Location from "expo-location";
import React, { useEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { getHeatIndexLevel } from "../../utils/heatIndex";

export default function App() {
  const [temperature, setTemperature] = useState<number>(0);
  const [locationName, setLocationName] = useState<string>(
    "Loading location..."
  );
  const [coords, setCoords] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);
  const [heatLevel, setHeatLevel] = useState<{
    level: string;
    color: string;
  } | null>(null);

  useEffect(() => {
  (async () => {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      setLocationName("Permission denied");
      return;
    }

    const location = await Location.getCurrentPositionAsync({});
    const { latitude, longitude } = location.coords;
    setCoords({ latitude, longitude });

    const [place] = await Location.reverseGeocodeAsync({
      latitude,
      longitude,
    });

    if (place.city || place.region) {
      setLocationName(
        `${place.city ?? ""}${place.region ? ", " + place.region : ""}`
      );
    } else {
      setLocationName("Unknown Location");
    }

    try {
      const response = await axios.post(
        "http://192.168.1.12:8000/process_userlocation",
        {
          latitude: latitude,
          longitude: longitude
        }
      );

      const data = response.data;
      setTemperature(data.heat_index);
      setHeatLevel((getHeatIndexLevel(data.heat_index)));
      console.log("Suggested shelters:", data.suggested_shelters);

    } catch (error) {
      console.error("Error fetching heat index:", error);
    }
  })();
}, []);

  return (
    <View style={styles.container}>
      <Text style={styles.header}>{locationName}</Text>
      <Text style={styles.date}>Fri, July 4, 2025</Text>

      <View
        style={[styles.temperatureCard, { backgroundColor: heatLevel?.color }]}
      >
        <Text style={styles.emoji}>🌡️☀️</Text>
        <Text style={styles.temperature}>{temperature}°C</Text>
      </View>

      <View style={styles.heatIndexBox}>
        <Text style={styles.heatText}>Heat Index Level:</Text>
        <Text style={[styles.levelText, { color: heatLevel?.color }]}>
          {heatLevel?.level}
        </Text>
      </View>

      <View style={styles.legend}>
        <Text style={styles.legendTitle}>Chart Reference:</Text>
        <View style={styles.chart}>
          {[
            { label: "< 27°C", color: "#ADD8E6", description: "Not Dangerous" },
            { label: "27 - 32°C", color: "#FFFF66", description: "Caution" },
            {
              label: "33 - 41°C",
              color: "#FFD700",
              description: "Extreme Caution",
            },
            { label: "42 - 51°C", color: "#FF4500", description: "Danger" },
            {
              label: "> 51°C",
              color: "#B22222",
              description: "Extreme Danger",
            },
          ].map((item, index) => (
            <View key={index} style={styles.chartItemContainer}>
              <View style={[styles.chartItem, { backgroundColor: item.color }]}>
                <Text style={styles.chartLabel}>{item.label}</Text>
              </View>
              <Text style={styles.chartDescription}>{item.description}</Text>
            </View>
          ))}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 60,
    backgroundColor: "#fff",
    alignItems: "center",
  },
  header: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#233D91",
  },
  date: {
    fontSize: 14,
    color: "#555",
    marginBottom: 20,
  },
  temperatureCard: {
    width: 220,
    height: 220,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
  },
  emoji: {
    fontSize: 60,
    marginBottom: 10,
  },
  temperature: {
    fontSize: 48,
    color: "#fff",
    fontWeight: "bold",
  },
  heatIndexBox: {
    padding: 10,
    alignItems: "center",
  },
  heatText: {
    fontSize: 16,
    fontWeight: "600",
  },
  levelText: {
    fontSize: 20,
    fontWeight: "bold",
  },
  legend: {
    marginTop: 30,
    alignItems: "center",
  },
  legendTitle: {
    fontWeight: "600",
    fontSize: 16,
    marginBottom: 10,
  },
  chart: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
  },
  chartItemContainer: {
    alignItems: "center",
    marginHorizontal: 6,
    marginBottom: 10,
    width: 100,
  },
  chartItem: {
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
  },
  chartLabel: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#000",
  },
  chartDescription: {
    fontSize: 11,
    color: "#333",
    textAlign: "center",
    marginTop: 4,
  },
});

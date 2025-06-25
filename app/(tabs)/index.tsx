import React, { useEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { getHeatIndexLevel } from "../../utils/heatIndex";

export default function App() {
  // State
  const [temperature, setTemperature] = useState<number>(0);
  const [location, setLocation] = useState<string>("STA. MESA, MANILA");
  const [heatLevel, setHeatLevel] = useState<{
    level: string;
    color: string;
  } | null>(null);

  useEffect(() => {
    // TODO: Replace the mock data when backend is implemented
    const mockTemp = 52; // mock temperature value
    const mockLoc = "STA. MESA, MANILA"; // mock location name

    setTemperature(mockTemp);
    setLocation(mockLoc);
    setHeatLevel(getHeatIndexLevel(mockTemp));
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.header}>{location}</Text>
      <Text style={styles.date}>Fri, July 4, 2025</Text>

      <View
        style={[styles.temperatureCard, { backgroundColor: heatLevel?.color }]}
      >
        {/* Replace with local image or emoji as needed */}
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
            <View
              key={index}
              style={[styles.chartItem, { backgroundColor: item.color }]}
            >
              <Text style={styles.chartLabel}>{item.label}</Text>
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
  chartItem: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    margin: 5,
    borderRadius: 8,
    alignItems: "center",
    width: 100,
  },
  chartLabel: {
    fontSize: 12,
    fontWeight: "600",
  },
  chartDescription: {
    fontSize: 11,
    fontWeight: "500",
    color: "#333",
    textAlign: "center",
    marginTop: 2,
  },
});

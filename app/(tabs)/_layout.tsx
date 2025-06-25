import Entypo from "@expo/vector-icons/Entypo";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import Fontisto from "@expo/vector-icons/Fontisto";
import { Tabs } from "expo-router";
import { useEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";

export default function RootLayout() {
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSplash(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  if (showSplash) {
    return (
      <View style={styles.splash}>
        <Text style={styles.title}>🔥 Heat Index App 🔥</Text>
        <Text style={styles.sub}>Loading...</Text>
      </View>
    );
  }

  return (
    <Tabs screenOptions={{ tabBarActiveTintColor: "#EC1A1A" }}>
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ color }) => (
            <Entypo name="home" size={24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="heatMap"
        options={{
          title: "Heat Map",
          tabBarIcon: ({ color }) => (
            <FontAwesome6 name="fire" size={24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="shelterFinder"
        options={{
          title: "Shelter Finder",
          tabBarIcon: ({ color }) => (
            <Fontisto name="map" size={24} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  splash: {
    flex: 1,
    backgroundColor: "#233D91",
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    color: "#fff",
    fontSize: 28,
    fontWeight: "bold",
  },
  sub: {
    color: "#fff",
    fontSize: 16,
    marginTop: 10,
  },
});

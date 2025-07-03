import Entypo from "@expo/vector-icons/Entypo";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import Fontisto from "@expo/vector-icons/Fontisto";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { Tabs } from "expo-router";
import { useEffect, useState } from "react";
import SplashScreen from "../../components/SplashScreen";

export default function RootLayout() {
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSplash(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  if (showSplash) return <SplashScreen />;

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
      <Tabs.Screen
        name="safetyReminders"
        options={{
          title: "Safety Reminders",
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons
              name="newspaper-check"
              size={24}
              color={color}
            />
          ),
        }}
      />
    </Tabs>
  );
}

import Entypo from "@expo/vector-icons/Entypo";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import Fontisto from "@expo/vector-icons/Fontisto";
import { Tabs } from "expo-router";

export default function RootLayout() {
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

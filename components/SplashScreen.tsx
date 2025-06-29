import React from "react";
import { Image, StyleSheet, Text, View } from "react-native";

export default function SplashScreen() {
  return (
    <View style={styles.container}>
      <Image
        source={require("../assets/images/1_SmartShield - LOGO.png")}
        style={styles.logo}
        resizeMode="contain"
      />
      {/* Title: SmartShield */}
      <Text style={styles.title}>
        <Text style={styles.titleRed}>Smart</Text>
        <Text style={styles.titleBlue}>Shield</Text>
        <Text style={styles.titleColon}>:</Text>
      </Text>

      {/* Subtitle */}
      <Text style={styles.subtitle}>
        A Real-Time Heatwave Detection System{"\n"}With an Adaptive Shelter
        Guidance
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
  },
  logo: {
    width: 200,
    height: 200,
  },
  title: {
    fontSize: 30,
    fontWeight: "bold",
  },
  titleRed: {
    color: "#FF3333", // Red for "Smart"
  },
  titleBlue: {
    color: "#233D91", // Blue for "Shield"
  },
  titleColon: {
    color: "#233D91",
    fontWeight: "bold",
  },
  subtitle: {
    color: "#233D91",
    fontSize: 14,
    textAlign: "center",
    marginTop: 10,
  },
});

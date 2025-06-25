import { useRouter } from "expo-router";
import { useEffect } from "react";
import { StyleSheet, Text, View } from "react-native";

export default function SplashScreen() {
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      router.replace("/(tabs)");
    }, 5000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🔥 Heat Index App 🔥</Text>
      <Text style={styles.sub}>Loading...</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff", // White background
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    color: "#233D91", // Dark blue text
    fontSize: 28,
    fontWeight: "bold",
  },
  sub: {
    marginTop: 8,
    fontSize: 16,
    color: "#666",
  },
});

import { Stack } from "expo-router";
import { LocationProvider } from "../context/LocationContext";

export default function RootLayout() {
  return (
    <LocationProvider>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      </Stack>
    </LocationProvider>
  );
}

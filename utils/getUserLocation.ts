import * as Location from "expo-location";

export async function getUserLocation() {
  let { status } = await Location.getForegroundPermissionsAsync();
  if (status !== "granted") {
    const request = await Location.requestForegroundPermissionsAsync();
    if (request.status !== "granted") {
      throw new Error("Location permission denied");
    }
  }

  const location = await Location.getCurrentPositionAsync({});
  return location.coords;
}

export async function getLocationName(latitude: number, longitude: number) {
  const [place] = await Location.reverseGeocodeAsync({ latitude, longitude });
  return place.city || place.region
    ? `${place.city ?? ""}${place.region ? ", " + place.region : ""}`
    : "Unknown Location";
}

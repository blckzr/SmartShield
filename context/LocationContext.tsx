import axios from "axios";
import * as Location from "expo-location";
import React, { createContext, ReactNode, useEffect, useState } from "react";
import { getHeatIndexLevel } from "../utils/heatIndex"; // adjust path as needed

type Coordinates = {
  latitude: number;
  longitude: number;
};

type HeatLevel = {
  level: string;
  color: string;
};

type LocationContextType = {
  coords: Coordinates | null;
  locationName: string;
  heatIndex: number | null;
  heatLevel: HeatLevel | null;
  loading: boolean;
};

export const LocationContext = createContext<LocationContextType>({
  coords: null,
  locationName: "Loading...",
  heatIndex: null,
  heatLevel: null,
  loading: true,
});

export const LocationProvider = ({ children }: { children: ReactNode }) => {
  const [coords, setCoords] = useState<Coordinates | null>(null);
  const [locationName, setLocationName] = useState("Loading...");
  const [heatIndex, setHeatIndex] = useState<number | null>(null);
  const [heatLevel, setHeatLevel] = useState<HeatLevel | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== "granted") {
          setLocationName("Permission denied");
          setLoading(false);
          return;
        }

        const location = await Location.getCurrentPositionAsync({});
        const { latitude, longitude } = location.coords;
        setCoords({ latitude, longitude });

        const [place] = await Location.reverseGeocodeAsync({
          latitude,
          longitude,
        });
        const name =
          place.city || place.region
            ? `${place.city ?? ""}${place.region ? ", " + place.region : ""}`
            : "Unknown Location";
        setLocationName(name);

        // 🔥 Request backend for heat index
        const response = await axios.post(
          "http://192.168.1.12:8000/process_userlocation",
          {
            latitude,
            longitude,
          }
        );

        const data = response.data;
        setHeatIndex(data.heat_index);
        setHeatLevel(getHeatIndexLevel(data.heat_index));
      } catch (err) {
        console.error("Error in LocationContext:", err);
        setLocationName("Location error");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return (
    <LocationContext.Provider
      value={{ coords, locationName, heatIndex, heatLevel, loading }}
    >
      {children}
    </LocationContext.Provider>
  );
};

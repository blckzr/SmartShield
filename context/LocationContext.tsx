import { BASE_URL } from "@/utils/config";
import axios from "axios";
import * as Location from "expo-location";
import React, { createContext, ReactNode, useEffect, useState } from "react";
import { getHeatIndexLevel } from "../utils/heatIndex";

type Coordinates = {
  latitude: number;
  longitude: number;
};

type HeatLevel = {
  level: string;
  color: string;
};

type Shelter = {
  name: string;
  longitude: number;
  latitude: number;
  address: string;
};

type ShelterDirectionData = {
  distance: number; // in meters
  duration: number; // in seconds
};

type LocationContextType = {
  coords: Coordinates | null;
  fixedStartCoords: Coordinates | null;
  locationName: string;
  heatIndex: number | null;
  heatLevel: HeatLevel | null;
  suggestedShelters: Shelter[];
  selectedShelter: Shelter | null;
  pathCoords: Coordinates[];
  getDirectionsToShelter: (shelter: Shelter) => Promise<void>;
  resetRoute: () => void;
  loading: boolean;
  shelterDirections: Record<string, ShelterDirectionData>; // ⬅️ added
};

export const LocationContext = createContext<LocationContextType>({
  coords: null,
  fixedStartCoords: null,
  locationName: "Loading...",
  heatIndex: null,
  heatLevel: null,
  suggestedShelters: [],
  selectedShelter: null,
  pathCoords: [],
  getDirectionsToShelter: async () => {},
  resetRoute: () => {},
  loading: true,
  shelterDirections: {}, // ⬅️ added
});

export const LocationProvider = ({ children }: { children: ReactNode }) => {
  const [coords, setCoords] = useState<Coordinates | null>(null);
  const [fixedStartCoords, setFixedStartCoords] = useState<Coordinates | null>(
    null
  );
  const [locationName, setLocationName] = useState("Loading...");
  const [heatIndex, setHeatIndex] = useState<number | null>(null);
  const [heatLevel, setHeatLevel] = useState<HeatLevel | null>(null);
  const [suggestedShelters, setSuggestedShelters] = useState<Shelter[]>([]);
  const [selectedShelter, setSelectedShelter] = useState<Shelter | null>(null);
  const [pathCoords, setPathCoords] = useState<Coordinates[]>([]);
  const [shelterDirections, setShelterDirections] = useState<
    Record<string, ShelterDirectionData>
  >({});
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

        const response = await axios.post(`${BASE_URL}/process_userlocation`, {
          latitude,
          longitude,
        });

        const data = response.data;
        setHeatIndex(data.heat_index);
        setHeatLevel(getHeatIndexLevel(data.heat_index));
        setSuggestedShelters(data.suggested_shelters);
      } catch (err) {
        console.error("Error in LocationContext:", err);
        setLocationName("Location error");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const getDirectionsToShelter = async (shelter: Shelter) => {
    if (!coords) return;

    try {
      setSelectedShelter(shelter);
      setFixedStartCoords(coords);

      const response = await axios.post(
        `${BASE_URL}/process_shelter_direction`,
        {
          startpoint: coords,
          endpoint: {
            latitude: shelter.latitude,
            longitude: shelter.longitude,
          },
        }
      );

      const linestring = response.data.linestring_coordinates;
      const converted = linestring.map(([lng, lat]: [number, number]) => ({
        latitude: lat,
        longitude: lng,
      }));

      setPathCoords(converted);

      // ✅ Save direction data for this shelter
      setShelterDirections((prev) => ({
        ...prev,
        [shelter.name]: {
          distance: response.data.distance_meters,
          duration: response.data.duration_seconds,
        },
      }));
    } catch (error) {
      console.error("Failed to get shelter directions:", error);
    }
  };

  const resetRoute = () => {
    setSelectedShelter(null);
    setPathCoords([]);
    setFixedStartCoords(null);
    setShelterDirections({});
  };

  return (
    <LocationContext.Provider
      value={{
        coords,
        fixedStartCoords,
        locationName,
        heatIndex,
        heatLevel,
        suggestedShelters,
        selectedShelter,
        pathCoords,
        getDirectionsToShelter,
        resetRoute,
        loading,
        shelterDirections, // ✅ added
      }}
    >
      {children}
    </LocationContext.Provider>
  );
};

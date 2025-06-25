// utils/heatIndex.ts

export function getHeatIndexLevel(temp: number): {
  level: string;
  color: string;
} {
  if (temp < 27) return { level: "Not Dangerous", color: "#ADD8E6" };
  if (temp < 33) return { level: "Caution", color: "#FFFF66" };
  if (temp < 42) return { level: "Extreme Caution", color: "#FFD700" };
  if (temp <= 51) return { level: "Danger", color: "#FF4500" };
  return { level: "Extreme Danger", color: "#B22222" };
}

import * as THREE from "three";

export interface JourneyLocation {
  id: string;
  flag: string;
  nameKey: string;
  descriptionKey: string;
  lat: number;
  lon: number;
}

export const EARTH_RADIUS = 2.05;

export const origin: JourneyLocation = {
  id: "azerbaijan",
  flag: "AZ",
  nameKey: "azerbaijan",
  descriptionKey: "azerbaijan",
  lat: 40.4093,
  lon: 49.8671,
};

export const destinations: JourneyLocation[] = [
  {
    id: "turkey",
    flag: "TR",
    nameKey: "turkey",
    descriptionKey: "turkey",
    lat: 39.9334,
    lon: 32.8597,
  },
  {
    id: "russia",
    flag: "RU",
    nameKey: "russia",
    descriptionKey: "russia",
    lat: 55.7558,
    lon: 37.6173,
  },
  {
    id: "georgia",
    flag: "GE",
    nameKey: "georgia",
    descriptionKey: "georgia",
    lat: 41.7151,
    lon: 44.8271,
  },
  {
    id: "kazakhstan",
    flag: "KZ",
    nameKey: "kazakhstan",
    descriptionKey: "kazakhstan",
    lat: 51.1605,
    lon: 71.4704,
  },
];

export const routeStops = [origin, ...destinations];

export function latLonToVector3(lat: number, lon: number, radius = EARTH_RADIUS) {
  const phi = THREE.MathUtils.degToRad(90 - lat);
  const theta = THREE.MathUtils.degToRad(lon + 180);

  return new THREE.Vector3(
    -(radius * Math.sin(phi) * Math.cos(theta)),
    radius * Math.cos(phi),
    radius * Math.sin(phi) * Math.sin(theta),
  );
}

export function buildFlightCurve(from: JourneyLocation, to: JourneyLocation) {
  const start = latLonToVector3(from.lat, from.lon);
  const end = latLonToVector3(to.lat, to.lon);
  const middle = start.clone().add(end).normalize().multiplyScalar(EARTH_RADIUS * 1.32);

  return new THREE.CatmullRomCurve3([start, middle, end]);
}

export function seededRandom(seed: number) {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
}

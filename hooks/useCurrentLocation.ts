import { useEffect, useState } from "react"
import axios from 'axios';
import { useLocationPermission } from "./useLocationPermission"
import Geolocation, { GeolocationResponse } from "@react-native-community/geolocation"
import { env } from "../env"

export const useCurrentLocation = () => {
  const [currentLocation, setCurrentLocation] = useState('')
  const { isGranted } = useLocationPermission()

  const fetchLocation = async (info: GeolocationResponse) => {
    try {
      const { data } = await axios.get(
        'https://maps.googleapis.com/maps/api/geocode/json',
        {
          params: {
            latlng: `${info.coords.latitude},${info.coords.longitude}`,
            result_type: 'locality',
            key: env.MAX_API_KEY,
          },
        },
      );

      setCurrentLocation(data.results[0]?.formatted_address ?? '');
    } catch (error) { }
  };

  useEffect(() => {
    if (isGranted) {
      Geolocation.getCurrentPosition(fetchLocation);
    }
  }, [isGranted])

  return { currentLocation }
}
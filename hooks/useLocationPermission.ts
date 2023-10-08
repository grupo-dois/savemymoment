import { useEffect, useState } from "react"
import { PermissionsAndroid } from "react-native";

export const useLocationPermission = () => {
  const [isGranted, setIsGranted] = useState(false)

  useEffect(() => {
    const requestCameraPermission = async () => {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          {
            title: 'Permissão de Localização Save My Moment',
            message: 'Save My Moment precisa acessar sua localização',
            buttonNeutral: 'Pergunte-me depois',
            buttonNegative: 'Cancelar',
            buttonPositive: 'OK',
          },
        );

        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          setIsGranted(true)
        } else {
          console.log('Camera permission denied');
        }
      } catch (err) {
        console.warn(err);
      }
    };

    requestCameraPermission();
  }, []);

  return { isGranted }
}
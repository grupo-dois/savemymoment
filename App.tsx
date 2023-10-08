/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, { useState, useRef, useEffect } from 'react';
import type {PropsWithChildren} from 'react';
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  useColorScheme,
  View,
  Image,
  Button,
  Alert,
} from 'react-native';
import HeaderLogin from './components/HeaderLogin'
import firestore from '@react-native-firebase/firestore';
import { useCameraPermission, Camera, useCameraDevice } from 'react-native-vision-camera';


import {
  Colors,
} from 'react-native/Libraries/NewAppScreen';

type SectionProps = PropsWithChildren<{
  title: string;
}>;

function Section({children, title}: SectionProps): JSX.Element {
  const isDarkMode = useColorScheme() === 'dark';
  return (
    <View style={styles.sectionContainer}>
      <Text
        style={[
          styles.sectionTitle,
          {
            color: isDarkMode ? Colors.white : Colors.black,
          },
        ]}>
        {title}
      </Text>
      <Text
        style={[
          styles.sectionDescription,
          {
            color: isDarkMode ? Colors.light : Colors.dark,
          },
        ]}>
        {children}
      </Text>
    </View>
  );
}

function App(): JSX.Element {
  const [moments, setMoments] = useState<{ [key: string]: any }[]>([]);
  const { hasPermission, requestPermission } = useCameraPermission();
  const device = useCameraDevice('back');
  const isDarkMode = useColorScheme() === 'dark';
  const [userInfo, setUserInfo] = useState<{ [key: string]: any }>();
  const [showCamera, setShowCamera] = useState<boolean>();
  const camera = useRef<Camera>(null)

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };

  useEffect(() => {
    firestore()
      .collection('moment')
      .onSnapshot((querySnapshot) => {
        const data = querySnapshot.docs.map((doc) => {
          return {
            id: doc.id,
            ...doc.data()
          }
        })
        setMoments(data)
      });
  }, [])

  const requestCameraPermission = () => {
    if (!hasPermission) {
      requestPermission();
    }
  }

  const takePhoto = async () => {
    if (camera !== null && camera.current !== null) {
      console.clear()
      const file = await camera.current.takePhoto()
      console.log('file', file)
      const result = await fetch(`file://${file.path}`)
      console.log('result', result)
      const data = await result.blob();
      console.log('data', data)
      const photoBase64 = blobToBase64(data)
      .then((base64) => base64)
      .catch((error) => {
        console.error('Erro ao converter Blob para base64:', error);
      });
      console.log('gerou foto', photoBase64)
      console.log('restante a enviar', {
        localization: 'hehe boy',
        user: userInfo?.user.name,
        date: '25/04/1993'
      })
      // firestore()
      // .collection('moment')
      // .add({
      //   image: photoBase64,
      //   localization: 'hehe boy',
      //   user: userInfo?.name,
      //   date: firestore.FieldValue.serverTimestamp()
      // })
      // .then(() => Alert.alert("Momento", "Momento salvo com sucesso!"))
      // .catch((error) => Alert.alert("Erro", "Ocorreu um erro. Tente novamente mais tarde.")))
      // .finally(() => setShowCamera(false))
    }
  }

  const blobToBase64 = (blob: Blob) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  };

  return (
    <>
      {showCamera ?
      (
        <>
          <Camera
            ref={camera}
            style={StyleSheet.absoluteFill}
            device={device}
            isActive={true}
            photo={true}
          />
          <View style={{marginTop: '165%', marginHorizontal: '10%'}}>
            <Button
              onPress={() => takePhoto()}
              title="Tirar Foto"
            />
          </View>
          <View style={{marginTop: '4%', marginHorizontal: '10%'}}>
            <Button
              onPress={() => setShowCamera(false)}
              title="Voltar"
            />
          </View>
        </>
      ) :
      <SafeAreaView style={Colors.lighter}>
        <ScrollView
          contentInsetAdjustmentBehavior="automatic"
          style={backgroundStyle}
        >
          <HeaderLogin userInfo={userInfo} setUserInfo={setUserInfo} />
          <View style={{margin: 5}}>
            <Button
              onPress={() => setShowCamera(true)}
              title="Registrar Momento"
            />
          </View>
          <View
            style={{
              backgroundColor: '#e6e6e6',
            }}>
            {userInfo &&(<Text
              style={[
                styles.sectionDescription,
                {
                  color: isDarkMode ? Colors.light : Colors.dark,
                },
              ]}
            >
              Usuário: {userInfo?.user.name}
            </Text>)}
            {moments?.map(moment => (
              <>
              <View style={styles.photoSection}>
                <Text style={styles.userTitle}>{ moment.user }</Text>
                <Image
                  key={moment.id}
                  style={styles.photo}
                  source={{
                    uri: moment.image,
                  }}
                />
                <Text style={styles.subtitle}>{ moment.date } - { moment.localization }</Text>
              </View>
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <View style={{flex: 1, height: 1, backgroundColor: 'black'}} />
              </View>
              </>
            ))}
            {moments?.length === 0 && (
              <Text style={{
                ...styles.subtitle,
                textAlign: 'center'
              }}>
                Não há momentos a serem mostrados.
              </Text>
            )}
          </View>
        </ScrollView>
      </SafeAreaView>}
    </>
  );
}

const styles = StyleSheet.create({
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
  },
  sectionDescription: {
    marginTop: 8,
    marginLeft: 8,
    fontSize: 18,
    fontWeight: '400',
  },
  highlight: {
    fontWeight: '700',
  },
  photoSection: {
    marginVertical: 12,
  },
  userTitle: {
    fontWeight: 'bold',
    marginLeft: 5,
    marginBottom: 5,
  },
  subtitle: {
    marginLeft: 5,
    marginTop: 5
  },
  photo: {
    width: '100%',
    height: 200,
  },
});

export default App;

import React, {useState, useEffect, useRef} from 'react';
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
import HeaderLogin from './components/HeaderLogin';
import firestore from '@react-native-firebase/firestore';
import storage from '@react-native-firebase/storage';
import {Colors} from 'react-native/Libraries/NewAppScreen';
import {useCurrentLocation} from './hooks';
import {
  useCameraPermission,
  Camera,
  useCameraDevice,
} from 'react-native-vision-camera';

function App(): JSX.Element {
  const [moments, setMoments] = useState<{[key: string]: any}[]>();
  const isDarkMode = useColorScheme() === 'dark';
  const {currentLocation} = useCurrentLocation();
  const [userInfo, setUserInfo] = useState<{[key: string]: any}>();
  const {hasPermission, requestPermission} = useCameraPermission();
  const device = useCameraDevice('back');
  const [showCamera, setShowCamera] = useState<boolean>();
  const camera = useRef<Camera>(null);

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };

  useEffect(() => {
    firestore()
      .collection('moment')
      .onSnapshot(querySnapshot => {
        const data = querySnapshot.docs.map(doc => {
          return {
            id: doc.id,
            ...doc.data(),
          };
        });
        setMoments(data);
      });
  }, []);

  useEffect(() => {
    if (showCamera) {
      requestCameraPermission();
    }
  }, [showCamera]);

  const requestCameraPermission = () => {
    if (!hasPermission) {
      requestPermission();
    }
  };

  const getCurrentDate = () => {
    const dataAtual: Date = new Date();

    const dia: number = dataAtual.getDate();
    const mes: number = dataAtual.getMonth() + 1;
    const ano: number = dataAtual.getFullYear();

    const diaFormatado: string = dia < 10 ? '0' + dia : dia.toString();
    const mesFormatado: string = mes < 10 ? '0' + mes : mes.toString();

    return diaFormatado + '/' + mesFormatado + '/' + ano;
  };

  const takePhoto = async () => {
    if (camera !== null && camera.current !== null) {
      const file = await camera.current.takePhoto({
        qualityPrioritization: 'speed',
      });
      const result = await fetch(`file://${file.path}`);
      const data = await result.blob();
      setShowCamera(false);
      const base64Photo = await blobToBase64(data);

      try {
        const timestamp = Date.now();
        const reference = storage().ref(
          `/user/${userInfo?.user.id}/${timestamp}`,
        );

        const pathToFile = `${file.path}`;

        await reference.putFile(pathToFile);

        firestore()
          .collection('moment')
          .add({
            image: `user/${userInfo?.user.id}/${timestamp}`,
            localization: currentLocation,
            user: userInfo ? userInfo.user.name : '',
            date: getCurrentDate(),
            text: '',
          })
          .then(() => Alert.alert('Momento', 'Momento salvo com sucesso!'))
          .catch(error => {
            Alert.alert('Erro', 'Ocorreu um erro. Tente novamente mais tarde.'),
              console.log(error);
          })
          .finally(() => setShowCamera(false));
      } catch (error) {
        console.log({error});
      }
    }
  };

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
      {showCamera && device ? (
        <>
          <Camera
            ref={camera}
            style={StyleSheet.absoluteFill}
            device={device}
            isActive={true}
            photo={true}
          />
          <View style={{marginTop: '165%', marginHorizontal: '10%'}}>
            <Button onPress={() => takePhoto()} title="Tirar Foto" />
          </View>
          <View style={{marginTop: '4%', marginHorizontal: '10%'}}>
            <Button onPress={() => setShowCamera(false)} title="Voltar" />
          </View>
        </>
      ) : (
        <SafeAreaView style={Colors.lighter}>
          <ScrollView
            contentInsetAdjustmentBehavior="automatic"
            style={backgroundStyle}>
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
              {userInfo && userInfo?.user?.name && (
                <Text
                  style={[
                    styles.sectionDescription,
                    {
                      color: isDarkMode ? Colors.light : Colors.dark,
                    },
                  ]}>
                  Usuário: {userInfo?.user?.name}
                </Text>
              )}
              {moments?.map(moment => {
                const url = `https://firebasestorage.googleapis.com/v0/b/savemymoment-g2-firebase.appspot.com/o/${encodeURIComponent(
                  moment.image,
                )}?alt=media`;

                console.log({url});
                return (
                  <View key={moment.id}>
                    <View style={styles.photoSection}>
                      <Text style={styles.userTitle}>{moment.user}</Text>
                      <Image
                        key={moment.id}
                        style={styles.photo}
                        source={{
                          uri: url,
                        }}
                      />
                      <Text style={styles.subtitle}>
                        {moment.date} - {moment.localization}
                      </Text>
                    </View>
                    <View style={{flexDirection: 'row', alignItems: 'center'}}>
                      <View
                        style={{flex: 1, height: 1, backgroundColor: 'black'}}
                      />
                    </View>
                  </View>
                );
              })}
              {moments?.length === 0 && (
                <Text
                  style={{
                    ...styles.subtitle,
                    textAlign: 'center',
                  }}>
                  Não há momentos a serem mostrados.
                </Text>
              )}
            </View>
          </ScrollView>
        </SafeAreaView>
      )}
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
    marginTop: 5,
  },
  photo: {
    width: '100%',
    height: 200,
  },
});

export default App;

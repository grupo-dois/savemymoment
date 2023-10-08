import React, {useState, useEffect} from 'react';
import type {PropsWithChildren} from 'react';
import {
  PermissionsAndroid,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  useColorScheme,
  View,
  Image,
} from 'react-native';
import HeaderLogin from './components/HeaderLogin';
import firestore from '@react-native-firebase/firestore';
import {Colors} from 'react-native/Libraries/NewAppScreen';
import {useCurrentLocation} from './hooks';

function App(): JSX.Element {
  const [moments, setMoments] = useState<{[key: string]: any}[]>();
  const isDarkMode = useColorScheme() === 'dark';
  const {currentLocation} = useCurrentLocation();
  const [userInfo, setUserInfo] = useState<{[key: string]: any}>();

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

  return (
    <SafeAreaView style={Colors.lighter}>
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        style={backgroundStyle}>
        <HeaderLogin userInfo={userInfo} setUserInfo={setUserInfo} />
        <View
          style={{
            backgroundColor: '#e6e6e6',
          }}>
          {userInfo && (
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
            console.log(moment);
            return (
              <>
                <View style={styles.photoSection}>
                  <Text style={styles.userTitle}>{moment.user}</Text>
                  <Image
                    key={moment.id}
                    style={styles.photo}
                    source={{
                      uri: moment.image,
                    }}
                  />
                  <Text style={styles.subtitle}>{moment.text}</Text>
                  <Text style={styles.dateLocalization}>
                    {moment.date} - {moment.localization}
                  </Text>
                </View>
                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                  <View
                    style={{flex: 1, height: 1, backgroundColor: 'black'}}
                  />
                </View>
              </>
            );
          })}
        </View>
      </ScrollView>
    </SafeAreaView>
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
    marginTop: 2,
  },
  dateLocalization: {
    fontSize: 10,
    marginLeft: 5,
    marginTop: 2,
  },
  photo: {
    width: '100%',
    height: 200,
  },
});

export default App;

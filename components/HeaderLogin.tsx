import React from 'react';
import { StyleSheet, Text, View, Button } from 'react-native';
import { GoogleSignin } from '@react-native-google-signin/google-signin';

GoogleSignin.configure({
  webClientId: '596648308005-h5o8rqs0hhcvrkhuuu915ml80gpnseam.apps.googleusercontent.com',
});

interface Props {
  userInfo: { [key: string]: any } | undefined,
  setUserInfo: (userInfo: { [key: string]: any }) => void,
}

const HeaderLogin: React.FC<Props> = ({ userInfo, setUserInfo }) => {
  const loginAtFirebase = async () => {
    try {
      await GoogleSignin.hasPlayServices();
      const userInfo = await GoogleSignin.signIn();
      setUserInfo({...userInfo});
    } catch (error: any) {
      throw new Error(error);
    }
  };

  const signOut = async () => {
    try {
      await GoogleSignin.signOut();
      setUserInfo({});
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <View style={styles.header}>
      <View>
        <Text style={styles.headerText}>SaveMyMoment</Text>
      </View>
      <View>
        {!userInfo?.idToken ? (<Button title="Login" color="#808080" onPress={() => loginAtFirebase()} />)
        : (<Button title="Logout" color="#808080" onPress={() => signOut()} />)}
      </View>
    </View>
  )
}

export default HeaderLogin;

const styles = StyleSheet.create({
  header: {
    width: '100%',
    height: 75,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#2B97F0',
    paddingHorizontal: '5%',
  },
  headerText: {
    fontWeight: 'bold',
    fontSize: 20,
    color: '#FFF',
    letterSpacing: 1,
  },
})
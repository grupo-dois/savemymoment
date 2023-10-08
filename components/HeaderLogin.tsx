import React from 'react';
import { StyleSheet, Text, View, Button } from 'react-native';

function HeaderLogin(): JSX.Element {
  const loginAtFirebase = () => {
    console.log('loginAtFirebase')
  }

  return (
    <View style={styles.header}>
      <View>
        <Text style={styles.headerText}>SaveMyMoment</Text>
      </View>
      <View>
        <Button title="Login" color="#808080" onPress={() => loginAtFirebase()} />
      </View>
    </View>
  )
}

export default HeaderLogin;

const styles = StyleSheet.create({
  header: {
    width: '100%',
    height: '30%',
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
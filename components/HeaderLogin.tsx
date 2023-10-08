import React from 'react';
import { StyleSheet, Text, View, Button } from 'react-native';

function HeaderLogin(): JSX.Element {
  return (
    <View style={styles.header}>
      <View>
        <Text style={styles.headerText}>SaveMyMoment</Text>
      </View>
      <View>
        <Button title={'login'} />
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
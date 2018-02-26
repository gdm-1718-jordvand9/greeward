import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { initializeFirebase } from './src/utils/firebase';
import RootStack,{ Tabs } from './src/navigator/AppNavigator';
import Expo from 'expo';
export default class App extends React.Component {
  constructor() {
    super();
    this.state = {
      isReady: false,
    }
  }
  async componentWillMount() {
    initializeFirebase();
    await Expo.Font.loadAsync({
      Roboto: require("./assets/fonts/Roboto-Regular.ttf"),
      Roboto_medium: require("./assets/fonts/Roboto-Medium.ttf")
    });
    this.setState({
      isReady: true
    })
  }
  render() {
    if(!this.state.isReady) {
      return (
        <Expo.AppLoading />
      );
    }
    return (
      // <RootStack />
      <Tabs />
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

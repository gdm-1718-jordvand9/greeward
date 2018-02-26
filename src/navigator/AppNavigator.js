import React from 'react';
import HomeScreen from '../screens/HomeScreen';
import DetailsScreen from '../screens/DetailsScreen';
import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';
import LeaderScreen from '../screens/LeaderScreen';
import TestScreen from '../screens/TestScreen';
import ActivityDetail from '../screens/ActivityDetail';
import { StackNavigator, TabNavigator } from 'react-navigation';
import { Icon, Footer, FooterTab, Button } from 'native-base';

const RootStack = StackNavigator(
  {
    Home: { screen: HomeScreen, navigationOptions: { title: 'Home', headerLeft: null}, },
    Details: { screen: DetailsScreen, navigationOptions: { title: 'Details'}, },
    Login: { screen: LoginScreen, navigationOptions: { title: 'Login'}, },
    Register: { screen: RegisterScreen,  navigationOptions: { title: 'Register'},},
    Leader: { screen: LeaderScreen, navigationOptions: { title: 'Leaderboard'}, },
  },
  {
    initialRouteName: 'Home',
  }
);

const DetailsStack = StackNavigator({
  Details: { screen: DetailsScreen},
  Login: { screen: LoginScreen}
})
const ActivityDetailStack = StackNavigator({
  ActivityDetail: { screen: ActivityDetail}
})

export const Tabs = TabNavigator({
  Feed: { screen: HomeScreen, },
  Leader: {screen: LeaderScreen},
  Me: { screen: DetailsStack, },
  Test: { screen: TestScreen, },
  ActivityDetail: { screen: ActivityDetail},
},
{
  tabBarPosition: 'bottom',
  swipeEnabled: false,
  animationEnabled: true,
  tabBarComponent: props => {
    return(
      <Footer>
          <FooterTab>
            <Button
            active={props.navigationState.index === 0}
            onPress={() => props.navigation.navigate('Feed')}
            >
              <Icon name="navigate" />
            </Button>
            <Button
            active={props.navigationState.index=== 1}
            onPress={() => props.navigation.navigate('Leader')}
            >
              <Icon name="bicycle" />
            </Button>
            <Button 
            active={props.navigationState.index === 2}
            onPress={() => props.navigation.navigate('Me')}>
              <Icon active name="person" />
            </Button>
          </FooterTab>
        </Footer>
    );
  }
}
);

export default RootStack;
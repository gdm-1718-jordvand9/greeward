import React, { Component } from 'react';
import { Container, Header, Content, Footer, FooterTab, Button, Icon } from 'native-base';
import { StackNavigator } from 'react-navigation';
import { withNavigation, NavigationActions } from 'react-navigation';
import { resetNavigation } from '../../src/navigator/AppNavigator';

class FooterTabsIconExample extends Component {
  resetNavigation(targetRoute) {
    const resetAction = NavigationActions.reset({
      index: 0,
      actions: [
        NavigationActions.navigate({ routeName: targetRoute}),
      ],
    });
    this.props.navigation.dispatch(resetAction);
  }
  render() {
    
    return (
        <Footer>
          <FooterTab>
            <Button onPress={() => {this.resetNavigation('Home')}} >
              <Icon name="home" />
            </Button>
            <Button>
              <Icon name="bicycle" />
            </Button>
            <Button active>
              <Icon active name="navigate" />
            </Button>
          </FooterTab>
        </Footer>
    );
  }
}
export default withNavigation(FooterTabsIconExample);
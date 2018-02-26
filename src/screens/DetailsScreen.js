import React from 'react';
import {Container, Content, Text, List, ListItem, Title, Button, Header} from 'native-base';
import firebase from 'firebase';
import FooterTabsIconExample from '../../src/components/FooterTabsIconExample';



export default class DetailsScreen extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      isLoggedIn: false,
      displayName: '',
      email: '',
      UID: '',
      totalPoints: '',
      totalKm: '',
      totalCo: '',
      followers: '',
      following:'',
      
    }
    this.getCurrentUser();
  }
  loggedInRender() {
    return <Button><Text>INGELOGD</Text></Button>
  }
  getCurrentUser() {
    console.log('checking current user');
    firebase.auth().onAuthStateChanged((user) => {
      if(user) {
        console.log(user.displayName + ' is hier');
        const uid = user.uid;
        firebase.database().ref('/users/' + uid).once('value', (snapshot) => {
          this.setState({
            isLoggedIn: true,
            displayName: user.displayName,
            email: user.email,
            UID: user.uid,
            totalPoints: snapshot.val().puntenTotal,
            totalKm: snapshot.val().kmTotal,
            totalCo:  Math.round(snapshot.val().coTotal * 100) / 100,
            followers: snapshot.val().followerCount,
            following: snapshot.val().followingCount,
          });
        });
      }
      else {
        console.log('niemand hier');
      }
    })
  }
  logOut() {
    firebase.auth().signOut().then(() => {
      this.setState({
        isLoggedIn: false,
      })
      console.log('Logout succesfull');
    })
  }
  render() {
    return (
      <Container>
        {this.state.isLoggedIn === true && 
        <Content>
        <List>
          <ListItem itemHeader first>
            <Text>User Info</Text>
          </ListItem>
          <ListItem >
            <Text>{'Username: ' + this.state.displayName}</Text>
          </ListItem>
          <ListItem last>
          <Text>{'Email: ' + this.state.email}</Text>
          </ListItem>
          <ListItem itemHeader>
            <Text>User stats</Text>
          </ListItem>
          <ListItem>
            <Text>{'Totale punten: ' + this.state.totalPoints}</Text>
          </ListItem>
          <ListItem>
            <Text>{'Totale co2 bespaard: ' + this.state.totalCo}</Text>
          </ListItem>
          <ListItem>
            <Text>{'Totale km gereden: ' + this.state.totalKm}</Text>
          </ListItem>
          <ListItem itemHeader>
            <Text>Social stats</Text>
          </ListItem>
          <ListItem>
            <Text>{'Followers: ' + this.state.followers}</Text>
          </ListItem>
          <ListItem>
            <Text>{'Following: ' + this.state.following}</Text>
          </ListItem>
        </List>
        <Button
        rounded
        full
        onPress={() => this.logOut()}
        >
          <Text>Log out</Text>
        </Button>
        <Button
        rounded
        full
        onPress={() => this.props.navigation.navigate('Test')}
        >
          <Text>Test</Text>
        </Button>
        </Content>
        }
        {this.state.isLoggedIn === false &&
        <Content>
          <Text style={{marginTop:20}}>Please log in to view your profile page.</Text>
          <Button
        rounded
        full
        onPress={() => this.props.navigation.navigate('Login')}
        style={{marginTop:20}}
        >
          <Text>Login</Text>
        </Button>
        </Content>
        
        } 
      </Container>
    );
  }
}

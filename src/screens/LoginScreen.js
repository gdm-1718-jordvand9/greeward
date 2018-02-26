import React from 'react';
import {Container, Content, Button, Text, Form, Item, Input, Label, Body, Title, Icon } from 'native-base';
import { logInUser } from '../../src/utils/firebase';
import FooterTabsIconExample from '../../src/components/FooterTabsIconExample';
import { FirebaseAuth } from '../utils/firebase'

export default class LoginScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      validEmail: 'succes',
      email: "",
      password: "",
    }
  }
  logInUser () {
    console.log("starting login");
    console.log("Email: " + this.state.email + " Password: " + this.state.password);
    FirebaseAuth().signInWithEmailAndPassword(this.state.email, this.state.password)
    .then(e => {
      console.log('LogIn succeeded');
    })
    .catch(error => {
      console.log(error.code)
      switch(error.code) {
        case 'auth/invalid-email': 
          alert('Enter a valid password')
          break;
        case 'auth/user-not-found':
          alert("This email and password combination doesn't exist")
          break;
        case 'auth/wrong-password':
          alert("Incorrect password")
          break;
        default:
          alert(error.message)
          break;
      }
    });
  }
  render() {
    return (
      <Container>
        <Content>
          <Form>
            <Item floatingLabel>
              <Label>Email</Label>
              <Input autoCorrect={false} autoCapitalize='none' onChangeText={email => this.setState({ email })} />
            </Item>
            <Item floatingLabel last style={{marginBottom: 50}}>
              <Label>Password</Label>
              <Input secureTextEntry={true} onChangeText={password => this.setState({ password })} />
            </Item>
            <Button block onPress={() => this.logInUser()}>
              <Text>Sign in</Text>
            </Button>
          </Form>
          
        </Content>
      </Container>
    );
  }
}
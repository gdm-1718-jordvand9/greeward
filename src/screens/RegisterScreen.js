import React from 'react';
import {Container, Header, Content, Button, Text, Form, Item, Input, Label, Body, Title } from 'native-base';
import { registerUser } from '../../src/utils/firebase';

export default class RegisterScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      name: "",
      email: "",
      password: "",
    }
  }
  render() {
    return (
      <Container>
        <Header>
          <Body>
            <Title>Register</Title>
          </Body>
        </Header>
        <Content>
          <Form>
            <Item floatingLabel>
              <Label>Name</Label>
              <Input onChangeText={name => this.setState({ name })} />
            </Item>
            <Item floatingLabel>
              <Label>Email</Label>
              <Input onChangeText={email => this.setState({ email })} />
            </Item>
            <Item floatingLabel last style={{marginBottom: 50}}>
              <Label>Password</Label>
              <Input secureTextEntry={true} onChangeText={password => this.setState({ password })} />
            </Item>
            <Button block onPress={() => registerUser(this.state.email, this.state.password, this.state.name)}>
              <Text>Sign up</Text>
            </Button>
          </Form>
          
        </Content>
      </Container>
    );
  }
}
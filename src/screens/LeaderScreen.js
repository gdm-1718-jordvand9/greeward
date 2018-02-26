import React from 'react';
import { ListView } from 'react-native'
import {Container, Header, Content, Text, List, ListItem, View, Badge, Left} from 'native-base';
import { FirebaseDatabase } from '../utils/firebase'
import FooterTabsIconExample from '../../src/components/FooterTabsIconExample';

export default class DetailsScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      points: [],
    };
    
    this.getLeaders();
  }
  getLeaders() {
    const usersRef = FirebaseDatabase().ref('/users');
    let arr = [];
    usersRef.orderByChild('puntenTotal').limitToLast(10).on('child_added', (snap) => {
      arr.push(snap.val())
        this.setState({
          points: arr,
        });
    });
    
  }
  render() {
    return (
      <Container>
        <Header />
      <Content>
      <List dataArray={this.state.points} renderRow={(item) => 
        <View>
           <ListItem>
              <Left>
                <Text>{item.name}</Text>
              </Left>
              <Badge primary>
                <Text>{item.puntenTotal}</Text>
              </Badge>
            </ListItem>
        </View>
      } >
      </List>
      </Content>
      {/* <FooterTabsIconExample /> */}
      </Container>
    );
  }
}
import React from 'react';
import { StatusBar, StyleSheet, ListView } from 'react-native'
import {Container, Header, Content, Button, Text, Icon, Item, Input, List, ListItem, Thumbnail, Body, Left, Right } from 'native-base';
import { FirebaseDatabase, FirebaseAuth, FirebaseComplete } from '../utils/firebase';


let data = []
export default class TestScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      ListViewData : data,
      newKm: "",
    }
    this.ds = new ListView.DataSource({rowHasChanged: (r1,r2) => r1 !== r2})
  }
  componentDidMount() {
    var that = this
    FirebaseDatabase().ref('/feed').on('child_added', (data) => {
      let newData = [...that.state.ListViewData]
      newData.push(data);
      that.setState({ListViewData: newData})
    });
  }
  addRow(data){
    const kilometers = this.state.newKm ? this.state.newKm : Math.round((Math.random(0,1)*6));
    const points = Math.round(kilometers * 10);
    const co = Math.round((Math.random(0,1) * kilometers),2);
    const authorId = FirebaseAuth().currentUser.uid;
    const author = FirebaseAuth().currentUser.displayName;
    const ActivityData = {
      author: author,
      uid: authorId,
      km : kilometers,
      co: co,
      points: points,
      visible: true,
      createdDate: FirebaseComplete().database.ServerValue.TIMESTAMP
    }
    const key = FirebaseDatabase().ref('/feed').push().key
    const updates = {};
    updates['/feed/' + key] = ActivityData;
    updates['/user-feed/' + authorId + '/' + key] = ActivityData;
    FirebaseDatabase().ref().update(updates).then(e => {
      console.log('Activity created')
    }).catch(error => {
      console.log(error)
    });
    //FirebaseDatabase().ref('/feed').child(key).set({name:data})
  }
  async deleteRow(secId, rowId, rowMap, data) {
    await FirebaseDatabase().ref('/feed/' + data.key).set(null);
    rowMap[`${secId}${rowId}`].props.closeRow();
    let newData = [...this.state.ListViewData]
    newData.splice(rowId,1)
    this.setState({ListViewData: newData});

  }
  showInformation() {

  }
  render() {
    return (
      <Container style={styles.container}>
        <Header style={{marginTop: StatusBar.currentHeight}}>
        <Content>
          <Item>
            <Input 
            onChangeText={(newKm) => this.setState({ newKm })}
            placeholder = "Enter kilometers" />
            <Button onPress={() => this.addRow(this.state.newKm)}>
              <Icon name="add" />
            </Button>
          </Item>
          
        </Content>
        </Header>
        <Content>
          <List 
          enableEmptySections
          dataSource={this.ds.cloneWithRows(this.state.ListViewData)}
          renderRow={data=>
          <ListItem avatar style={{paddingTop: 10, paddingLeft: 10}}>
          <Left>
            <Thumbnail source={{uri: 'https://i.imgur.com/RRWRFac.png'}} />
          </Left>
          <Body>
            <Text note>Gent</Text>
            <Text>{data.val().author}</Text>
            <Text note>
            <Icon name="ios-bicycle" style={{fontSize:20}} />{ '  ' +data.val().km + ' '}
            <Icon name="ios-trophy-outline" style={{fontSize: 17}} /> {data.val().points + ' points'+ '\n'}
            <Icon name="ios-leaf-outline" style={{fontSize: 20}} /> {' ' + Math.round(data.val().co) + ' gr minder co'}
            
            </Text>
          </Body>
          <Right>
            <Button transparent>
              <Icon /* ative */ name="ios-heart-outline" style={{color:'red'}}/>
              
            </Button>
          </Right>
          </ListItem>
          }
          renderLeftHiddenRow={data => 
          <Button full
          onPress={() => this.addRow(data)}
          >
            <Icon name="information-circle" />
          </Button>
          }
          renderRightHiddenRow ={(data,secId, rowId, rowMap) => 
            <Button full danger
            onPress={() => this.deleteRow(secId, rowId, rowMap, data)}
            >
              <Icon name="trash" />
            </Button>
          }
          leftOpenValue={+75}
          rightOpenValue={-75}
          />
        </Content>
      </Container>
    );
  }
}
const styles = StyleSheet.create({
  container: {
    flex:1,
  }
})
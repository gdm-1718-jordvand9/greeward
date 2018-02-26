import React from 'react';
import { StatusBar, StyleSheet, ListView, ActivityIndicator } from 'react-native'
import {Container, Header, Content, Button, Text, Icon, Item, Input, List, ListItem, Thumbnail, Body, Left, Right, Spinner } from 'native-base';
import { FirebaseDatabase, FirebaseAuth, FirebaseComplete } from '../utils/firebase';


let data = []
export default class HomeScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      ListViewData : data,
      newKm: "",
      loading: true,
    }
    this.ds = new ListView.DataSource({rowHasChanged: (r1,r2) => r1 !== r2})
  }
  componentDidMount() {
    var that = this
    FirebaseDatabase().ref('/feed').on('child_added', (data) => {
      FirebaseDatabase().ref('activity-likes/' + data.key).once('value', snapshot => {
        if(snapshot.hasChild(FirebaseAuth().currentUser.uid)){
          data.userLiked = true
        }
        else {
          data.userLiked = false
        }
        //console.log(data.userLiked);
        data.likeCount = data.val().likeCount
        let newData = [...that.state.ListViewData]
        newData.push(data);
        that.setState({ListViewData: newData, loading: false})
      });
    });
  }
  addRow(data){
    const kilometers = this.state.newKm ? this.state.newKm : Math.round((Math.random(0,1)*6));
    const points = Math.round(kilometers * 10);
    const co = Math.random(0,1) * kilometers;
    const authorId = FirebaseAuth().currentUser.uid;
    const author = FirebaseAuth().currentUser.displayName;
    let cities = ['Gent', 'Antwerpen', 'Kortrijk', 'Brussel']; 
    var randomCity = cities[(Math.random() * cities.length) | 0]; 
    const ActivityData = {
      author: author,
      uid: authorId,
      km : kilometers,
      co: co,
      points: points,
      city: randomCity,
      visible: true,
      likeCount: 0,
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
    const updates = {};
    updates['/feed/' + data.key] = null;
    updates['/user-feed/' + data.val().uid + '/' + data.key] = null;
    await FirebaseDatabase().ref().update(updates);
    rowMap[`${secId}${rowId}`].props.closeRow();
    let newData = [...this.state.ListViewData]
    newData.splice(rowId,1)
    this.setState({ListViewData: newData});
  }
  updateLikeCounter(data,bool) {
    FirebaseDatabase().ref('feed/' + data.key).transaction((snap) => {
      if(snap != null) {
        if(bool === true) {
          snap.likeCount++;
        }
        else if (bool=== false) {
          snap.likeCount--;
        }
      }
      else {
        snap = 1
      }
      return snap;
    }, (error, committed, snapshot) => {
      if (error) {
        console.log('error in transaction');
      } else if (!committed) {
        console.log('transaction not committed');
      } else {
        console.log('Transaction Committed');
      }
    }, true
  
  );
  }
  likeActivity(data, rowId) {
    console.log(data.key)
    console.log(data.likeCount)
    if(data.userLiked === true) {
      FirebaseDatabase().ref('activity-likes/' + data.key).update({[FirebaseAuth().currentUser.uid]: null}).then(e => {
        const obj = data
        obj.userLiked = false
        // Updating of like count not under promise of transaction
        obj.likeCount--
        let newData = [...this.state.ListViewData]
        newData[rowId] = obj
        this.setState({ListViewData: newData});
        this.updateLikeCounter(data, false)
      })
    }
    else {
      FirebaseDatabase().ref('activity-likes/' + data.key).update({[FirebaseAuth().currentUser.uid]: true}).then(e => {
        const obj = data
        // Updating of like count not under promise of transaction
        obj.likeCount++
        obj.userLiked = true
        let newData = [...this.state.ListViewData]
        newData[rowId] = obj
        this.setState({ListViewData: newData})
        this.updateLikeCounter(data, true)
      })
    }
    console.log(data.val().likeCount)
  }
  showInformation() {

  }
  render() {
    const loading = this.state.loading;
    if(loading) {
      return(
        <Container style={styles.spinner}>
        <Header />
          <Content>
            <Spinner color="green"/>
          </Content>
        </Container>
      )
    }
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
          renderRow={(data, secId, rowId)=>
          <ListItem avatar style={{paddingTop: 10, paddingLeft: 10}}>
          <Left>
            <Thumbnail source={{uri: 'https://i.imgur.com/RRWRFac.png'}} />
          </Left>
          <Body>
            
            <Text note>{data.val().city}</Text>
            <Text>{data.val().author}</Text>
            <Text note>
            <Icon name="ios-bicycle" style={{fontSize:20}} />{ '  ' +data.val().km + ' '}
            <Icon name="ios-trophy-outline" style={{fontSize: 17}} /> {data.val().points + ' points'+ '\n'}
            <Icon name="ios-leaf-outline" style={{fontSize: 20}} /> {' ' + (data.val().co).toFixed(2) + ' gr minder co'}
            
            </Text>
          </Body>
          <Right>
            <Button transparent onPress={() => this.likeActivity(data, rowId)} >
              <Icon /* ative */ name= {data.userLiked === true ? 'ios-heart' : 'ios-heart-outline'} style={{color:'red', marginRight: 0}}/>
              <Text note>{data.likeCount}</Text>
            </Button>
          </Right>
          </ListItem>
          }
          renderLeftHiddenRow={data => 
          <Button full
          onPress={() => this.props.navigation.navigate('ActivityDetail', {data})}
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
          leftOpenValue={75}
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
  },
  spinner: {
    flex:1,
    justifyContent: 'center',
  }
})
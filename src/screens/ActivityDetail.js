import React from 'react';
import { ListView } from 'react-native'
import {Container, Header, Content, Text, View, Thumbnail, Icon, Left, Right, Card, CardItem, Body, Grid, Col, Item, Input, Button} from 'native-base';
import { FirebaseDatabase, FirebaseComplete, FirebaseAuth } from '../utils/firebase'
import FooterTabsIconExample from '../../src/components/FooterTabsIconExample';

let data =[];
export default class ActivityDetail extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      ListViewData : data,
      comment: "",
      loading: true,
    }
  }
  getData() {
    console.log('getting data');
    console.log(this.props.navigation.state)
    const { params } = this.props.navigation.state;
    if(params) {
      console.log("yes");
      var that = this
      FirebaseDatabase().ref('activity-comments/' + params.data.key).on('child_added', (data) => {
        //console.log(data.val())
        let newData = [...that.state.ListViewData]
        newData.push(data);
        that.setState({ListViewData: newData, loading: false})
      });
    }
  }
  addRow(data) {
    const { params } = this.props.navigation.state;
    console.log(data);
    const authorId = FirebaseAuth().currentUser.uid;
    const author = FirebaseAuth().currentUser.displayName;
    const ActivityComment = {
      author: author,
      authorId: authorId,
      createdDate: FirebaseComplete().database.ServerValue.TIMESTAMP,
      comment: this.state.comment
    }
    const key = FirebaseDatabase().ref('/feed').push().key
    FirebaseDatabase().ref('activity-comments/' + params.data.key + '/' + key ).update(ActivityComment).then(e => {
      console.log('Activitycomment created')
    }).catch(error => {
      console.log(error)
    });
  }
  render() {
    this.getData()
    const { params } = this.props.navigation.state;
    if(params) {
      console.log(this.state.ListViewData);
      return (
        <Container>
          <Header />
          <Content>
            <Item>
              <Input 
              onChangeText={(comment) => this.setState({ comment })}
              placeholder = "Enter kilometers" />
              <Button onPress={() => this.addRow(this.state.comment)}>
                <Icon name="add" />
              </Button>
            </Item>
              <Card>
                <CardItem>
                  <View style={{flexDirection:'row'}}>
                    <Thumbnail large source={{uri: 'https://i.imgur.com/RRWRFac.png'}} />
                    <View style={{paddingLeft:10}}>
                      <Text style={{fontSize:20}} >{params.data.val().author}</Text>
                      <Text note style={{paddingBottom:5}}>{params.data.val().city} - 10 uur geleden</Text>
                      <Icon name={params.data.userLiked === true ? 'ios-heart' : 'ios-heart-outline'} style={{fontSize:25, color:'red'}}><Text note style={{lineHeight:25}}> {params.data.likeCount}</Text></Icon>
                    </View>
                  </View>
                </CardItem>
                <CardItem>
                  <Grid>
                    <Col style={{ alignItems:'center' }}>
                      <Icon name='ios-bicycle' style={{fontSize:40}}/>
                      <Text note>{params.data.val().km} km</Text>
                    </Col>
                    <Col style={{ alignItems:'center' }}>
                      <Icon name='ios-trophy-outline' style={{fontSize:40}}/>
                      <Text note>{params.data.val().points} points</Text>
                    </Col>
                    <Col style={{ alignItems:'center' }}>
                      <Icon name='ios-leaf-outline' style={{fontSize:40}}/>
                      <Text note>{(params.data.val().co).toFixed(2)} co</Text>
                    </Col>
                  </Grid>
                </CardItem>
              </Card>
              <Card
              
              enableEmptySections
              dataArray={this.state.ListViewData}
              renderRow={(data) => 
                <Text>{data.val().comment}</Text>
              } 
              >
                <CardItem header>
                  <Text>Naam</Text>
                </CardItem>
                <CardItem>
                  <Body>
                    <Text>
                      //Your text here
                    </Text>
                  </Body>
                </CardItem>
              </Card>
          </Content>
        </Container>
      );
    }
    return (
      <View></View>
    );
    //console.log(this.props.navigation.state.params)
    
  }
}
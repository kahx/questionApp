import React, { Component,createRef } from 'react';
import {View, StyleSheet, TouchableOpacity, Text, ScrollView, StatusBar} from 'react-native';
import {Snackbar, Switch, Button} from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import BottomBar from 'react-native-bottom-bar'
import Icon from "react-native-dynamic-vector-icons";
import RNSketchCanvas from '@terrylinla/react-native-sketch-canvas';
import Item from './Item';
import ItemPicker from './ItemPicker';

const colorGradient = ["#222831", "#c9d6df"];
let canvasColor = 'gray'

AsyncStorage.getItem('favQuestions')
.then((item) => {
     if (!item) {
      let questionArray = [];
      AsyncStorage.setItem('favQuestions', JSON.stringify(questionArray));
     }
});

export default class App extends Component {
  
  constructor(props) {
    super(props);
    this.scrollBar = createRef();
    this.canvas = createRef();
    this.setChanged = this.setChanged.bind(this);
    this.state = {
      activeQuestion: 0,
      isHidden: true,
      answer: true,
      scrollable: true,
      snackBarVisible: false,
      snackBarText: '',
      isSwitchOn : false,
      userAnswer: ''
    }
    this.mainIconOnPress = this.mainIconOnPress.bind(this);
  }
  setChanged(value) {
    this.setState({activeQuestion : value - 1});
  }
  mainIconOnPress() {
    {this.state.isHidden == true ? this.setState({isHidden: false}) : null}
    setTimeout(() => {
      this.scrollBar.current.scrollToEnd()
    }, 100);
  }
  renderMainIcon() {
    return (
      <Icon name="check-circle" type="FontAwesome" size={40} color="white" />
    );
  }
  renderFirstIconComponent() {
    return (
      <TouchableOpacity style={{right:16, top: 5}} onPress={()=>{
        if(this.state.activeQuestion > 0){
          this.setState({activeQuestion : parseInt(this.state.activeQuestion) - 1});
          this.scrollBar.current.scrollTo({x: 0, y: 0, animated: true})
          {this.state.isHidden == false ? this.setState({isHidden: true}) : null}
        }
      }}>
      <Icon
        name="chevron-left"
        type="FontAwesome"
        color="#222831"
        size={30}
      />
      </TouchableOpacity>
    );
  }
  renderSecondIconComponent() {
    return (
      <TouchableOpacity style={{right:24}} onPress={()=>{
        AsyncStorage.getItem('favQuestions')
        .then((item) => {
            let questionArray = JSON.parse(item)
            if(!questionArray.includes(this.state.activeQuestion)){
              questionArray.push(this.state.activeQuestion)
              AsyncStorage.setItem('favQuestions', JSON.stringify(questionArray)).then(() => {
                {this.setState({snackBarVisible: !this.state.snackBarVisible})}
                {this.setState({snackBarText: 'Soru listenize eklendi.'})}
              })
            }else{
              {this.setState({snackBarVisible: !this.state.snackBarVisible})}
              {this.setState({snackBarText: 'Soru zaten listenizde ekli.'})}
            }
        });
      }}>
      <Icon
        name="star"
        type="FontAwesome"
        color="#222831"
        size={35}
      />
      </TouchableOpacity>
    );
  }
  renderThirdIconComponent() {
    return (
      <TouchableOpacity style={{left:24}} onPress={()=>this.canvas.current.undo()}>
      <Icon
        name="shopping-cart"
        type="FontAwesome"
        color="#222831"
        size={35}
      />
      </TouchableOpacity>
    );
  }
  renderFourthIconComponent() {
    return (
      <TouchableOpacity style={{left:16, top: 5}} onPress={()=>{
        if(this.state.activeQuestion < 99){
          this.setState({activeQuestion : parseInt(this.state.activeQuestion) + 1});
          {this.state.isHidden == false ? this.setState({isHidden: true}) : null}
          this.scrollBar.current.scrollTo({x: 0, y: 0, animated: true})
        }
      }}>
      <Icon
        name="chevron-right"
        type="FontAwesome"
        color="#222831"
        size={30}
      />
      </TouchableOpacity>
    );
  }
  
  render(){
    return(
      <View style={styles.container}>
        <StatusBar barStyle="light-content"/>
        <ItemPicker setChanged={this.setChanged} activeQuestion={this.state.activeQuestion}/>
        <ScrollView contentContainerStyle={{
          paddingBottom: 60,
          }}
          ref={this.scrollBar}
          scrollEnabled={this.state.scrollable}
        >
        <Item activeQuestion={this.state.activeQuestion}/>
        <View style={{flexDirection: 'row', justifyContent:'space-evenly', alignItems:'center'}}>
          <View style={{flexDirection:'row', alignItems:'center', left: -25}}>
            <Text style={{fontSize:16, marginLeft: 20}}>Tahta</Text>
            <Switch style={{marginLeft: 15}} value={this.state.isSwitchOn} onValueChange={() => {
              this.setState({isSwitchOn: !this.state.isSwitchOn}, () => {
                if(this.state.isSwitchOn){
                  this.setState({scrollable : false});
                  canvasColor = 'green';
                }else{
                  this.setState({scrollable : true})
                  canvasColor = 'gray';
                }
              })
              }}/>
            </View>
          <Button color="#222831"  mode="contained" disabled={!this.state.isSwitchOn} onPress={() => this.canvas.current.undo()}>Geri al</Button>
          <Button color="#e63946"  mode="contained" disabled={!this.state.isSwitchOn} onPress={() => this.canvas.current.clear()}>Temizle</Button>
        </View>
        <View pointerEvents={this.state.scrollable ? 'none' : 'auto'}>
          <RNSketchCanvas
              ref={this.canvas}
              canvasStyle={{ backgroundColor: 'white', height:400, borderWidth: 2,
              borderColor: canvasColor, marginBottom:40}}
              containerStyle={{ backgroundColor: 'white',  margin:20 }}
              defaultStrokeWidth={3}
            />
         </View>
        {this.state.isHidden ? null : <Item activeQuestion={this.state.activeQuestion} answer={this.state.answer}/>}
        </ScrollView>
        <View>
        <Snackbar
          visible={this.state.snackBarVisible}
          onDismiss={() => this.setState({snackBarVisible: false})}
          duration={2500}
          style={{marginBottom:75, backgroundColor: '#222831'}}>
          {this.state.snackBarText}
        </Snackbar>
        </View>
        <BottomBar
            shapeColor="#d6d7d9"
            mainIconGradient={colorGradient}
            mainIcon={this.renderMainIcon()}
            mainIconOnPress={this.mainIconOnPress}
            firstIconComponent={this.renderFirstIconComponent()}
            secondIconComponent={this.renderSecondIconComponent()}
            thirdIconComponent={this.renderThirdIconComponent()}
            fourthIconComponent={this.renderFourthIconComponent()}
          />
      </View>
    )
  }
}
const styles = StyleSheet.create({
  container:{
    flex: 1,
  },
});

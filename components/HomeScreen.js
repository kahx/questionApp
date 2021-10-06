import React, { Component,createRef } from 'react';
import {View, StyleSheet, TouchableOpacity, Text, ScrollView, StatusBar} from 'react-native';
import {Snackbar, Switch, Button} from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from "react-native-vector-icons/FontAwesome";
import RNSketchCanvas from '@terrylinla/react-native-sketch-canvas';
import { scale, verticalScale, moderateScale, moderateVerticalScale } from 'react-native-size-matters';
import Item from './Item';
import ItemPicker from './ItemPicker';

let canvasColor = 'gray'

AsyncStorage.getItem('favQuestions')
.then((item) => {
     if (!item) {
      let questionArray = [];
      AsyncStorage.setItem('favQuestions', JSON.stringify(questionArray));
     }
});
AsyncStorage.getItem('answerCounter')
.then((item) => {
     if (!item) {
      AsyncStorage.setItem('answerCounter', JSON.stringify(5));
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
  }
  setChanged(value) {
    this.setState({activeQuestion : value - 1});
    {this.state.isHidden == false ? this.setState({isHidden: true}) : null}
    this.scrollBar.current.scrollTo({x: 0, y: 0, animated: true})
  }

  render(){
    const { navigation } = this.props;
    return(
      <View style={styles.container}>
        <StatusBar barStyle="light-content"/>
        <ItemPicker setChanged={this.setChanged} activeQuestion={this.state.activeQuestion}/>
        <ScrollView contentContainerStyle={{
          paddingBottom: moderateVerticalScale(30, 0.8),
          }}
          ref={this.scrollBar}
          scrollEnabled={this.state.scrollable}
        >
        <Item activeQuestion={this.state.activeQuestion}/>
        <View style={{flexDirection: 'row', justifyContent:'space-evenly', alignItems:'center'}}>
          <View style={{flexDirection:'row', alignItems:'center', left: moderateScale(5, 0.5)}}>
            <Text style={{fontSize:moderateScale(15, 0.7), marginLeft: scale(-20)}}>Tahta</Text>
            <Switch style={{marginLeft: moderateScale(10, 0.7)}} value={this.state.isSwitchOn} onValueChange={() => {
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
              canvasStyle={{ backgroundColor: 'white', height:verticalScale(365), borderWidth: 2,
              borderColor: canvasColor, marginBottom:verticalScale(25)}}
              containerStyle={{ backgroundColor: 'white',  margin:scale(20) }}
              defaultStrokeWidth={3}
            />
         </View>
        {this.state.isHidden ? null : <Item activeQuestion={this.state.activeQuestion} answer={this.state.answer}/>}
        </ScrollView>
        <View>
          <Snackbar
            visible={this.state.snackBarVisible}
            onDismiss={() => this.setState({snackBarVisible: false})}
            duration={2000}
            style={{marginBottom:verticalScale(110), backgroundColor: '#222831'}}>
            {this.state.snackBarText}
          </Snackbar>
        </View>
        <View style={styles.bottomBarStyle}>
          <TouchableOpacity onPress={()=>{
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
              size={moderateScale(25, 0.6)}/>
        </TouchableOpacity>
        <TouchableOpacity onPress={()=>{
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
              size={moderateScale(25, 0.7)}/>
        </TouchableOpacity>
        <TouchableOpacity style={{bottom:verticalScale(15), justifyContent:'center', alignItems:'center'}} onPress={()=>{
             
             AsyncStorage.getItem('answerCounter')
            .then((item) => {
              let __answerCounter = parseInt(item)
              if(__answerCounter > 0){
                {this.state.isHidden == true ? this.setState({isHidden: false}) : null}
                setTimeout(() => {
                  this.scrollBar.current.scrollToEnd()
                }, 100);
                AsyncStorage.setItem('answerCounter', JSON.stringify(__answerCounter - 1))
              }else{
                {this.setState({snackBarVisible: !this.state.snackBarVisible})}
                {this.setState({snackBarText: 'Cevap görüntüleme hakkınız kalmadı.'})}
                AsyncStorage.setItem('renewTime', JSON.stringify(new Date.getTime));
              }
              });
          }}>
          <View style={{
            width: moderateScale(55, 0.7),
            height: moderateVerticalScale(55, 0.9),
            borderRadius:moderateScale(30),
            backgroundColor:'#c9d6df',
        }}/>
        <Icon
          style={{elevation:5, zIndex:5,position:'absolute'}}
                name="check-circle"
                type="FontAwesome"
                color="#222831"
                size={moderateScale(33, 0.8)}/>  
        </TouchableOpacity>
        <TouchableOpacity onPress={()=>navigation.navigate('PurchaseScreen')}>
          <Icon
            name="shopping-cart"
            type="FontAwesome"
            color="#222831"
            size={moderateScale(25, 0.7)}/>
        </TouchableOpacity>
        <TouchableOpacity  onPress={()=>{
          if(this.state.activeQuestion < 99){
            this.setState({activeQuestion : parseInt(this.state.activeQuestion) + 1});
            {this.state.isHidden == false ? this.setState({isHidden: true}) : null}
            this.scrollBar.current.scrollTo({x: 0, y: 0, animated: true})}
          }}>
          <Icon
            name="chevron-right"
            type="FontAwesome"
            color="#222831"
            size={moderateScale(25, 0.6)}/>
        </TouchableOpacity>
        </View>
      </View>
    )
  }
}
const styles2 = StyleSheet.create({
  shadow:{
      shadowColor:'#7F5DF0',
      shadowOffset:{
          width:0,
          height:verticalScale(10)
      },
      shadowOpacity: 0.25,
      shadowRadius:3.5,
      elevation:5
  }
});
const styles = StyleSheet.create({
  container:{
    flex: 1,
  },
  bottomBarStyle:{
    flexDirection:'row',
    justifyContent:'space-around',
    alignItems:'center',
    position:'absolute',
    bottom: verticalScale(20),
    left: scale(10),
    right: scale(10),
    elevation: 0,
    backgroundColor:'#f7f7f7',
    borderRadius: scale(10),
    height: moderateVerticalScale(60, 0.6),
    ...styles2.shadow
},
});

import React, {useState, useEffect} from 'react';
import {View, Image, StyleSheet, Text} from 'react-native';
import {Chip} from 'react-native-paper';
import sorular from './Sorular.js';

const Item = (props) => {
  const [aColor, setAColor] = useState('linen');
  const [bColor, setBColor] = useState('linen');
  const [cColor, setCColor] = useState('linen');
  const [dColor, setDColor] = useState('linen');
  const [eColor, setEColor] = useState('linen');
  const [activeQuestion, setaActiveQuestion] = useState(props.activeQuestion)
  useEffect(() => {
    if (props.activeQuestion !== activeQuestion) {
      setAColor('linen');
      setBColor('linen');
      setCColor('linen');
      setDColor('linen');
      setEColor('linen');
      setaActiveQuestion(props.activeQuestion);
    }
  });
  return(
    <View style={{margin: 15}}>
      {props.answer !== undefined ? (<View><Text style={styles.text}>Çözüm:</Text><Image 
        source={sorular[props.activeQuestion].cozum}
        style={styles.img} /></View>) : 
        <View><Image 
        source={sorular[props.activeQuestion].soru}
        style={styles.img} />        
        <View style={{flexDirection:'row', justifyContent:'space-evenly', marginBottom:20, marginTop:20}}>
        <Chip textStyle={{fontSize:21}} style={{backgroundColor:aColor}} onPress={() => {
          if(sorular[props.activeQuestion].dogruYanit == 'A'){
            setAColor('green')
          }else{
            setAColor('#e63946')
          }
        }}>A</Chip>
        <Chip textStyle={{fontSize:21}} style={{backgroundColor:bColor}} onPress={() => {
          if(sorular[props.activeQuestion].dogruYanit == 'B'){
            setBColor('green')
          }else{
            setBColor('#e63946')
          }
        }}>B</Chip>
        <Chip textStyle={{fontSize:21}} style={{backgroundColor:cColor}} onPress={() => {
          if(sorular[props.activeQuestion].dogruYanit == 'C'){
            setCColor('green')
          }else{
            setCColor('#e63946')
          }
        }}>C</Chip>
        <Chip textStyle={{fontSize:21}} style={{backgroundColor:dColor}} onPress={() => {
          if(sorular[props.activeQuestion].dogruYanit == 'D'){
            setDColor('green')
          }else{
            setDColor('#e63946')
          }
        }}>D</Chip>
        <Chip textStyle={{fontSize:21}} style={{backgroundColor:eColor}} onPress={() => {
          if(sorular[props.activeQuestion].dogruYanit == 'E'){
            setEColor('green')
          }else{
            setEColor('#e63946')
          }
        }}>E</Chip>
      </View></View>}
    </View>
  )
}
const styles = StyleSheet.create({
  img:{
    width: '100%',
    height: undefined,
    aspectRatio: 1,
    resizeMode: 'stretch',
  },
  text:{
    fontSize:18,
    marginLeft:10
  }
});
export default Item;
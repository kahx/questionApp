import React, {useState, useEffect} from 'react';
import {View, Image, StyleSheet, Text} from 'react-native';
import {Chip} from 'react-native-paper';
import { scale, verticalScale, moderateScale, moderateVerticalScale } from 'react-native-size-matters';
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
    <View style={{margin: scale(8)}}>
      {props.answer !== undefined ? (<View><Text style={styles.text}>Çözüm:</Text><Image 
        source={sorular[props.activeQuestion].cozum}
        style={styles.img} /></View>) : 
        <View><Image 
        source={sorular[props.activeQuestion].soru}
        style={styles.img} />        
        <View style={{flexDirection:'row',justifyContent:'space-evenly', marginBottom:verticalScale(18), marginTop:verticalScale(18)}}>
        <Chip textStyle={{fontSize:moderateScale(20), lineHeight: moderateVerticalScale(35, 0.3)}} style={{backgroundColor:aColor}} onPress={() => {
          if(sorular[props.activeQuestion].dogruYanit == 'A'){
            setAColor('green')
          }else{
            setAColor('#e63946')
          }
        }}>A</Chip>
        <Chip textStyle={{fontSize:moderateScale(20), lineHeight: moderateVerticalScale(35, 0.3)}} style={{backgroundColor:bColor}} onPress={() => {
          if(sorular[props.activeQuestion].dogruYanit == 'B'){
            setBColor('green')
          }else{
            setBColor('#e63946')
          }
        }}>B</Chip>
        <Chip textStyle={{fontSize:moderateScale(20), lineHeight: moderateVerticalScale(35, 0.3)}} style={{backgroundColor:cColor}} onPress={() => {
          if(sorular[props.activeQuestion].dogruYanit == 'C'){
            setCColor('green')
          }else{
            setCColor('#e63946')
          }
        }}>C</Chip>
        <Chip textStyle={{fontSize:moderateScale(20), lineHeight: moderateVerticalScale(35, 0.3)}} style={{backgroundColor:dColor}} onPress={() => {
          if(sorular[props.activeQuestion].dogruYanit == 'D'){
            setDColor('green')
          }else{
            setDColor('#e63946')
          }
        }}>D</Chip>
        <Chip textStyle={{fontSize:moderateScale(20), lineHeight: moderateVerticalScale(35, 0.3)}} style={{backgroundColor:eColor}} onPress={() => {
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
    fontSize:moderateScale(15),
    marginLeft:scale(5)
  }
});
export default Item;
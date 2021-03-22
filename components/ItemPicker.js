import React from 'react';
import {View, StyleSheet, TextInput} from 'react-native';
import ModalSelector from 'react-native-modal-selector'
import Icon from 'react-native-vector-icons/FontAwesome';
import questionsJson from './Sorular.js';

const questions = [];

questionsJson.map(data => {
  questions.push({key: data.hangiSoru,label:'Soru '+data.hangiSoru});
});
const ItemPicker = (props) => {
  let modalValue = props.activeQuestion + 1;
  return(
      <ModalSelector
        style={styles.modalStyle}
        data={questions}
        accessible={true}
        cancelText={'İptal'}
        optionContainerStyle={{flex:0.6}}
        onChange={(option)=>{props.setChanged(option.key)
        }}>
        <View style={{flexDirection: 'row', alignItems:'center', justifyContent:'center'}}>
        <TextInput
          style={{fontSize: 16,color: 'black'}}
          editable={false}
          value={'Soru '+modalValue.toString()} 
          />
        <Icon name='angle-down' size={25} color="gray" style={{left:15}}/>
        </View>
    </ModalSelector>
  )
}
const styles = StyleSheet.create({
modalStyle: {
  paddingVertical: 12,
  marginVertical: 18,
  marginHorizontal: 100,
  borderWidth: 1,
  borderColor: 'gray',
  borderRadius: 8,
  }
});
export default ItemPicker;
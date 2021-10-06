import React, {useState} from 'react';
import {View, Image,StyleSheet, ScrollView, Text, SafeAreaView} from 'react-native';
import {Card, Button, Divider, Title} from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/FontAwesome';
import { scale, verticalScale, moderateScale, moderateVerticalScale } from 'react-native-size-matters';
import sorularJson from './Sorular.js';

const FavScreen = ({navigation}) => {
  const [activeItem, setActiveItem] = useState(null);
  const [favList, setFavList] = useState([]);
  React.useEffect(() => {
    navigation.addListener('focus', () => {
      AsyncStorage.getItem('favQuestions')
      .then((item) => {
          if (item) {
            let questionArray = JSON.parse(item);
            setFavList(questionArray)
          }
      });
    });

  }, []);
  return(
    <SafeAreaView>
      <ScrollView>
        {favList.length > 0 ? 
        (favList.map(data => {
          return(
            <Card key={data} style={{margin: moderateScale(30, 0.8)}}>
              <Card.Content style={{flexDirection: 'row', justifyContent:'center'}}>
                <Title style={{fontSize:moderateScale(15)}}>Soru {sorularJson[data].hangiSoru}</Title>
              </Card.Content>
              <Divider/>
              <Image source={sorularJson[data].soru} style={styles.img}/>
              <View style={{flexDirection: 'row', justifyContent:'space-between', marginTop:verticalScale(10), margin:moderateScale(15)}}>
                  <Button mode="contained" labelStyle={{fontSize: moderateScale(10, 0.3)}} compact={true} color="#222831" onPress={() => {setActiveItem(data)}}>
                    Çözümü Göster
                  </Button>
                  <Button mode="contained" color={"#e63946"} labelStyle={{fontSize: moderateScale(11, 0.4)}} compact={true} onPress={() => {
                    const valueToRemove = data;
                    const filteredItems = favList.filter(item => item !== valueToRemove);
                    setFavList(filteredItems);
                    AsyncStorage.setItem('favQuestions', JSON.stringify(filteredItems));
                    }}>
                    Listeden Kaldır
                  </Button>
              </View>
              {activeItem == data ? <Image source={sorularJson[data].cozum} style={[{marginTop: verticalScale(2)},styles.img]}/> : null}
            </Card>
          )
        })) : (<View style={{alignItems: 'center', marginTop: scale(15)}}><Icon name='times-circle' size={moderateScale(35,0.6)} color="#d91a1a"/><Text style={{fontSize: moderateScale(15)}}>Listenizde soru bulunmuyor.</Text></View>)}
      </ScrollView>
    </SafeAreaView>
  )
}
const styles = StyleSheet.create({
  img:{
    width: '100%',
    height: undefined,
    aspectRatio: 1,
    resizeMode: 'stretch'
  },
});
export default FavScreen;
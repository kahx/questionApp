import React, {useState} from 'react';
import {View, Image,StyleSheet, ScrollView, Text, SafeAreaView} from 'react-native';
import {Card, Button, Divider, Title} from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/FontAwesome';
import sorularJson from './Sorular.js';

const FavScreen = ({navigation}) => {
  const [activeItem, setActiveItem] = useState(null);
  const [favList, setFavList] = useState([]);
  React.useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      AsyncStorage.getItem('favQuestions')
      .then((item) => {
          if (item) {
            let questionArray = JSON.parse(item);
            setFavList(questionArray)
          }
      });
    });
    return unsubscribe;
  }, []);
  return(
    <SafeAreaView>
      <ScrollView>
        {favList.length > 0 ? 
        (favList.map(data => {
          return(
            <Card key={data} style={{margin: 25}}>
              <Card.Content style={{flexDirection: 'row', justifyContent:'center'}}>
                <Title>Soru {sorularJson[data].hangiSoru}</Title>
              </Card.Content>
              <Divider/>
              <Image source={sorularJson[data].soru} style={styles.img}/>
              <View style={{flexDirection: 'row', justifyContent:'space-between', marginTop:15, margin:15}}>
                  <Button mode="contained" compact={true} color="#222831" onPress={() => {setActiveItem(data)}}>
                    Çözümü Göster
                  </Button>
                  <Button mode="contained" color={"#e63946"} compact={true} onPress={() => {
                    const valueToRemove = data;
                    const filteredItems = favList.filter(item => item !== valueToRemove);
                    setFavList(filteredItems);
                    AsyncStorage.setItem('favQuestions', JSON.stringify(filteredItems));
                    }}>
                    Listeden Kaldır
                  </Button>
              </View>
              {activeItem == data ? <Image source={sorularJson[data].cozum} style={[{marginTop: 15},styles.img]}/> : null}
            </Card>
          )
        })) : (<View style={{alignItems: 'center', marginTop: 30}}><Icon name='times-circle' size={50} color="#d91a1a"/><Text style={{fontSize: 18}}>Listenizde soru bulunmuyor.</Text></View>)}
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
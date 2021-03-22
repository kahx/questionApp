import 'react-native-gesture-handler';
import React,  {Component} from 'react';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from './components/HomeScreen';
import FavScreen from './components/FavScreen';
import { TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

const Stack = createStackNavigator();

const MyTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: 'white'
  },
};

export default class App extends Component {
  render(){
  return (
    <NavigationContainer theme={MyTheme}>
      <Stack.Navigator initialRouteName="HomeScreen" screenOptions={{ headerStyle: { backgroundColor: '#222831' } }}>
        <Stack.Screen name="HomeScreen" component={HomeScreen}  options={({ navigation }) => ({
          title: '',
          headerLeft: () => (
            <TouchableOpacity>
              <Icon name='home' size={35} color="#c9d6df" style={{marginLeft:15, marginBottom: 15}}/>
            </TouchableOpacity>
          ),
          headerRight: () => (
            <TouchableOpacity onPress={() => {navigation.navigate('FavScreen')}}>
              <Icon name='star-o' size={35} color="#c9d6df" style={{marginRight:15, marginBottom:15}}/>
            </TouchableOpacity>
          )
        })}/>
        <Stack.Screen name="FavScreen" component={FavScreen} options={({ navigation }) => ({
          title: 'İşaretli Sorular', headerTintColor: '#c9d6df', headerBackTitle: 'Geri'})}/>
      </Stack.Navigator>
    </NavigationContainer>
  );
}
}
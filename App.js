import 'react-native-gesture-handler';
import React,  {Component} from 'react';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { TouchableOpacity } from 'react-native';
import { scale, verticalScale, moderateScale } from 'react-native-size-matters';
import Icon from 'react-native-vector-icons/FontAwesome';
import HomeScreen from './components/HomeScreen';
import FavScreen from './components/FavScreen';
import PurchaseScreen from './components/PurchaseScreen';

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
      <Stack.Navigator initialRouteName="HomeScreen" screenOptions={{ headerStyle: { backgroundColor: '#222831', height:verticalScale(50) } }}>
        <Stack.Screen name="HomeScreen" component={HomeScreen}  options={({ navigation }) => ({
          title: '',
          headerLeft: () => (
            <TouchableOpacity>
              <Icon name='home' size={moderateScale(25,0.8)} color="#c9d6df" style={{marginLeft:scale(15)}}/>
            </TouchableOpacity>
          ),
          headerRight: () => (
            <TouchableOpacity onPress={() => {navigation.navigate('FavScreen')}}>
              <Icon name='star-o' size={moderateScale(25,0.8)} color="#c9d6df" style={{marginRight:scale(15)}}/>
            </TouchableOpacity>
          )
        })}/>
        <Stack.Screen name="FavScreen" component={FavScreen} options={({ navigation }) => ({
          title: 'İşaretli Sorular',
          headerLeft: () => (
            <TouchableOpacity onPress={() => {navigation.navigate('HomeScreen')}}>
              <Icon name='chevron-left' size={moderateScale(20,0.4)} color="#c9d6df" style={{marginLeft:scale(15)}}/>
            </TouchableOpacity>
          ), headerTitleStyle: {fontSize: moderateScale(14, 0.7)}, headerTintColor: '#c9d6df', headerBackTitle: 'Geri'})}/>
          <Stack.Screen name="PurchaseScreen" component={PurchaseScreen} options={({ navigation }) => ({
          title: 'Mağaza',
          headerLeft: () => (
            <TouchableOpacity onPress={() => {navigation.navigate('HomeScreen')}}>
              <Icon name='chevron-left' size={moderateScale(20,0.4)} color="#c9d6df" style={{marginLeft:scale(15)}}/>
            </TouchableOpacity>
          ), headerTitleStyle: {fontSize: moderateScale(14, 0.7)}, headerTintColor: '#c9d6df', headerBackTitle: 'Geri'})}/>
      </Stack.Navigator>
    </NavigationContainer>
  );
}
}
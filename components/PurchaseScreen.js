import {Alert, Platform, ScrollView, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
  import RNIap, {finishTransaction, purchaseErrorListener, purchaseUpdatedListener} from 'react-native-iap';
  import React, {Component} from 'react';
  import {moderateScale, moderateVerticalScale } from 'react-native-size-matters';
  import AsyncStorage from '@react-native-async-storage/async-storage';

  const itemSkus = Platform.select({
    ios: [
      'com.cooni.point1000',
      'com.cooni.point5000',
    ],
    android: [
      '7soru',
      '15soru',
      '50soru'
    ]
  });

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      marginTop: Platform.select({
        ios: 0,
        android: moderateVerticalScale(15,0.4),
      }),
      paddingTop: Platform.select({
        ios: 0,
        android: moderateVerticalScale(15,0.4),
      }),
      backgroundColor: 'white',
    },    
    content: {
      flex: 80,
      flexDirection: 'column',
      justifyContent: 'center',
      alignSelf: 'stretch',
      alignItems: 'center',
    },
    btn: {
      height: moderateVerticalScale(40,0.8),
      width: moderateScale(250, 0.8),
      alignSelf: 'center',
      backgroundColor: '#222831',
      borderRadius: moderateScale(5,0.4),
      justifyContent:'center',
      alignItems:'center'
    },
    txt: {
      fontSize: moderateScale(16,0.4),
      marginHorizontal:moderateScale(15,0.7),
      marginBottom: moderateVerticalScale(15,0.7),

    },
  });

  class PurchaseScreen extends Component {
    constructor(props) {
      super(props);
  
      this.state = {
        productList: [],
        receipt: '',
        availableItemsMessage: '',
        answerCounter:5,
      };
    }
  
    async componentDidMount() {
      try {
        await RNIap.initConnection();
        if (Platform.OS === 'android') {
          await RNIap.flushFailedPurchasesCachedAsPendingAndroid();
        } else {
          await RNIap.clearTransactionIOS();
        }
        
      } catch (err) {
        console.warn(err.code, err.message);
        Alert.alert('Bilgi', "Ödemenizin Google'a aktarılması bekleniyor.");
      }
      
      
      this.getItems()
      
      purchaseUpdateSubscription = purchaseUpdatedListener(
        async (purchase) => {
          console.info('purchase', purchase);
          const receipt = purchase.transactionReceipt
            ? purchase.transactionReceipt
            : purchase.originalJson;
          console.info(receipt);
          if (receipt) {
            try {
              const ackResult = await finishTransaction(purchase, true);
              if(ackResult.responseCode == 0){
                Alert.alert('Tebrikler', 'Ürün başarıyla satın alındı.');
                let __state = this.state.answerCounter
                if(purchase.productId == '15soru'){
                  await AsyncStorage.setItem('answerCounter', JSON.stringify(__state + 15)).then(() => {
                    this.setState({
                      answerCounter: (__state + 15)
                    })
                  })
                }else if(purchase.productId == '50soru'){
                  await AsyncStorage.setItem('answerCounter', JSON.stringify(__state + 50));
                  this.setState({
                    answerCounter: (__state + 50)
                  })
                }else{
                  await AsyncStorage.setItem('answerCounter', JSON.stringify(__state + 7));
                  this.setState({
                    answerCounter: (__state + 7)
                  })
                }
              }
            } catch (ackErr) {
              
            }
  
            
          }
        },
      );
  
      purchaseErrorSubscription = purchaseErrorListener(
        (error) => {

        },
      );
      
    }
  
    componentWillUnmount() {
      if (purchaseUpdateSubscription) {
        purchaseUpdateSubscription.remove();
        purchaseUpdateSubscription = null;
      }
      if (purchaseErrorSubscription) {
        purchaseErrorSubscription.remove();
        purchaseErrorSubscription = null;
      }
      RNIap.endConnection();
    }
    

    getItems = async () => {
      try {
        const products = await RNIap.getProducts(itemSkus);
        AsyncStorage.getItem('answerCounter')
        .then((item) => {
          this.setState({
            answerCounter: (parseInt(item))
          })
          if(parseInt(item) == 0){
            AsyncStorage.getItem('renewTime').then((date) => {
              const oldTime = new Date(date)
              const now = new Date().getTime()
              const diff = (now - oldTime) / (1000*60*60)
              if(diff >= 24){
                AsyncStorage.setItem('answerCounter', JSON.stringify(5));
                  this.setState({
                    answerCounter: (5)
                  })
              }
            })
            
          }
        });
        this.setState({productList: products});
      } catch (err) {
        Alert.alert('Hata', 'Ürünlere ulaşılırken sorunla karşılaşıldı.');
      }
    };
  

 
  
    // Version 3 apis
    requestPurchase = async (sku) => {
      try {
        RNIap.requestPurchase(sku);
      } catch (err) {
        Alert.alert('Hata', 'Satın alımda bir sorunla karşılaşıldı. '+err.message.toString());
      }
    };

  
    render() {
      const {productList} = this.state;
      return (
        <View style={styles.container}>
          <View style={styles.content}>
            <ScrollView style={{alignSelf: 'stretch'}}>
              <Text style={styles.txt}>Kalan cevap görme hakkınız 5'ten az ise her 24 saatte bir otomatik 5'e tamamlanır.</Text>
              <Text style={styles.txt}>Kalan hakkınız: {this.state.answerCounter}</Text>
              {productList.map((product, i) => {
                return (
                  <View
                    key={i}
                    style={{
                      flexDirection: 'column',
                      marginVertical:moderateVerticalScale(15,0.6)
                    }}>
                    <TouchableOpacity onPress={() =>
                        this.requestPurchase(product.productId)
                      }
                
                    style={styles.btn}>
                    <Text style={{color:'#fff', justifyContent:'center', alignItems:'center', fontSize:moderateScale(15,0.25)}}>{JSON.parse(product.originalJson).name} - {product.localizedPrice}</Text>
                    </TouchableOpacity>
                  </View>
                );
              })}
            </ScrollView>
          </View>
        </View>
      );
    }
  }
  
  export default PurchaseScreen;
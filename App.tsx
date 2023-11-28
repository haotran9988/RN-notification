/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, { useEffect } from 'react';
import {
  Button,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import messaging from '@react-native-firebase/messaging';
import PushNotification from "react-native-push-notification";
import { Colors } from 'react-native/Libraries/NewAppScreen';

function App(): JSX.Element {

  //----------------------------FIREBASE NOTIFICATION--------------------------------------
  async function requestUserPermission() {
    const authStatus = await messaging().requestPermission();
    const enabled =
      authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
      authStatus === messaging.AuthorizationStatus.PROVISIONAL;
  
    if (enabled) {
      console.log('Authorization status:', authStatus);
    }
  }
  // Lắng nghe thông báo khi ứng dụng mở
  useEffect(() => {
    requestUserPermission();
    messaging()
      .getToken()
      .then(token => {
        console.log('Device token:', token);
      });
    console.log('Thông báo: ');
    messaging().onMessage(async remoteMessage => {
      console.log('Thông báo mới: ' + JSON.stringify(remoteMessage.notification));
    });
  }, []);
  // Lắng nghe sự kiện khi có thông báo từ FCM khi ứng dụng đang nằm trong background
  messaging().onNotificationOpenedApp(remoteMessage => {
    console.log('Thông báo khi ở background:', JSON.stringify(remoteMessage.notification));
  });

  // Xử lý thông báo khi ứng dụng mở từ trạng thái tắt hoàn toàn
  messaging()
    .getInitialNotification()
    .then(remoteMessage => {
      if (remoteMessage) {
        console.log('Thông báo khi khởi động từ thông báo:', JSON.stringify(remoteMessage.notification));
      }
    });


  //------------------------------------LOCAL NOTIFICATION----------------------------------------
  // Tạo thông báo local
  const handleButtonPress = () => {
    PushNotification.localNotification({
      title: "Thông báo mới",
      message: "Haott test thong báo local",
    });
  };

  // PushNotification.configure({
  //   onNotification: function(notification) {
  //     console.log("Thông báo nhấn:", notification);
  //     // xử lý sự kiện
  //   },
  //   // các cấu hình khác
  // });
  return (
    <SafeAreaView>
      <View>
        <Text style={styles.sectionTitle}>App test notification</Text>
      </View>
      <TouchableOpacity onPress={handleButtonPress} style={styles.btn}>
        <Text>Hiển thị thông báo</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
  },
  btn:{
    backgroundColor:'grey',
    borderRadius:5,
    height:50,
    justifyContent:'center',
    alignItems:'center',
    marginTop:100,
    marginHorizontal:20,
  }
});

export default App;

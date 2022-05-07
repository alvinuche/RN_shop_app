import React, {useEffect} from 'react';
import {StyleSheet, View, ActivityIndicator} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useDispatch} from 'react-redux';
import {authenticate} from '../store/actions/auth';

import Colors from '../constants/Colors';

const StartUpScreen = ({navigation}) => {
  const dispatch = useDispatch();

  const loginUser = async () => {
    const data = await AsyncStorage.getItem('userData');

    if (!data) {
      navigation.navigate('Auth');
      return;
    }
    const userdata = JSON.parse(data);
    const {token, userId, expireDate} = userdata;

    const expirationDate = new Date(expireDate);
    if (expirationDate <= new Date() || !token || !userId) {
      navigation.navigate('Auth');
      return;
    }

    const expirationTime = expirationDate.getTime() - new Date().getTime();

    navigation.navigate('Shop');
    dispatch(authenticate(userId, token, expirationTime));
  };

  useEffect(() => {
    loginUser();
  }, [dispatch]);

  return (
    <View style={styles.screen}>
      <ActivityIndicator size="large" color={Colors.primary} />
    </View>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default StartUpScreen;

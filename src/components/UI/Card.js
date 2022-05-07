import React from 'react';
import {StyleSheet, View} from 'react-native';

const Card = ({children, customStyles}) => {
  return <View style={{...styles.card, ...customStyles}}>{children}</View>;
};

const styles = StyleSheet.create({
  card: {
    shadowColor: '#000',
    shadowOpacity: 0.26,
    shadowOffset: {width: 0, height: 2},
    shadowRadius: 8,
    elevation: 5,
    borderRadius: 10,
    backgroundColor: '#fff',
  },
});
export default Card;

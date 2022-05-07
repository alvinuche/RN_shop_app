import React from 'react';
import {
  StyleSheet,
  Text,
  Image,
  View,
  TouchableOpacity,
  TouchableNativeFeedback,
  Platform,
  Pressable,
} from 'react-native';

import Card from '../UI/Card';

const ProductItem = ({image, title, price, onSelect, children}) => {
  let TouchableComp = TouchableOpacity;

  if (Platform.OS === 'android' && Platform.Version >= 21) {
    TouchableComp = TouchableNativeFeedback;
  }

  return (
    <Card customStyles={styles.container}>
      <View style={styles.touch}>
        <TouchableComp onPress={onSelect} useForeground>
          <View>
            <Image style={styles.image} source={{uri: image}} />

            <View style={styles.details}>
              <Text style={styles.title}>{title}</Text>
              <Text style={styles.price}>{`$${price.toFixed(2)}`}</Text>
            </View>

            <View style={styles.actions}>{children}</View>
          </View>
        </TouchableComp>
      </View>
    </Card>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 300,
    margin: 20,
    overflow: 'hidden',
  },
  touch: {
    borderRadius: 10,
    overflow: 'hidden',
  },
  image: {
    height: '60%',
    width: '100%',
  },
  title: {
    fontSize: 18,
    // marginVertical: 4,
    fontFamily: 'OpenSans-Bold',
  },
  price: {
    fontSize: 14,
    color: '#888',
    fontFamily: 'OpenSans-Regular',
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: '25%',
    marginHorizontal: 20,
  },
  details: {
    alignItems: 'center',
    height: '15%',
    padding: 10,
  },
});
export default ProductItem;

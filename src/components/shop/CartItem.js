import React from 'react';
import {StyleSheet, Text, View, Pressable, Platform} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

import Colors from '../../constants/Colors';

const CartItem = ({quantity, title, amount, onRemove}) => {
  return (
    <View style={styles.cartItem}>
      <View style={styles.itemData}>
        <Text style={styles.quantity}>{quantity}</Text>
        <Text style={styles.mainText}>{title}</Text>
      </View>

      <View style={styles.itemData}>
        <Text style={styles.mainText}>{`$${amount.toFixed(2)}`}</Text>
        {onRemove && (
          <Pressable onPress={onRemove} style={styles.deleteButton}>
            <Ionicons
              name={Platform.OS === 'android' ? 'md-trash' : 'ios-trash'}
              size={23}
              color={'#f00'}
            />
          </Pressable>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  cartItem: {
    padding: 10,
    backgroundColor: '#fff',
    flexDirection: 'row',
    justifyContent: 'space-between',
    // marginHorizontal: 15,
    marginVertical: 10,
  },
  itemData: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  quantity: {
    fontFamily: 'OpenSans-Bold',
    color: '#888',
    fontSize: 16,
    // marginHorizontal: 5,
    marginRight: 5,
    color: Colors.primary_dark,
  },
  mainText: {
    fontFamily: 'OpenSans-Bold',
    fontSize: 16,
    color: Colors.primary_dark,
  },

  deleteButton: {
    marginLeft: 20,
  },
});
export default CartItem;

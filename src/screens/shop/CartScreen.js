import React, {useEffect, useState} from 'react';
import {
  StyleSheet,
  Text,
  View,
  Button,
  FlatList,
  ActivityIndicator,
} from 'react-native';

import {useSelector, useDispatch} from 'react-redux';

import CartItem from '../../components/shop/CartItem';
import Colors from '../../constants/Colors';
import {removeFromCart} from '../../store/actions/cart';
import {addOrder} from '../../store/actions/orders';

import Card from '../../components/UI/Card';

const CartScreen = () => {
  const {items, totalAmount} = useSelector(state => state.cart);
  const dispatch = useDispatch();

  const [userCart, setUserCart] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  function getCartItems() {
    const cartItems = [];

    for (const key in items) {
      cartItems.push({
        productId: key,
        productTitle: items[key].title,
        productPrice: items[key].price,
        quantity: items[key].quantity,
        sum: items[key].sum,
      });
    }
    return cartItems.sort((a, b) => (a.productId > b.productId ? 1 : -1));
  }

  function handleRemove(id) {
    dispatch(removeFromCart(id));
  }

  async function handleAddOrder() {
    setIsLoading(true);
    await dispatch(addOrder(userCart, totalAmount));
    setIsLoading(false);
  }

  useEffect(() => {
    setUserCart(getCartItems());
  }, [items]);

  return (
    <View style={styles.screen}>
      <Card customStyles={styles.summary}>
        <Text style={styles.summaryText}>
          Total:{' '}
          <Text style={styles.amount}>{`$${
            Math.round(totalAmount.toFixed(2) * 100) / 100
          }`}</Text>
        </Text>

        {isLoading ? (
          <ActivityIndicator size="small" color={Colors.primary} />
        ) : (
          <Button
            disabled={userCart.length === 0 ? true : false}
            color={Colors.primary_dark}
            title="Order Now"
            onPress={handleAddOrder}
          />
        )}
      </Card>

      <FlatList
        data={userCart}
        keyExtractor={item => item.productId}
        renderItem={({item}) => (
          <CartItem
            title={item.productTitle}
            quantity={item.quantity}
            amount={item.sum}
            onRemove={() => handleRemove(item.productId)}
          />
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  screen: {
    margin: 20,
  },
  summary: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
    padding: 10,
  },
  summaryText: {
    fontFamily: 'OpenSans-Bold',
    fontSize: 18,
  },
  amount: {
    color: Colors.primary_dark,
  },
});
export default CartScreen;

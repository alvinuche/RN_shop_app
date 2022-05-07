import React, {useEffect} from 'react';
import {FlatList, Text, View, StyleSheet} from 'react-native';

import {useSelector, useDispatch} from 'react-redux';
import OrderItem from '../../components/shop/OrderItem';
import dayjs from 'dayjs';
import localizedFormat from 'dayjs/plugin/localizedFormat';
import {fetchOrders} from '../../store/actions/orders';

dayjs.extend(localizedFormat);

const OrdersScreen = () => {
  const orders = useSelector(state => state.orders.orders);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchOrders());
  }, [dispatch]);

  if (orders.length === 0) {
    return (
      <View style={styles.msgBox}>
        <Text>No orders found, add some produts to your cart. 😉</Text>
      </View>
    );
  }

  return (
    <FlatList
      data={orders}
      renderItem={({item}) => (
        <OrderItem
          amount={item.totalAmount}
          date={dayjs(item.date).format('lll')}
          items={item.items}
        />
      )}
    />
  );
};

const styles = StyleSheet.create({
  msgBox: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default OrdersScreen;

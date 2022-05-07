import React from 'react';
import {useState} from 'react';
import {StyleSheet, Text, View, Button} from 'react-native';
import Colors from '../../constants/Colors';

import CartItem from './CartItem';
import Card from '../UI/Card';

const OrderItem = ({amount, date, items}) => {
  const [showDetails, setShowDetails] = useState(false);

  return (
    <Card customStyles={styles.orderItem}>
      <View style={styles.summary}>
        <Text style={styles.totalAmount}>{`$${amount.toFixed(2)}`}</Text>
        <Text style={styles.date}>{date}</Text>
      </View>
      <Button
        color={Colors.primary}
        title={!showDetails ? 'Show Details' : 'Hide Details'}
        onPress={() => setShowDetails(!showDetails)}
      />

      {showDetails && (
        <View style={styles.details}>
          {items.map(({quantity, sum, productTitle, productId}) => (
            <CartItem
              key={productId}
              amount={sum}
              quantity={quantity}
              title={productTitle}
            />
          ))}
        </View>
      )}
    </Card>
  );
};

const styles = StyleSheet.create({
  orderItem: {
    margin: 20,
    padding: 10,
    alignItems: 'center',
  },
  summary: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    marginBottom: 16,
  },
  totalAmount: {
    fontFamily: 'OpenSans-Bold',
    fontSize: 16,
  },
  date: {
    fontSize: 16,
    fontFamily: 'OpenSans-Regular',
    color: '#888',
  },
  details: {
    width: '100%',
  },
});
export default OrderItem;

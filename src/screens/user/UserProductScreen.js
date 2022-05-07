import React from 'react';
import {StyleSheet, FlatList, Button, View, Alert, Text} from 'react-native';
import {useSelector, useDispatch} from 'react-redux';
import {deleteProduct} from '../../store/actions/products';

import ProductItem from '../../components/shop/ProductItem';
import Colors from '../../constants/Colors';

const UserProductScreen = ({navigation}) => {
  const userProducts = useSelector(state => state.products.userProducts);
  const dispatch = useDispatch();

  function handleDelete(id) {
    dispatch(deleteProduct(id));
  }

  function handleProductEdit(id) {
    navigation.navigate('EditProduct', {id});
  }

  function handleConfirm(id) {
    Alert.alert('Are you sure?', 'Do you really wnat to delete this item?', [
      {text: 'No', style: 'default'},
      {text: 'Yes', style: 'destructive', onPress: () => handleDelete(id)},
    ]);
  }

  if (userProducts.length === 0) {
    return (
      <View style={styles.msgBox}>
        <Text>No products found, create some. 😉</Text>
      </View>
    );
  }

  return (
    <FlatList
      data={userProducts}
      keyExtractor={item => item.id}
      renderItem={({item}) => (
        <ProductItem
          image={item.imageUrl}
          title={item.title}
          price={item.price}
          onSelect={() => handleProductEdit(item.id)}>
          <View style={styles.btnBox}>
            <Button
              color={Colors.primary}
              title="Edit"
              onPress={() => handleProductEdit(item.id)}
            />
            <Button
              color={Colors.danger}
              title="Delete"
              onPress={() => handleConfirm(item.id)}
            />
          </View>
        </ProductItem>
      )}
    />
  );
};

const styles = StyleSheet.create({
  btnBox: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
  },
  msgBox: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
export default UserProductScreen;

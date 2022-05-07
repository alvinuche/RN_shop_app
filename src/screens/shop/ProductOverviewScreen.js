import React, {useState, useEffect, useCallback} from 'react';
import {
  FlatList,
  StyleSheet,
  Button,
  View,
  Text,
  ActivityIndicator,
  Alert,
} from 'react-native';
// import { useFocusEffect } from '@react-navigation/native';

import {useSelector, useDispatch} from 'react-redux';
import {fetchProducts} from '../../store/actions/products';

import ProductItem from '../../components/shop/ProductItem';
import * as cartActions from '../../store/actions/cart';

import Colors from '../../constants/Colors';

const ProductOverviewScreen = ({navigation}) => {
  const products = useSelector(state => state.products.availableProducts);
  const dispatch = useDispatch();

  const [isLoading, setIsLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const [error, setError] = useState();

  function handleDetail(data) {
    navigation.navigate('ProductDetails', {
      productId: data.id,
    });
  }
  function handleToCart(data) {
    dispatch(cartActions.addToCart(data));
  }

  const loadProducts = useCallback(async () => {
    setError(null);
    // setIsLoading(true);
    setIsRefreshing(true);
    try {
      await dispatch(fetchProducts());
    } catch (error) {
      setError(error.message);
    }
    // setIsLoading(false);
    setIsRefreshing(false);
  }, [dispatch]);

  useEffect(() => {
    const unsubscribe = navigation.addListener('willFocus', loadProducts);
    return () => unsubscribe.remove();
  }, [loadProducts]);

  useEffect(() => {
    setIsLoading(true);
    loadProducts().then(() => setIsLoading(false));
  }, [dispatch, loadProducts]);

  if (error) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorMsg}>An error occurred!</Text>
        <View style={styles.errorBtn}>
          <Button
            title="Try again"
            onPress={loadProducts}
            color={Colors.primary_dark}
          />
        </View>
      </View>
    );
  }

  if (isLoading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  if (!isLoading && products.length === 0) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorMsg}>
          {'No products found. Please add some \n😁'}
        </Text>
      </View>
    );
  }

  return (
    <FlatList
      onRefresh={loadProducts}
      refreshing={isRefreshing}
      data={products}
      renderItem={({item}) => (
        <ProductItem
          key={item.id}
          title={item.title}
          price={item.price}
          image={item.imageUrl}
          onSelect={() => handleDetail(item)}
          // handleDetail={() => handleDetail(item)}
          // handleToCart={() => handleToCart(item)}
        >
          <View style={styles.btnBox}>
            <Button
              color={Colors.primary}
              title="View"
              onPress={() => handleDetail(item)}
            />
            <Button
              color={Colors.primary}
              title="Cart"
              onPress={() => handleToCart(item)}
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
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignContent: 'center',
    paddingHorizontal: 16,
    backgroundColor: '#fff',
  },
  errorMsg: {
    textAlign: 'center',
    fontSize: 18,
    fontFamily: 'OpenSans-Bold',
    color: Colors.primary,
  },
  errorBtn: {
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 12,
  },
});
export default ProductOverviewScreen;

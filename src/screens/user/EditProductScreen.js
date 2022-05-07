import React, {useState, useEffect, useCallback, useReducer} from 'react';
import {
  StyleSheet,
  View,
  ScrollView,
  Alert,
  KeyboardAvoidingView,
  ActivityIndicator,
} from 'react-native';

import {useSelector, useDispatch} from 'react-redux';
import {createProduct, updateProduct} from '../../store/actions/products';
import Input from '../../components/UI/Input';
import Colors from '../../constants/Colors';

const FORM_UPDATE = 'FORM_UPDATE';
const formReducer = (state, action) => {
  switch (action.type) {
    case FORM_UPDATE:
      const {text, isValid, input} = action.payload;

      const updatedValues = {
        ...state.inputValues,
        [input]: text,
      };

      const updatedValidities = {
        ...state.inputValidities,
        [input]: isValid,
      };
      let updatedFormIsValid = true;
      for (const key in updatedValidities) {
        updatedFormIsValid = updatedFormIsValid && updatedValidities[key];
      }

      return {
        inputValues: updatedValues,
        inputValidities: updatedValidities,
        formIsValid: updatedFormIsValid,
      };
  }

  return state;
};

const EditProductScreen = ({navigation}) => {
  const productId = navigation.getParam('id');
  const editedProduct = useSelector(state =>
    state.products.userProducts.find(product => product.id === productId),
  );
  const dispatch = useDispatch();

  const [formState, hookDispatch] = useReducer(formReducer, {
    inputValues: {
      title: editedProduct ? editedProduct.title : '',
      imageUrl: editedProduct ? editedProduct.imageUrl : '',
      price: '',
      description: editedProduct ? editedProduct.description : '',
    },
    inputValidities: {
      title: editedProduct ? true : false,
      imageUrl: editedProduct ? true : false,
      price: editedProduct ? true : false,
      description: editedProduct ? true : false,
    },
    formIsValid: editedProduct ? true : false,
  });

  const {description, imageUrl, price, title} = formState.inputValues;

  const [fetching, setFetching] = useState({
    isLoading: false,
    error: undefined,
  });

  // const [inputStates, setInputStates] = useState({
  //   title: editedProduct ? editedProduct.title : '',
  //   imageUrl: editedProduct ? editedProduct.imageUrl : '',
  //   price: '',
  //   description: editedProduct ? editedProduct.description : '',
  // });

  // const {description, imageUrl, price, title} = inputStates;

  const handleSubmit = useCallback(async () => {
    if (!formState.formIsValid) {
      Alert.alert('Invalid Input!', 'Please fill all inputs.', [
        {text: 'Okay'},
      ]);

      return;
    }
    setFetching({isLoading: true, error: null});
    try {
      if (editedProduct) {
        await dispatch(updateProduct(productId, title, description, imageUrl));
      } else {
        await dispatch(createProduct(title, description, imageUrl, +price));
      }
    } catch (error) {
      setFetching({...fetching, error: error.message});
    }

    setFetching({...fetching, isLoading: false});
    navigation.goBack();
  }, [dispatch, productId, formState]);

  const handleTextChange = useCallback(
    (inputIdentifier, inputValue, inputValidity) => {
      hookDispatch({
        type: FORM_UPDATE,
        payload: {
          text: inputValue,
          isValid: inputValidity,
          input: inputIdentifier,
        },
      });
    },
    [hookDispatch],
  );

  useEffect(() => {
    navigation.setParams({
      submit: handleSubmit,
      title: editedProduct && editedProduct.title,
    });
  }, [handleSubmit]);

  if (fetching.isLoading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={{flex: 1}}
      behavior="padding"
      keyboardVerticalOffset={50}>
      <ScrollView>
        <View style={styles.form}>
          <Input
            label="Title"
            keyboardType="default"
            autoCapitalize="sentences"
            autoCorrect
            returnKeyType="next"
            onInputChange={handleTextChange.bind(this, 'title')}
            initialValue={editedProduct ? editedProduct.title : ''}
            isDefaultValid={!!editedProduct}
            required
          />

          <Input
            label="Image URL"
            keyboardType="default"
            returnKeyType="next"
            onInputChange={handleTextChange.bind(this, 'imageUrl')}
            initialValue={editedProduct ? editedProduct.imageUrl : ''}
            isDefaultValid={!!editedProduct}
            required
          />

          {!editedProduct && (
            <Input
              label="Price"
              keyboardType="decimal-pad"
              returnKeyType="next"
              onInputChange={handleTextChange.bind(this, 'price')}
              required
              min={0.1}
            />
          )}
          <Input
            label="Description"
            keyboardType="default"
            autoCapitalize="sentences"
            autoCorrect
            multiline
            numberOfLines={3}
            initialValue={editedProduct ? editedProduct.description : ''}
            isDefaultValid={!!editedProduct}
            onInputChange={handleTextChange.bind(this, 'description')}
            required
            minLength={5}
          />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  form: {
    margin: 20,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
export default EditProductScreen;

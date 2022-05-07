import PRODUCTS from '../../data/dummy-data';
import {
  CREATE_PRODUCT,
  DELETE_PRODUCT,
  SET_PRODUCTS,
  UPDATE_PRODUCT,
} from '../actions/products';
import Product from '../../models/product';

const initialState = {
  availableProducts: [],
  userProducts: [],
};

export default (state = initialState, action) => {
  switch (action.type) {
    case SET_PRODUCTS:
      return {
        availableProducts: action.products,
        userProducts: action.userProducts,
      };

    case CREATE_PRODUCT:
      const {id, title, description, imageUrl, price, ownerId} = action.payload;

      const newProduct = new Product(
        id,
        ownerId,
        title,
        imageUrl,
        description,
        price,
      );

      return {
        ...state,
        availableProducts: [...state.availableProducts, newProduct],
        userProducts: [...state.availableProducts, newProduct],
      };

    case UPDATE_PRODUCT:
      // const {title, description, imageUrl} = action.payload;

      const productIndex = state.userProducts.findIndex(
        product => product.id === action.productId,
      );
      const updatedProduct = new Product(
        action.productId,
        state.userProducts[productIndex].ownerId,
        action.payload.title,
        action.payload.imageUrl,
        action.payload.description,
        state.userProducts[productIndex].price,
      );

      const updatedUserProducts = [...state.userProducts];
      updatedUserProducts[productIndex] = updatedProduct;

      // UPDATE AVAILABLE PRODUCTS
      const availableProductIndex = state.availableProducts.findIndex(
        product => product.id === action.productId,
      );

      const updatedAvailableProducts = [...state.availableProducts];
      updatedAvailableProducts[availableProductIndex] = updatedProduct;

      return {
        ...state,
        availableProducts: updatedAvailableProducts,
        userProducts: updatedUserProducts,
      };

    case DELETE_PRODUCT:
      return {
        ...state,
        userProducts: state.userProducts.filter(
          product => product.id !== action.payload,
        ),
        availableProducts: state.availableProducts.filter(
          product => product.id !== action.payload,
        ),
      };
  }

  return state;
};

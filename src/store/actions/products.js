import uri from '../uri/uri';
import Product from '../../models/product';

export const DELETE_PRODUCT = 'DELETE_PRODUCT';
export const CREATE_PRODUCT = 'CREATE_PRODUCT';
export const UPDATE_PRODUCT = 'UPDATE_PRODUCT';
export const SET_PRODUCTS = 'SET_PRODUCTS';

// GET PRODUCTS

export const fetchProducts = () => async (dispatch, getState) => {
  const userId = getState().auth.userId;

  try {
    const response = await fetch(`${uri}products.json`);
    // console.log(response);
    if (!response.ok) {
      throw new Error("Couldn't fetch data");
    }

    const responseData = await response.json();
    // console.log(responseData);

    const products = [];
    for (const key in responseData) {
      products.push(
        new Product(
          key,
          responseData[key].ownerId ? responseData[key].ownerId : 'u1',
          responseData[key].title,
          responseData[key].imageUrl,
          responseData[key].description,
          responseData[key].price,
        ),
      );
    }

    dispatch({
      type: SET_PRODUCTS,
      products,
      userProducts: products.filter(product => product.ownerId === userId),
    });
  } catch (error) {
    throw error;
  }
};

// CREATE PRODUCT

export const createProduct =
  (title, description, imageUrl, price) => async (dispatch, getState) => {
    // any async code you want
    const token = getState().auth.token;
    const userId = getState().auth.userId;

    const data = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        title,
        description,
        imageUrl,
        price,
        ownerId: userId,
      }),
    };

    try {
      const response = await fetch(`${uri}products.json?auth=${token}`, data);
      const responseData = await response.json();

      dispatch({
        type: CREATE_PRODUCT,
        payload: {
          id: responseData.name,
          title,
          description,
          imageUrl,
          price,
          ownerId: userId,
        },
      });
    } catch (error) {
      console.log(error);
    }
  };

// UPDATE PRODUCT
export const updateProduct =
  (id, title, description, imageUrl) => async (dispatch, getState) => {
    const token = getState().auth.token;
    const data = {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({title, description, imageUrl}),
    };

    try {
      const response = await fetch(
        `${uri}products/${id}.json?auth=${token}`,
        data,
      );
      const {title, description, imageUrl} = await response.json();

      dispatch({
        type: UPDATE_PRODUCT,
        productId: id,
        payload: {title, description, imageUrl},
      });
    } catch (error) {
      console.log(error);
    }
  };

// DELETE PRODUCT

export const deleteProduct = productId => async (dispatch, getState) => {
  const token = getState().auth.token;
  const data = {
    method: 'DELETE',
  };

  try {
    const response = await fetch(
      `${uri}products/${productId}.json?auth=${token}`,
      data,
    );
    const responseData = await response.json();

    console.log(responseData);
    dispatch({type: DELETE_PRODUCT, payload: productId});
  } catch (error) {
    console.log(error);
  }
};

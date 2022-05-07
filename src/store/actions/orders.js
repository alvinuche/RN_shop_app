import uri from '../uri/uri';
import Order from '../../models/order';

export const ADD_ORDER = 'ADD_ORDER';
export const SET_ORDERS = 'SET_ORDERS';

export const addOrder =
  (cartItems, totalAmount) => async (dispatch, getState) => {
    const token = getState().auth.token;
    const userId = getState().auth.userId;

    const date = new Date();
    const data = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        cartItems,
        totalAmount,
        date: date.toISOString(),
      }),
    };

    try {
      const response = await fetch(
        `${uri}orders/${userId}.json?auth=${token}`,
        data,
      );
      const responseData = await response.json();

      console.log(responseData);

      dispatch({
        type: ADD_ORDER,
        payload: {id: responseData.name, cartItems, totalAmount, date},
      });
    } catch (error) {
      console.log(error);
    }
  };

export const fetchOrders = () => async (dispatch, getState) => {
  const userId = getState().auth.userId;

  try {
    const response = await fetch(`${uri}orders/${userId}.json`);
    // console.log(response);
    if (!response.ok) {
      throw new Error("Couldn't fetch data");
    }

    const responseData = await response.json();
    console.log(responseData);

    const orders = [];
    for (const key in responseData) {
      orders.push(
        new Order(
          key,
          responseData[key].cartItems,
          responseData[key].totalAmount,
          new Date(responseData[key].date),
        ),
      );
    }

    dispatch({type: SET_ORDERS, payload: orders});
  } catch (error) {
    throw error;
  }
};

import Order from '../../models/order';
import {ADD_ORDER, SET_ORDERS} from '../actions/orders';

const initialState = {
  orders: [],
};

export default (state = initialState, action) => {
  const {type, payload} = action;

  switch (type) {
    case ADD_ORDER:
      const newOrder = new Order(
        payload.id,
        payload.cartItems,
        payload.totalAmount,
        payload.date,
      );

      return {
        ...state,
        orders: [...state.orders, newOrder],
      };

    case SET_ORDERS:
      return {
        ...state,
        orders: action.payload,
      };
  }

  return state;
};

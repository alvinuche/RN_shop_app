import AsyncStorage from '@react-native-async-storage/async-storage';

// export const SIGNUP = 'SIGNUP';
// export const LOGIN = 'LOGIN';
export const AUTHENTICATE = 'AUTHENTICATE';
export const LOGOUT = 'LOGOUT';

let timer;

export const authenticate = (userId, token, expiryTime) => dispatch => {
  dispatch(setLogoutTimer(expiryTime));
  dispatch({type: AUTHENTICATE, userId, token});
};

export const signup = (email, password) => async dispatch => {
  const data = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({email, password, returnSecureToken: true}),
  };

  try {
    const response = await fetch(
      'https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyBjI0HSJky3qScvWQ-HpdKVahFE9YQiy7k',
      data,
    );

    if (!response.ok) {
      const errorResponse = await response.json();
      throw new Error(errorResponse.error.message);
    }
    const {idToken, localId, expiresIn} = await response.json();
    // dispatch({type: SIGNUP, token: idToken, userId: localId});
    dispatch(authenticate(localId, idToken, parseInt(expiresIn) * 1000));

    const expireDate = new Date(
      new Date().getTime() + parseInt(expiresIn) * 1000,
    );
    saveDataToStorage(idToken, localId, expireDate);
  } catch (error) {
    throw new Error(error.message);
  }
};

export const login = (email, password) => async dispatch => {
  const data = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({email, password, returnSecureToken: true}),
  };

  try {
    const response = await fetch(
      'https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyBjI0HSJky3qScvWQ-HpdKVahFE9YQiy7k',
      data,
    );

    if (!response.ok) {
      const errorResponse = await response.json();
      throw new Error(errorResponse.error.message);
    }
    const {idToken, localId, expiresIn} = await response.json();

    // dispatch({type: LOGIN, token: idToken, userId: localId});
    dispatch(authenticate(localId, idToken, parseInt(expiresIn) * 1000));

    const expireDate = new Date(
      new Date().getTime() + parseInt(expiresIn) * 1000,
    );
    saveDataToStorage(idToken, localId, expireDate);
  } catch (error) {
    throw new Error(error.message);
  }
};

export const logout = () => {
  clearLogoutTimer();
  AsyncStorage.removeItem('userData');
  return {type: LOGOUT};
};

const clearLogoutTimer = () => {
  if (timer) {
    clearTimeout(timer);
  }
};

const setLogoutTimer = expirationTime => dispatch => {
  timer = setTimeout(() => {
    dispatch(logout());
  }, expirationTime);
};

const saveDataToStorage = (token, userId, expireDate) => {
  AsyncStorage.setItem(
    'userData',
    JSON.stringify({token, userId, expireDate: expireDate.toISOString()}),
  );
};

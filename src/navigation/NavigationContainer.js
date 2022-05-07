import React, {useEffect, useRef} from 'react';
import {NavigationActions} from 'react-navigation';
import ShopNavigator from './ShopNavigator';

import {useSelector} from 'react-redux';

const NavigationContainer = ({navigation}) => {
  const isAuth = useSelector(state => !!state.auth.token);

  const navRef = useRef();

  useEffect(() => {
    if (!isAuth) {
      navRef.current.dispatch(NavigationActions.navigate({routeName: 'Auth'}));
    }
  }, [isAuth]);

  return <ShopNavigator ref={navRef} />;
};

export default NavigationContainer;

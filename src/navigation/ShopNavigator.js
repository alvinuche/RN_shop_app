import React from 'react';
import {
  Platform,
  Dimensions,
  SafeAreaView,
  Button,
  ScrollView,
} from 'react-native';
import {createAppContainer, createSwitchNavigator} from 'react-navigation';

import {createStackNavigator} from 'react-navigation-stack';
import {
  createDrawerNavigator,
  DrawerItems,
  DrawerNavigatorItems,
} from 'react-navigation-drawer';

import ProductOverviewScreen from '../screens/shop/ProductOverviewScreen';
import ProductDetailScreen from '../screens/shop/ProductDetailScreen';
import CartScreen from '../screens/shop/CartScreen';
import OrdersScreen from '../screens/shop/OrdersScreen';
import UserProductScreen from '../screens/user/UserProductScreen';
import EditProductScreen from '../screens/user/EditProductScreen';
import AuthScreen from '../screens/user/AuthScreen';
import StartUpScreen from '../screens/StartUpScreen';

import {useDispatch} from 'react-redux';
import {HeaderButtons, Item} from 'react-navigation-header-buttons';
import CustomHeaderButton from '../components/UI/HeaderButton';
import {logout} from '../store/actions/auth';

import Colors from '../constants/Colors';
import PRODUCTS from '../data/dummy-data';
import Ionicons from 'react-native-vector-icons/Ionicons';

const defaultNavOptions = {
  safeAreaInsets: {top: 0, bottom: 0, left: 0, right: 0},
  headerStyle: {
    backgroundColor: Platform.OS === 'android' ? Colors.primary : '',
  },
  headerTintColor: Platform.OS === 'android' ? '#E7E7DE' : Colors.primary,
  headerTitleStyle: {
    fontFamily: 'OpenSans-Bold',
  },
  headerBackTitleStyle: {
    fontFamily: 'OpenSans-Regular',
  },
};

const defaultNavigationOptions = navData => (
  <HeaderButtons HeaderButtonComponent={CustomHeaderButton}>
    <Item
      title="Menu"
      iconName="ios-menu-sharp"
      onPress={() => {
        navData.navigation.toggleDrawer();
      }}
    />
  </HeaderButtons>
);

const ProductsNavigator = createStackNavigator(
  {
    Products: {
      screen: ProductOverviewScreen,
      navigationOptions: navData => {
        return {
          title: 'Products',
          headerLeft: () => defaultNavigationOptions(navData),
          headerRight: () => (
            <HeaderButtons HeaderButtonComponent={CustomHeaderButton}>
              <Item
                title="Cart"
                iconName={Platform.OS === 'android' ? 'md-cart' : 'ios-cart'}
                onPress={() => {
                  navData.navigation.navigate('Cart');
                }}
              />
            </HeaderButtons>
          ),
        };
      },
    },
    ProductDetails: {
      screen: ProductDetailScreen,
      navigationOptions: navData => {
        const title = navData.navigation.getParam('title');
        return {title};
      },
    },

    Cart: {
      screen: CartScreen,
      navigationOptions: navData => {
        return {title: 'Cart'};
      },
    },
  },
  {
    defaultNavigationOptions: defaultNavOptions,
  },
);

const OrdersNavigator = createStackNavigator(
  {
    Orders: {
      screen: OrdersScreen,
      navigationOptions: navData => {
        return {
          title: 'Your orders',
          headerLeft: () => defaultNavigationOptions(navData),
        };
      },
    },
  },
  {
    defaultNavigationOptions: defaultNavOptions,
  },
);
const AdminNavigator = createStackNavigator(
  {
    Orders: {
      screen: UserProductScreen,
      navigationOptions: navData => {
        return {
          title: 'Your Products',
          headerLeft: () => defaultNavigationOptions(navData),
          headerRight: () => {
            return (
              <HeaderButtons HeaderButtonComponent={CustomHeaderButton}>
                <Item
                  title="Add"
                  iconName={
                    Platform.OS === 'android' ? 'md-create' : 'ios-create'
                  }
                  onPress={() => {
                    navData.navigation.navigate('EditProduct');
                  }}
                />
              </HeaderButtons>
            );
          },
        };
      },
    },
    EditProduct: {
      screen: EditProductScreen,
      navigationOptions: navData => {
        // const productId = navData.navigation.getParam('id');
        // const product = PRODUCTS.find(product => product.id === productId);

        const submit = navData.navigation.getParam('submit');
        const title = navData.navigation.getParam('title');

        return {
          title: title ? title : 'Add new product',
          headerRight: () => {
            return (
              <HeaderButtons HeaderButtonComponent={CustomHeaderButton}>
                <Item
                  title="Save"
                  iconName={
                    Platform.OS === 'android' ? 'md-checkmark' : 'ios-checkmark'
                  }
                  onPress={submit}
                />
              </HeaderButtons>
            );
          },
        };
      },
    },
  },
  {
    defaultNavigationOptions: defaultNavOptions,
  },
);

const RootNavigator = createDrawerNavigator(
  {
    Products: {
      screen: ProductsNavigator,
      navigationOptions: navData => {
        return {
          drawerIcon: ({tintColor}) => (
            <Ionicons
              name={Platform.OS === 'android' ? 'md-cart' : 'ios-cart'}
              size={23}
              color={tintColor}
            />
          ),
        };
      },
    },
    Orders: {
      screen: OrdersNavigator,
      navigationOptions: navData => {
        return {
          drawerIcon: ({tintColor}) => (
            <Ionicons
              name={Platform.OS === 'android' ? 'md-list' : 'ios-list'}
              size={23}
              color={tintColor}
            />
          ),
        };
      },
    },
    Admin: {
      screen: AdminNavigator,
      navigationOptions: navData => {
        return {
          drawerIcon: ({tintColor}) => (
            <Ionicons
              name={Platform.OS === 'android' ? 'md-create' : 'ios-create'}
              size={23}
              color={tintColor}
            />
          ),
        };
      },
    },
  },
  {
    drawerType: 'front',
    drawerPosition: 'left',
    drawerWidth: () => {
      return Dimensions.get('screen').width / 1.5;
    },
    contentOptions: {
      activeTintColor: Colors.primary,
      labelStyle: {fontFamily: 'OpenSans-Regular'},
    },
    contentComponent: props => {
      // eslint-disable-next-line react-hooks/rules-of-hooks
      const dispatch = useDispatch();

      return (
        <ScrollView style={{flex: 1, paddingTop: 20}}>
          <SafeAreaView forceInset={{top: 'always', horizontal: 'never'}}>
            <DrawerItems {...props} />
            <Button
              title="Logout"
              color={Colors.auth_color}
              onPress={() => {
                dispatch(logout());
                // props.navigation.navigate('Auth');
              }}
            />
          </SafeAreaView>
        </ScrollView>
      );
    },
  },
);

const AuthNavigator = createStackNavigator(
  {
    Auth: {
      screen: AuthScreen,
      navigationOptions: navData => {
        return {
          title: 'Autheniticate',
          headerStyle: {
            backgroundColor: '',
          },
          headerTintColor: Colors.auth_color,
        };
      },
    },
  },
  {
    defaultNavigationOptions: defaultNavOptions,
  },
);

const MainNavigator = createSwitchNavigator({
  Startup: StartUpScreen,
  Auth: AuthNavigator,
  Shop: RootNavigator,
});

export default createAppContainer(MainNavigator);

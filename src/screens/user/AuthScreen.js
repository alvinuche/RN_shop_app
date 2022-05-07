import React, {useReducer, useCallback, useState, useEffect} from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  KeyboardAvoidingView,
  Button,
  Pressable,
  ActivityIndicator,
  Alert,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {useDispatch} from 'react-redux';
import {signup, login} from '../../store/actions/auth';

import Input from '../../components/UI/Input';
import Card from '../../components/UI/Card';
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

const AuthScreen = ({navigation}) => {
  const dispatch = useDispatch();

  const [isSignUp, SetIsSignUp] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState();

  const [formState, hookDispatch] = useReducer(formReducer, {
    inputValues: {
      email: '',
      password: '',
    },
    inputValidities: {
      email: false,
      password: false,
    },
    formIsValid: false,
  });

  const {email, password} = formState.inputValues;

  const handleAuthentication = () => {
    let action;
    if (isSignUp) {
      action = signup(email, password);
    } else {
      action = login(email, password);
    }
    setError(null);
    setIsLoading(true);
    dispatch(action)
      .then(() => navigation.navigate('Shop'))
      .catch(err => {
        setError(err.message);
        setIsLoading(false);
      });
  };

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
    if (error) {
      Alert.alert('An Error Occurred!', error, [{text: 'Okay'}]);
    }
  }, [error]);

  return (
    <KeyboardAvoidingView
      // behavior="padding"
      behavior="height"
      keyboardVerticalOffset={-10}
      style={styles.screen}>
      <LinearGradient
        start={{x: 0.9, y: 0.8}}
        end={{x: -1.5, y: 0}}
        locations={[0.5, 0.4, 0.7]}
        // colors={['#ffedff', '#ffe3ff', '#192f6a']}
        // colors={['#276678', '#1687A7', '#D3E0EA', '#F6F5F5']}
        // colors={['#D3E0EA', '#1687A7', '#276678']}
        colors={['#D3E0EA', Colors.auth_color, Colors.primary_dark]}
        style={styles.gradient}>
        <Card customStyles={styles.authContainer}>
          <ScrollView>
            <Input
              id="email"
              label="Username"
              keyboardType="email-address"
              required
              email
              autoCapitalize="none"
              initialValue=""
              onInputChange={handleTextChange.bind(this, 'email')}
              // isDefaultValid={}
            />

            <Input
              id="password"
              label="Password"
              keyboardType="default"
              secureTextEntry
              required
              minLength={5}
              autoCapitalize="none"
              initialValue=""
              onInputChange={handleTextChange.bind(this, 'password')}
            />

            <View style={styles.btnBox}>
              {isLoading ? (
                <ActivityIndicator size="small" color={Colors.primary} />
              ) : (
                <Button
                  title={isSignUp ? 'Sign Up' : 'Login'}
                  // color={Colors.primary_dark}
                  color={Colors.auth_color}
                  onPress={handleAuthentication}
                />
              )}
            </View>

            {/* <View style={styles.btnBox}>
              <Button
                title={`Switch to ${isSignUp ? 'Login' : 'Sign Up'}`}
                color={Colors.danger}
                onPress={() => SetIsSignUp(!isSignUp)}
              />
            </View> */}

            <Pressable
              onPress={() => SetIsSignUp(!isSignUp)}
              style={styles.pressableText}>
              <Text style={styles.switchText}>{`Switch to ${
                isSignUp ? 'Login' : 'Sign Up'
              }`}</Text>
            </Pressable>
          </ScrollView>
        </Card>
      </LinearGradient>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  authContainer: {
    width: '90%',
    maxWidth: 400,
    maxHeight: 400,
    padding: 20,
  },
  gradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  btnBox: {
    marginTop: 20,
  },
  pressableText: {
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
  switchText: {
    fontFamily: 'OpenSans-Bold',
    color: Colors.auth_color,
  },
});
export default AuthScreen;

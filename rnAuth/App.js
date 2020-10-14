import React, { useState, useContext, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import SplashScreen from './src/ResolveAuthScreen/SplashScreen'
import SignUpScreen from './src/screens/SignupScreen'
import SignInScreen from './src/screens/SigninScreen'
import IndexScreen from './src/screens/IndexScreen'
import ProfileScreen from './src/screens/ProfileScreen'
import {Provider as AuthProvider} from './src/Context/AuthContext'
import {Provider as UserProvider} from './src/Context/UserContext'

import { Context as AuthContext } from './src/Context/AuthContext';
import {navigationRef} from './src/navigationRef'


  const Stack = createStackNavigator();

  const App = () => {

  const { state } = useContext(AuthContext);

  
  return (
    <NavigationContainer ref={ navigationRef } >
      <Stack.Navigator>
      {state.load && (
          <Stack.Screen
              name="SplashScreen"
              component={SplashScreen}
              options={{
                title: 'SplashScreen',
              }}
            />
      )}
      
        {state.token == null ?  (
        <>
          <Stack.Screen
              name="SignIn"
              component={SignInScreen}
              options={{
                title: 'Sign in',
              }}
            />
          <Stack.Screen name="SignUp" component={SignUpScreen} />
        </>
      ) : (
        <>
        <Stack.Screen name="Index" component={IndexScreen} />
        <Stack.Screen name="Profile" component={ProfileScreen} />
      </>
      )}

      </Stack.Navigator>
    </NavigationContainer>
  );
}


  const jsx = () => (
    <UserProvider>
      <AuthProvider value={AuthContext}>
        <App />
      </AuthProvider>
    </UserProvider>
  );
export default jsx;
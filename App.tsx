/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React, { useState } from 'react';
import 'react-native-gesture-handler';
import { NavigationContainer, StackActions } from '@react-navigation/native'
import { createStackNavigator } from '@react-navigation/stack';
import Watch from './src/Screen/Watch'
import Home from './src/Screen/Home'



const Stack = createStackNavigator();

const App: React.FC<{}> = (props) => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen name="Home" component={Home} />
        <Stack.Screen name="Watch" component={Watch} />
      </Stack.Navigator>
    </NavigationContainer>
  )
}

export default App


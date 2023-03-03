import React, { useLayoutEffect } from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import Gameboard from './components/Gameboard';
import Home from './components/Home';
import Scoreboard from './components/Scoreboard';
import styles from './styles/styles';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';


export default function App() {



  const Tab = createBottomTabNavigator();


  return (
    <NavigationContainer styles={styles.container}>
      <Tab.Navigator>
        <Tab.Screen name='Home' component={Home} options={{tabBarStyle:{display:'none'}}}/>
        <Tab.Screen name='Gameboard' component={Gameboard}/> 
        <Tab.Screen name='Scoreboard' component={Scoreboard}/> 
    </Tab.Navigator>
   </NavigationContainer>
   
  );
}


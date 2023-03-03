import React from 'react';
import { Text, View, TextInput, Pressable, Keyboard} from 'react-native';
import styles from '../styles/styles';
import { useState } from 'react';
import Gameboard from './Gameboard';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';


export default Home = ( {navigation} ) => {


    const [playerName, setPlayerName] = useState();
    const [hasPlayerName, setHasPlayerName] = useState(false);

    const handlePlayerName = (value) => {
        if (value.trim().length > 0) {
            setHasPlayerName(true);
            Keyboard.dismiss();
        }
    }


    return (
        <View style={styles.container}>
            <Header></Header>
            <MaterialCommunityIcons
                name={'information-outline'}
                size={100}
                style={styles.header_icon}
                color={'black'}>
            </MaterialCommunityIcons>
            { !hasPlayerName ? 
            <>
            <Text style={styles.header_1}>Enter your name:</Text>
            <TextInput style={styles.header_1} onChangeText={setPlayerName} autoFocus={true}></TextInput>
            <Pressable style={styles.button} onPress={() => handlePlayerName(playerName)}>
                <Text style={styles.buttonText}>Ok</Text>
            </Pressable>
            </>
            :
            <>
            <Text style={styles.bold_header}>Rules of the game:</Text>
            <Text style={styles.header_1}>THE GAME Upper section of the classic Yahztee dice game. You have 5 dices and for the every dice you have 3 throws. After each throw you can keep the dices in order to get same dice spot counts as many as possible. In the end of the turn you must select your points from 1 to 6. Game ends when all points have been selected. The order for selecting those is free.</Text>
            <Text style={styles.header_1}>POINTS: After each turn game calculates the sum for the dices you selected. Only the dices having the same spot count are calculated. Inside the game you can not selected same points from 1 to 6 again .</Text>
            <Text style={styles.header_1}>GOAL: To get points as much as possible. 63 points is the limit of getting bonus which gives you 50 points more.</Text>
            <Text style={styles.bold_header}>Good luck! {playerName}</Text>
            <Pressable onPress={() => navigation.navigate('Gameboard', {player : playerName})}>
                <Text style={styles.button}>Play</Text>
            </Pressable>
            </>
            }
            <Footer></Footer>
         </View>

    
    )
}
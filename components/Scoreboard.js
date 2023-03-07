import { View, Text, Button } from "react-native";
import React, { useState, useEffect} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SCOREBOARD_KEY } from '../constants/Game';
import styles from '../styles/styles';
import Header from "./Header";
import Footer from "./Footer";
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';


const Scoreboard = ( {navigation} ) => {

    const [scores, setScores] = useState([]);

    useEffect(() => {
        const unsubscribe = navigation.addListener('focus', () => {
        getScoreboardData();
        });
        return unsubscribe;
    }, [navigation]);

    const getScoreboardData = async () => {
        try {
            const jsonValue = await AsyncStorage.getItem(SCOREBOARD_KEY);
            if (jsonValue !== null) {
                let tmpScores = JSON.parse(jsonValue);
                setScores(tmpScores);
                  scores.sort((a, b) => parseFloat(b.points) - parseFloat(a.points));
                // Sort results here for the rendering sort()
            }
        } catch (error) {
            console.log('Read error' + error.message);
        }
    }
    const clearScoreboard = async () => {
        try {
            await AsyncStorage.removeItem(SCOREBOARD_KEY);
            setScores([]);
        } catch (error) {
            console.log("Removing: " + error.message);
        }
    };
   
    return (
        <View>
            <Header />
            <Text style={styles.title}>Mini-Yahtzee</Text>
            <MaterialCommunityIcons
                name={'account-star'}
                size={100}
                style={styles.header_icon}
                color={'black'}>
            </MaterialCommunityIcons>
            {scores.length > 0 ? (
                <View>
                    {scores.map((player, i) => (
                        <Text style={styles.header_1} key={i}>{i + 1}. {player.name} {player.date} Points: {String(player.points)}</Text>
                    ))}
                    <Button style={styles.button} title="Clear Scoreboard" onPress={clearScoreboard} />
                </View>
            ) 
            : 
            (
                <Text style={styles.bold_header}>Scoreboard is empty</Text>
            )}
            <Footer style={styles.footer_styles} />
        </View>

    )
}
                
      
    export default Scoreboard;

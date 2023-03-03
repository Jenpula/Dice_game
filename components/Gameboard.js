import React, { useState, useEffect, useCallback } from 'react';
import { Text, View, Pressable } from 'react-native'
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import styles from '../styles/styles'
import { NBR_OF_DICES, nbrOfThrowsLeft, nbrOfWins, SCOREBOARD_KEY, NBR_OF_THROWS, BONUS_POINTS, BONUS_POINTS_LIMIT, WINNING_POINTS, MAX_SPOT } from '../constants/Game';
import { Grid, Col } from 'react-native-easy-grid';
import AsyncStorage from '@react-native-async-storage/async-storage';


let board = [];
let getBonus = false;


export default Gameboard = ( {route} ) => {


   

    const [playerName, setPlayerName] = useState('');
    const [nbrOfThrowsLeft, setNbrOfThrowsLeft] = useState(NBR_OF_THROWS);
    const [nbrOfWins, setNbrOfWins] = useState(0);
    const [sum, setSum] = useState(0);
    const [status, setStatus] = useState('');
    const [selectedDices, setSelectedDices] = useState(new Array(NBR_OF_DICES).fill(false));
    const [selectedDicePoints, setSelectedDicePoints] = useState(new Array(MAX_SPOT).fill(false));
    const [diceSpots, setDiceSpots] = useState(new Array(NBR_OF_DICES). fill(0));
    const [dicePointsTotal, setDicePointsTotal] = useState(new Array(MAX_SPOT).fill(0))
    const [scores, setScores] = useState([]);


    

    
const row = [];
for (let i = 0; i < NBR_OF_DICES; i++) {
    row.push(
        <Pressable
        key={'row' + i}
        onPress={() => selectDice(i)}>
     <MaterialCommunityIcons
        name={board[i]}
        key={'row' + i}
        size={50}
        color={getDiceColor(i)}>
     </MaterialCommunityIcons>
     </Pressable>
    );
}

const pointsRow = [];
for (let spot = 0; spot < MAX_SPOT; spot++) {   
    pointsRow.push (
        <Col key={'points' + spot} >
            <Text style={styles.points} key={'points' + spot}>{getSpotTotal(spot)}</Text>
        </Col>
    )
}

const buttonRow = [];
    for (let diceButton = 0; diceButton < MAX_SPOT; diceButton++) {
        buttonRow.push(
    <Col key={'buttonRow' + diceButton}>
        <Pressable
        key={'buttonRow' + diceButton}
            onPress={() => selectDicePoints(diceButton)}>
            <MaterialCommunityIcons
                name={'numeric-' + (diceButton + 1) + '-circle'}
                key={'buttonRow' + diceButton}
                size={40}
                color={getPointsColor(diceButton)}>
            </MaterialCommunityIcons>
        </Pressable>
    </Col>
    )
}

     function getDiceColor(i) {
    if (board.every((val, i, arr) => val === arr[0])) {
      return "orange";
    }
    else {
      return selectedDices[i] ? "black" : "#8cb7f8";
    }
  }

    function getPointsColor(i) {
        if (selectedDicePoints[i]) {
            return 'black';
        }
        else {
            return '#8cb7f8';
        }
    }

     function selectDice(i) {
        let dices = [...selectedDices];
        dices[i] = selectedDices[i] ? false : true;
        setSelectedDices(dices);
     }


     const selectDicePoints = (i) => {
        let selected = [...selectedDices];
        let selectedPoints = [...selectedDicePoints];
        let points = [...dicePointsTotal];
        if (!selectedPoints[i]) {
        selectedPoints[i] = true;
        let nbrofdices = diceSpots.reduce((total, x) => ( x === (i + 1) ? total + 1: total), 0);
        points[i] = nbrofdices + (i + 1)
        setDicePointsTotal(points);
    }
        selected.fill(false);
        setSelectedDices(selected);
        setSelectedDicePoints(selectedPoints);
        setNbrOfThrowsLeft(NBR_OF_THROWS)
        return points[i];
     }

     function getSpotTotal(i) {
        return dicePointsTotal[i];
     }

     function checkBonus() {
        if (sum >= BONUS_POINTS_LIMIT) {
            getBonus = true;
            return ("You got the Bonus!")
        } else {
            return ("You are " + (BONUS_POINTS_LIMIT - sum) + " points away from bonus.");
        }
    }

    
    const getScoreboardData = async () => {
        try {
            const jsonValue = await AsyncStorage.getItem(SCOREBOARD_KEY)
            if (jsonValue !== null) {
                let tmpScores = JSON.parse(jsonValue);
                setScores(tmpScores);
            }
          } 
          catch (error) {
            console.log(error.message);
          }
        }  

        const totalPoints = dicePointsTotal.reduce(function(a, b) {
            return a + b;
        });
        
        const savePlayerPoints = async () => {
            const playerPoints = {
                name: playerName,
                date: new Date().toLocaleString(),
                points: totalPoints       
            }
            try {
                const newScore = [...scores, playerPoints];
                const jsonValue = JSON.stringify(newScore);
                await AsyncStorage.setItem(SCOREBOARD_KEY, jsonValue);
            } catch(error){
                console.log("Save error: " + error.message);
            }
        }
                
     

    const throwDices = () => {
        let spots = [...diceSpots];
        let sum = 0;
        for(let i = 0; i < NBR_OF_DICES; i++) {
            if(!selectedDices[i]) {
            let randomNumber = Math.floor(Math.random() * 6 + 1);
            board[i] = 'dice-' + randomNumber;
            spots[i] = randomNumber;
            sum += randomNumber
            }
        }
        setNbrOfThrowsLeft(nbrOfThrowsLeft-1);
        setDiceSpots(spots);
        setStatus('Select and throw dices again');
        setSum(sum);
    }
    
    const checkWinner = () => {
        if (sum >= WINNING_POINTS && nbrOfThrowsLeft > 0) {
            setStatus('You won');
           
        }
     else if (sum >= WINNING_POINTS && nbrOfThrowsLeft === 0) {
        setStatus('You won, game over');
        setSelectedDices(new Array(NBR_OF_DICES).fill(false));
      
    } 
    else if (nbrOfWins > 0 && nbrOfThrowsLeft === 0) {
        setStatus('You won, game over');
        setSelectedDices(new Array(NBR_OF_DICES).fill(false));
    }
    else if (nbrOfThrowsLeft === 0) {
        setStatus('Game over');
        setSelectedDices(new Array(NBR_OF_DICES).fill(false));
    }
    else {
        setStatus('Keep on throwing!');
    }
}

useEffect(() => {
    checkWinner();
    if ( playerName ===  '' && route.params?.player) {
        setPlayerName(route.params.player);
        getScoreboardData();
    }

    if ( nbrOfThrowsLeft === NBR_OF_THROWS) {
        setStatus('Game has not started');
    }
  
}, []);



    useEffect(() => {
        if(nbrOfThrowsLeft === 0) {
            setStatus('Select your points');
        }
        else if (nbrOfThrowsLeft < 0) {
            setNbrOfThrowsLeft(NBR_OF_THROWS-1);
            setSelectedDices(new Array(NBR_OF_DICES).fill(false));
        }
        else if (selectedDicePoints.every(x => x)) {
            savePlayerPoints();
        }

    }, [nbrOfThrowsLeft]);


return (
    
    <View style={styles.gameboard}>
        <Header></Header>
        <Text style={styles.flex}>{row}</Text>
        <Text style={styles.gameinfo}>Throws left: {nbrOfThrowsLeft}</Text>
        <Text style={styles.gameinfo}>{status}</Text>
        <Pressable style={styles.button}
            onPress={() => throwDices()}>
            <Text style={styles.buttonText}>
                Throw dices
            </Text>
        </Pressable>
        <Text style={styles.bold_header}>Total: {getBonus ? (sum + BONUS_POINTS) : sum }</Text>
        <Text style={styles.gameinfo}>{checkBonus()}</Text>
        <View style={styles.dicepoints}><Grid>{pointsRow}</Grid></View>
        <View style={styles.dicepoints}><Grid>{buttonRow}</Grid></View>
        <Text style={styles.gameinfo}>Player: {playerName}</Text>
        <Footer></Footer>
    </View>
)
}
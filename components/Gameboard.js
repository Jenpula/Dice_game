import React, { useEffect, useState } from "react";
import { Text, View, Pressable } from "react-native";
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons'
import styles from '../styles/styles';
import Header from './Header';
import Footer from './Footer';
import { MAX_SPOT, NBR_OF_DICES, NBR_OF_THROWS, MIN_SPOT, BONUS_POINTS, BONUS_POINTS_LIMIT, SCOREBOARD_KEY } from "../constants/Game";
import { Col, Grid} from 'react-native-easy-grid';
import AsyncStorage from '@react-native-async-storage/async-storage';


let board = [];

export default Gameboard = ({route}) => {

    const [nbrOfThrowsLeft, setNbrOfThrowsLeft] = useState(NBR_OF_THROWS);
    const [status, setStatus] = useState('Game has not started');
    const [playerName, setPlayerName] = useState('')
    const [selectedDices, setSelectedDices] = useState(new Array(NBR_OF_DICES).fill(false));
    const [selectedDicePoints, setSelectedDicePoints] = useState(new Array(MAX_SPOT).fill(false))
    const [diceSpots, setDiceSpots] = useState(new Array(NBR_OF_DICES).fill(0))
    const [dicePointsTotal, setDicePointsTotal] = useState(new Array(MAX_SPOT).fill(0));
    const [sum, setSum] = useState(0);
    const [bonusScores, setBonusScores] = useState(BONUS_POINTS_LIMIT);
    const [bonusStatus, setBonusStatus] = useState('');
    const [scores, setScores] = useState([]);
    

    const row = [];
    if(nbrOfThrowsLeft === 3) {
        row.push(
            <MaterialCommunityIcons
            name='dice-multiple'
            key={'multiple-dice'}
            size={70}
            color={'#8cb7f8'}></MaterialCommunityIcons>
        )
    }
    else {
        for(let i = 0; i < NBR_OF_DICES; i++) {
            row.push(
                <Pressable 
                    key={"row" + i}
                    onPress={() => selectDice(i)}>
                    <MaterialCommunityIcons
                        name={board[i]}
                        key={"row" + i}
                        size={50}
                        color={getDiceColor(i)}></MaterialCommunityIcons>
                </Pressable>
                )
        }
    }
    
    const pointsRow = []
    for (let spot = 0; spot < MAX_SPOT; spot++) {
        pointsRow.push(
            <Col key={"points"+spot}>
                <Text key={"points"+spot} style={styles.points}>{getSpotTotal(spot)}</Text>
            </Col>
        )
    }
    
    const buttonRow = [];
    for (let dicebutton = 0; dicebutton < MAX_SPOT ; dicebutton++) {
        buttonRow.push(
        <Col key={'buttonsRow'+dicebutton}>
            <Pressable 
                key={'buttonsRow'+dicebutton}
                onPress={() => selectDicePoints(dicebutton)}>
                <MaterialCommunityIcons
                    name={"numeric-" + (dicebutton + 1) + "-circle"}
                    key={"buttonsRow"+ dicebutton}
                    size={40}
                    color={getDicePointsColor(dicebutton)}
                ></MaterialCommunityIcons>
            </Pressable>
        </Col>
    )}

    useEffect(() => {
        if(playerName == '' && route.params?.player) {
            setPlayerName(route.params.player);  
            getScoreBoardData(); 
        }
    }, []);


    useEffect(() => {
        checkPoints();
        if(nbrOfThrowsLeft == NBR_OF_THROWS) {
            setStatus('Throw dices');
        }
        if(nbrOfThrowsLeft < 0) {
            setNbrOfThrowsLeft(NBR_OF_THROWS-1);
        }
    }, [nbrOfThrowsLeft]);

    useEffect(() => {
        if(selectedDicePoints.every(x => x)) {
            setStatus("Game over. All points selected");
            savePlayerPoints();
            getScoreBoardData();
        }
    }, [sum])

    useEffect(() => {
        if(bonusScores <= 0) {
            setBonusStatus("Congrats! Bonuspoints (" + BONUS_POINTS + ") added" );
        }
        else {
            setBonusStatus("You are " + bonusScores + " points away from bonus")
        }
    }, [bonusScores]);

    function getDiceColor(i) {
        return selectedDices[i] ? "black" : '#8cb7f8';
    }

    function getDicePointsColor(i) {
        return selectedDicePoints[i] ? "black" : '#8cb7f8';
    }

    function getSpotTotal(i) {
        return dicePointsTotal[i];
    }
    

    const selectDice = (i) => {
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
            let nbrOfDices = diceSpots.reduce((total, x) => ( x === (i + 1) ? total + 1: total), 0);
            points[i] = nbrOfDices * (i + 1)
            setDicePointsTotal(points);
    }
        selected.fill(false);
        setSelectedDices(selected);
        setSelectedDicePoints(selectedPoints);
        setNbrOfThrowsLeft(NBR_OF_THROWS)
        return points[i];
     }

    const throwDices = () => {
        
        if(nbrOfThrowsLeft === 0) {
            setStatus('Select your points before next throw')
        } 
        else {
            let spots = [...diceSpots];
            for (let i = 0; i < NBR_OF_DICES; i++) {
                if(!selectedDices[i]) {
                    let randomNumber = Math.floor(Math.random() * 6 + 1);
                    board[i] = 'dice-' + randomNumber;
                    spots[i] = randomNumber;
                } 
            }
            setNbrOfThrowsLeft(nbrOfThrowsLeft-1);
            setDiceSpots(spots);
            setStatus("Select and throw dices again");
            
        }     
    }

    const checkPoints = () => {
        const dpt = [...dicePointsTotal]
        const total = dpt.reduce((total, a) => total + a, 0);
       
        if(nbrOfThrowsLeft >= 0) {
            setSum(total)
            checkBonusScores(total)
        }
    }

    const checkBonusScores = (total) => {
        const bonus = BONUS_POINTS_LIMIT - total;

        if(bonus <= 0) {
            setBonusScores(0)
            setSum(total+BONUS_POINTS);
        }
        else if(bonus > 0 ) {
            setBonusScores(bonus);
        } 
    }

    const getScoreBoardData = async () => {
        try {
            const jsonValue = await AsyncStorage.getItem(SCOREBOARD_KEY);
            if(jsonValue !== null) {
                let tmpScores = JSON.parse(jsonValue);
                tmpScores.sort((a, b) => parseFloat(b.points) - parseFloat(a.points)); // Sort by descending score
                setScores(tmpScores);
            }
        }
        catch (error) {
            console.log(error.message)
        }
    }

    const savePlayerPoints = async () => {
        const playerPoints = {
            name: playerName,
            date: new Date().toLocaleString(),
            points: sum
        }
        try {
            const newScore = [...scores, playerPoints];
            const jsonValue = JSON.stringify(newScore);
            await AsyncStorage.setItem(SCOREBOARD_KEY, jsonValue);
        }
        catch (error) {
            console.log('Save error: ' + error.message)
        }
    }

    function resetGame() {
        setNbrOfThrowsLeft(NBR_OF_THROWS);
        setStatus('');
        setSelectedDices(new Array(NBR_OF_DICES).fill(false));
        setSelectedDicePoints(new Array(MAX_SPOT).fill(false));
        setDiceSpots(new Array(NBR_OF_DICES).fill(0));
        setDicePointsTotal(new Array(MAX_SPOT).fill(0));
        setScores([]);
        setSum(0);
        setBonusStatus('');
    }
  
    return (
        <View style={styles.gameboard}>
            <Header />
            <View style={styles.flex}>{row}</View>
            <Text style={styles.gameinfo}>Throws left: {nbrOfThrowsLeft}</Text>
            <Text style={styles.gameinfo}>{status}</Text>
            <Pressable style={styles.button}
            onPress={() => throwDices()}>
            <Text style={styles.buttonText}>
                Throw dices
            </Text>
            </Pressable>
            <Pressable style={styles.button}
            onPress={() => resetGame()}>
            <Text style={styles.buttonText}>
                Restart game
            </Text>
            </Pressable>
            <Text style={styles.bold_header}>Total: {sum}</Text>
            <Text>{bonusStatus}</Text>
            <View style={styles.dicepoints}>
                <Grid>{pointsRow}</Grid>
            </View>
            <View style={styles.dicepoints}>
                <Grid>{buttonRow}</Grid>
            </View>
            <Text style={styles.header_1}>Player: {playerName}</Text>
            <Footer />
        </View>
    )
}


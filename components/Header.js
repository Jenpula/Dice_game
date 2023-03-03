import React from 'react';
import { Text, View} from 'react-native';
import styles from '../styles/styles';


export default Header = () => {
    return (
        <View style={styles.header}>
            <Text style={styles.title}>
                Mini-yazthee
            </Text>
        </View>
    )
}
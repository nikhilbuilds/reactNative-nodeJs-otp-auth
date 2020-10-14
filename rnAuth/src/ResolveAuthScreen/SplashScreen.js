import React, { useContext, useEffect } from 'react'
import {View, Text, StyleSheet, ActivityIndicator} from 'react-native'
import {Context as AuthContext} from '../Context/AuthContext'


const SplashScreen = () => {
    const {trylocalSignin} = useContext(AuthContext)

    useEffect(() => {
        trylocalSignin()
    }, [])
    return (
        <View style={styles.splashContainer}>
             <ActivityIndicator 
                size="large"  
                color="#0000ff" 
            />
        </View>
    )
}

const styles = StyleSheet.create({
    splashContainer:{
        backgroundColor: 'black',
        flex:1,
        justifyContent:'center'
    }
})

export default SplashScreen
import React, { useState, useContext, useEffect } from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native'
import authApiLink from '../api/authApi';
import { Context as AuthContext } from '../Context/AuthContext';
import { Context as UserContext } from '../Context/UserContext';


const IndexScreen = () => { 

    const { signout } = useContext(AuthContext);
    const {state, userBasicDetails} = useContext(UserContext)

    useEffect(()=>{
        userBasicDetails()
    },[])

    console.log(state);
   
        return(
            <View style={styles.container}>
                <Text style={{fontSize:30}}>Welcome, {state.userData.name}</Text>
                <Text>This is home screen</Text>

                <TouchableOpacity style={styles.linkbtn} onPress={() => signout()}>
                    <Text style={styles.linkText}>Logout</Text>
                </TouchableOpacity>
            </View>
        )
    }
    


const styles = StyleSheet.create({
    container:{
      
        justifyContent:'center',
        margin:20,
    },
    linkbtn:{
        paddingTop: 20
    },
    linkText:{
        fontSize: 20,
        color: 'blue',
    }
})
export default IndexScreen 